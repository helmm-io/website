#!/usr/bin/env python3
"""One-time setup: creates the custom HELM contact properties in HubSpot.

Run from any machine:  HUBSPOT_PAT=pat-xxx python3 setup_hubspot_properties.py

Safe to re-run — existing properties are left untouched (409s are skipped).
The private app needs the crm.schemas.contacts.write scope for this script
(the proxy itself only needs crm.objects.contacts.write).
"""
import json
import os
import sys
import urllib.error
import urllib.request

TOKEN = os.environ.get('HUBSPOT_PAT') or sys.exit('Set HUBSPOT_PAT in the environment')

PROPERTIES = [
    {'name': 'helm_lead_source', 'label': 'HELM lead source', 'type': 'string', 'fieldType': 'text'},
    {'name': 'helm_quote_source', 'label': 'HELM quote source', 'type': 'string', 'fieldType': 'text'},
    {'name': 'helm_quote_tier', 'label': 'HELM quote tier', 'type': 'string', 'fieldType': 'text'},
    {'name': 'helm_quote_monthly', 'label': 'HELM quote monthly (GBP)', 'type': 'number', 'fieldType': 'number'},
    {'name': 'helm_quote_detail', 'label': 'HELM quote detail', 'type': 'string', 'fieldType': 'textarea'},
]

for prop in PROPERTIES:
    prop['groupName'] = 'contactinformation'
    req = urllib.request.Request(
        'https://api.hubapi.com/crm/v3/properties/contacts',
        data=json.dumps(prop).encode(),
        headers={'authorization': 'Bearer ' + TOKEN, 'content-type': 'application/json'},
        method='POST')
    try:
        urllib.request.urlopen(req, timeout=10)
        print('created', prop['name'])
    except urllib.error.HTTPError as e:
        if e.code == 409:
            print('exists ', prop['name'])
        else:
            print('FAILED ', prop['name'], e.code, e.read().decode()[:300])
            sys.exit(1)
print('done')
