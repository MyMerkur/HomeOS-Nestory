#!/usr/bin/env bash
# Builds Nestory-Web and deploys the static export to the VPS
# (nestoryhomekit.com, CyberPanel/OpenLiteSpeed, linux user nesto5570).
set -euo pipefail

VPS_HOST="root@72.62.76.12"
VPS_KEY="$HOME/.ssh/nestory_vps_deploy"
REMOTE_ROOT="/home/nestoryhomekit.com/public_html"
SITE_USER="nesto5570"

cd "$(dirname "$0")/.."

npm run build

cp deploy/htaccess out/.htaccess

rsync -avz --delete \
  -e "ssh -i $VPS_KEY" \
  out/ "$VPS_HOST:$REMOTE_ROOT/"

ssh -i "$VPS_KEY" "$VPS_HOST" "chown -R $SITE_USER:$SITE_USER $REMOTE_ROOT && find $REMOTE_ROOT -type d -exec chmod 755 {} \; && find $REMOTE_ROOT -type f -exec chmod 644 {} \;"

echo "Deployed. Verify: https://nestoryhomekit.com/destek https://www.nestoryhomekit.com/privacy"
