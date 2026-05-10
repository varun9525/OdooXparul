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
  const sqliteParams = params?.map((param) => typeof param === 'boolean' ? (param ? 1 : 0) : param);
  const trimmed = sql.trim().toLowerCase();

  // Modern SQLite supports RETURNING. Run those statements as row-returning
  // queries so API controllers get the same shape as PostgreSQL.
  const hasReturning = /\s+RETURNING\s+/i.test(sql);

  if (trimmed.startsWith('select') || hasReturning) {
    const stmt = sqliteDb.prepare(sql);
    const rows = sqliteParams && sqliteParams.length ? stmt.all(...sqliteParams) : stmt.all();
    return { rows, rowCount: rows.length };
  }

  // For INSERT/UPDATE/DELETE
  const stmt = sqliteDb.prepare(sql);
  const info = sqliteParams && sqliteParams.length ? stmt.run(...sqliteParams) : stmt.run();
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
