#!/bin/bash
# Deploys the already-pulled /opt/helm-website checkout to the nginx web root
# and (re)installs the server components. Called by GitHub Actions via SSM.
set -euo pipefail

cp -r /opt/helm-website/. /usr/share/nginx/html/

# Server-side and repo-only files have no business in the public web root
rm -rf /usr/share/nginx/html/.git \
       /usr/share/nginx/html/.github \
       /usr/share/nginx/html/.gitignore \
       /usr/share/nginx/html/server \
       /usr/share/nginx/html/README.md

bash /opt/helm-website/server/install.sh
