/* HELM MSP website — lower sections.
   Results · Pricing · FAQ · CTA + Footer · Contact modal */
const { Logo, Button, Icon, Eyebrow, Stat, Badge, Input, Select, Checkbox } = window.HELMDesignSystem_93c981;
const HELM_MAX_B = 'var(--content-max)';

const TOBY_BOOKING_URL = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1r2kQrqzr8NjzcE2UfDs2VdJIfvBWYKzS1qVhN_PEoNjXkB-Xori19uGUn18XSF8aGMnJh8Syr?gv=true';

function HelmCountStat({ value, delay = '0ms', ...rest }) {
  const ref = React.useRef(null);
  const [disp, setDisp] = React.useState(value);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = parseFloat(value);
    const decimals = (String(value).split('.')[1] || '').length;
    if (reduce || isNaN(target)) { setDisp(value); return; }
    setDisp(decimals ? (0).toFixed(decimals) : '0');
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const dur = 1200; let t0 = null;
      const step = (ts) => {
        if (!t0) t0 = ts;
        const p = Math.min(1, (ts - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const cur = target * eased;
        setDisp(decimals ? cur.toFixed(decimals) : Math.round(cur).toString());
        if (p < 1) requestAnimationFrame(step); else setDisp(value);
      };
      requestAnimationFrame(step);
    };
    const check = () => {
      if (started) return;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const top = el.getBoundingClientRect().top;
      if (top < vh * 0.85) run();
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    const failsafe = setTimeout(() => { started = true; setDisp(value); }, 2600);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      clearTimeout(failsafe);
    };
  }, [value]);
  return <div ref={ref} data-reveal style={{ '--rd': delay }}><Stat value={disp} {...rest} /></div>;
}

/* ---------------- Results ---------------- */
function HelmResults() {
  const points = [
    { icon: 'automation', title: 'Instant AI first response', body: 'Every message is answered the second it lands, handled by our AI assistant. No queue, no hold music, no ticket-number limbo.' },
    { icon: 'clock', title: 'Around the clock', body: 'Day, night or weekend, help is there the moment you need it, not only during office hours.' },
    { icon: 'support', title: 'Senior engineers on hand', body: 'When something needs a person, a senior engineer picks it up straight away. Never a junior, never a script.' },
  ];
  return (
    <section id="results" style={{ background: 'var(--helm-deep-teal)', color: 'var(--text-on-dark)', padding: 'clamp(72px,9vw,100px) var(--gutter)' }}>
      <div style={{ maxWidth: HELM_MAX_B, margin: '0 auto' }}>
        <div data-reveal><Eyebrow tone="accent">The difference</Eyebrow></div>
        <h2 data-reveal style={{ '--rd': '70ms', fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(32px,5vw,54px)', lineHeight: 1.02, margin: '14px 0 14px', maxWidth: 760, color: 'var(--helm-facade-white)' }}>Ask a question, get an answer, instantly.</h2>
        <p data-reveal style={{ '--rd': '140ms', fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.6, color: 'var(--helm-pale-sky)', maxWidth: 660, margin: '0 0 56px' }}>Our AI support assistant replies the moment you reach out, any time of day or night. It resolves first-line questions on the spot, and when something needs a person, a senior engineer takes over straight away.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 40, borderTop: '1px solid rgba(245,245,240,0.22)', paddingTop: 44 }}>
          {points.map((p, i) => (
            <div key={p.title} data-reveal style={{ '--rd': (i * 90) + 'ms', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Icon name={p.icon} size={30} color="var(--helm-mural-yellow)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, textTransform: 'uppercase', letterSpacing: '0.01em', margin: 0, color: 'var(--helm-facade-white)' }}>{p.title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, lineHeight: 1.55, color: 'var(--helm-pale-sky)', margin: 0 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */
const HELM_PLANS = [
  { name: 'Essential', tag: 'For small teams', price: '£39', unit: '/ user / month', featured: false,
    features: ['Senior helpdesk, 8am–6pm', 'Patch & update management', 'Endpoint protection', 'Microsoft 365 management', 'Monthly health report'] },
  { name: 'Managed', tag: 'For growing businesses', price: '£59', unit: '/ user / month', featured: true,
    features: ['Everything in Essential', '24/7 monitoring & response', 'Security hardening & MFA', 'Tested backup & recovery', 'AI-native ticket automation', 'Quarterly strategy review'] },
  { name: 'Partner', tag: 'For complex estates', price: 'Custom', unit: 'tailored to you', featured: false,
    features: ['Everything in Managed', 'Dedicated lead engineer', 'vCIO & roadmap planning', 'Cloud & Azure architecture', 'Compliance & audit support', 'Priority incident response'] },
];
function HelmPricing({ onContact }) {
  return (
    <section id="pricing" style={{ background: 'var(--color-bg)', padding: 'clamp(72px,10vw,112px) var(--gutter)' }}>
      <div style={{ maxWidth: HELM_MAX_B, margin: '0 auto' }}>
        <div data-reveal><Eyebrow index="03">Plans</Eyebrow></div>
        <h2 data-reveal style={{ '--rd': '70ms', fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(32px,5vw,54px)', lineHeight: 1.02, margin: '14px 0 12px', maxWidth: 720, color: 'var(--text-primary)' }}>Clear, fixed pricing. No surprise invoices.</h2>
        <p data-reveal style={{ '--rd': '140ms', fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: 640, margin: '0 0 52px' }}>One per-user price covers the lot: support, security and the tooling behind it. Protection is the default, never the upsell.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'var(--grid-gap-hair)', background: 'var(--color-border)', border: '1px solid var(--color-border)' }}>
          {HELM_PLANS.map((p, i) => (
            <div key={p.name} data-reveal={p.featured ? 'scale' : true} style={{ '--rd': (i * 110) + 'ms', background: p.featured ? 'var(--helm-night-teal)' : 'var(--color-surface)', color: p.featured ? 'var(--text-on-dark)' : 'var(--text-primary)', padding: '40px 34px', display: 'flex', flexDirection: 'column', gap: 22, borderTop: p.featured ? '3px solid var(--brand-accent)' : '3px solid transparent' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, textTransform: 'uppercase', letterSpacing: '0.02em', color: p.featured ? 'var(--helm-facade-white)' : 'var(--text-primary)' }}>{p.name}</span>
                  {p.featured && <Badge tone="accent">Most popular</Badge>}
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: p.featured ? 'var(--helm-pale-sky)' : 'var(--text-muted)' }}>{p.tag}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingBottom: 22, borderBottom: p.featured ? '1px solid rgba(168,216,224,0.22)' : '1px solid var(--color-border)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 46, lineHeight: 0.9, color: p.featured ? 'var(--helm-mural-yellow)' : 'var(--brand-primary)' }}>{p.price}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: p.featured ? 'var(--helm-pale-sky)' : 'var(--text-secondary)' }}>{p.unit}</span>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.45, color: p.featured ? 'var(--helm-facade-white)' : 'var(--text-secondary)' }}>
                    <Icon name="check" size={17} color={p.featured ? 'var(--helm-mural-yellow)' : 'var(--brand-primary)'} style={{ marginTop: 1, flex: 'none' }} /> {f}
                  </li>
                ))}
              </ul>
              <Button variant={p.featured ? 'accent' : 'secondary'} fullWidth onClick={onContact}>{p.price === 'Custom' ? 'Talk to us' : 'Get started'}</Button>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--text-muted)', margin: '20px 0 0', textAlign: 'center' }}>All plans are rolling monthly with no lock-in. Onboarding and estate audit included.</p>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
const HELM_FAQ = [
  { q: 'How quickly can you take over our IT?', a: 'Most onboardings complete inside two to three weeks. We start with a full estate audit, run in parallel with your current arrangement, then take over once monitoring and security are in place.' },
  { q: 'Do we have to sign a long contract?', a: 'No. Every plan is rolling monthly with no lock-in. We would rather keep you because the service is good than because the paperwork is binding.' },
  { q: 'What does "security-first by default" actually mean?', a: 'Hardening, MFA, monitoring and tested backups are built into every plan, not sold as extras. We assume protection is the baseline, because for your business it is.' },
  { q: 'Will we speak to the same engineers each time?', a: 'Yes. You get a small, senior team who learn your estate: no call centres, no scripts, no being passed around. On the Partner plan you also get a dedicated lead engineer.' },
  { q: 'How does the AI-native tooling help us?', a: 'It handles the routine quietly in the background: triaging tickets, spotting anomalies and automating patches, so our senior people spend their time on the work that genuinely needs a human.' },
];
function HelmFAQ() {
  const [open, setOpen] = React.useState(0);
  return (
    <section id="faq" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: 'clamp(72px,10vw,112px) var(--gutter)' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div data-reveal><Eyebrow index="05">Questions</Eyebrow></div>
        <h2 data-reveal style={{ '--rd': '70ms', fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(32px,5vw,54px)', lineHeight: 1.02, margin: '14px 0 48px', maxWidth: 640, color: 'var(--text-primary)' }}>The things teams ask us first.</h2>
        <div style={{ borderTop: '1px solid var(--color-border)' }}>
          {HELM_FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} data-reveal style={{ '--rd': (i * 70) + 'ms', borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '24px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(18px,2.4vw,22px)', letterSpacing: '0.01em', color: 'var(--text-primary)' }}>{f.q}</span>
                  <span style={{ flex: 'none', color: 'var(--brand-primary)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-base) var(--ease-standard)' }}><Icon name="chevronDown" size={22} /></span>
                </button>
                <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows var(--dur-base) var(--ease-standard)' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0, paddingBottom: 26, maxWidth: 660 }}>{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA + Footer ---------------- */
function HelmCtaFooter({ onContact, base = '' }) {
  const cols = [
    { h: 'Services', items: [
      { l: 'Managed IT', href: base + '#services' },
      { l: 'Cyber Security', href: base + '#services' },
      { l: 'Cloud & Infrastructure', href: base + '#services' },
      { l: 'Consultancy', href: base + '#services' },
    ] },
    { h: 'Company', items: [
      { l: 'About', href: 'About.html' },
      { l: 'Approach', href: base + '#approach' },
      { l: 'The difference', href: base + '#results' },
      { l: 'Careers', href: 'mailto:hello@helmm.io?subject=Careers' },
    ] },
    { h: 'Contact', items: [
      { l: 'hello@helmm.io', href: 'mailto:hello@helmm.io' },
      { l: 'London, UK', href: null },
    ] },
  ];
  return (
    <>
      <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--helm-night-teal)', color: 'var(--text-on-dark)', padding: 'clamp(72px,10vw,104px) var(--gutter)' }}>
        <img data-helm-wheel data-wheel-base="translateY(-50%)" data-wheel-speed="0.05" src={(window.__resources && window.__resources.wheelSky) || "assets/motifs/wheel-sky.svg"} alt="" aria-hidden="true" style={{ position: 'absolute', right: -130, top: '50%', transform: 'translateY(-50%)', width: 460, height: 460, opacity: 0.06, pointerEvents: 'none' }} />
        <div style={{ maxWidth: HELM_MAX_B, margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
          <div data-reveal style={{ maxWidth: 640 }}>
            <Eyebrow tone="accent">Get started</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(32px,5vw,58px)', lineHeight: 0.98, textTransform: 'uppercase', margin: '18px 0 0', color: 'var(--helm-facade-white)' }}>Let's get your IT running right.</h2>
            <p style={{ fontFamily: 'var(--font-quote)', fontStyle: 'italic', fontSize: 'clamp(18px,2.2vw,23px)', lineHeight: 1.45, color: 'var(--helm-pale-sky)', margin: '20px 0 0' }}>A 30-minute discovery call, no obligation. We'll map where you are and where you're headed.</p>
          </div>
          <div data-reveal style={{ '--rd': '160ms' }}>
            <Button variant="accent" size="lg" iconRight={<Icon name="arrowRight" size={18} />} onClick={onContact}>Book a discovery call</Button>
          </div>
        </div>
      </section>

      <footer style={{ background: 'var(--helm-night-teal)', borderTop: '1px solid rgba(168,216,224,0.18)', color: 'var(--helm-pale-sky)', padding: '64px var(--gutter) 40px' }}>
        <div style={{ maxWidth: HELM_MAX_B, margin: '0 auto' }}>
          <div className="helm-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(3, 1fr)', gap: 40, paddingBottom: 40, borderBottom: '1px solid rgba(168,216,224,0.18)' }}>
            <div>
              <Logo size={28} tone="white" />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.6, marginTop: 18, maxWidth: 260, color: 'var(--helm-pale-sky)' }}>Boutique, AI-native IT consultancy for businesses worldwide. Senior people, security-first.</p>
            </div>
            {cols.map(c => (
              <div key={c.h}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--helm-facade-white)', marginBottom: 14 }}>{c.h}</div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {c.items.map(it => (
                    <li key={it.l} style={{ fontFamily: 'var(--font-body)', fontSize: 13.5 }}>
                      {it.href
                        ? <a href={it.href} style={{ color: 'var(--helm-pale-sky)', textDecoration: 'none', transition: 'color var(--dur-base) var(--ease-standard)' }}
                             onMouseEnter={e => e.currentTarget.style.color = 'var(--helm-mural-yellow)'}
                             onMouseLeave={e => e.currentTarget.style.color = 'var(--helm-pale-sky)'}>{it.l}</a>
                        : <span>{it.l}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 24, fontSize: 12, letterSpacing: '0.04em', flexWrap: 'wrap', gap: 12 }}>
            <span>© 2026 Helm Managed Services Ltd · Est. 2026</span>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--helm-warm-grey)' }}>A steady hand on your technology</span>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ---------------- Contact modal ---------------- */
function HelmContact({ open, onClose }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const configured = /^https?:\/\//.test(TOBY_BOOKING_URL);
  return (
    <div onClick={onClose} className="helm-book-overlay" style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(26,43,46,0.55)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} className="helm-book-modal" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', width: configured ? 'min(860px, 100%)' : 'min(520px, 100%)', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid var(--color-border)' }}>
          <Logo size={25} tone="night" />
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}><Icon name="close" size={20} /></button>
        </div>
        {configured ? (
          <div className="helm-book-body" style={{ padding: '22px 28px 28px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, textTransform: 'uppercase', color: 'var(--text-primary)' }}>Book a call with Toby</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Pick a slot that suits you and you'll get a calendar invite straight away. Today is often full, so use the arrows to move to the next available day.</div>
            <div style={{ marginTop: 18, border: '1px solid var(--color-border)' }}>
              <iframe src={TOBY_BOOKING_URL} title="Book a call with Toby" className="helm-book-frame" style={{ width: '100%', height: 'min(68vh, 640px)', border: 0, display: 'block' }}></iframe>
            </div>
          </div>
        ) : (
          <div style={{ padding: '44px 28px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(26,143,160,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><Icon name="clock" size={28} color="var(--brand-primary)" /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, textTransform: 'uppercase', margin: '0 0 10px', color: 'var(--text-primary)' }}>Nearly there</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.6, color: 'var(--text-secondary)', margin: '0 0 24px' }}>Toby's live booking calendar is being connected. In the meantime, email us and we'll confirm your call within one working day.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:hello@helmm.io?subject=Discovery call" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--brand-primary)', color: 'var(--helm-facade-white)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14.5, padding: '12px 20px', textDecoration: 'none' }}>Email hello@helmm.io</a>
              <Button variant="secondary" onClick={onClose}>Done</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { HelmResults, HelmPricing, HelmFAQ, HelmCtaFooter, HelmContact });
