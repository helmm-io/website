#!/usr/bin/env python3
"""HELM pricing sync — regenerates site/quoteData.jsx from the
"HELM Licensing & Pricing Reference" Google Sheet.

Run on a schedule by .github/workflows/sync-pricing.yml. Reads six tabs
(Support Tiers, Tools & Addons, Bundled By Tier, SLA, M365 Licences, Google
Workspace Licences), validates them, and — only if everything checks out —
renders a new site/quoteData.jsx. The workflow commits and pushes it only if
the rendered file actually differs, which is what triggers the existing
auto-deploy.

On-site support cadence (HELM_ONSITE_LEVELS / helmOnsiteLevel) and the
always-included RMM/MDM line (HELM_ALWAYS_INCLUDED) are logic, not simple
price data, so they are NOT sourced from the sheet — they're carried over
unchanged from TEMPLATE below. Edit them in this script (or ask Claude to)
if they ever need to change.

Deliberately fails loudly and writes nothing if the sheet doesn't validate —
see validate_*() below — since this pipeline auto-publishes with no human
review step. A failed run shows as a red X in the Actions tab.

Requires: google-api-python-client, google-auth (see requirements.txt).
Auth: a service account JSON key in the GOOGLE_SERVICE_ACCOUNT_JSON env var,
shared as Viewer on the sheet. Sheet ID from the PRICING_SHEET_ID env var.
"""
import json
import os
import sys
from datetime import date

from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
TIER_NAMES = ('Essential', 'Secure', 'Secure+', 'Enterprise')

# Devices included per licensed user (RMM/MDM, and EDR on tiers where it's bundled
# free). This is a business constant, not sheet data — it must be kept in sync by
# hand with HELM_DEVICES_PER_USER in site/sectionsC.jsx.
DEVICES_PER_USER = 2

# The AI invoice-matching prompt carries a couple of vendor hints that only help the
# model match line items on a customer's invoice — they're not part of the site-facing
# Display Name/Description the sheet holds, so they're kept here rather than as sheet
# columns. NAME_HINTS is appended to the display name before the price; LINE_HINTS is
# appended after the price/unit.
QUOTE_CONTEXT_NAME_HINTS = {'egnyteAFS': ' (Egnyte AFS)', 'egnyteIFS': ' (Egnyte IFS)', 'huntressITDR': ' (ITDR)'}
QUOTE_CONTEXT_LINE_HINTS = {'huntressITDR': ', Microsoft 365 or Google Workspace'}
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_PATH = os.path.join(REPO_ROOT, 'site', 'quoteData.jsx')


class ValidationError(Exception):
    pass


# ---------------------------------------------------------------- fetching --

def get_sheets_client():
    key_json = os.environ.get('GOOGLE_SERVICE_ACCOUNT_JSON')
    if not key_json:
        sys.exit('error: GOOGLE_SERVICE_ACCOUNT_JSON is not set')
    info = json.loads(key_json)
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    return build('sheets', 'v4', credentials=creds, cache_discovery=False)


def fetch_tab(client, sheet_id, tab_name):
    resp = client.spreadsheets().values().get(
        spreadsheetId=sheet_id, range=f"'{tab_name}'!A1:Z1000").execute()
    return resp.get('values', [])


def rows_after_header(grid, header_first_cell):
    """Finds the header row by its first cell (skips an optional merged note
    row above it), then returns every row after it up to the first blank
    row, each padded/truncated to the header's column count."""
    header_idx = None
    for i, row in enumerate(grid):
        if row and row[0].strip() == header_first_cell:
            header_idx = i
            break
    if header_idx is None:
        raise ValidationError(f'could not find a header row starting with "{header_first_cell}"')
    ncols = len(grid[header_idx])
    out = []
    for row in grid[header_idx + 1:]:
        if not row or not any(c.strip() for c in row):
            break
        padded = row + [''] * (ncols - len(row))
        out.append([c.strip() for c in padded[:ncols]])
    return out


def to_float(val, what):
    try:
        return float(str(val).replace(',', '').replace('£', '').strip())
    except (ValueError, AttributeError):
        raise ValidationError(f'expected a number for {what!r}, got {val!r}')


def to_bool(val, what):
    v = str(val).strip().upper()
    if v in ('TRUE', 'YES', '1'):
        return True
    if v in ('FALSE', 'NO', '0', ''):
        return False
    raise ValidationError(f'expected TRUE/FALSE for {what!r}, got {val!r}')


# --------------------------------------------------------------- parsing ---

def parse_support_tiers(rows):
    if len(rows) != 4:
        raise ValidationError(f'Support Tiers: expected exactly 4 tiers, found {len(rows)}')
    tiers = {}
    for tier, fee, infra, min_u, max_u in rows:
        if tier not in TIER_NAMES:
            raise ValidationError(f'Support Tiers: unknown tier name {tier!r} — must be one of {TIER_NAMES}')
        tiers[tier] = {
            'sale': to_float(fee, f'{tier} support fee'),
            'infra': to_float(infra, f'{tier} infra fee'),
            'min_users': int(to_float(min_u, f'{tier} min users')),
            'max_users': int(to_float(max_u, f'{tier} max users')) if max_u else None,
        }
    if set(tiers) != set(TIER_NAMES):
        raise ValidationError(f'Support Tiers: missing tier(s) {set(TIER_NAMES) - set(tiers)}')
    return tiers


def parse_tools(rows):
    if not rows:
        raise ValidationError('Tools & Addons: no rows found')
    tools = {}
    for key, name, price, unit, desc, hide in rows:
        if not key:
            raise ValidationError('Tools & Addons: a row has a blank Key')
        if key in tools:
            raise ValidationError(f'Tools & Addons: duplicate key {key!r}')
        if unit not in ('user', 'device'):
            raise ValidationError(f'Tools & Addons: unit for {key!r} must be "user" or "device", got {unit!r}')
        tools[key] = {
            'displayName': name,
            'sale': to_float(price, f'{key} price'),
            'unit': unit,
            'desc': desc,
            'noBudgetAddon': to_bool(hide, f'{key} Hide from Budget Explorer'),
        }
    return tools


def parse_bundled(rows, valid_keys):
    bundled = {t: [] for t in TIER_NAMES}
    for key, essential, secure, secure_plus, enterprise in rows:
        if key not in valid_keys:
            raise ValidationError(f'Bundled By Tier: key {key!r} is not in Tools & Addons')
        flags = dict(zip(TIER_NAMES, (essential, secure, secure_plus, enterprise)))
        for tier, flag in flags.items():
            if to_bool(flag, f'{key}/{tier} bundled flag'):
                bundled[tier].append(key)
    return bundled


def parse_sla(rows):
    if len(rows) != 4:
        raise ValidationError(f'SLA: expected exactly 4 tiers, found {len(rows)}')
    sla = {}
    for tier, hours, full_cover, reporting in rows:
        if tier not in TIER_NAMES:
            raise ValidationError(f'SLA: unknown tier name {tier!r}')
        sla[tier] = {'hours': hours, 'fullCover': to_bool(full_cover, f'{tier} Full Cover'), 'reporting': reporting}
    if set(sla) != set(TIER_NAMES):
        raise ValidationError(f'SLA: missing tier(s) {set(TIER_NAMES) - set(sla)}')
    return sla


def parse_licences(rows, what):
    licences = []
    for name, price in rows:
        if not name:
            raise ValidationError(f'{what}: a row has a blank licence name')
        licences.append((name, to_float(price, f'{name} price')))
    if not licences:
        raise ValidationError(f'{what}: no rows found')
    return licences


def recommend_tier_bands(tiers):
    """Sorts tiers by Min Users and checks the bands are contiguous (each
    tier's Max Users + 1 == the next tier's Min Users, last tier open-ended),
    since helmRecommendTier assumes that shape."""
    ordered = sorted(tiers.items(), key=lambda kv: kv[1]['min_users'])
    for i, (tier, t) in enumerate(ordered):
        is_last = i == len(ordered) - 1
        if is_last:
            if t['max_users'] is not None:
                raise ValidationError(f'Support Tiers: {tier} (highest by Min Users) must have a blank Max Users')
        else:
            if t['max_users'] is None:
                raise ValidationError(f'Support Tiers: {tier} must have a Max Users (only the top tier is unbounded)')
            next_tier, next_t = ordered[i + 1]
            if t['max_users'] + 1 != next_t['min_users']:
                raise ValidationError(
                    f"Support Tiers: gap/overlap between {tier} (max {t['max_users']}) "
                    f"and {next_tier} (min {next_t['min_users']}) — bands must be contiguous")
    return ordered


# -------------------------------------------------------------- rendering --

def js_str(s):
    return json.dumps(s, ensure_ascii=False)


def render_pricing_block(tiers, tools):
    support_lines = ',\n    '.join(f"{js_str(t)}:  {{ sale: {tiers[t]['sale']:.2f} }}" for t in TIER_NAMES)
    infra_lines = ',\n    '.join(f"{js_str(t)}:  {{ sale: {tiers[t]['infra']:.2f} }}" for t in TIER_NAMES)
    tool_lines = ',\n    '.join(
        f"{k}:      {{ displayName: {js_str(v['displayName'])}, sale: {v['sale']:.2f},  unit: {js_str(v['unit'])}"
        + (", noBudgetAddon: true }" if v.get('noBudgetAddon') else " }")
        for k, v in tools.items())
    return (
        "const HELM_PRICING = {\n"
        "  support: {\n"
        f"    {support_lines},\n"
        "  },\n"
        "  infra: {\n"
        f"    {infra_lines},\n"
        "  },\n"
        "  tools: {\n"
        f"    {tool_lines},\n"
        "  },\n"
        "};"
    )


def render_bundled_block(bundled):
    lines = ',\n  '.join(f"{js_str(t)}:  [{', '.join(js_str(k) for k in bundled[t])}]" for t in TIER_NAMES)
    return "const HELM_BUNDLED_BY_TIER = {\n  " + lines + ",\n};"


def render_sla_block(sla):
    lines = ',\n  '.join(
        f"{js_str(t)}:  {{ hours: {js_str(sla[t]['hours'])}, fullCover: {str(sla[t]['fullCover']).lower()}, "
        f"reporting: {js_str(sla[t]['reporting'])} }}"
        for t in TIER_NAMES)
    return "const HELM_SLA = {\n  " + lines + ",\n};"


def render_descriptors_block(tools):
    lines = ',\n  '.join(f"{k}:      {js_str(v['desc'])}" for k, v in tools.items())
    return "const HELM_DESCRIPTORS = {\n  " + lines + ",\n};"


def render_recommend_tier(ordered_tiers):
    # ordered_tiers is ascending by min_users. Every tier except the lowest
    # becomes an "if userCount > (its min - 1)" check, checked highest-first;
    # the lowest tier is the unconditional fallback.
    lines = [
        f"  if (userCount > {t['min_users'] - 1}) return {js_str(tier)};"
        for tier, t in reversed(ordered_tiers[1:])
    ]
    lowest_tier = ordered_tiers[0][0]
    body = '\n'.join(lines)
    return (
        "function helmRecommendTier(userCount) {\n"
        f"{body}\n"
        f"  return {js_str(lowest_tier)};\n"
        "}"
    )


def render_quote_context(ordered_tiers, tools, m365, gws):
    if 'rmmOverage' not in tools or 'mdmOverage' not in tools:
        raise ValidationError(
            'Tools & Addons: rmmOverage and mdmOverage rows are required (used by the invoice-matching AI prompt)')

    fee_line = ' | '.join(f"{t} £{v['sale']:.0f}" for t, v in ordered_tiers)
    infra_line = ' | '.join(f"{t} £{v['infra']:,.0f}" for t, v in ordered_tiers)
    rmm_overage_price = tools['rmmOverage']['sale']
    mdm_overage_price = tools['mdmOverage']['sale']

    addon_parts = []
    for k, v in tools.items():
        if k in ('rmmOverage', 'mdmOverage'):
            continue  # auto-computed overage, not a customer-facing paid add-on
        name = v['displayName'] + QUOTE_CONTEXT_NAME_HINTS.get(k, '')
        addon_parts.append(f"{name} £{v['sale']:.2f}/{v['unit']}" + QUOTE_CONTEXT_LINE_HINTS.get(k, ''))
    addon_line = ' | '.join(addon_parts)

    m365_line = ' | '.join(f"{name} £{price:.2f}" for name, price in m365)
    gws_line = ' | '.join(f"{name} £{price:.2f}" for name, price in gws)

    bands = []
    for i, (tier, t) in enumerate(ordered_tiers):
        if t['max_users'] is None:
            # Top tier: phrase as "<previous tier's cap>+", matching the plain, rounded
            # style of the hand-written original (e.g. "100+" for Enterprise, even though
            # its own Min Users is 101 — it reads as "more than Secure+'s ceiling").
            prev_cap = ordered_tiers[i - 1][1]['max_users'] if i > 0 else t['min_users'] - 1
            bands.append(f"{tier} {prev_cap}+")
        elif t['min_users'] == 1:
            bands.append(f"{tier} up to {t['max_users']} users")
        else:
            bands.append(f"{tier} {t['min_users']} to {t['max_users']}")
    bands_line = ', '.join(bands)

    return f"""You are a quoting assistant for HELM, a global IT consultancy. A prospective client has shared their current IT invoice so HELM can produce a comparable quote.

SUPPORT TIERS (per user/mo): {fee_line}
INFRASTRUCTURE FEE (flat per client/mo): {infra_line}

BUNDLED IN EVERY TIER (never a separate line item, never billed, do not add to helm_mapping or helm_total): Windows/Mac device monitoring, patching and management (RMM/MDM), covering {DEVICES_PER_USER} managed devices per licensed user. This replaces any "RMM", "NinjaOne", "Addigy", "device management" or "patch management" line on the customer's invoice: map it to nothing and mention in notes that it's included at no extra cost. If the invoice states a device count more than double the user count, note the likely RMM/MDM overage (£{rmm_overage_price:.0f}/device for RMM, £{mdm_overage_price:.0f}/device for MDM, beyond the {DEVICES_PER_USER} per user allowance) in notes, but do not add it to helm_mapping or helm_total unless the invoice gives you a device count to calculate from.

ALSO BUNDLED FREE from Secure upward (never billed on Secure/Secure+/Enterprise quotes, only shown as a paid add-on when quoting Essential): Endpoint Detection & Response (EDR), covering {DEVICES_PER_USER} managed devices per licensed user; devices beyond that allowance are billed at the EDR add-on rate below. Matches any "EDR", "SentinelOne", "CrowdStrike", "advanced antivirus" or similar line on the customer's invoice.
ALSO BUNDLED FREE from Secure+ upward (never billed on Secure+/Enterprise quotes, only shown as a paid add-on when quoting Essential or Secure): Identity & Cloud Security Monitoring (ITDR), per licensed user with no device allowance. Matches any "identity protection", "ITDR" or "M365 security monitoring" line.

PAID ADD-ONS (per device or user/mo; every add-on below is available on EVERY tier, including a tier where the same tool is already bundled free; never add a bundled-free tool as a paid add-on on the tier that bundles it): {addon_line}

MICROSOFT 365 LICENCES (per user/mo): {m365_line}
GOOGLE WORKSPACE LICENCES (per user/mo): {gws_line}

RULES FOR CHOOSING THE TIER (read carefully, this is the most important part):
1. First find the headcount implied tier: {bands_line}. Treat this only as a starting point, never as the final answer.
2. Do not default straight to the headcount implied tier. Every add-on above is available on every tier, so a cheaper tier plus only the specific paid add-ons needed to replicate what the customer's invoice already shows them paying for can easily beat a pricier tier that happens to bundle one of those same tools in for free. The per-user fee step between tiers is usually bigger than the cost of the individual add-on(s) it bundles. Example: a 30 user prospect whose invoice shows support at £65/user plus EDR billed separately. Secure+ (£95/user) bundles EDR free, but Essential (£55/user) + the EDR add-on (£7.76/device) comes to about £62.76/user: cheaper than Secure+, and cheaper than their current £65 plus EDR too. Do not jump straight to the tier EDR happens to be bundled on; check the maths.
3. Concretely: for every tier from Essential up to the headcount implied tier, work out the full monthly cost of matching everything on the invoice at that tier: support fee × users, plus the infrastructure fee, plus a paid add-on for anything that tier does not bundle free but the invoice shows the customer already has. Recommend whichever tier gives the lowest total monthly cost.
4. Any mention on the invoice of 24/7 user support, 24/7 helpdesk, round the clock support, out of hours support, weekend cover, or similar language always triggers a recommendation of at least Secure+, the lowest tier with a human engineer included 24/7/365 at no extra charge (Essential and Secure only offer a human engineer out of hours on a billed hourly basis). When this applies, skip the cost comparison in rules 2 and 3 entirely: recommend Secure+, or Enterprise if the headcount implied tier from rule 1 is already Enterprise, regardless of whether a cheaper tier could otherwise match the rest of the invoice, and say in notes that the invoice specifies 24/7 support and only Secure+ and Enterprise deliver that at no extra charge. If the invoice does not mention 24/7 support or similar in any form, ignore this rule and follow rules 2 and 3 as normal. Never infer a 24/7 requirement purely from headcount or company size.
5. If the cheapest tier and the headcount implied tier land within a few pounds a month of each other, prefer the headcount implied tier: its support hours and onsite cadence are better for a negligible cost difference, and say so in notes.
6. Once you've picked the tier: match every remaining line item on the invoice to the closest HELM equivalent, applying the bundling rules above. Include that tier's support fee and infrastructure fee. Use exact HELM sale prices only for these direct matches. monthly_price = per-unit price only, never a line total. For any invoice line with no direct HELM equivalent, still add it to helm_mapping so the client is quoted for it: helm_equivalent = a short label for it (drawn from the invoice), unit = "flat", monthly_price = exactly the price already shown on the invoice for that line — never invent a figure. If the invoice gives no price for that line, leave it out of helm_mapping and helm_total entirely. Also add a short label for every such item to unmatched_items, so it's still called out separately as something the team will confirm — this is for the sales rep's benefit only and must never be double counted. helm_total = sum of all (qty x monthly_price) across every line in helm_mapping, including paid add-ons and items priced this way, excluding anything bundled free at that tier.
7. In notes, write one short sentence (no more than about 20 words) naming the tier and the single clearest reason, in plain English a sales rep can read straight off the screen — for example "Essential — your invoice doesn't mention 24/7 support, so a cheaper tier covers everything you have." or "Secure+ — your invoice specifies 24/7 support, which only Secure+ and Enterprise include at no extra charge." Do not walk through the cost comparison, list every tier considered, or mention specific pound figures — just the headline reason.

Return ONLY a valid JSON object, no explanation or text outside the JSON:
{{"users":<number>,"devices":<number>,"tier":"<Essential|Secure|Secure+|Enterprise>","helm_mapping":[{{"helm_equivalent":"string","qty":<number>,"unit":"<user|device|flat>","monthly_price":<per-unit price>}}],"helm_total":<number>,"unmatched_items":["string"],"notes":"string"}}"""


TEMPLATE = """/* HELM MSP Pricing & tools configuration (single source of truth for the quote tools).
   AUTO-GENERATED by scripts/sync_pricing_sheet.py from the "HELM Licensing & Pricing
   Reference" Google Sheet — do not hand-edit price/tier/tool data here, edit the sheet
   instead and let the sync pick it up (target cadence: every 15-30 minutes). On-site
   cadence logic and this comment block are the only parts NOT sourced from the sheet.
   All prices are exclusive of VAT, per unit/month unless stated. displayName is prospect
   facing (no vendor names).

   Sell prices only — buy costs and margins live in MSP_Pricing.xlsx and never appear here.
   Last synced: {sync_date}.

   DEVICE ALLOWANCE: every plan includes {devices_per_user} managed devices per licensed user, covering RMM
   (remote monitoring & management), MDM (mobile device management), and, on any tier where
   EDR is bundled free, EDR too. Devices beyond that allowance are billed monthly per device
   at the rates in HELM_PRICING.tools.rmmOverage / mdmOverage, and, on tiers where EDR is
   bundled free, at the huntressEDR add-on rate. ITDR remains a simple per licensed user
   inclusion with no device allowance.

   BUNDLING MODEL: RMM + MDM (device management) are absorbed into every tier's support fee
   and are never itemised or separately billed within the included allowance. EDR is
   additionally bundled free from Secure upward; ITDR is additionally bundled free from
   Secure+ upward, on a per licensed user basis. Every tool below is also offered as an
   optional, separately priced add-on on the website's Budget Explorer regardless of tier
   (a visitor can add EDR to Essential, or ITDR to Secure, etc.), except any tool flagged
   noBudgetAddon (hidden from the Budget Explorer add-on list but remaining available for
   the invoice matching tool). That's a UI choice made in sectionsC.jsx, not encoded here.

   ON-SITE SUPPORT: cadence scales with headcount and is boosted or trimmed per tier; see
   helmOnsiteLevel below. This is logic, not sheet data, and is carried over unchanged by the
   sync script. Secure's cadence is the base table (11 to 25 users quarterly, 26 to 50
   monthly half day); Essential trims one step below that (remote first); Secure+ adds one
   step above; Enterprise is always weekly/dedicated resource regardless of headcount.

   CONTRACT TERM: every plan starts on a monthly rolling agreement for the client's first 12
   months. Once the client is happy, the agreement renews onto a 36 month term. See the
   footnote surfaced on the site next to the price. */

{pricing_block}

/* RMM/MDM is bundled free into every tier's support fee, covering {devices_per_user} managed devices
   per licensed user. It's rendered as an always-included line rather than living in
   the tools table; devices beyond the allowance are billed via HELM_PRICING.tools
   rmmOverage / mdmOverage, computed in helmBuildTiers. */
const HELM_ALWAYS_INCLUDED = {{
  key: 'rmmMdm',
  displayName: 'Device Monitoring, Patching & Management (RMM/MDM)',
  desc: 'Continuous remote monitoring and automated patching of every managed Windows and Mac device, keeping them secure and up to date without interrupting users. Covers {devices_per_user} managed devices per licensed user; additional devices are billed monthly, shown separately below when they apply.',
}};

/* Which HELM_PRICING.tools keys are bundled free into each tier, up to the
   licensed user count. These are shown as included lines on that tier (never
   as a tickable, separately priced add-on there). On any other tier the same
   tool is still a normal optional add-on. Keep in sync with the BUNDLING MODEL
   note above and the invoice tool prompt below. */
{bundled_block}

/* Onsite support cadence. A base cadence scales with headcount (the thresholds
   below), then each tier boosts or trims that base by one step, so two clients
   with the same headcount get tier appropriate cadence rather than identical
   cadence everywhere. Secure IS the base table (boost 0). Essential trims one
   step below base, matching its remote first positioning. Secure+ adds one step
   above base. Enterprise always sits at the top level regardless of headcount:
   weekly presence, moving into a dedicated onsite resource conversation, since
   that's part of what Enterprise buys. NOT sourced from the sheet; logic lives
   here only, edit this script's TEMPLATE to change it. */
const HELM_ONSITE_LEVELS = [
  {{ level: 0, label: 'Onsite Support', sub: 'Remote first · ad hoc onsite visits billed separately',
    desc: 'No scheduled onsite visits. Your team is supported remotely day to day; an onsite visit can be arranged and billed separately whenever it is needed.' }},
  {{ level: 1, label: 'Onsite Support', sub: 'Quarterly visit, half day',
    desc: 'A scheduled half day onsite visit every quarter, for hands on work, stakeholder check ins and anything easier to resolve in person.' }},
  {{ level: 2, label: 'Onsite Support', sub: 'Monthly visit, half day',
    desc: 'A scheduled half day onsite visit every month, keeping a regular in person cadence alongside remote support.' }},
  {{ level: 3, label: 'Onsite Support', sub: 'Monthly visit, full day (or fortnightly half day)',
    desc: 'A scheduled full day onsite visit every month, or a half day visit every fortnight, whichever suits your team\\u2019s working pattern.' }},
  {{ level: 4, label: 'Onsite Support', sub: 'Weekly onsite presence',
    desc: 'Weekly onsite presence as standard. At this scale a dedicated part time or full time onsite resource is usually the more cost effective option compared with ad hoc visits; we\\u2019ll scope that as part of onboarding.' }},
];

function helmOnsiteLevel(tier, users) {{
  if (tier === 'Enterprise') return HELM_ONSITE_LEVELS[4];
  let base = 0;
  if (users > 100) base = 4;
  else if (users > 50) base = 3;
  else if (users > 25) base = 2;
  else if (users > 10) base = 1;
  const boost = tier === 'Secure+' ? 1 : tier === 'Essential' ? -1 : 0; // Secure = 0 (base table)
  const lvl = Math.max(0, Math.min(4, base + boost));
  return HELM_ONSITE_LEVELS[lvl];
}}

/* Support hours model: AI triage and remediation runs 24/7 on every plan (see
   sectionsC.jsx), regardless of tier, so a client can always get hold of HELM.
   "hours" below is when a live human engineer is covering at no extra charge;
   fullCover marks the tiers where that live cover is truly 24/7/365. Outside
   the stated hours on a non fullCover tier, a client can still reach a human
   engineer; it's just billed hourly rather than included. Only Secure+ and
   Enterprise are fullCover, with no hourly billing for out of hours access to
   a human engineer. */
{sla_block}

{descriptors_block}

const HELM_TIER_NAMES = [{tier_names}];

{recommend_tier_block}

/* Prompt used by the AI invoice-comparison tool. Prices mirror the config above,
   generated from the same sheet data so the two can never drift apart. */
const HELM_QUOTE_CONTEXT = `{quote_context}`;

Object.assign(window, {{ HELM_PRICING, HELM_SLA, HELM_DESCRIPTORS, HELM_TIER_NAMES, HELM_ALWAYS_INCLUDED, HELM_BUNDLED_BY_TIER, HELM_ONSITE_LEVELS, helmOnsiteLevel, helmRecommendTier, HELM_QUOTE_CONTEXT }});
"""


def render_quote_data_jsx(tiers, ordered_tiers, tools, bundled, sla, m365, gws):
    return TEMPLATE.format(
        sync_date=date.today().isoformat(),
        devices_per_user=DEVICES_PER_USER,
        pricing_block=render_pricing_block(tiers, tools),
        bundled_block=render_bundled_block(bundled),
        sla_block=render_sla_block(sla),
        descriptors_block=render_descriptors_block(tools),
        tier_names=', '.join(js_str(t) for t in TIER_NAMES),
        recommend_tier_block=render_recommend_tier(ordered_tiers),
        quote_context=render_quote_context(ordered_tiers, tools, m365, gws)
        .replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${'),
    )


# ------------------------------------------------------------------- main --

def main():
    sheet_id = os.environ.get('PRICING_SHEET_ID')
    if not sheet_id:
        sys.exit('error: PRICING_SHEET_ID is not set')
    client = get_sheets_client()

    try:
        support_rows = rows_after_header(fetch_tab(client, sheet_id, 'Support Tiers'), 'Tier')
        tools_rows = rows_after_header(fetch_tab(client, sheet_id, 'Tools & Addons'), 'Key (do not edit)')
        bundled_rows = rows_after_header(fetch_tab(client, sheet_id, 'Bundled By Tier'), 'Tool Key')
        sla_rows = rows_after_header(fetch_tab(client, sheet_id, 'SLA'), 'Tier')
        m365_rows = rows_after_header(fetch_tab(client, sheet_id, 'M365 Licences'), 'Licence Name')
        gws_rows = rows_after_header(fetch_tab(client, sheet_id, 'Google Workspace Licences'), 'Licence Name')

        tiers = parse_support_tiers(support_rows)
        tools = parse_tools(tools_rows)
        bundled = parse_bundled(bundled_rows, set(tools))
        sla = parse_sla(sla_rows)
        m365 = parse_licences(m365_rows, 'M365 Licences')
        gws = parse_licences(gws_rows, 'Google Workspace Licences')
        ordered_tiers = recommend_tier_bands(tiers)
    except ValidationError as e:
        sys.exit(f'validation failed, NOT touching {OUTPUT_PATH}: {e}')

    rendered = render_quote_data_jsx(tiers, ordered_tiers, tools, bundled, sla, m365, gws)

    existing = ''
    if os.path.exists(OUTPUT_PATH):
        with open(OUTPUT_PATH, encoding='utf-8') as f:
            existing = f.read()

    # Ignore the sync-date line when diffing so a no-op run (sheet unchanged)
    # doesn't produce a commit every single time it happens to run.
    def strip_date(s):
        return '\n'.join(l for l in s.splitlines() if not l.strip().startswith('Last synced:'))

    if strip_date(rendered) == strip_date(existing):
        print('no pricing changes — leaving quoteData.jsx untouched')
        return

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(rendered)
    print(f'wrote {OUTPUT_PATH}')


if __name__ == '__main__':
    main()
