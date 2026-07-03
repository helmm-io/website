/* HELM — HubSpot integration scaffold.
   Logs the contact (when they unlock the quote tools) and each created quote
   (Budget Explorer plan opened, or invoice comparison produced) into HubSpot.

   ─────────────────────────────────────────────────────────────────────────
   CONFIGURE ONE OF THE TWO APPROACHES BELOW, then it goes live automatically.
   Until configured, submissions are just console-logged so nothing breaks.
   ─────────────────────────────────────────────────────────────────────────

   ── Approach A (recommended — nothing secret in the browser): Forms API ──
   In HubSpot create a form with the fields you want (email, firstname,
   lastname, company + any custom quote properties). Then set `portalId`,
   `contactFormGuid` (and optionally `quoteFormGuid`). Portal ID and form
   GUIDs are NOT secrets and are safe in client-side code; each submit
   creates/updates a contact.

   ── Approach B: your own serverless proxy holding a private-app token ──
   Do NOT paste a HubSpot access token in this file — it ships to every
   visitor. Instead deploy a tiny function (Netlify / Vercel / Cloudflare /
   AWS) that stores the token and calls the HubSpot CRM API, and put its URL
   in `proxyEndpoint`. The site POSTs { kind, fields, submittedAt } as JSON.
   `proxyEndpoint` takes priority over the Forms API if both are set.

   Custom contact properties expected for quotes (create these in HubSpot):
     helm_lead_source, helm_quote_source, helm_quote_tier,
     helm_quote_monthly, helm_quote_detail
*/
const HELM_HUBSPOT = {
  portalId: '',         // Approach A — e.g. '1234567'
  contactFormGuid: '',  // Approach A — form GUID for the lead capture
  quoteFormGuid: '',    // Approach A — optional separate form for quotes (falls back to contactFormGuid)
  proxyEndpoint: '/api/hubspot',  // Approach B — nginx proxies this to the on-instance HubSpot proxy (see server/)
  region: 'eu1',        // HubSpot data region for the Forms API host: 'na1' (US) or 'eu1' (EU)
};

(function () {
  var sent = {};

  function devLog(kind, fields) {
    try { console.log('[HubSpot ' + kind + ' — not yet connected, configure site/hubspot.js]', fields); } catch (e) {}
  }

  function formsHost() {
    return (HELM_HUBSPOT.region && HELM_HUBSPOT.region !== 'na1')
      ? 'https://api-' + HELM_HUBSPOT.region + '.hsforms.com'
      : 'https://api.hsforms.com';
  }

  async function viaProxy(kind, fields) {
    var r = await fetch(HELM_HUBSPOT.proxyEndpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: kind, fields: fields, submittedAt: Date.now() }),
    });
    return r.ok;
  }

  async function viaForms(formGuid, fields) {
    var url = formsHost() + '/submissions/v3/integration/submit/' + HELM_HUBSPOT.portalId + '/' + formGuid;
    var body = {
      fields: Object.keys(fields)
        .filter(function (k) { return fields[k] !== undefined && fields[k] !== null && fields[k] !== ''; })
        .map(function (k) { return { name: k, value: String(fields[k]) }; }),
      context: { pageUri: location.href, pageName: document.title },
    };
    var r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    return r.ok;
  }

  async function send(kind, formGuid, fields) {
    try {
      if (HELM_HUBSPOT.proxyEndpoint) return await viaProxy(kind, fields);
      if (HELM_HUBSPOT.portalId && formGuid) return await viaForms(formGuid, fields);
      devLog(kind, fields);
      return false;
    } catch (e) {
      console.warn('HubSpot submit failed:', e);
      return false;
    }
  }

  function splitName(name) {
    var parts = String(name || '').trim().split(/\s+/);
    return { firstname: parts.shift() || '', lastname: parts.join(' ') };
  }

  window.HelmHubSpot = {
    submitContact: function (lead) {
      var n = splitName(lead.name);
      return send('contact', HELM_HUBSPOT.contactFormGuid, {
        firstname: n.firstname,
        lastname: n.lastname,
        email: (lead.email || '').toLowerCase(),
        company: lead.company,
        helm_lead_source: 'Quote Tools',
      });
    },
    submitQuote: function (quote) {
      var key = [quote.email, quote.source, quote.tier, quote.monthly_total].join('|');
      if (sent[key]) return Promise.resolve(true);
      sent[key] = true;
      var n = splitName(quote.name);
      return send('quote', HELM_HUBSPOT.quoteFormGuid || HELM_HUBSPOT.contactFormGuid, {
        firstname: n.firstname,
        lastname: n.lastname,
        email: (quote.email || '').toLowerCase(),
        company: quote.company,
        helm_quote_source: quote.source,
        helm_quote_tier: quote.tier,
        helm_quote_monthly: (quote.monthly_total != null ? Number(quote.monthly_total).toFixed(2) : ''),
        helm_quote_detail: quote.detail,
      });
    },
  };
})();
