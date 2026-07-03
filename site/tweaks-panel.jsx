/* HELM MSP — Design tweaks panel (tweaks-panel.jsx)
   Exports useTweaks hook + TweaksPanel + all TweakRow components.
   Appears as a floating gear-icon drawer in bottom-right corner.
   For design exploration only — not visible to end users in production. */

function useTweaks(defaults) {
  const [values, setValues] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('helm-tweaks') || '{}');
      return { ...defaults, ...saved };
    } catch { return { ...defaults }; }
  });
  const set = React.useCallback((key, val) => {
    setValues(prev => {
      const next = { ...prev, [key]: val };
      try { localStorage.setItem('helm-tweaks', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);
  const reset = React.useCallback(() => {
    try { localStorage.removeItem('helm-tweaks'); } catch {}
    setValues({ ...defaults });
  }, []);
  return [values, set, reset];
}

function TweakSection({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--helm-pale-sky)', marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  );
}

function TweakRow({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
      <label style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--helm-pale-sky)', flex: 1 }}>{label}</label>
      <div style={{ flex: '0 0 auto' }}>{children}</div>
    </div>
  );
}

function TweakSlider({ min = 0, max = 100, step = 1, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: 100, accentColor: 'var(--helm-mural-yellow)' }} />
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'var(--helm-facade-white)', minWidth: 32, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function TweakToggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer', padding: 0, position: 'relative',
      background: checked ? 'var(--helm-mural-yellow)' : 'rgba(168,216,224,0.3)', transition: 'background 150ms',
    }}>
      <span style={{ position: 'absolute', top: 3, left: checked ? 19 : 3, width: 14, height: 14, borderRadius: '50%', background: 'white', transition: 'left 150ms' }} />
    </button>
  );
}

function TweakRadio({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {options.map(o => (
        <button key={o.value || o} onClick={() => onChange(o.value !== undefined ? o.value : o)} style={{
          padding: '4px 9px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 11.5,
          background: (o.value !== undefined ? o.value : o) === value ? 'var(--helm-mural-yellow)' : 'rgba(168,216,224,0.2)',
          color: (o.value !== undefined ? o.value : o) === value ? 'var(--helm-night-teal)' : 'var(--helm-pale-sky)',
        }}>{o.label !== undefined ? o.label : o}</button>
      ))}
    </div>
  );
}

function TweakSelect({ options, value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      background: 'rgba(26,43,46,0.7)', border: '1px solid rgba(168,216,224,0.3)', color: 'var(--helm-facade-white)',
      fontFamily: 'var(--font-body)', fontSize: 12, padding: '4px 8px',
    }}>
      {options.map(o => <option key={o.value || o} value={o.value !== undefined ? o.value : o}>{o.label !== undefined ? o.label : o}</option>)}
    </select>
  );
}

function TweakText({ value, onChange, placeholder }) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ background: 'rgba(26,43,46,0.7)', border: '1px solid rgba(168,216,224,0.3)', color: 'var(--helm-facade-white)', fontFamily: 'var(--font-body)', fontSize: 12, padding: '5px 8px', width: 160 }} />
  );
}

function TweakNumber({ value, onChange, min, max, step = 1 }) {
  return (
    <input type="number" value={value} min={min} max={max} step={step} onChange={e => onChange(Number(e.target.value))}
      style={{ background: 'rgba(26,43,46,0.7)', border: '1px solid rgba(168,216,224,0.3)', color: 'var(--helm-facade-white)', fontFamily: 'var(--font-body)', fontSize: 12, padding: '5px 8px', width: 80 }} />
  );
}

function TweakColor({ value, onChange }) {
  return (
    <input type="color" value={value} onChange={e => onChange(e.target.value)}
      style={{ width: 36, height: 28, border: 'none', cursor: 'pointer', padding: 0, background: 'none' }} />
  );
}

function TweakButton({ label, onClick, variant = 'default' }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 12px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12,
      background: variant === 'danger' ? 'var(--helm-danger)' : 'rgba(168,216,224,0.2)',
      color: variant === 'danger' ? 'white' : 'var(--helm-pale-sky)',
    }}>{label}</button>
  );
}

function TweaksPanel({ children, onReset }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 200 }}>
      {!open && (
        <button onClick={() => setOpen(true)} title="Open tweaks panel"
          style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--helm-night-teal)', border: '1px solid rgba(168,216,224,0.3)', color: 'var(--helm-mural-yellow)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
          ⚙
        </button>
      )}
      {open && (
        <div style={{ width: 280, maxHeight: '80vh', overflowY: 'auto', background: 'rgba(26,43,46,0.97)', border: '1px solid rgba(168,216,224,0.22)', backdropFilter: 'blur(8px)', padding: '16px 18px', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--helm-mural-yellow)' }}>Tweaks</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {onReset && <button onClick={onReset} style={{ background: 'none', border: 'none', color: 'var(--helm-pale-sky)', cursor: 'pointer', fontSize: 11.5, fontFamily: 'var(--font-body)' }}>Reset</button>}
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--helm-pale-sky)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
            </div>
          </div>
          {children}
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakNumber, TweakColor, TweakButton,
});
