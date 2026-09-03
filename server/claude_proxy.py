#!/usr/bin/env python3
"""HELM Claude proxy.

Backs the "Beat my invoice" tool (site/quoteInvoice.jsx). The browser can't
hold an Anthropic API key, so it POSTs the fully-built prompt (the pricing
context from quoteData.jsx plus the extracted invoice text — see
helmBuildInvoicePrompt in quoteInvoice.jsx) to same-origin /api/claude; this
proxy adds the API key server-side and forwards it to the Anthropic Messages
API, then relays the reply back verbatim as {"text": "..."}.

The key comes from the ANTHROPIC_API_KEY environment variable, injected at
service start from SSM Parameter Store — it never appears in the repo, the
browser, or nginx config. Model and max_tokens are fixed here, not
client-controlled, so a request can only ever cost what this file allows.

This is a thin pass-through, not a validator of prompt content — nginx rate
limiting (see nginx-ratelimit.conf) is the primary control on cost/abuse,
same posture as hubspot_proxy.py.
"""
import json
import os
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

LISTEN = ('127.0.0.1', 8082)
ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
ANTHROPIC_VERSION = '2023-06-01'
API_KEY = os.environ.get('ANTHROPIC_API_KEY', '')
KEY_OK = bool(API_KEY) and API_KEY != 'REPLACE_ME'

# Fixed server-side, never taken from the request — bounds cost per call.
MODEL = os.environ.get('ANTHROPIC_MODEL', 'claude-sonnet-5')

# Sonnet 5 (and every current model) reasons before answering, and those
# thinking tokens count against max_tokens alongside the JSON we actually
# want. The quote prompt asks the model to cost out every tier before choosing
# one, so it legitimately thinks for a few thousand tokens; with the original
# cap of 2000 the budget ran out before any text was written and the proxy
# answered 502 "empty response from model". 8000 leaves headroom while still
# bounding cost per call; effort "medium" keeps the reasoning proportionate.
MAX_TOKENS = 8000
EFFORT = os.environ.get('ANTHROPIC_EFFORT', 'medium')

# HELM_QUOTE_CONTEXT (quoteData.jsx) runs ~6KB plus up to ~3KB of invoice
# text the client extracts; this leaves comfortable headroom for both to
# grow before the cap needs revisiting.
MAX_BODY = 24 * 1024
REQUEST_TIMEOUT = 85  # seconds — must stay under nginx's proxy_read_timeout (90s)


def call_claude(prompt):
    req = urllib.request.Request(
        ANTHROPIC_URL,
        data=json.dumps({
            'model': MODEL,
            'max_tokens': MAX_TOKENS,
            'thinking': {'type': 'adaptive'},
            'output_config': {'effort': EFFORT},
            'messages': [{'role': 'user', 'content': prompt}],
        }).encode(),
        headers={
            'x-api-key': API_KEY,
            'anthropic-version': ANTHROPIC_VERSION,
            'content-type': 'application/json',
        },
        method='POST')
    with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as r:
        return json.load(r)


class Handler(BaseHTTPRequestHandler):
    server_version = 'helm-claude-proxy'

    def log_message(self, fmt, *args):  # keep nginx as the access log
        pass

    def reply(self, code, body=None):
        payload = json.dumps(body).encode() if body is not None else b''
        self.send_response(code)
        self.send_header('content-type', 'application/json')
        self.send_header('content-length', str(len(payload)))
        self.end_headers()
        if payload:
            self.wfile.write(payload)

    def do_POST(self):
        if not KEY_OK:
            return self.reply(503, {'error': 'quoting engine not configured'})
        try:
            length = int(self.headers.get('content-length') or 0)
            if not 0 < length <= MAX_BODY:
                return self.reply(400, {'error': 'invalid request size'})
            data = json.loads(self.rfile.read(length))
            prompt = data.get('prompt')
            if not isinstance(prompt, str) or not prompt.strip():
                return self.reply(400, {'error': 'missing prompt'})
        except (ValueError, KeyError):
            return self.reply(400, {'error': 'malformed request'})

        try:
            started = time.monotonic()
            out = call_claude(prompt)
            parts = out.get('content') or []
            text = ''.join(p.get('text', '') for p in parts if p.get('type') == 'text')
            stop = out.get('stop_reason')
            usage = out.get('usage') or {}
            # One line per call so cost and failures are visible in the journal.
            print('claude call: stop_reason={} blocks={} in={} out={} text_chars={} took={:.1f}s'.format(
                stop, [p.get('type') for p in parts], usage.get('input_tokens'),
                usage.get('output_tokens'), len(text), time.monotonic() - started), flush=True)
            if stop == 'refusal':
                return self.reply(502, {'error': 'quoting engine declined this document'})
            if not text:
                if stop == 'max_tokens':
                    print('claude call: max_tokens ({}) exhausted before any text was produced'.format(MAX_TOKENS), flush=True)
                return self.reply(502, {'error': 'empty response from model'})
            if stop == 'max_tokens':
                print('claude call: text truncated at max_tokens; client JSON parse will likely fail', flush=True)
            return self.reply(200, {'text': text})
        except urllib.error.HTTPError as e:
            body = e.read()[:500]
            print('anthropic api error {}: {}'.format(e.code, body), flush=True)
            # Surface 429 (rate limited upstream) distinctly so the client can
            # show a "try again shortly" message rather than a hard failure.
            return self.reply(429 if e.code == 429 else 502, {'error': 'quoting engine unavailable'})
        except (urllib.error.URLError, TimeoutError) as e:
            print('anthropic unreachable: {}'.format(e), flush=True)
            return self.reply(502, {'error': 'quoting engine unavailable'})


if __name__ == '__main__':
    if not KEY_OK:
        print('warning: ANTHROPIC_API_KEY not set — responding 503 until configured', flush=True)
    ThreadingHTTPServer(LISTEN, Handler).serve_forever()
