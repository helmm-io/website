
/* @ds-bundle: {"format":3,"namespace":"HELMDesignSystem_93c981","components":[{"name":"Icon","sourcePath":"components/brand/Icon.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Stat","sourcePath":"components/core/Stat.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"}],"sourceHashes":{"components/brand/Icon.jsx":"814794433ab3","components/brand/Logo.jsx":"a4e9e456387e","components/core/Badge.jsx":"d1f5b678c22a","components/core/Button.jsx":"dcc9ff58a557","components/core/Card.jsx":"8f2997eb150f","components/core/Eyebrow.jsx":"07ef92448a79","components/core/Stat.jsx":"d05cda449391","components/forms/Checkbox.jsx":"8418a17eca20","components/forms/Input.jsx":"12cbf4529a6a","components/forms/Select.jsx":"eb4a1cd63e4d","components/forms/Switch.jsx":"b2b80f6d90df","ui_kits/website/Contact.jsx":"7a100b94b197","ui_kits/website/CtaFooter.jsx":"b0dae1c7d6e4","ui_kits/website/Header.jsx":"559f7ec3e104","ui_kits/website/Hero.jsx":"be2b00db550a","ui_kits/website/Results.jsx":"4e8573aee390","ui_kits/website/Services.jsx":"19cf78b0cfd1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.HELMDesignSystem_93c981 = window.HELMDesignSystem_93c981 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* HELM line icons — 24px grid, 2px stroke, rounded joins, single weight & colour.
   Drawn to sit beside the boss mark. Add new glyphs to PATHS only. */
const PATHS = {
  shield: () => /*#__PURE__*/React.createElement("path", {
    d: "M12 2l8 4v5c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V6z"
  }),
  cloud: () => /*#__PURE__*/React.createElement("path", {
    d: "M6 16a4 4 0 010-8 5 5 0 019.6-1.5A3.5 3.5 0 0118 16z"
  }),
  automation: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"
  })),
  support: () => /*#__PURE__*/React.createElement("path", {
    d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
  }),
  growth: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 17l6-6 4 4 7-7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 8h6v6"
  })),
  check: () => /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  }),
  close: () => /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  }),
  arrowRight: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 6l6 6-6 6"
  })),
  chevronRight: () => /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }),
  chevronDown: () => /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }),
  menu: () => /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18M3 12h18M3 18h18"
  }),
  search: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 21l-4.3-4.3"
  })),
  user: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1"
  })),
  settings: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.4 13a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H10a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V10a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"
  })),
  lock: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "11",
    width: "16",
    height: "10",
    rx: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11V7a4 4 0 018 0v4"
  })),
  server: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "7",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "13",
    width: "18",
    height: "7",
    rx: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 7.5h.01M7 16.5h.01"
  })),
  mail: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "14",
    rx: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 7l9 6 9-6"
  })),
  phone: () => /*#__PURE__*/React.createElement("path", {
    d: "M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8 9.6a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"
  }),
  clock: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7v5l3 2"
  })),
  alert: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 9v4M12 17h.01"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.3 3.9l-8 13.9A2 2 0 004 21h16a2 2 0 001.7-3.2l-8-13.9a2 2 0 00-3.4 0z"
  })),
  helm: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "2.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.8 2.8M15.2 15.2L18 18M18 6l-2.8 2.8M8.8 15.2L6 18"
  }))
};
function Icon({
  name = 'shield',
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  style,
  ...rest
}) {
  const glyph = (PATHS[name] || PATHS.shield)();
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: 'block',
      flex: 'none',
      ...style
    },
    "aria-hidden": "true"
  }, rest), glyph);
}
Icon.names = Object.keys(PATHS);
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Icon.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The HELM "boss" mark — a shield with a negative-space hub (security + direction).
   Optionally locks up with the HELM wordmark in Oswald. */

const BOSS_D = 'M60.87,129.19l-12.63-.17c-10.82-.14-20.8-5.87-26.38-15.14l-15.71-26.1c-7.51-12.48-5.41-28.5,5.07-38.62L60.87,1.21l49.64,47.94c10.48,10.12,12.58,26.14,5.07,38.62l-15.71,26.1c-5.58,9.27-15.56,15-26.38,15.14,0,0-12.63.17-12.63.17ZM26.31,72.98a34.56,34.56,0,1,0,69.12,0a34.56,34.56,0,1,0,-69.12,0Z';
const TONES = {
  teal: {
    mark: 'var(--helm-deep-teal, #1A8FA0)',
    word: 'var(--helm-night-teal, #1A2B2E)'
  },
  night: {
    mark: 'var(--helm-night-teal, #1A2B2E)',
    word: 'var(--helm-night-teal, #1A2B2E)'
  },
  white: {
    mark: 'var(--helm-facade-white, #F5F5F0)',
    word: 'var(--helm-facade-white, #F5F5F0)'
  },
  accent: {
    mark: 'var(--helm-mural-yellow, #F2C12E)',
    word: 'var(--helm-facade-white, #F5F5F0)'
  }
};
function Logo({
  variant = 'full',
  tone = 'teal',
  size = 40,
  wordColor,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.teal;
  const markColor = t.mark;
  const word = wordColor || t.word;
  const h = size,
    w = size * (121.75 / 130.87);
  const Mark = /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 121.75 130.87",
    width: w,
    height: h,
    style: {
      display: 'block',
      flex: 'none'
    },
    "aria-hidden": variant !== 'mark'
  }, /*#__PURE__*/React.createElement("path", {
    fill: markColor,
    fillRule: "evenodd",
    d: BOSS_D
  }));
  if (variant === 'mark') return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      ...style
    }
  }, rest), Mark);
  const Word = /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display, 'Oswald'), sans-serif",
      fontWeight: 600,
      letterSpacing: '0.02em',
      fontSize: size * 0.7,
      lineHeight: 0.9,
      color: word
    }
  }, "HELM");
  if (variant === 'wordmark') return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      ...style
    }
  }, rest), Word);
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.32,
      ...style
    }
  }, rest), Mark, Word);
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* HELM Badge — small status/label pill. Square by default to match the brand;
   tones map to semantic colours. Use the dot for live/status contexts. */

const TONES = {
  teal: {
    bg: 'rgba(26,143,160,0.12)',
    fg: 'var(--helm-deep-teal)',
    dot: 'var(--helm-deep-teal)'
  },
  accent: {
    bg: 'rgba(242,193,46,0.20)',
    fg: 'var(--helm-amber)',
    dot: 'var(--helm-amber)'
  },
  sky: {
    bg: 'rgba(168,216,224,0.35)',
    fg: 'var(--helm-night-teal)',
    dot: 'var(--helm-mid-teal)'
  },
  neutral: {
    bg: 'rgba(196,184,168,0.28)',
    fg: '#5C5448',
    dot: 'var(--helm-warm-grey)'
  },
  solid: {
    bg: 'var(--helm-deep-teal)',
    fg: 'var(--text-on-dark)',
    dot: 'var(--helm-pale-sky)'
  },
  danger: {
    bg: 'rgba(178,58,72,0.12)',
    fg: 'var(--helm-danger)',
    dot: 'var(--helm-danger)'
  }
};
function Badge({
  children,
  tone = 'teal',
  dot = false,
  pill = false,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.teal;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 11.5,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      lineHeight: 1,
      padding: '5px 10px',
      background: t.bg,
      color: t.fg,
      borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-none)',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: t.dot,
      flex: 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* HELM Button — square corners (brand is hard-edged), Work Sans medium, condensed feel.
   Primary = Deep Teal. Accent = Mural Yellow (sparingly). Secondary = outline. Ghost = bare. */

const SIZES = {
  sm: {
    padding: '8px 16px',
    fontSize: 13,
    gap: 7
  },
  md: {
    padding: '11px 22px',
    fontSize: 14,
    gap: 8
  },
  lg: {
    padding: '15px 30px',
    fontSize: 16,
    gap: 10
  }
};
const VARIANTS = {
  primary: {
    background: 'var(--brand-primary)',
    color: 'var(--text-on-dark)',
    border: '1px solid var(--brand-primary)',
    hover: 'var(--brand-primary-hover)'
  },
  accent: {
    background: 'var(--brand-accent)',
    color: 'var(--helm-night-teal)',
    border: '1px solid var(--brand-accent)',
    hover: 'var(--brand-accent-hover)'
  },
  secondary: {
    background: 'transparent',
    color: 'var(--brand-primary)',
    border: '1px solid var(--brand-primary)',
    hover: 'rgba(26,143,160,0.08)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid transparent',
    hover: 'rgba(26,43,46,0.06)'
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  type = 'button',
  style,
  onClick,
  ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: s.fontSize,
      letterSpacing: '0.01em',
      lineHeight: 1,
      padding: s.padding,
      borderRadius: 'var(--radius-none)',
      background: hover && !disabled ? v.hover : v.background,
      color: v.color,
      border: v.border,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transform: active && !disabled ? 'translateY(1px)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* HELM Card — flat, hard-edged surface with a 1px hairline border. No radius, no shadow
   by default (the brand prefers borders + tight grids over drop shadows). */

const TONES = {
  light: {
    background: 'var(--color-surface)',
    color: 'var(--text-primary)',
    border: '1px solid var(--color-border)'
  },
  sunken: {
    background: 'var(--color-surface-sunken)',
    color: 'var(--text-primary)',
    border: '1px solid var(--color-border)'
  },
  dark: {
    background: 'var(--color-surface-dark)',
    color: 'var(--text-on-dark)',
    border: '1px solid rgba(168,216,224,0.18)'
  },
  brand: {
    background: 'var(--color-surface-brand)',
    color: 'var(--text-on-dark)',
    border: '1px solid var(--brand-primary)'
  }
};
const PADS = {
  none: 0,
  sm: 'var(--space-6)',
  md: 'var(--space-9)',
  lg: 'var(--space-12)'
};
function Card({
  children,
  tone = 'light',
  padding = 'md',
  accentTop = false,
  elevated = false,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.light;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: t.background,
      color: t.color,
      border: t.border,
      borderTop: accentTop ? '3px solid var(--brand-accent)' : t.border,
      borderRadius: 'var(--radius-none)',
      padding: PADS[padding] ?? PADS.md,
      boxShadow: elevated ? 'var(--shadow-md)' : 'var(--shadow-none)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* HELM Eyebrow — the signature numbered section label: a small index + tracked,
   uppercase label in the brand accent colour. Sits above section headings. */

function Eyebrow({
  index,
  children,
  tone = 'teal',
  style,
  ...rest
}) {
  const color = tone === 'accent' ? 'var(--brand-accent)' : tone === 'light' ? 'var(--helm-pale-sky)' : 'var(--brand-primary)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 14,
      ...style
    }
  }, rest), index != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: '0.2em',
      color
    }
  }, index), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color
    }
  }, children));
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* HELM Stat — a metric with an Oswald figure and a Work Sans label. Used in
   capability grids, results sections, and dashboards. */

function Stat({
  value,
  label,
  suffix,
  tone = 'teal',
  align = 'left',
  style,
  ...rest
}) {
  const valueColor = tone === 'accent' ? 'var(--helm-amber)' : tone === 'light' ? 'var(--helm-facade-white)' : 'var(--brand-primary)';
  const labelColor = tone === 'light' ? 'var(--helm-pale-sky)' : 'var(--text-secondary)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 2,
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      lineHeight: 0.95,
      color: valueColor
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 52,
      letterSpacing: '0.01em'
    }
  }, value), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26,
      fontWeight: 500
    }
  }, suffix)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13.5,
      fontWeight: 500,
      letterSpacing: '0.04em',
      color: labelColor,
      maxWidth: 220
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stat.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* HELM Checkbox — square box (matches the brand), teal when checked, white tick. */

function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled,
  id,
  style,
  ...rest
}) {
  const cbId = id || React.useId();
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  const handle = e => {
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: cbId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 18,
      height: 18,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: cbId,
    type: "checkbox",
    checked: isControlled ? checked : undefined,
    defaultChecked: isControlled ? undefined : defaultChecked,
    onChange: handle,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: '100%',
      height: '100%',
      margin: 0,
      cursor: 'inherit'
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 'var(--radius-sm)',
      border: `1px solid ${on ? 'var(--brand-primary)' : 'var(--color-border-strong)'}`,
      background: on ? 'var(--brand-primary)' : 'var(--color-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background var(--dur-fast), border-color var(--dur-fast)'
    }
  }, on && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-on-dark)",
    strokeWidth: "3.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  })))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* HELM Input — square-cornered text field, hairline border, teal focus.
   Supports label, hint, error, and optional leading icon. */

function Input({
  label,
  hint,
  error,
  iconLeft,
  id,
  type = 'text',
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || React.useId();
  const borderColor = error ? 'var(--color-danger)' : focus ? 'var(--brand-primary)' : 'var(--color-border-strong)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--color-surface)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-none)',
      padding: '0 12px',
      boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)',
      opacity: disabled ? 0.55 : 1
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      display: 'flex'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-primary)',
      padding: '11px 0'
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: error ? 'var(--color-danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* HELM Select — native select styled to match Input: square, hairline border, teal focus. */

function Select({
  label,
  hint,
  error,
  id,
  children,
  value,
  defaultValue,
  onChange,
  disabled,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const selId = id || React.useId();
  const borderColor = error ? 'var(--color-danger)' : focus ? 'var(--brand-primary)' : 'var(--color-border-strong)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-primary)',
      background: 'var(--color-surface)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-none)',
      padding: '11px 38px 11px 12px',
      boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      outline: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
    }
  }, rest), children), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  })))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: error ? 'var(--color-danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* HELM Switch — pill toggle; teal track when on. The one place rounded shapes are used. */

function Switch({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled,
  id,
  style,
  ...rest
}) {
  const swId = id || React.useId();
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  const handle = e => {
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: swId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 38,
      height: 22,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: swId,
    type: "checkbox",
    checked: isControlled ? checked : undefined,
    defaultChecked: isControlled ? undefined : defaultChecked,
    onChange: handle,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: '100%',
      height: '100%',
      margin: 0,
      cursor: 'inherit'
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 'var(--radius-pill)',
      background: on ? 'var(--brand-primary)' : 'var(--helm-warm-grey)',
      transition: 'background var(--dur-base) var(--ease-standard)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: on ? 19 : 3,
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: 'var(--helm-white)',
      boxShadow: '0 1px 2px rgba(26,43,46,0.3)',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Contact.jsx
try { (() => {
/* HELM website — contact modal. Interactive: fill the form, submit → success state. */
const {
  Input,
  Select,
  Checkbox,
  Button,
  Logo,
  Icon
} = window.HELMDesignSystem_93c981;
function Contact({
  open,
  onClose
}) {
  const [sent, setSent] = React.useState(false);
  const [name, setName] = React.useState('');
  React.useEffect(() => {
    if (open) setSent(false);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: 'rgba(26,43,46,0.55)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      width: 'min(520px, 100%)',
      maxHeight: '90vh',
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 28px',
      borderBottom: '1px solid var(--color-border)'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "full",
    tone: "teal",
    size: 28
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      display: 'flex',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 20
  }))), sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px 28px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'rgba(26,143,160,0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 28,
    color: "var(--brand-primary)"
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 26,
      textTransform: 'uppercase',
      margin: '0 0 10px',
      color: 'var(--text-primary)'
    }
  }, "You're booked in"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--text-secondary)',
      margin: '0 0 24px'
    }
  }, "Thanks", name ? `, ${name.split(' ')[0]}` : '', " \u2014 a senior engineer will be in touch within one working day to confirm your discovery call."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onClose
  }, "Done")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 24,
      textTransform: 'uppercase',
      color: 'var(--text-primary)'
    }
  }, "Book a discovery call"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-secondary)',
      marginTop: 4
    }
  }, "30 minutes, no obligation.")), /*#__PURE__*/React.createElement(Input, {
    label: "Full name",
    placeholder: "Alex Morgan",
    value: name,
    onChange: e => setName(e.target.value),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "user",
      size: 16
    }),
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Work email",
    type: "email",
    placeholder: "you@company.co.uk",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "mail",
      size: 16
    }),
    required: true
  }), /*#__PURE__*/React.createElement(Select, {
    label: "What can we help with?",
    defaultValue: "Managed IT"
  }, /*#__PURE__*/React.createElement("option", null, "Managed IT & Helpdesk"), /*#__PURE__*/React.createElement("option", null, "Cyber Security"), /*#__PURE__*/React.createElement("option", null, "Cloud & Infrastructure"), /*#__PURE__*/React.createElement("option", null, "IT Strategy & Consultancy")), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Add 24/7 monitoring to the conversation",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    variant: "accent",
    size: "lg",
    fullWidth: true,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrowRight",
      size: 18
    })
  }, "Request my call"))));
}
window.HelmContact = Contact;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/CtaFooter.jsx
try { (() => {
/* HELM website — CTA band + footer. */
const {
  Button,
  Logo,
  Icon,
  Eyebrow
} = window.HELMDesignSystem_93c981;
function CtaFooter({
  onContact
}) {
  const cols = [{
    h: 'Services',
    items: ['Managed IT', 'Cyber Security', 'Cloud & Infrastructure', 'Consultancy']
  }, {
    h: 'Company',
    items: ['About', 'Approach', 'Results', 'Careers']
  }, {
    h: 'Contact',
    items: ['hello@helm.co.uk', '0800 000 0000', 'Manchester, UK']
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--color-bg)',
      padding: '88px var(--gutter)',
      borderTop: '1px solid var(--color-border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 40,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 620
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    index: "02"
  }, "Get started"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 'clamp(30px,4.5vw,50px)',
      lineHeight: 1.02,
      margin: '14px 0 0',
      color: 'var(--text-primary)'
    }
  }, "Let's get your IT running right."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 17,
      lineHeight: 1.6,
      color: 'var(--text-secondary)',
      margin: '14px 0 0'
    }
  }, "A 30-minute discovery call, no obligation. We'll map where you are and where you want to be.")), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrowRight",
      size: 18
    }),
    onClick: onContact
  }, "Book a discovery call"))), /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--helm-night-teal)',
      color: 'var(--helm-pale-sky)',
      padding: '64px var(--gutter) 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr repeat(3, 1fr)',
      gap: 40,
      paddingBottom: 40,
      borderBottom: '1px solid rgba(168,216,224,0.18)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    variant: "full",
    tone: "white",
    size: 32
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13.5,
      lineHeight: 1.6,
      marginTop: 18,
      maxWidth: 260,
      color: 'var(--helm-pale-sky)'
    }
  }, "Boutique, AI-native managed IT for UK businesses.")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 12,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--helm-facade-white)',
      marginBottom: 14
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, c.items.map(i => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13.5
    }
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: 24,
      fontSize: 12,
      letterSpacing: '0.04em',
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Helm MSP Ltd \xB7 Est. 2024"), /*#__PURE__*/React.createElement("span", {
    style: {
      textTransform: 'uppercase',
      letterSpacing: '0.18em',
      color: 'var(--helm-warm-grey)'
    }
  }, "Expert Managed Services")))));
}
window.HelmCtaFooter = CtaFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/CtaFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
/* HELM website — top navigation bar. Logo + links + CTA. */
const {
  Logo,
  Button,
  Icon
} = window.HELMDesignSystem_93c981;
function Header({
  onContact
}) {
  const links = ['Services', 'Approach', 'Results', 'About'];
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'rgba(245,245,240,0.92)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--color-border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      padding: '0 var(--gutter)',
      height: 72,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "full",
    tone: "teal",
    size: 34
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 34
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: '#' + l.toLowerCase(),
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14.5,
      fontWeight: 500,
      color: 'var(--text-primary)',
      textDecoration: 'none',
      letterSpacing: '0.01em'
    }
  }, l)), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: onContact
  }, "Get in touch"))));
}
window.HelmHeader = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
/* HELM website — hero. Dark night-teal panel, condensed Oswald headline,
   Gudea sub-line, CTAs, and the wheel motif as a quiet watermark. */
const {
  Button,
  Eyebrow,
  Icon,
  Badge
} = window.HELMDesignSystem_93c981;
function Hero({
  onContact
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      background: 'var(--helm-night-teal)',
      color: 'var(--text-on-dark)',
      overflow: 'hidden',
      padding: '96px var(--gutter) 104px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/motifs/wheel-sky.svg",
    alt: "",
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: -150,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 560,
      height: 560,
      opacity: 0.07,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "accent"
  }, "Managed IT Services \xB7 UK"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'clamp(48px,7vw,88px)',
      lineHeight: 0.96,
      letterSpacing: '0.01em',
      margin: '24px 0 0',
      maxWidth: 880,
      textTransform: 'uppercase',
      color: 'var(--helm-facade-white)'
    }
  }, "Reliable IT,", /*#__PURE__*/React.createElement("br", null), "quietly managed"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-quote)',
      fontStyle: 'italic',
      fontSize: 'clamp(19px,2.3vw,26px)',
      color: 'var(--helm-pale-sky)',
      margin: '30px 0 0',
      maxWidth: 600,
      lineHeight: 1.45
    }
  }, "Boutique, AI-native managed IT for UK businesses. Senior people, security-first, keeping everything running so you don't have to think about it."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 40,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrowRight",
      size: 18
    }),
    onClick: onContact
  }, "Book a discovery call"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    style: {
      color: 'var(--helm-pale-sky)',
      borderColor: 'var(--helm-pale-sky)'
    }
  }, "See our services")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      marginTop: 56,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13.5,
      color: 'var(--helm-pale-sky)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 17,
    color: "var(--helm-mural-yellow)"
  }), " Security-first by default"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13.5,
      color: 'var(--helm-pale-sky)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 17,
    color: "var(--helm-mural-yellow)"
  }), " 24/7 monitoring & response"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13.5,
      color: 'var(--helm-pale-sky)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 17,
    color: "var(--helm-mural-yellow)"
  }), " Senior engineers, no call centres"))));
}
window.HelmHero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Results.jsx
try { (() => {
/* HELM website — results band. Dark section with stats + a Gudea testimonial. */
const {
  Eyebrow,
  Stat
} = window.HELMDesignSystem_93c981;
function Results() {
  return /*#__PURE__*/React.createElement("section", {
    id: "results",
    style: {
      background: 'var(--helm-deep-teal)',
      color: 'var(--text-on-dark)',
      padding: '88px var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "accent"
  }, "The difference"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
      gap: 40,
      margin: '28px 0 56px'
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "99.9",
    suffix: "%",
    label: "Uptime across managed estates",
    tone: "light"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "12",
    suffix: "min",
    label: "Average response to priority tickets",
    tone: "light"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "24",
    suffix: "/7",
    label: "Monitoring, alerting & response",
    tone: "light"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "100",
    suffix: "%",
    label: "UK-based senior engineers",
    tone: "light"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(245,245,240,0.22)',
      paddingTop: 40,
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-quote)',
      fontStyle: 'italic',
      fontSize: 'clamp(22px,3vw,32px)',
      lineHeight: 1.4,
      color: 'var(--helm-facade-white)',
      margin: 0
    }
  }, "\"Helm just feel like part of our team \u2014 calm, quick, and always a step ahead.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--helm-pale-sky)',
      letterSpacing: '0.04em'
    }
  }, "Operations Director \xB7 Northwind Logistics"))));
}
window.HelmResults = Results;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Results.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Services.jsx
try { (() => {
/* HELM website — services grid. Signature hairline-gap grid of capability cards. */
const {
  Eyebrow,
  Icon
} = window.HELMDesignSystem_93c981;
const SERVICES = [{
  icon: 'support',
  title: 'Managed IT & Helpdesk',
  body: 'Day-to-day support from senior engineers who know your estate. Fast resolution, no scripts, no call centres.'
}, {
  icon: 'lock',
  title: 'Cyber Security',
  body: 'Security-first by default — monitoring, hardening, and incident response built into everything we run.'
}, {
  icon: 'cloud',
  title: 'Cloud & Infrastructure',
  body: 'Microsoft 365, Azure and hybrid estates designed, migrated and managed for resilience and scale.'
}, {
  icon: 'automation',
  title: 'AI-Native Automation',
  body: 'Intelligence wired into your workflows — faster tickets, fewer surprises, more time for the work that matters.'
}, {
  icon: 'server',
  title: 'Backup & Continuity',
  body: 'Tested backups and recovery plans so a bad day stays a small one. Protection is the default, not the upsell.'
}, {
  icon: 'growth',
  title: 'IT Strategy & Consultancy',
  body: 'Plain-spoken roadmaps and senior advice. We tell you the why before we touch the how.'
}];
function Services() {
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      background: 'var(--color-bg)',
      padding: '96px var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    index: "01"
  }, "What we do"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 'clamp(32px,5vw,54px)',
      lineHeight: 1.02,
      margin: '14px 0 12px',
      maxWidth: 760,
      color: 'var(--text-primary)'
    }
  }, "Everything that keeps your business running, in one steady team."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--text-secondary)',
      maxWidth: 640,
      margin: '0 0 48px'
    }
  }, "We pair hands-on consultancy with AI-native tooling \u2014 the calm, capable partner behind your IT."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
      gap: 'var(--grid-gap-hair)',
      background: 'var(--color-border)',
      border: '1px solid var(--color-border)'
    }
  }, SERVICES.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.title,
    style: {
      background: 'var(--color-surface)',
      padding: '36px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      minHeight: 220
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 30,
    color: "var(--brand-primary)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: '0.16em',
      color: 'var(--color-border-strong)'
    }
  }, String(i + 1).padStart(2, '0'))), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 21,
      textTransform: 'uppercase',
      letterSpacing: '0.01em',
      margin: 0,
      color: 'var(--text-primary)'
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14.5,
      lineHeight: 1.55,
      color: 'var(--text-secondary)',
      margin: 0
    }
  }, s.body))))));
}
window.HelmServices = Services;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Services.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

})();

