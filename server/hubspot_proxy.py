#!/usr/bin/env python3
"""HELM HubSpot proxy.

Receives {kind: 'contact'|'quote', fields: {...}} from the site (via nginx at
/api/hubspot), validates it, and calls the HubSpot CRM API with the private-app
token. The token comes from the HUBSPOT_PAT environment variable, injected at
service start from SSM Parameter Store — it never appears in the repo, the
browser, or nginx config.

- contact: upserts the contact by email (lead gate submissions)
- quote:   upserts the contact with the latest quote properties, then records
           the quote as a Note on the contact timeline so every quote is kept
"""
import json
import os
import re
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

LISTEN = ('127.0.0.1', 8081)
HUBSPOT = 'https://api.hubapi.com'
TOKEN = os.environ.get('HUBSPOT_PAT', '')
TOKEN_OK = bool(TOKEN) and TOKEN != 'REPLACE_ME'

MAX_BODY = 16 * 1024
EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
NOTE_TO_CONTACT = 202  # HubSpot-defined association type: note -> contact

# Only these properties are ever forwarded to HubSpot, with hard length caps.
ALLOWED_PROPS = {
    'firstname': 100, 'lastname': 100, 'email': 254, 'company': 200,
    'helm_lead_source': 100, 'helm_quote_source': 100, 'helm_quote_tier': 100,
    'helm_quote_monthly': 20, 'helm_quote_detail': 2000,
}


def hs_post(path, payload):
    req = urllib.request.Request(
        HUBSPOT + path,
        data=json.dumps(payload).encode(),
        headers={'authorization': 'Bearer ' + TOKEN,
                 'content-type': 'application/json'},
        method='POST')
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.load(r)


def clean_fields(fields):
    props = {}
    for key, cap in ALLOWED_PROPS.items():
        val = fields.get(key)
        if val is None or val == '':
            continue
        props[key] = str(val)[:cap]
    return props


def upsert_contact(props):
    out = hs_post('/crm/v3/objects/contacts/batch/upsert', {
        'inputs': [{'idProperty': 'email', 'id': props['email'],
                    'properties': props}]})
    results = out.get('results') or []
    return results[0].get('id') if results else None


def add_quote_note(contact_id, props):
    body = 'HELM quote — {}\nTier: {}\nMonthly total: £{}\nDetail: {}'.format(
        props.get('helm_quote_source', 'unknown'),
        props.get('helm_quote_tier', '-'),
        props.get('helm_quote_monthly', '-'),
        props.get('helm_quote_detail', '-'))
    hs_post('/crm/v3/objects/notes', {
        'properties': {'hs_timestamp': str(int(time.time() * 1000)),
                       'hs_note_body': body},
        'associations': [{
            'to': {'id': contact_id},
            'types': [{'associationCategory': 'HUBSPOT_DEFINED',
                       'associationTypeId': NOTE_TO_CONTACT}]}]})


class Handler(BaseHTTPRequestHandler):
    server_version = 'helm-proxy'

    def log_message(self, fmt, *args):  # keep nginx as the access log; no PII here
        pass

    def reply(self, code):
        self.send_response(code)
        self.send_header('content-length', '0')
        self.end_headers()

    def do_POST(self):
        if not TOKEN_OK:
            return self.reply(503)
        try:
            length = int(self.headers.get('content-length') or 0)
            if not 0 < length <= MAX_BODY:
                return self.reply(400)
            data = json.loads(self.rfile.read(length))
            kind = data.get('kind')
            fields = data.get('fields')
            if kind not in ('contact', 'quote') or not isinstance(fields, dict):
                return self.reply(400)
            props = clean_fields(fields)
            email = (props.get('email') or '').lower()
            if not EMAIL_RE.match(email):
                return self.reply(400)
            props['email'] = email
        except (ValueError, KeyError):
            return self.reply(400)

        try:
            contact_id = upsert_contact(props)
            if kind == 'quote' and contact_id:
                add_quote_note(contact_id, props)
            return self.reply(204)
        except urllib.error.HTTPError as e:
            print('hubspot api error {}: {}'.format(e.code, e.read()[:500]), flush=True)
            return self.reply(502)
        except OSError as e:
            print('hubspot unreachable: {}'.format(e), flush=True)
            return self.reply(502)


if __name__ == '__main__':
    if not TOKEN_OK:
        print('warning: HUBSPOT_PAT not set — responding 503 until configured', flush=True)
    ThreadingHTTPServer(LISTEN, Handler).serve_forever()
