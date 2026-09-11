#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
TARGET="${1:-}"
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then echo "ERROR: repository metadata is unavailable."; exit 1; fi
CURRENT="$(git rev-parse HEAD)"
echo "Current commit: $CURRENT"
node scripts/recovery/backup-system.mjs
if [[ -n "$TARGET" ]]; then
  git fetch --all --tags --prune || true
  git checkout --detach "$TARGET"
  echo "Checked out recovery commit: $(git rev-parse HEAD)"
fi
if [[ -f docker-compose.yml ]] && command -v docker >/dev/null 2>&1; then
  docker compose build
  docker compose up -d
elif command -v pm2 >/dev/null 2>&1; then
  npm install --prefix backend --omit=dev
  npm install --prefix frontend
  npm run build --prefix frontend
  pm2 restart spandana-api || pm2 start ecosystem.config.json --env production
  pm2 save
else
  echo "No Docker or PM2 detected. Rebuild with npm run build and restart the Node process using your hosting provider."
fi
curl -fsS http://127.0.0.1:5000/api/health || true
echo "Recovery deployment completed."
