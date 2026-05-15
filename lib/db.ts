import type { Company } from '@/types/company';

export type CachedCompany = { data: Company; fetchedAt: number };

export async function getCachedCompany(
  _ico: string,
): Promise<CachedCompany | null> {
  throw new Error('not implemented');
}

export async function setCachedCompany(
  _ico: string,
  _data: Company,
): Promise<void> {
  throw new Error('not implemented');
}

export async function getSavedCompanies(): Promise<
  { ico: string; name: string; savedAt: string }[]
> {
  throw new Error('not implemented');
}

export async function saveCompany(
  _ico: string,
  _name: string,
): Promise<{ ico: string; name: string; savedAt: string }> {
  throw new Error('not implemented');
}

export async function deleteCompany(_ico: string): Promise<boolean> {
  throw new Error('not implemented');
}

export async function getCachedGeocode(
  _query: string,
): Promise<{ lat: number; lng: number } | null> {
  throw new Error('not implemented');
}

export async function setCachedGeocode(
  _query: string,
  _lat: number,
  _lng: number,
): Promise<void> {
  throw new Error('not implemented');
}
