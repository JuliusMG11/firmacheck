import { getCachedGeocode, setCachedGeocode } from '@/lib/db';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export async function geocode(
  query: string,
): Promise<{ lat: number; lng: number } | null> {
  const cached = await getCachedGeocode(query);
  if (cached) return cached;

  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=cz`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': 'FirmaCheck/1.0 (juliuspetrik.mg@gmail.com)' },
    });
  } catch {
    return null;
  }

  if (!response.ok) return null;

  let results: unknown[];
  try {
    results = await response.json();
  } catch {
    return null;
  }

  if (!Array.isArray(results) || results.length === 0) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const first = results[0] as any;
  const lat = Number(first.lat);
  const lng = Number(first.lon);

  if (isNaN(lat) || isNaN(lng)) return null;

  await setCachedGeocode(query, lat, lng);
  return { lat, lng };
}
