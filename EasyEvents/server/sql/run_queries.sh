#!/bin/bash

set -e

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

DB_DIR="$SERVER_DIR/data"
DB="$DB_DIR/events.db"

echo "Recreating database at: $DB"

mkdir -p "$DB_DIR"
rm -f "$DB"

sqlite3 "$DB" < "$SCRIPT_DIR/schema.sql"
sqlite3 "$DB" < "$SCRIPT_DIR/insert_data.sql"

echo
echo "Running queries..."

sqlite3 -header -column "$DB" < "$SCRIPT_DIR/queries.sql"

echo
echo "Running transaction..."

sqlite3 -bail "$DB" < "$SCRIPT_DIR/transaction.sql"

echo
echo "Done."

