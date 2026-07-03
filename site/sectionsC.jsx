/* HELM MSP website — Instant Quote section.
   Two real tools, rendered in the Helm design system:
   · Budget Explorer  — deterministic, client-side pricing across all four tiers.
   · Beat my invoice  — AI reads your current supplier invoice → like-for-like Helm quote.
   Pricing data lives in quoteData.jsx (window.HELM_*). */
const { Button, Icon, Eyebrow, Badge } = window.HELMDesignSystem_93c981;
const HELM_MAX_C = 'var(--content-max)';

/* Work-email gate for the quote wall.
   1) Block free / personal mailbox providers (gmail, outlook, etc.).
   2) Verify the domain can actually receive mail via a DNS-over-HTTPS MX
      lookup (Google, then Cloudflare). If the domain has no MX and no A
      record, it's treated as fake/invalid. If the DNS service itself can't
      be reached, we fail OPEN so a real visitor is never blocked by an
      outage. */
const HELM_FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'ymail.com', 'rocketmail.com',
  'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'outlook.co.uk', 'live.com', 'live.co.uk', 'msn.com',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'aim.com', 'gmx.com', 'gmx.co.uk', 'gmx.net',
  'mail.com', 'zoho.com', 'yandex.com', 'yandex.ru', 'protonmail.com', 'proton.me', 'pm.me',
  'tutanota.com', 'tuta.io', 'hey.com', 'fastmail.com', 'hushmail.com',
  'btinternet.com', 'sky.com', 'virginmedia.com', 'talktalk.net', 'ntlworld.com',
  'blueyonder.co.uk', 'tiscali.co.uk', 'orange.net', 'o2.co.uk',
]);

async function helmDomainHasMail(domain) {
  const doh = async (name, type) => {
    const urls = [
      'https://dns.google/resolve?name=' + encodeURIComponent(name) + '&type=' + type,
      'https://cloudflare-dns.com/dns-query?name=' + encodeURIComponent(name) + '&type=' + type,
    ];
    for (const u of urls) {
      try {
        const r = await fetch(u, { headers: { accept: 'application/dns-json' } });
        if (!r.ok) continue;
        return await r.json();
      } catch (e) { /* try next resolver */ }
    }
    return null;
  };
  const mx = await doh(domain, 'MX');
  if (!mx) return null;                       // both resolvers unreachable → fail open
  if (mx.Status === 3) return false;          // NXDOMAIN → domain doesn't exist
  if (mx.Answer && mx.Answer.some((a) => a.type === 15)) return true; // has MX
  // No MX: mail can still fall back to an A record (implicit MX). Check it.
  const a = await doh(domain, 'A');
  if (a && a.Answer && a.Answer.length) return true;
  return false;                               // no MX and no A → not a real mail domain
}

const helmGBP = (n) => '£' + Math.round(n).toLocaleString('en-GB');
const helmGBP2 = (n) => '£' + Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ------------------------------------------------------------------ *
 *  Budget Explorer — real pricing, all four tiers side by side        *
 * ------------------------------------------------------------------ */
function helmBuildTiers(users, devices, os, email) {
  const P = window.HELM_PRICING, SLA = window.HELM_SLA, DESC = window.HELM_DESCRIPTORS;
  const winD = os === 'both' ? Math.ceil(devices / 2) : os === 'windows' ? devices : 0;
  const macD = os === 'both' ? Math.floor(devices / 2) : os === 'mac' ? devices : 0;

  return window.HELM_TIER_NAMES.map((tier) => {
    const ss = P.support[tier].sale, is = P.infra[tier].sale;
    let total = ss * users + is;
    const sla = SLA[tier];
    const lines = [
      { key: 'support', label: 'User Support & Helpdesk', sub: `${users} users × ${helmGBP2(ss)}/mo`, val: ss * users,
        desc: `Support hours: ${sla.hours}${sla.ooh ? ' · out-of-hours on-call included' : ''}. Uptime commitment ${sla.uptime}. ${sla.reporting} service reporting.` },
      { key: 'infra', label: 'Infrastructure & 24/7 Monitoring', sub: 'flat / mo', val: is,
        desc: 'Continuous 24/7 monitoring of your core infrastructure: servers, network devices and cloud services, with proactive alerting and response.' },
    ];
    Object.entries(P.tools).forEach(([k, t]) => {
      if (!t.tiers.includes(tier)) return;
      if (t.emailReq && t.emailReq !== email) return;
      let qty;
      if (t.unit === 'device') {
        if (k === 'addigy') { if (os === 'windows') return; qty = macD; }
        else if (k === 'ninja') { if (os === 'mac') return; qty = winD; }
        else qty = devices;
      } else qty = users;
      if (qty <= 0) return;
      total += t.sale * qty;
      lines.push({ key: k, label: t.displayName, sub: `${qty} × ${helmGBP2(t.sale)} / ${t.unit}`, val: t.sale * qty, desc: DESC[k] });
    });
    return { tier, total, lines };
  });
}

function HelmBudgetExplorer({ onContact, lead }) {
  const [users, setUsers] = React.useState(24);
  const [devices, setDevices] = React.useState(28);
  const [email, setEmail] = React.useState('m365');
  const [os, setOs] = React.useState('windows');
  const [lineOpen, setLineOpen] = React.useState(() => new Set());

  const uSafe = Math.max(1, users), dSafe = Math.max(1, devices);
  const results = React.useMemo(() => helmBuildTiers(uSafe, dSafe, os, email), [uSafe, dSafe, os, email]);
  const rec = window.helmRecommendTier(uSafe);
  const [openTier, setOpenTier] = React.useState(rec);
  // Follow the recommendation as the team size changes.
  const recRef = React.useRef(rec);
  React.useEffect(() => { if (recRef.current !== rec) { recRef.current = rec; setOpenTier(rec); } }, [rec]);

  const osLabel = os === 'windows' ? 'Windows' : os === 'mac' ? 'Mac' : 'Windows & Mac';
  const emailLabel = email === 'm365' ? 'Microsoft 365' : 'Google Workspace';
  const meta = `${uSafe} users · ${dSafe} devices · ${osLabel} · ${emailLabel}`;

  const toggleLine = (id) => setLineOpen((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div className="helm-budget-grid" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 'var(--grid-gap-hair)', background: 'rgba(168,216,224,0.18)', border: '1px solid rgba(168,216,224,0.18)' }}>

      {/* ---- Inputs ---- */}
      <div style={{ background: 'var(--helm-night-teal)', padding: 'clamp(24px,3vw,32px)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--helm-mural-yellow)' }}>Tell us about your team</div>
        <HelmQuoteField label="Number of users" value={users} onChange={setUsers} />
        <HelmQuoteField label="Managed devices" value={devices} onChange={setDevices} />
        <HelmSeg label="Email platform" value={email} onChange={setEmail}
          options={[{ v: 'm365', l: 'Microsoft 365' }, { v: 'google', l: 'Google Workspace' }]} />
        <HelmSeg label="Device operating system" value={os} onChange={setOs}
          options={[{ v: 'windows', l: 'Windows' }, { v: 'mac', l: 'Mac' }, { v: 'both', l: 'Both' }]} />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, lineHeight: 1.6, color: 'var(--helm-warm-grey)', margin: 0, borderTop: '1px solid rgba(168,216,224,0.18)', paddingTop: 18 }}>
          All four packages update live. Open any plan for the full breakdown. Prices exclude VAT and are indicative; Microsoft 365 / Google Workspace licences are quoted separately.
        </p>
      </div>

      {/* ---- Plans (concertina) ---- */}
      <div style={{ background: 'rgba(168,216,224,0.18)', display: 'flex', flexDirection: 'column', gap: 'var(--grid-gap-hair)' }}>
        {results.map((r) => (
          <HelmPlanRow key={r.tier} r={r} isRec={r.tier === rec} isOpen={openTier === r.tier}
            onToggle={() => {
              const opening = openTier !== r.tier;
              setOpenTier(opening ? r.tier : null);
              // Log the created quote to HubSpot when a plan is opened.
              if (opening && lead && window.HelmHubSpot) {
                window.HelmHubSpot.submitQuote({ name: lead.name, company: lead.company, email: lead.email, source: 'Budget Explorer', tier: r.tier, monthly_total: r.total, detail: meta });
              }
            }}
            meta={meta} sla={window.HELM_SLA[r.tier]} lineOpen={lineOpen} toggleLine={toggleLine} onContact={onContact} />
        ))}
      </div>
    </div>
  );
}

function HelmPlanRow({ r, isRec, isOpen, onToggle, meta, sla, lineOpen, toggleLine, onContact }) {
  return (
    <div style={{ background: 'var(--helm-facade-white)', borderTop: '3px solid ' + (isRec ? 'var(--helm-mural-yellow)' : 'transparent') }}>
      {/* header */}
      <button onClick={onToggle} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: 'clamp(18px,2.2vw,24px) clamp(20px,3vw,32px)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(21px,2.6vw,27px)', textTransform: 'uppercase', letterSpacing: '0.02em', color: 'var(--helm-night-teal)' }}>{r.tier}</span>
            {isRec && <Badge tone="accent">Recommended</Badge>}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)', marginTop: 5 }}>{sla.hours} · {sla.uptime} uptime · {sla.reporting.toLowerCase()} reporting</div>
        </div>
        <div style={{ textAlign: 'right', flex: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(26px,3.2vw,34px)', lineHeight: 1, color: 'var(--helm-deep-teal)' }}>{helmGBP(r.total)}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)' }}> /mo</span>
        </div>
        <span style={{ flex: 'none', color: 'var(--helm-deep-teal)', display: 'flex', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-base) var(--ease-standard)' }}><Icon name="chevronDown" size={22} /></span>
      </button>

      {/* body */}
      {isOpen && (
        <div className="helm-plan-body helm-plan-open" style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 'clamp(24px,3.5vw,44px)', padding: '4px clamp(20px,3vw,32px) clamp(26px,3vw,34px)', borderTop: '1px solid var(--color-border)' }}>

            {/* included */}
            <div style={{ paddingTop: 22 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>What's included</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {r.lines.map((ln) => {
                  const id = r.tier + '-' + ln.key;
                  const open = lineOpen.has(id);
                  return (
                    <li key={id} style={{ padding: '11px 0', borderBottom: '1px solid rgba(26,43,46,0.08)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <Icon name="check" size={16} color="var(--helm-deep-teal)" style={{ flex: 'none', marginTop: 2 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, lineHeight: 1.4, color: 'var(--helm-night-teal)' }}>{ln.label}</span>
                          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{ln.sub}</span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5, whiteSpace: 'nowrap', color: 'var(--helm-night-teal)' }}>{helmGBP2(ln.val)}</span>
                        <button onClick={() => toggleLine(id)} aria-label="Details" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: 'none', display: 'flex', color: 'var(--helm-mid-teal)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-base) var(--ease-standard)' }}>
                          <Icon name="chevronDown" size={16} />
                        </button>
                      </div>
                      {open && (
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.65, color: 'var(--text-secondary)', marginTop: 9, marginLeft: 26, padding: '11px 14px', background: 'rgba(26,143,160,0.05)', borderLeft: '2px solid var(--helm-deep-teal)' }}>{ln.desc}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* summary */}
            <div style={{ background: isRec ? 'var(--helm-deep-teal)' : 'var(--helm-night-teal)', padding: 'clamp(22px,2.6vw,28px)', alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 18, marginTop: 22 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, lineHeight: 1.5, color: 'var(--helm-pale-sky)' }}>{meta}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(168,216,224,0.85)' }}>Monthly total</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(38px,5vw,50px)', lineHeight: 0.9, color: 'var(--helm-mural-yellow)' }}>{helmGBP(r.total)}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--helm-facade-white)' }}>/mo</span>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--helm-pale-sky)', marginTop: 6 }}>ex-VAT · rolling monthly, no lock-in</div>
              </div>
              <div style={{ borderTop: '1px solid rgba(168,216,224,0.22)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <HelmSlaRow label="Support hours" value={sla.hours} />
                <HelmSlaRow label="Uptime commitment" value={sla.uptime} />
                <HelmSlaRow label="Out-of-hours cover" value={sla.ooh ? 'Included' : 'Business hours'} />
                <HelmSlaRow label="Service reporting" value={sla.reporting} />
              </div>
              <Button variant="accent" size="md" fullWidth iconRight={<Icon name="arrowRight" size={16} />} onClick={onContact}>Choose {r.tier}</Button>
            </div>
        </div>
      )}
    </div>
  );
}

function HelmSlaRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--helm-pale-sky)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5, letterSpacing: '0.01em', color: 'var(--helm-facade-white)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Shared inputs                                                      *
 * ------------------------------------------------------------------ */
function HelmSeg({ label, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--helm-facade-white)' }}>{label}</span>
      <div style={{ display: 'flex', border: '1px solid rgba(168,216,224,0.3)' }}>
        {options.map((o, i) => {
          const active = o.v === value;
          return (
            <button key={o.v} onClick={() => onChange(o.v)} style={{
              flex: 1, padding: '10px 6px', cursor: 'pointer', border: 'none',
              borderLeft: i === 0 ? 'none' : '1px solid rgba(168,216,224,0.18)',
              background: active ? 'var(--helm-deep-teal)' : 'rgba(13,22,24,0.5)',
              color: active ? 'var(--helm-facade-white)' : 'var(--helm-pale-sky)',
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11.5, letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'background var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard)',
            }}>{o.l}</button>
          );
        })}
      </div>
    </div>
  );
}

function HelmQuoteField({ label, value, onChange, prefix, step = 1 }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--helm-facade-white)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(13,22,24,0.5)', border: '1px solid rgba(168,216,224,0.3)', padding: '0 14px' }}>
        {prefix && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--helm-pale-sky)' }}>{prefix}</span>}
        <input type="number" min="1" step={step} value={value}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value || '0', 10)))}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--helm-facade-white)', padding: '11px 0', width: '100%' }} />
      </div>
    </label>
  );
}

/* ------------------------------------------------------------------ *
 *  Section shell + tab switch                                         *
 * ------------------------------------------------------------------ */
function HelmQuote({ onContact }) {
  const [mode, setMode] = React.useState('budget'); // 'budget' | 'invoice'
  const InvoiceTool = window.HelmInvoiceTool;

  // Single lead-capture wall in front of BOTH tools. Until the visitor gives
  // name + company + work email, neither the Budget Explorer nor the invoice
  // tool is shown. Once unlocked, the lead is passed to the invoice tool so it
  // doesn't ask again.
  const [lead, setLead] = React.useState({ name: '', company: '', email: '' });
  const [access, setAccess] = React.useState(false);
  const [leadErr, setLeadErr] = React.useState('');
  const [checking, setChecking] = React.useState(false);
  const wallFieldStyle = { width: '100%', padding: '12px 14px', background: 'rgba(13,22,24,0.5)', border: '1px solid rgba(168,216,224,0.3)', color: 'var(--helm-facade-white)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' };
  const unlock = async () => {
    const { name, company, email } = lead;
    if (!name.trim() || !company.trim() || !email.trim()) { setLeadErr('Please fill in all three fields to continue.'); return; }
    const em = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { setLeadErr('Please enter a valid email address.'); return; }
    const domain = em.split('@')[1];
    if (HELM_FREE_EMAIL_DOMAINS.has(domain)) { setLeadErr('Please use your work email address, not a personal one.'); return; }
    setLeadErr('');
    setChecking(true);
    const deliverable = await helmDomainHasMail(domain);
    setChecking(false);
    if (deliverable === false) { setLeadErr("We couldn't verify that email domain. Please check it and try again."); return; }
    // true (valid) or null (DNS unreachable → fail open) both proceed.
    setAccess(true);
    // Record the contact in HubSpot (see site/hubspot.js for configuration).
    if (window.HelmHubSpot) window.HelmHubSpot.submitContact({ ...lead, email: em });
  };

  const tab = (id, label) => {
    const active = mode === id;
    return (
      <button onClick={() => setMode(id)} style={{
        padding: '13px 22px', cursor: 'pointer', border: 'none', background: active ? 'var(--helm-mural-yellow)' : 'transparent',
        color: active ? 'var(--helm-night-teal)' : 'var(--helm-pale-sky)',
        fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5, letterSpacing: '0.1em', textTransform: 'uppercase',
        transition: 'background var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard)',
      }}>{label}</button>
    );
  };

  return (
    <section id="quote" style={{ position: 'relative', overflow: 'hidden', background: 'var(--helm-night-teal)', color: 'var(--text-on-dark)', borderTop: '1px solid rgba(168,216,224,0.18)', padding: 'clamp(72px,10vw,112px) var(--gutter)' }}>
      <img src={(window.__resources && window.__resources.ropeTeal) || "assets/motifs/rope-teal.svg"} alt="" aria-hidden="true" style={{ position: 'absolute', right: -120, top: -80, width: 420, height: 420, opacity: 0.06, pointerEvents: 'none' }} />
      <div style={{ maxWidth: HELM_MAX_C, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div data-reveal><Eyebrow index="04" tone="accent">Instant quote</Eyebrow></div>
        <h2 data-reveal style={{ '--rd': '70ms', fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(32px,5vw,54px)', lineHeight: 1.02, margin: '14px 0 12px', maxWidth: 760, color: 'var(--helm-facade-white)' }}>Price it up in a couple of minutes.</h2>
        <p data-reveal style={{ '--rd': '140ms', fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.6, color: 'var(--helm-pale-sky)', maxWidth: 640, margin: '0 0 32px' }}>{!access
          ? 'Two ways to price up Helm: explore our packages against your team size, or upload your current invoice for a like-for-like comparison. Tell us who you are to unlock both.'
          : (mode === 'budget'
            ? 'Enter your headcount and devices to see all four Helm packages side by side, with a full cost breakdown, no sales call required.'
            : 'Upload your current supplier invoice. We read it line by line and map it to an equivalent Helm quote at our prices.')}</p>

        {!access ? (
          <div data-reveal style={{ '--rd': '210ms', background: 'rgba(13,22,24,0.5)', border: '1px solid rgba(168,216,224,0.18)', padding: 'clamp(28px,4vw,40px)', maxWidth: 760 }}>
            <div className="helm-lead-fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <input style={wallFieldStyle} placeholder="Your name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
              <input style={wallFieldStyle} placeholder="Company name" value={lead.company} onChange={(e) => setLead({ ...lead, company: e.target.value })} />
              <input style={wallFieldStyle} type="email" placeholder="Work email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
            </div>
            {leadErr && <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--helm-mural-yellow)', margin: '0 0 14px' }}>{leadErr}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="accent" size="lg" iconRight={checking ? null : <Icon name="arrowRight" size={18} />} onClick={unlock} disabled={checking}>{checking ? 'Checking…' : 'Quoting tool'}</Button>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.55, color: 'var(--helm-warm-grey)', margin: '18px 0 0', maxWidth: 560 }}>We'll store your details in our CRM to prepare your quote, and may email you once if we don't hear back. You can opt out any time. See our <a href="Privacy%20Policy.html" style={{ color: 'var(--helm-pale-sky)', textDecoration: 'underline' }}>Privacy Policy</a>.</p>
          </div>
        ) : (
          <React.Fragment>
            <div data-reveal style={{ '--rd': '210ms', display: 'inline-flex', border: '1px solid rgba(168,216,224,0.28)', marginBottom: 36 }}>
              {tab('budget', 'Budget Explorer')}
              {tab('invoice', 'Beat my invoice')}
            </div>

            {mode === 'budget'
              ? <HelmBudgetExplorer onContact={onContact} lead={lead} />
              : (InvoiceTool ? <InvoiceTool onContact={onContact} lead={lead} /> : null)}
          </React.Fragment>
        )}
      </div>
    </section>
  );
}

Object.assign(window, { HelmQuote });
