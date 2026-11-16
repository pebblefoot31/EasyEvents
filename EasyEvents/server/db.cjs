const Database = require("better-sqlite3");
const fs = require("node:fs");
const path = require("node:path");

function readSqlFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readSeedSqlFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");

  const lines = raw.split(/\r?\n/);
  const keptLines = [];
  let insideTestSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("-- TEST QUERIES")) {
      insideTestSection = true;
    }

    if (insideTestSection) {
      continue;
    }

    // SQLite CLI meta-commands (ex: .mode box) are not valid SQL.
    if (trimmed.startsWith(".")) {
      continue;
    }

    keptLines.push(line);
  }

  return keptLines.join("\n");
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function schemaLooksInitialized(db) {
  const requiredTables = [
    "Venue",
    "Events",
    "Vendors",
    "Applications",
    "Registration"
  ];

  return requiredTables.every(tableName => {
    const row = db
      .prepare(
        `SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?`
      )
      .get(tableName);

    return Boolean(row);
  });
}

function shouldSeedSampleData(db) {
  const venues = db
    .prepare("SELECT COUNT(*) AS count FROM Venue")
    .get().count;

  return venues === 0;
}

const schemaPath = path.join(__dirname, "sql", "schema.sql");
const seedPath = path.join(__dirname, "sql", "insert_data.sql");

const databasePath =
  process.env.DATABASE_PATH ||
  path.join(__dirname, "data", "events.db");

ensureDirectory(path.dirname(databasePath));

const db = new Database(databasePath);
db.pragma("foreign_keys = ON");

// Initialize the main application schema from schema.sql.
// Only runs on first boot so we don't wipe an existing DB.
if (!schemaLooksInitialized(db)) {
  db.exec(readSqlFile(schemaPath));
}

// Load sample data (without SQLite CLI-only commands or test queries).
if (schemaLooksInitialized(db) && shouldSeedSampleData(db)) {
  db.exec(readSeedSqlFile(seedPath));
}

// Additional table for dashboard tasks.
// Doesn't modify your existing event-management tables.
db.exec(`
  CREATE TABLE IF NOT EXISTS dashboard_tasks (
    TaskID INTEGER PRIMARY KEY AUTOINCREMENT,
    Description TEXT NOT NULL,
    IsCompleted INTEGER NOT NULL DEFAULT 0
  );
`);

module.exports = db;
