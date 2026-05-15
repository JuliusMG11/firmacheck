import type { Company } from '@/types/company';
import { AppError } from '@/lib/errors';
import { getCachedCompany, setCachedCompany } from '@/lib/db';

const ARES_BASE = 'https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function joinStreet(s: Record<string, unknown> | null | undefined): string | null {
  if (!s?.nazevUlice) return null;
  const parts = [s.nazevUlice as string];
  const dom = s.cisloDomovni;
  const ori = s.cisloOrientacni;
  if (dom != null && ori != null) {
    parts.push(`${dom}/${ori}`);
  } else if (dom != null) {
    parts.push(String(dom));
  } else if (ori != null) {
    parts.push(String(ori));
  }
  return parts.join(' ');
}

export function mapAresToCompany(raw: unknown): Company {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = raw as any;
  const sidlo = r.sidlo ?? null;
  return {
    ico: String(r.ico),
    name: r.obchodniJmeno ?? '—',
    dic: r.dic ?? null,
    legalForm: r.pravniForma ?? null,
    establishedAt: r.datumVzniku ?? null,
    closedAt: r.datumZaniku ?? null,
    address: {
      full: sidlo?.textovaAdresa ?? '',
      street: joinStreet(sidlo),
      city: sidlo?.nazevObce ?? null,
      psc: sidlo?.psc != null ? String(sidlo.psc) : null,
    },
    isActive: !r.datumZaniku,
  };
}

export async function getCompanyByIco(ico: string): Promise<Company> {
  const cached = await getCachedCompany(ico);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  let response: Response;
  try {
    response = await fetch(`${ARES_BASE}/${ico}`, {
      headers: { Accept: 'application/json' },
    });
  } catch {
    throw new AppError('ARES_UNAVAILABLE', 502, 'Registr ARES je momentálně nedostupný.');
  }

  if (response.status === 404) {
    throw new AppError('NOT_FOUND', 404, 'Firma s tímto IČO nebyla nalezena.');
  }
  // 400 is unreachable: IČO is always validated (mod-11) before this function is called
  if (!response.ok) {
    throw new AppError('ARES_UNAVAILABLE', 502, 'Registr ARES vrátil neočekávanou odpověď.');
  }

  const raw = await response.json();
  const company = mapAresToCompany(raw);
  await setCachedCompany(ico, company);
  return company;
}
