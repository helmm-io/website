# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing site for HELM Managed Services (helmm.io). React 18 + JSX compiled **in the browser** by Babel standalone. There is no build step, no package.json, no bundler, no test suite, and no linter — the files in the repo are exactly what nginx serves. See `README.md` for hosting/DNS/HubSpot setup and `OPERATIONS.md` for the "site is down" runbook.

## Commands

```bash
# Run locally (must be an HTTP server, not file://, because Babel fetches the JSX via XHR)
python3 -m http.server 8791        # then open http://localhost:8791/

# Pricing sync (normally run by GitHub Actions every 15 min; needs a Google service account)
pip install -r scripts/requirements.txt
GOOGLE_SERVICE_ACCOUNT_JSON='…' PRICING_SHEET_ID='…' python3 scripts/sync_pricing_sheet.py

# One-time HubSpot property creation
HUBSPOT_PAT=pat-eu1-… python3 server/setup_hubspot_properties.py
```

Deploy is automatic: any push to `main` runs `.github/workflows/deploy.yml`, which uses SSM Run Command on the EC2 instance to `git pull` and run `server/deploy.sh`. There is no staging environment — `main` is production.

Verification is manual: load the page in a browser and check the console. A JSX syntax error surfaces only at runtime as a Babel error in the console, and one broken file takes down every component defined after it.

## Architecture

### Front end: global-scope JSX, load order matters

`index.html` loads React, Babel, the design-system bundle, `site/hubspot.js`, pdf.js, `site/motion.js`, then the `site/*.jsx` files as `<script type="text/babel">` in a fixed order, and finally an inline `<Site />` root. There are no modules or imports: every top-level `const`/`function` in a JSX file is a **global shared across all files**, so:

- Names must be unique across files (hence `HELM_MAX`, `HELM_MAX_B`, `HELM_MAX_C`). A duplicate `const` is a runtime SyntaxError.
- A file may only reference globals from files loaded before it. Order in `index.html`: `tweaks-panel` → `quoteData` → `quoteInvoice` → `sectionsA` → `sectionsB` → `sectionsC`.
- `About.html` loads only `sectionsA` and `sectionsB` (for header/footer), so anything those files need must not live in `sectionsC` or `quoteData`.
- Design-system components come from `window.HELMDesignSystem_93c981` (destructured at the top of each JSX file). The bundle and tokens under `_ds/` are generated output — don't hand-edit them.

`site/tweaks-panel.jsx` is a dev-only styling drawer persisted in localStorage; it ships to production but is meant for design exploration.

### Pricing data is generated — do not hand-edit prices

`site/quoteData.jsx` is the single source of pricing truth for the Budget Explorer and invoice tool, **and it is auto-generated** by `scripts/sync_pricing_sheet.py` from the "HELM Licensing & Pricing Reference" Google Sheet. The sync workflow overwrites and commits it every 15 minutes if the sheet changed, so manual price edits there will be lost. To change prices, change the sheet. Things that are *not* sheet-sourced and must be changed in the script's `TEMPLATE`/constants instead: on-site support cadence (`HELM_ONSITE_LEVELS`), the always-included RMM/MDM line, and the invoice-matching vendor hints.

Two constants are duplicated by hand and must be kept in sync: `DEVICES_PER_USER` in the sync script and `HELM_DEVICES_PER_USER` in `site/sectionsC.jsx`.

The sync script validates every tab and exits without writing if anything fails, because a push from the workflow deploys straight to production with no review.

### Lead capture and quote tools

Flow: lead-gate form → `HelmHubSpot.submitContact()` → quote generated (Budget Explorer in `sectionsC.jsx`, or "Beat my invoice" in `quoteInvoice.jsx`) → `HelmHubSpot.submitQuote()`.

`site/hubspot.js` supports two transports chosen by config at the top of the file: the HubSpot Forms API (portal ID + form GUID, safe to be client-side) or a same-origin proxy at `/api/hubspot`. **Currently the Forms API is active** (`proxyEndpoint` is empty); the server-side proxy exists and is deployed but isn't wired in. The README describes the proxy path as if it were live — the config in `hubspot.js` is authoritative.

### Server side (`server/`) — never served publicly

`deploy.sh` copies the checkout to the nginx web root and then strips `.git`, `.github`, `server/` and `README.md`. Anything else at the repo root **is** publicly served (e.g. `OPERATIONS.md`). Keep that in mind when adding files.

Two small Python stdlib HTTP proxies run as hardened systemd services on localhost, fronted by nginx `location` blocks with per-IP rate limits (`nginx-ratelimit.conf` / `nginx-api.conf`):

| Route | Port | Service | Secret (SSM SecureString) |
|---|---|---|---|
| `/api/hubspot` | 8081 | `hubspot_proxy.py` — allowlists properties, upserts contact, adds a Note | `/helm/hubspot/pat` |
| `/api/claude` | 8082 | `claude_proxy.py` — forwards a client-built prompt to the Anthropic Messages API with a fixed model and `max_tokens` | `/helm/anthropic/api_key` |

Secrets are fetched by the `helm-*-proxy-start` wrappers at service start; they never appear in the repo. The Claude proxy is a pass-through: the browser builds the full prompt (`HELM_QUOTE_CONTEXT` from `quoteData.jsx` + extracted invoice text) in `quoteInvoice.jsx`, so nginx's `client_max_body_size`, the proxy's `MAX_BODY`, and the size of `HELM_QUOTE_CONTEXT` are coupled. `install.sh` is idempotent and re-run on every deploy, so nginx/systemd changes go through it — edit the files in `server/`, never the instance directly.

## Conventions

- Prices are GBP, ex VAT, per unit/month; `displayName` fields are prospect-facing and must not contain vendor names.
- Contact email everywhere is `hello@helmm.io`.
- Files in `server/` and `scripts/` are plain Python 3 stdlib (plus the Google client libs for the sync script only).
