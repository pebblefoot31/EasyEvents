```bash
#!/bin/bash

set -e  # Stop if any command fails

DB="events.db"

echo "Creating database schema..."
sqlite3 "$DB" < schema.sql

echo "Inserting data..."
sqlite3 "$DB" < insert_data.sql

echo "Running queries..."
sqlite3 -header -column "$DB" < queries.sql

echo "All SQL scripts executed successfully!"
```
