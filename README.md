# HELM Website

Static marketing site for **HELM Managed Services Ltd**, live at [helmm.io](https://helmm.io). React 18 rendered in-browser via Babel standalone — no build step, no node_modules; what's in the repo is what ships.

## Repository layout

```
index.html                  Homepage (SPA entry point)
About.html                  About Toby McCorriston
Privacy Policy.html         Privacy policy (static HTML)

site/
  sectionsA.jsx             Header, hero, trust bar, services, approach
  sectionsB.jsx             Results, pricing, FAQ, CTA footer, contact panel
  sectionsC.jsx             Quote tools: Budget Explorer + lead gate
  quoteData.jsx             Pricing tiers and per-user/onboarding rates
  quoteInvoice.jsx          Invoice comparison tool
  hubspot.js                HubSpot submit layer (see HubSpot integration)
  motion.js                 Scroll-reveal + ship's-wheel rotation animations
  tweaks-panel.jsx          Dev-only styling tweaks panel

assets/                     Logo, motifs, photos
_ds/helm-design-system-*/   Design tokens (colors, type, spacing) + component bundle

server/                     Server-side pieces (NOT served publicly)
  hubspot_proxy.py          HubSpot proxy service (keeps the PAT off the client)
  helm-hubspot-proxy-start  Startup wrapper: pulls the PAT from SSM
  helm-hubspot-proxy.service systemd unit (hardened, DynamicUser)
  claude_proxy.py           Claude proxy behind the "Beat my invoice" tool (keeps the API key off the client)
  helm-claude-proxy-start   Startup wrapper: pulls the Anthropic key from SSM
  helm-claude-proxy.service systemd unit (same hardening)
  nginx-api.conf            /api/hubspot + /api/claude routes + hidden-file blocking
  nginx-ratelimit.conf      Rate-limit zones for the API endpoints
  install.sh                Installs/refreshes the above on the instance
  deploy.sh                 Full deploy: web root sync + install.sh
  setup_hubspot_properties.py  One-time: creates HELM contact properties

.github/workflows/deploy.yml  Auto-deploy on push to main
```

## Local development

```bash
python3 -m http.server 8791
# open http://localhost:8791/
```

An HTTP server is required (not `file://`) because Babel fetches the JSX via XHR. The HubSpot proxy isn't present locally, so form submissions log to the console — nothing breaks.

## Hosting architecture (AWS, eu-west-2, account 669031107739)

```
Cloudflare (DNS, proxied, Full-strict SSL)
   └── Application Load Balancer  helm-web-alb
       ├── :80  → 301 redirect to HTTPS
       └── :443 → ACM cert (helmm.io + *.helmm.io, auto-renews)
            └── EC2 t3.micro  helm-web-1  (i-0913c45eb892e511f)
                └── nginx: static site from /usr/share/nginx/html
                    ├── /api/hubspot → 127.0.0.1:8081 (HubSpot proxy)
                    └── /api/claude  → 127.0.0.1:8082 (Claude proxy)
```

- Every AWS resource is tagged **`HELM=website`** for cost tracking.
- The instance accepts traffic only from the ALB security group; there is no SSH key — admin access is via **SSM Session Manager / Run Command**.
- Cloudflare DNS: apex + `www` are proxied CNAMEs to the ALB. The ACM validation CNAME (`_8fa0e3c6...`) must stay in place (DNS-only) for certificate renewal.
- Cloudflare has Email Address Obfuscation on, so emails in served HTML appear as `data-cfemail` blobs — browsers decode them.

## Deployment

**Automatic:** push to `main`. GitHub Actions (`deploy.yml`) assumes the IAM role `helm-deploy-github` via OIDC (no stored AWS keys), then uses SSM Run Command to execute `git pull` + `server/deploy.sh` on the instance. Watch runs in the Actions tab.

`deploy.sh` copies the checkout to the nginx web root, strips repo/server-only files (`.git`, `.github`, `server/`, `README.md`, `OPERATIONS.md`, `CLAUDE.md`), and re-runs `install.sh` so nginx config and the proxy service stay in sync with the repo.

**Manual fallback:**

```bash
aws ssm send-command --instance-ids i-0913c45eb892e511f \
  --document-name AWS-RunShellScript \
  --parameters 'commands=["cd /opt/helm-website && git pull","bash /opt/helm-website/server/deploy.sh"]'
```

## HubSpot integration

Flow: a visitor unlocks the quote tools through the lead-gate form → `HelmHubSpot.submitContact()` → the contact is upserted in HubSpot. Each quote they generate (Budget Explorer plan or invoice comparison) → `HelmHubSpot.submitQuote()` → contact properties are updated **and** the quote is recorded as a Note on the contact's timeline.

Security model (the PAT never leaves the server side):

1. The private-app token lives in **SSM Parameter Store** as a SecureString: `/helm/hubspot/pat`.
2. The instance role (`helm-web-ssm`) may read **only that parameter** (plus `/helm/anthropic/api_key` for the Claude proxy — see below).
3. At service start, `helm-hubspot-proxy-start` fetches it into the environment of the proxy — a `systemd` service hardened with `DynamicUser`, `ProtectSystem=strict`, `NoNewPrivileges`, listening on localhost only.
4. The browser talks to same-origin `/api/hubspot`; nginx rate-limits it (10 req/min/IP). The proxy allowlists properties, caps lengths, validates the email, and forwards to `api.hubapi.com`.

Rotating or setting the token:

```bash
aws ssm put-parameter --name /helm/hubspot/pat --type SecureString \
  --value 'pat-eu1-…' --overwrite
aws ssm send-command --instance-ids i-0913c45eb892e511f \
  --document-name AWS-RunShellScript \
  --parameters 'commands=["systemctl restart helm-hubspot-proxy"]'
```

The private app needs the `crm.objects.contacts.write` scope (plus `crm.objects.notes.write` if scoped granularly). Custom contact properties (`helm_lead_source`, `helm_quote_source`, `helm_quote_tier`, `helm_quote_monthly`, `helm_quote_detail`) are created once with:

```bash
HUBSPOT_PAT=pat-eu1-… python3 server/setup_hubspot_properties.py
```

Until a real token is set, the proxy answers 503 and the site degrades gracefully.

## Claude quoting engine ("Beat my invoice")

`site/quoteInvoice.jsx` builds a prompt (pricing context from `quoteData.jsx` + the text extracted from the visitor's invoice) and POSTs it to same-origin `/api/claude`. nginx rate-limits that route (5 req/min/IP) and forwards to `server/claude_proxy.py` on `127.0.0.1:8082`, which adds the Anthropic API key and calls the Messages API with a fixed model and `max_tokens`. Same security model as HubSpot: the key lives in SSM as a SecureString and is fetched by `helm-claude-proxy-start` when the service starts.

Until the key is readable, the proxy answers **503** with `{"error": "quoting engine not configured"}` and the tool shows a "get in touch and we'll quote you directly" message. If the key is *invalid* rather than missing, Anthropic returns 401 and the proxy answers 502; the reason is in the service journal.

Setting it up (account `669031107739`, region `eu-west-2`):

```bash
# 1. Store the key (name and type must match exactly)
aws ssm put-parameter --name /helm/anthropic/api_key --type SecureString \
  --value 'sk-ant-…' --overwrite

# 2. Let the instance role read it (the inline policy read-hubspot-pat on the
#    helm-web-ssm role lists every parameter the instance may read)
aws iam put-role-policy --role-name helm-web-ssm --policy-name read-hubspot-pat \
  --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"ssm:GetParameter","Resource":[
    "arn:aws:ssm:eu-west-2:669031107739:parameter/helm/hubspot/pat",
    "arn:aws:ssm:eu-west-2:669031107739:parameter/helm/anthropic/api_key"]}]}'

# 3. Restart the proxy so it re-fetches the key, then check it came up with one
aws ssm send-command --instance-ids i-0913c45eb892e511f \
  --document-name AWS-RunShellScript \
  --parameters 'commands=["systemctl restart helm-claude-proxy","sleep 2","journalctl -u helm-claude-proxy -n 5 --no-pager"]'
```

The journal should show no `warning:` lines after a restart. A quick external check:

```bash
curl -s -X POST https://helmm.io/api/claude -H 'content-type: application/json' --data '{"prompt":""}'
# {"error": "missing prompt"}                 → key loaded, proxy working
# {"error": "quoting engine not configured"}  → key still not readable (parameter name / IAM)
```

Rotating the key is steps 1 and 3 again. The model is `claude-sonnet-5` by default and can be overridden with the `ANTHROPIC_MODEL` environment variable in the service unit.

## Certificates & DNS summary

| Record | Type | Target | Mode |
|---|---|---|---|
| `helmm.io` | CNAME (flattened) | ALB DNS name | Proxied |
| `www` | CNAME | ALB DNS name | Proxied |
| `_8fa0e3c6…` | CNAME | ACM validation | DNS only — keep |

Cloudflare SSL/TLS mode: **Full (strict)**. ACM renews automatically while the validation record exists.
