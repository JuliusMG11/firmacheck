import { createClient, type Client } from '@libsql/client';
import type { Company, SavedCompany } from '@/types/company';

const url = process.env.TURSO_DATABASE_URL ?? 'file:./data/firmacheck.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db: Client = authToken
  ? createClient({ url, authToken })
  : createClient({ url });

let initialized = false;

async function ensureInit(): Promise<void> {
  if (initialized) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS companies_cache (
      ico       TEXT PRIMARY KEY,
      data      TEXT NOT NULL,
      fetched_at INTEGER NOT NULL
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS saved_companies (
      ico      TEXT PRIMARY KEY,
      name     TEXT NOT NULL,
      saved_at TEXT NOT NULL
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS geocode_cache (
      query      TEXT PRIMARY KEY,
      lat        REAL NOT NULL,
      lng        REAL NOT NULL,
      fetched_at INTEGER NOT NULL
    )
  `);
  initialized = true;
}

export type CachedCompany = { data: Company; fetchedAt: number };

export async function getCachedCompany(
  ico: string,
): Promise<CachedCompany | null> {
  await ensureInit();
  const result = await db.execute({
    sql: 'SELECT data, fetched_at FROM companies_cache WHERE ico = ?',
    args: [ico],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    data: JSON.parse(row.data as string) as Company,
    fetchedAt: row.fetched_at as number,
  };
}

export async function setCachedCompany(
  ico: string,
  data: Company,
): Promise<void> {
  await ensureInit();
  await db.execute({
    sql: 'INSERT OR REPLACE INTO companies_cache (ico, data, fetched_at) VALUES (?, ?, ?)',
    args: [ico, JSON.stringify(data), Date.now()],
  });
}

export async function getSavedCompanies(): Promise<SavedCompany[]> {
  await ensureInit();
  const result = await db.execute(
    'SELECT ico, name, saved_at FROM saved_companies ORDER BY saved_at DESC',
  );
  return result.rows.map((row) => ({
    ico: row.ico as string,
    name: row.name as string,
    savedAt: row.saved_at as string,
  }));
}

export async function saveCompany(
  ico: string,
  name: string,
): Promise<SavedCompany> {
  await ensureInit();
  const savedAt = new Date().toISOString();
  await db.execute({
    sql: 'INSERT OR IGNORE INTO saved_companies (ico, name, saved_at) VALUES (?, ?, ?)',
    args: [ico, name, savedAt],
  });
  const result = await db.execute({
    sql: 'SELECT ico, name, saved_at FROM saved_companies WHERE ico = ?',
    args: [ico],
  });
  const row = result.rows[0];
  return {
    ico: row.ico as string,
    name: row.name as string,
    savedAt: row.saved_at as string,
  };
}

export async function deleteCompany(ico: string): Promise<boolean> {
  await ensureInit();
  const result = await db.execute({
    sql: 'DELETE FROM saved_companies WHERE ico = ?',
    args: [ico],
  });
  return (result.rowsAffected ?? 0) > 0;
}

export async function getCachedGeocode(
  query: string,
): Promise<{ lat: number; lng: number } | null> {
  await ensureInit();
  const result = await db.execute({
    sql: 'SELECT lat, lng FROM geocode_cache WHERE query = ?',
    args: [query],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return { lat: row.lat as number, lng: row.lng as number };
}

export async function setCachedGeocode(
  query: string,
  lat: number,
  lng: number,
): Promise<void> {
  await ensureInit();
  await db.execute({
    sql: 'INSERT OR REPLACE INTO geocode_cache (query, lat, lng, fetched_at) VALUES (?, ?, ?, ?)',
    args: [query, lat, lng, Date.now()],
  });
}
