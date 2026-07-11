#!/usr/bin/env bash
# Builds Nestory-Web and deploys the static export to the VPS.
# Connection details live in deploy/config.sh (gitignored, not in the repo)
# — see deploy/config.sh.example for the expected variables.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f deploy/config.sh ]; then
  echo "Missing deploy/config.sh — copy deploy/config.sh.example and fill in real values." >&2
  exit 1
fi
# shellcheck source=/dev/null
source deploy/config.sh

npm run build

cp deploy/htaccess out/.htaccess

rsync -avz --delete \
  -e "ssh -i $VPS_KEY" \
  out/ "$VPS_HOST:$REMOTE_ROOT/"

ssh -i "$VPS_KEY" "$VPS_HOST" "chown -R $SITE_USER:$SITE_USER $REMOTE_ROOT && find $REMOTE_ROOT -type d -exec chmod 755 {} \; && find $REMOTE_ROOT -type f -exec chmod 644 {} \;"

echo "Deployed. Verify: https://nestoryhomekit.com/destek https://www.nestoryhomekit.com/privacy"
