#!/usr/bin/env bash
set -euo pipefail

ENV="${1:-prod}"
ENV_FILE=".env.${ENV}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "No $ENV_FILE found. Usage: ./scripts/db-backup.sh [prod|staging|local]"
  exit 1
fi

DATABASE_URL=$(grep '^DATABASE_URL=' "$ENV_FILE" | head -1 | cut -d'=' -f2- | tr -d '"'"'")

if [[ -z "$DATABASE_URL" ]]; then
  echo "DATABASE_URL not found in $ENV_FILE"
  exit 1
fi

BACKUP_DIR="backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
FILENAME="${BACKUP_DIR}/${ENV}-${TIMESTAMP}.sql.gz"

echo "Backing up $ENV database..."
PG_DUMP="${PG_DUMP:-/opt/homebrew/opt/libpq/bin/pg_dump}"
"$PG_DUMP" "$DATABASE_URL" --no-owner --no-acl | gzip > "$FILENAME"

SIZE=$(du -h "$FILENAME" | cut -f1)
echo "Done: $FILENAME ($SIZE)"

# Keep last 30 backups per environment, delete older ones
ls -t "${BACKUP_DIR}/${ENV}-"*.sql.gz 2>/dev/null | tail -n +31 | xargs rm -f 2>/dev/null || true
