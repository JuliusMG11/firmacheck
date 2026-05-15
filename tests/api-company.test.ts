import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCompanyByIco } from '@/lib/ares';

vi.mock('@/lib/db', () => ({
  getCachedCompany: vi.fn().mockResolvedValue(null),
  setCachedCompany: vi.fn().mockResolvedValue(undefined),
}));

const aresFixture = {
  ico: '27074358',
  obchodniJmeno: 'Alza.cz a.s.',
  sidlo: {
    nazevUlice: 'Jankovcova',
    cisloDomovni: 1522,
    cisloOrientacni: 53,
    nazevObce: 'Praha',
    psc: 17000,
    textovaAdresa: 'Jankovcova 1522/53, 170 00 Praha 7',
  },
  pravniForma: '121',
  datumVzniku: '2005-07-26',
  datumZaniku: null,
  dic: 'CZ27074358',
};

describe('getCompanyByIco', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(aresFixture),
    }));
  });

  it('returns a mapped Company on success', async () => {
    const company = await getCompanyByIco('27074358');
    expect(company.ico).toBe('27074358');
    expect(company.name).toBe('Alza.cz a.s.');
    expect(company.address.street).toBe('Jankovcova 1522/53');
    expect(company.isActive).toBe(true);
  });

  it('throws AppError NOT_FOUND on 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    await expect(getCompanyByIco('00000000')).rejects.toMatchObject({
      code: 'NOT_FOUND',
      status: 404,
    });
  });

  it('throws AppError ARES_UNAVAILABLE on network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    await expect(getCompanyByIco('27074358')).rejects.toMatchObject({
      code: 'ARES_UNAVAILABLE',
      status: 502,
    });
  });
});
