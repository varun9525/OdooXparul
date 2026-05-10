import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

type QueryResult = {
  rows: any[];
  rowCount?: number | null;
};

let useSqlite = false;
let pgPool: pg.Pool | null = null;
let sqliteDb: Database.Database | null = null;

const SQLITE_FILE = path.resolve(process.cwd(), 'backend.sqlite');

async function tryConnectPostgres(): Promise<boolean> {
  try {
    pgPool = new pg.Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'traveloop',
    });
    // Try a simple query
    await pgPool.query('SELECT 1');
    return true;
  } catch (err) {
    pgPool = null;
    return false;
  }
}

function initSqlite() {
  // ensure dir exists
  const dir = path.dirname(SQLITE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  sqliteDb = new Database(SQLITE_FILE);
  // Enable foreign keys
  sqliteDb.pragma('foreign_keys = ON');
}

// Convert $1, $2 style params to ? placeholders for sqlite
function convertSqliteQuery(sql: string) {
  return sql.replace(/\$\d+/g, '?');
}

async function query(text: string, params?: any[]): Promise<QueryResult> {
  if (!useSqlite && pgPool) {
    const res = await pgPool.query(text, params);
    return { rows: res.rows, rowCount: res.rowCount };
  }

  if (!sqliteDb) throw new Error('SQLite DB not initialized');

  let sql = convertSqliteQuery(text);
  const trimmed = sql.trim().toLowerCase();

  // Handle RETURNING clause for SQLite (not natively supported)
  const hasReturning = /\s+RETURNING\s+/i.test(sql);
  let baseSql = sql;
  let returningCols: string[] = [];

  if (hasReturning) {
    const match = sql.match(/(.+?)\s+RETURNING\s+(.+?)(?:;|$)/i);
    if (match) {
      baseSql = match[1];
      returningCols = match[2].split(',').map(col => col.trim()).filter(col => col);
    }
  }

  if (trimmed.startsWith('select')) {
    const stmt = sqliteDb.prepare(sql);
    const rows = params && params.length ? stmt.all(...params) : stmt.all();
    return { rows, rowCount: rows.length };
  }

  // For INSERT/UPDATE/DELETE
  const stmt = sqliteDb.prepare(baseSql);
  const info = params && params.length ? stmt.run(...params) : stmt.run();

  // If there was a RETURNING clause and it's an INSERT, fetch the inserted row
  if (hasReturning && info.changes > 0) {
    try {
      // Try to determine the table and ID from the query
      const insertMatch = baseSql.match(/INSERT\s+INTO\s+(\w+)\s*\(/i);
      const updateMatch = baseSql.match(/UPDATE\s+(\w+)/i);
      
      let tableName = insertMatch?.[1] || updateMatch?.[1];
      if (!tableName) return { rows: [], rowCount: info.changes };

      // Get the ID from parameters (usually first param for INSERT, last for UPDATE/DELETE)
      const idParam = params?.[0];
      if (idParam) {
        const cols = returningCols.join(', ') || '*';
        const selectSql = `SELECT ${cols} FROM ${tableName} WHERE id = ?`;
        const selectStmt = sqliteDb.prepare(selectSql);
        const rows = selectStmt.all(idParam);
        return { rows, rowCount: info.changes };
      }
    } catch (e) {
      // If fetch fails, still return success with no rows
    }
  }

  return { rows: [], rowCount: info.changes };
}

async function initialize() {
  const ok = await tryConnectPostgres();
  if (!ok) {
    useSqlite = true;
    initSqlite();
    console.warn('Postgres not available — using SQLite fallback at', SQLITE_FILE);
  } else {
    console.log('Connected to PostgreSQL');
  }
}

export default {
  initialize,
  query,
  get isSqlite() {
    return useSqlite;
  },
};
