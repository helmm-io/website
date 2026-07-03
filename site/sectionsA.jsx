/* HELM MSP website — top + middle sections.
   Header · Hero · Trust strip · Services · Approach */
const { Logo, Button, Icon, Eyebrow, Badge, Card } = window.HELMDesignSystem_93c981;
const HELM_MAX = 'var(--content-max)';

/* ---------------- Header ---------------- */
function HelmHeader({ onContact, base = '' }) {
  const links = [
    { label: 'Services', href: base + '#services' },
    { label: 'Approach', href: base + '#approach' },
    { label: 'Quote', href: base + '#quote' },
    { label: 'FAQ', href: base + '#faq' },
    { label: 'About', href: 'About.html' },
  ];
  const [scrolled, setScrolled] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <header data-helm-header style={{
      position: 'sticky', top: 0, zIndex: 30, background: 'rgba(245,245,240,0.92)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
      transition: 'border-color var(--dur-base) var(--ease-standard)',
    }}>
      <div style={{ maxWidth: HELM_MAX, margin: '0 auto', padding: '0 var(--gutter)', height: 74, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href={base || '#top'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}><Logo size={30} tone="night" /></a>
        <nav className="helm-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 500,
              color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '0.01em',
            }} onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-primary)'}
               onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}>{l.label}</a>
          ))}
          <Button variant="primary" size="sm" onClick={onContact}>Get in touch</Button>
        </nav>
        <button className="helm-mobile-toggle" onClick={() => setMenu(m => !m)} aria-label="Menu" style={{ display: 'none', background: 'none', border: '1px solid var(--color-border)', padding: 9, cursor: 'pointer', color: 'var(--text-primary)' }}>
          <Icon name={menu ? 'close' : 'menu'} size={22} />
        </button>
      </div>
      {menu && (
        <div className="helm-mobile-menu" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg)', padding: '12px var(--gutter) 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenu(false)} style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>{l.label}</a>
          ))}
          <div style={{ marginTop: 12 }}><Button variant="primary" fullWidth onClick={() => { setMenu(false); onContact(); }}>Get in touch</Button></div>
        </div>
      )}
    </header>
  );
}

/* ---------------- Hero ---------------- */
function HelmHero({ onContact, eyebrow = 'IT Consultancy · Global', securityChip = 'Security first' }) {
  return (
    <section id="top" style={{ position: 'relative', background: 'var(--helm-night-teal)', color: 'var(--text-on-dark)', overflow: 'hidden', padding: 'clamp(72px,11vw,116px) var(--gutter) clamp(80px,12vw,120px)' }}>
      <img data-helm-wheel data-wheel-base="translateY(-50%)" data-wheel-speed="0.045" src={(window.__resources && window.__resources.wheelSky) || "assets/motifs/wheel-sky.svg"} alt="" aria-hidden="true" style={{ position: 'absolute', right: -150, top: '50%', transform: 'translateY(-50%)', width: 580, height: 580, opacity: 0.07, pointerEvents: 'none' }} />
      <div style={{ maxWidth: HELM_MAX, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div data-reveal style={{ '--rd': '40ms' }}><Eyebrow tone="accent">{eyebrow}</Eyebrow></div>
        <h1 data-reveal style={{ '--rd': '120ms', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(46px,7vw,88px)', lineHeight: 0.96, letterSpacing: '0.01em', margin: '24px 0 0', maxWidth: 900, textTransform: 'uppercase', color: 'var(--helm-facade-white)' }}>A steady hand<br />on your technology</h1>
        <p data-reveal style={{ '--rd': '220ms', fontFamily: 'var(--font-quote)', fontStyle: 'italic', fontSize: 'clamp(19px,2.3vw,26px)', color: 'var(--helm-pale-sky)', margin: '30px 0 0', maxWidth: 620, lineHeight: 1.45 }}>Boutique, AI-native IT consultancy for businesses worldwide. Senior people, security-first, quietly keeping everything running.</p>
        <div data-reveal style={{ '--rd': '320ms', display: 'flex', gap: 14, marginTop: 40, flexWrap: 'wrap' }}>
          <Button variant="accent" size="lg" iconRight={<Icon name="arrowRight" size={18} />} onClick={onContact}>Book a discovery call</Button>
        </div>
        <div data-reveal style={{ '--rd': '420ms', display: 'flex', gap: 28, marginTop: 56, flexWrap: 'wrap' }}>
          {[['shield', securityChip], ['clock', '24/7 monitoring & response'], ['automation', 'AI-powered first-line support']].map(([ic, txt]) => (
            <span key={txt} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--helm-pale-sky)' }}><Icon name={ic} size={17} color="var(--helm-mural-yellow)" /> {txt}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Trust strip ---------------- */
function HelmTrust() {
  const clients = ['Northwind Logistics', 'Pennine Health', 'Calder & Co', 'Vantage Studios', 'Meridian Care', 'Brightwater'];
  return (
    <section style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '30px var(--gutter)' }}>
      <div style={{ maxWidth: HELM_MAX, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 'clamp(20px,5vw,56px)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span data-reveal style={{ '--rd': '0ms', fontFamily: 'var(--font-body)', fontSize: 11.5, fontWeight: 600, letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Trusted by UK teams</span>
        {clients.map((c, i) => (
          <span key={c} data-reveal style={{ '--rd': (80 + i * 70) + 'ms', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)', opacity: 0.75, whiteSpace: 'nowrap' }}>{c}</span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Services ---------------- */
const HELM_SERVICES = [
  { icon: 'support', title: 'Managed IT & Helpdesk', body: 'AI handles first-line instantly, around the clock, with senior engineers on hand the moment anything needs a human.' },
  { icon: 'lock', title: 'Cyber Security', body: 'Security-first by default: monitoring, hardening and incident response built into everything we run.' },
  { icon: 'cloud', title: 'Cloud & Infrastructure', body: 'Microsoft 365, Azure and hybrid estates designed, migrated and managed for resilience and scale.' },
  { icon: 'automation', title: 'AI-Native Automation', body: 'Intelligence wired into your workflows: faster tickets, fewer surprises, more time for the work that matters.' },
  { icon: 'server', title: 'Backup & Continuity', body: 'Regularly tested backups and a clear recovery plan, so if something fails you are back up and running in hours, not days.' },
  { icon: 'check', title: 'Compliance & Governance', body: 'Cyber Essentials, ISO 27001 and GDPR. We get you audit-ready and keep you there, with plain-spoken advice on the strategy behind it.' },
];
function HelmServices() {
  const [hover, setHover] = React.useState(-1);
  return (
    <section id="services" style={{ background: 'var(--color-bg)', padding: 'clamp(72px,10vw,112px) var(--gutter)' }}>
      <div style={{ maxWidth: HELM_MAX, margin: '0 auto' }}>
        <div data-reveal><Eyebrow index="01">What we do</Eyebrow></div>
        <h2 data-reveal style={{ '--rd': '70ms', fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(32px,5vw,54px)', lineHeight: 1.02, margin: '14px 0 12px', maxWidth: 780, color: 'var(--text-primary)' }}>Everything that keeps your business running, in one steady team.</h2>
        <p data-reveal style={{ '--rd': '140ms', fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: 660, margin: '0 0 48px' }}>We pair hands-on consultancy with AI-native tooling: the calm, capable partner behind your technology.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'var(--grid-gap-hair)', background: 'var(--color-border)', border: '1px solid var(--color-border)' }}>
          {HELM_SERVICES.map((s, i) => (
            <div key={s.title} className="helm-service-card" data-reveal="rise" data-reveal-group="services" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)}
              style={{ '--rd': (i * 170) + 'ms', background: 'var(--color-surface)', padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 220, borderTop: hover === i ? '3px solid var(--brand-accent)' : '3px solid transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Icon name={s.icon} size={30} color="var(--brand-primary)" />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, letterSpacing: '0.16em', color: 'var(--color-border-strong)' }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 21, textTransform: 'uppercase', letterSpacing: '0.01em', margin: 0, color: 'var(--text-primary)' }}>{s.title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, lineHeight: 1.55, color: 'var(--text-secondary)', margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Approach ---------------- */
const HELM_STEPS = [
  { n: '01', icon: 'search', title: 'Audit & assess', body: 'A senior engineer audits your estate end-to-end: systems, security, risk and the goals behind them.' },
  { n: '02', icon: 'settings', title: 'Secure & stabilise', body: 'We harden security, fix what is fragile and put 24/7 monitoring in place before anything breaks.' },
  { n: '03', icon: 'automation', title: 'Automate', body: 'AI-native tooling automates the routine: patching, alerts and tickets handled before you notice.' },
  { n: '04', icon: 'growth', title: 'Plan ahead', body: 'Quarterly reviews and a plain-spoken roadmap keep your technology one step ahead of the business.' },
];
function HelmApproach() {
  return (
    <section id="approach" style={{ position: 'relative', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', overflow: 'hidden', padding: 'clamp(72px,10vw,112px) var(--gutter)' }}>
      <img data-helm-wheel data-wheel-speed="0.06" src={(window.__resources && window.__resources.wheelTeal) || "assets/motifs/wheel-teal.svg"} alt="" aria-hidden="true" style={{ position: 'absolute', left: -180, bottom: -180, width: 500, height: 500, opacity: 0.05, pointerEvents: 'none' }} />
      <div style={{ maxWidth: HELM_MAX, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div data-reveal><Eyebrow index="02">How we work</Eyebrow></div>
        <h2 data-reveal style={{ '--rd': '70ms', fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(32px,5vw,54px)', lineHeight: 1.02, margin: '14px 0 12px', maxWidth: 740, color: 'var(--text-primary)' }}>A calm, deliberate way of running your IT.</h2>
        <p data-reveal style={{ '--rd': '140ms', fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: 640, margin: '0 0 52px' }}>No surprise invoices. Just genuine, knowledgeable people taking a thoughtful, considered approach. We move methodically, explain every decision, and leave your systems stronger than we found them.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 'var(--grid-gap-hair)', background: 'var(--color-border)', border: '1px solid var(--color-border)' }}>
          {HELM_STEPS.map((s, i) => (
            <div key={s.n} data-reveal="rise" style={{ '--rd': (i * 170) + 'ms', background: 'var(--color-bg)', padding: '34px 30px', display: 'flex', flexDirection: 'column', gap: 18, minHeight: 240 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 42, lineHeight: 0.9, color: 'var(--helm-pale-sky)' }}>{s.n}</span>
              <Icon name={s.icon} size={26} color="var(--brand-primary)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, textTransform: 'uppercase', letterSpacing: '0.01em', margin: 0, color: 'var(--text-primary)' }}>{s.title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55, color: 'var(--text-secondary)', margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HelmHeader, HelmHero, HelmTrust, HelmServices, HelmApproach });
