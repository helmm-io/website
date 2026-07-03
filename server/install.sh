#!/bin/bash
# Idempotent server setup for the HubSpot proxy + nginx API routing.
# Run as root on the instance (the deploy script calls this on every deploy).
set -euo pipefail
SRC=/opt/helm-website/server

install -m 755 "$SRC/helm-hubspot-proxy-start" /usr/local/bin/helm-hubspot-proxy-start
install -m 644 "$SRC/helm-hubspot-proxy.service" /etc/systemd/system/helm-hubspot-proxy.service
install -m 644 "$SRC/nginx-ratelimit.conf" /etc/nginx/conf.d/helm-ratelimit.conf
install -m 644 "$SRC/nginx-api.conf" /etc/nginx/default.d/helm-api.conf

systemctl daemon-reload
systemctl enable helm-hubspot-proxy >/dev/null 2>&1 || true
systemctl restart helm-hubspot-proxy

nginx -t
systemctl reload nginx
