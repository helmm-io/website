/* HELM MSP — Pricing & tools configuration (single source of truth for the quote tools).
   Ported from helm_pricing_config.js. All prices are ex-VAT, per unit/month unless stated.
   displayName is prospect-facing (no vendor names). */

const HELM_PRICING = {
  support: {
    Essential:  { sale: 65.00 },
    Secure:     { sale: 75.00 },
    'Secure+':  { sale: 95.00 },
    Enterprise: { sale: 150.00 },
  },
  infra: {
    Essential:  { sale: 250.00 },
    Secure:     { sale: 400.00 },
    'Secure+':  { sale: 650.00 },
    Enterprise: { sale: 1000.00 },
  },
  tools: {
    ninja:       { displayName: 'Windows Remote Monitoring & Management', sale: 5.00, unit: 'device', tiers: ['Essential','Secure','Secure+','Enterprise'], os: ['windows','both'] },
    addigy:      { displayName: 'Mac Patching & Management',              sale: 4.10, unit: 'device', tiers: ['Essential','Secure','Secure+','Enterprise'], os: ['mac','both'] },
    webroot:     { displayName: 'Endpoint Protection',                    sale: 2.49, unit: 'device', tiers: ['Essential'],                                 os: ['windows','mac','both'] },
    huntressEDR: { displayName: 'Endpoint Detection & Response (EDR)',    sale: 3.02, unit: 'device', tiers: ['Secure','Secure+','Enterprise'],            os: ['windows','mac','both'] },
    s1:          { displayName: 'Advanced EDR & Threat Control',          sale: 6.27, unit: 'device', tiers: ['Secure+','Enterprise'],                     os: ['windows','mac','both'] },
    dropsuite:   { displayName: 'Email & Cloud Server Backup',            sale: 3.92, unit: 'user',   tiers: ['Essential','Secure','Secure+','Enterprise'], os: ['windows','mac','both'] },
    huntressITDR:{ displayName: 'Identity & Cloud Security Monitoring',   sale: 3.45, unit: 'user',   tiers: ['Secure','Secure+','Enterprise'],            os: ['windows','mac','both'], emailReq: 'm365' },
    exclaimer:   { displayName: 'Managed Email Signatures',               sale: 1.35, unit: 'user',   tiers: ['Essential','Secure','Secure+','Enterprise'], os: ['windows','mac','both'] },
    phin:        { displayName: 'Security Awareness Training',            sale: 2.50, unit: 'user',   tiers: ['Secure+','Enterprise'],                     os: ['windows','mac','both'] },
    egnyte:      { displayName: 'Advanced File Management & Collaboration',sale: 20.00,unit: 'user',   tiers: ['Essential','Secure','Secure+','Enterprise'], os: ['windows','mac','both'] },
  },
};

const HELM_SLA = {
  Essential:  { hours: '08:00–18:00 Mon–Fri', ooh: false, uptime: '99.5%',  reporting: 'Quarterly' },
  Secure:     { hours: '24/5 Mon–Fri',        ooh: false, uptime: '99.7%',  reporting: 'Monthly' },
  'Secure+':  { hours: '24/7/365',            ooh: true,  uptime: '99.9%',  reporting: 'Monthly' },
  Enterprise: { hours: '24/7/365',            ooh: true,  uptime: '99.95%', reporting: 'Weekly' },
};

const HELM_DESCRIPTORS = {
  ninja:       'Continuous remote monitoring of all Windows endpoints. Automated patching keeps devices secure and up to date without interrupting users.',
  addigy:      'Full lifecycle management for Apple Mac devices: remote monitoring, OS and app patching, compliance enforcement and configuration.',
  webroot:     'Traditional signature-based endpoint protection providing a foundational layer of defence against known malware and web threats.',
  huntressEDR: 'Endpoint Detection & Response goes beyond antivirus, continuously hunting for attacker behaviour, fileless threats and post-exploitation activity that AV cannot see. Backed by a 24/7 Security Operations Centre.',
  s1:          'Advanced EDR with AI-powered behavioural analysis, autonomous threat containment and one-click rollback of ransomware damage, without needing human intervention.',
  dropsuite:   'Automated daily backup of all Microsoft 365 and Google Workspace data: email, calendars, contacts and cloud files. Point-in-time restore to any date.',
  huntressITDR:'Monitors your Microsoft 365 identity layer for suspicious logins, privilege escalation and account compromise, catching threats cloud AV cannot see.',
  exclaimer:   'Centrally managed, consistent email signatures across the whole organisation. Brand-compliant on every device, every email client.',
  phin:        'Continuous phishing simulation and bite-sized security training that builds staff awareness and measurably reduces human risk.',
  egnyte:      'Secure cloud file management and collaboration platform, giving your team fast, controlled access to business files from any device, with full audit trails and admin oversight.',
};

const HELM_TIER_NAMES = ['Essential', 'Secure', 'Secure+', 'Enterprise'];

function helmRecommendTier(userCount) {
  if (userCount > 30) return 'Secure+';
  if (userCount > 10) return 'Secure';
  return 'Essential';
}

/* Prompt used by the AI invoice-comparison tool. Prices mirror the config above. */
const HELM_QUOTE_CONTEXT = `You are a quoting assistant for HELM, a global IT consultancy. A prospective client has shared their current IT invoice so HELM can produce a comparable quote.

SUPPORT TIERS (per user/mo): Essential \xa365 | Secure \xa375 | Secure+ \xa395 | Enterprise \xa3150
INFRASTRUCTURE FEE (flat per client/mo): Essential \xa3250 | Secure \xa3400 | Secure+ \xa3650 | Enterprise \xa31,000
DEVICE TOOLS (per endpoint/mo): Windows Remote Monitoring & Management \xa35.00 | Mac Patching & Management \xa34.10 | Endpoint Protection \xa32.49 (Essential) | Endpoint Detection & Response (EDR) \xa33.02 (Secure/Secure+) | Advanced EDR & Threat Control \xa36.27 (Secure+)
USER TOOLS (per user/mo): Email & Cloud Server Backup \xa33.92 | Identity & Cloud Security Monitoring \xa33.45 (M365 only) | Managed Email Signatures \xa31.35 | Security Awareness Training \xa32.50 | Advanced File Management & Collaboration (Egnyte) \xa320.00
MICROSOFT 365 LICENCES (per user/mo): M365 Business Basic \xa36.00 | M365 Business Standard \xa313.50 | M365 Business Premium \xa324.00 | M365 Apps for Business \xa39.72 | M365 E3 (no Teams) \xa334.80 | M365 E5 (no Teams) \xa356.52 | Microsoft Teams Essentials \xa33.72 | Microsoft Teams Enterprise \xa37.92 | Microsoft Teams Rooms Pro \xa336.96 | Microsoft Entra ID P1 \xa35.88 | Microsoft Power BI Pro \xa312.96 | Microsoft Project Plan 3 \xa329.64 | Microsoft Visio Plan 2 \xa313.80 | Exchange Online Plan 1 \xa33.96 | Exchange Online Plan 2 \xa37.92 | O365 Enterprise E3 (legacy) \xa326.40
GOOGLE WORKSPACE LICENCES (per user/mo): Google Workspace Business Starter \xa37.00 | Google Workspace Business Standard \xa313.00 | Google Workspace Business Plus \xa322.00 | Google Workspace Enterprise Plus \xa335.30 | GWS Enterprise Plus Archived User \xa37.00 | Google Workspace Business Plus Archive \xa34.00

RULES: Match every line item to the closest HELM equivalent. Include support tier and infrastructure fee based on user count. Use exact HELM sale prices only. monthly_price = per-unit price only, never a line total. helm_total = sum of all (qty x monthly_price). Exclude unmatched items from total and list them in unmatched_items.

Return ONLY a valid JSON object, no explanation or text outside the JSON:
{"users":<number>,"devices":<number>,"tier":"<Essential|Secure|Secure+|Enterprise>","helm_mapping":[{"helm_equivalent":"string","qty":<number>,"unit":"<user|device|flat>","monthly_price":<per-unit price>}],"helm_total":<number>,"unmatched_items":["string"],"notes":"string"}`;

Object.assign(window, { HELM_PRICING, HELM_SLA, HELM_DESCRIPTORS, HELM_TIER_NAMES, helmRecommendTier, HELM_QUOTE_CONTEXT });
