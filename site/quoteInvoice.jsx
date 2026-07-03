/* HELM MSP — "Beat my invoice" AI comparison tool.
   Lead gate → upload invoice (PDF/text) → Claude maps it to Helm pricing → quote.
   Uses window.claude.complete (built-in) and pdf.js (loaded in the page head). */
const { Button, Icon, Badge } = window.HELMDesignSystem_93c981;

const helmInvGBP = (n) => '£' + Math.round(n).toLocaleString('en-GB');
const helmInvGBP2 = (n) => '£' + Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function HelmInvoiceTool({ onContact, lead: leadProp }) {
  const [lead, setLead] = React.useState(leadProp || { name: '', company: '', email: '' });
  const [unlocked, setUnlocked] = React.useState(!!(leadProp && leadProp.name));
  const [leadErr, setLeadErr] = React.useState('');
  const [drag, setDrag] = React.useState(false);
  const [status, setStatus] = React.useState('');   // '' | 'reading' | 'analysing'
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [fileName, setFileName] = React.useState('');
  const inputRef = React.useRef(null);

  const unlock = () => {
    const { name, company, email } = lead;
    if (!name.trim() || !company.trim() || !email.trim()) { setLeadErr('Please fill in all three fields to continue.'); return; }
    if (!email.includes('@')) { setLeadErr('Please enter a valid email address.'); return; }
    setLeadErr('');
    setUnlocked(true);
    console.log('Lead captured:', { ...lead, source: 'Invoice Comparison', timestamp: new Date().toISOString() });
  };

  const readPdf = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        if (!window.pdfjsLib) return reject(new Error('pdf'));
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(e.target.result) }).promise;
        let text = '';
        for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((x) => x.str).join(' ') + '\n';
        }
        resolve(text);
      } catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

  const readText = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });

  const analyse = async (text) => {
    if (!window.claude || !window.claude.complete) {
      setStatus(''); setError('The live quoting engine is unavailable in this preview. Please try again on the published site.'); return;
    }
    setStatus('analysing');
    try {
      const raw = await window.claude.complete({
        max_tokens: 2000,
        messages: [{ role: 'user', content: window.HELM_QUOTE_CONTEXT + '\n\nInvoice:\n' + text.substring(0, 3000) }],
      });
      const stripped = String(raw).replace(/```json|```/g, '');
      let start = -1, depth = 0, end = -1;
      for (let i = 0; i < stripped.length; i++) {
        if (stripped[i] === '{') { if (start === -1) start = i; depth++; }
        else if (stripped[i] === '}') { depth--; if (depth === 0 && start > -1) { end = i; break; } }
      }
      if (start === -1 || end === -1) { setStatus(''); setError("We couldn't extract a quote from that document. Please try a clearer invoice."); return; }
      let parsed;
      try { parsed = JSON.parse(stripped.slice(start, end + 1)); }
      catch (e) { setStatus(''); setError("We couldn't process that file. Please try a different format."); return; }
      setStatus(''); setResult(parsed);
    } catch (err) { console.error(err); setStatus(''); setError('Something went wrong reading your invoice. Please try again.'); }
  };

  const processFile = async (file) => {
    if (!file) return;
    setError(''); setResult(''); setFileName(file.name);
    try {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        setStatus('reading');
        const text = await readPdf(file);
        if (!text || text.trim().length < 50) { setStatus(''); setError("This PDF looks scanned and can't be read automatically. Please try a text-based PDF or a CSV."); return; }
        await analyse(text);
      } else {
        const text = await readText(file);
        await analyse(text);
      }
    } catch (err) { setStatus(''); setError('Could not read that file. Please try a different one.'); }
  };

  const total = result && result.helm_mapping
    ? result.helm_mapping.reduce((s, r) => { const u = Number(r.monthly_price) || 0, q = Number(r.qty) || 1; return s + (r.unit === 'flat' ? u : u * q); }, 0)
    : 0;

  const fieldStyle = { width: '100%', padding: '12px 14px', background: 'rgba(13,22,24,0.5)', border: '1px solid rgba(168,216,224,0.3)', color: 'var(--helm-facade-white)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' };

  React.useEffect(() => {
    if (result && result.helm_mapping && leadProp && window.HelmHubSpot) {
      window.HelmHubSpot.submitQuote({ name: leadProp.name, company: leadProp.company, email: leadProp.email, source: 'Invoice Comparison', tier: result.tier, monthly_total: total, detail: fileName });
    }
  }, [result]);

  /* ---- Lead gate ---- */
  if (!unlocked) {
    return (
      <div style={{ background: 'rgba(13,22,24,0.5)', border: '1px solid rgba(168,216,224,0.18)', padding: 'clamp(28px,4vw,40px)', maxWidth: 760 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.02em', color: 'var(--helm-facade-white)' }}>Get your free comparison quote</div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, lineHeight: 1.6, color: 'var(--helm-pale-sky)', margin: '8px 0 24px', maxWidth: 520 }}>Tell us who you are and we'll build a like-for-like Helm quote from your current invoice. We may follow up to talk through switching.</p>
        <div className="helm-lead-fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          <input style={fieldStyle} placeholder="Your name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
          <input style={fieldStyle} placeholder="Company name" value={lead.company} onChange={(e) => setLead({ ...lead, company: e.target.value })} />
          <input style={fieldStyle} type="email" placeholder="Work email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
        </div>
        {leadErr && <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--helm-mural-yellow)', margin: '0 0 14px' }}>{leadErr}</p>}
        <Button variant="accent" size="lg" iconRight={<Icon name="arrowRight" size={18} />} onClick={unlock}>Continue to invoice upload</Button>
      </div>
    );
  }

  /* ---- Tool ---- */
  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(26,143,160,0.14)', border: '1px solid var(--helm-mid-teal)', marginBottom: 22 }}>
        <Icon name="check" size={18} color="var(--helm-mural-yellow)" />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--helm-facade-white)' }}>Thanks {lead.name.split(' ')[0]}, upload your latest invoice below and we'll build your Helm quote.</span>
      </div>

      {!result && (
        <React.Fragment>
        <label
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files[0]); }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center', minHeight: 220, padding: 40, cursor: 'pointer',
            border: `1.5px dashed ${drag ? 'var(--helm-mural-yellow)' : 'rgba(168,216,224,0.45)'}`,
            background: drag ? 'rgba(242,193,46,0.06)' : 'rgba(168,216,224,0.04)',
            transition: 'border-color var(--dur-base) var(--ease-standard), background var(--dur-base) var(--ease-standard)' }}>
          <input ref={inputRef} type="file" accept=".pdf,.txt,.csv" onChange={(e) => processFile(e.target.files[0])} style={{ display: 'none' }} />
          <span style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(168,216,224,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--helm-pale-sky)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, textTransform: 'uppercase', color: 'var(--helm-facade-white)' }}>Upload your latest IT invoice</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--helm-pale-sky)' }}>PDF, text or CSV · processed instantly · never stored</span>
        </label>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 14, padding: '14px 18px', background: 'rgba(26,143,160,0.10)', border: '1px solid rgba(168,216,224,0.20)' }}>
            <span style={{ flex: 'none', marginTop: 1, display: 'flex' }}><Icon name="lock" size={18} color="var(--helm-mural-yellow)" /></span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.55, color: 'var(--helm-pale-sky)' }}>Your invoice is read by our own private AI, never used to train it, and permanently deleted the moment your quote is ready. Nothing is stored, and no one else ever sees it.</span>
          </div>
        </React.Fragment>
      )}

      {status && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, padding: '16px 20px', background: 'rgba(13,22,24,0.5)', border: '1px solid rgba(168,216,224,0.18)' }}>
          <span className="helm-spin" style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(168,216,224,0.25)', borderTopColor: 'var(--helm-mural-yellow)', display: 'block', flex: 'none' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--helm-pale-sky)' }}>{status === 'reading' ? 'Reading your document…' : 'Analysing your invoice…'}</span>
        </div>
      )}

      {error && <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.6, color: 'var(--helm-mural-yellow)', marginTop: 18 }}>{error}</p>}

      {result && result.helm_mapping && (
        <div style={{ marginTop: 4 }}>
          <div style={{ background: 'var(--helm-facade-white)', border: '1px solid var(--color-border)', padding: 'clamp(20px,3vw,28px)', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Icon name="helm" size={20} color="var(--helm-deep-teal)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--helm-deep-teal)' }}>Your Helm quote</span>
              {result.tier && <Badge tone="accent">{result.tier}</Badge>}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 16px' }}>Read from <strong>{fileName}</strong> and matched line by line to Helm's portfolio.</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13.5 }}>
              <thead>
                <tr>
                  {['Service', 'Qty / unit', 'Monthly price'].map((h, i) => (
                    <th key={h} style={{ textAlign: i === 2 ? 'right' : 'left', padding: '8px 10px', background: 'rgba(26,43,46,0.04)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.helm_mapping.map((r, i) => {
                  const u = Number(r.monthly_price) || 0, q = Number(r.qty) || 1, lt = r.unit === 'flat' ? u : u * q;
                  const ql = r.unit === 'flat' ? 'flat / mo' : `${q} × ${helmInvGBP2(u)} / ${r.unit}`;
                  return (
                    <tr key={i}>
                      <td style={{ padding: '10px', borderBottom: '1px solid rgba(26,43,46,0.06)', color: 'var(--helm-night-teal)' }}>{r.helm_equivalent}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid rgba(26,43,46,0.06)', color: 'var(--text-muted)' }}>{ql}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid rgba(26,43,46,0.06)', textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--helm-deep-teal)' }}>{helmInvGBP2(lt)}/mo</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {result.unmatched_items && result.unmatched_items.length > 0 && (
            <div style={{ background: 'rgba(196,145,26,0.08)', border: '1px solid rgba(196,145,26,0.3)', padding: '20px 24px', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--helm-amber)', marginBottom: 8 }}>A few other items</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 10px' }}>We couldn't automatically match everything, but we can almost certainly help. Let's cover these off on a call.</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {result.unmatched_items.map((it, i) => (
                  <li key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', padding: '5px 0', borderBottom: '1px solid rgba(26,43,46,0.06)' }}>— {it}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ background: 'var(--helm-deep-teal)', padding: 'clamp(22px,3vw,28px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--helm-facade-white)' }}>Helm monthly total</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>{result.users || '—'} users · {result.devices || '—'} devices · ex-VAT</div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(34px,5vw,46px)', lineHeight: 1, color: 'var(--helm-mural-yellow)' }}>{helmInvGBP(total)}<span style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>/mo</span></div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <Button variant="accent" size="lg" iconRight={<Icon name="arrowRight" size={18} />} onClick={onContact}>Get a formal proposal</Button>
            <Button variant="ghost" size="lg" style={{ color: 'var(--helm-pale-sky)', border: '1px solid rgba(168,216,224,0.4)' }} onClick={() => { setResult(null); setFileName(''); setError(''); }}>Try another invoice</Button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { HelmInvoiceTool });
