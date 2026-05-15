import { describe, it, expect } from 'vitest';
import { mapAresToCompany } from '@/lib/ares';

const sample = {
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

describe('mapAresToCompany', () => {
  it('maps a full payload', () => {
    const company = mapAresToCompany(sample);
    expect(company.ico).toBe('27074358');
    expect(company.name).toBe('Alza.cz a.s.');
    expect(company.dic).toBe('CZ27074358');
    expect(company.legalForm).toBe('121');
    expect(company.establishedAt).toBe('2005-07-26');
    expect(company.closedAt).toBeNull();
    expect(company.isActive).toBe(true);
    expect(company.address.full).toBe('Jankovcova 1522/53, 170 00 Praha 7');
    expect(company.address.street).toBe('Jankovcova 1522/53');
    expect(company.address.city).toBe('Praha');
    expect(company.address.psc).toBe('17000');
  });

  it('marks closed companies as inactive', () => {
    const closed = { ...sample, datumZaniku: '2020-01-01' };
    const company = mapAresToCompany(closed);
    expect(company.isActive).toBe(false);
    expect(company.closedAt).toBe('2020-01-01');
  });

  it('handles missing optional fields', () => {
    const minimal = { ico: '12345678', obchodniJmeno: 'Test s.r.o.' };
    const company = mapAresToCompany(minimal);
    expect(company.ico).toBe('12345678');
    expect(company.name).toBe('Test s.r.o.');
    expect(company.dic).toBeNull();
    expect(company.legalForm).toBeNull();
    expect(company.establishedAt).toBeNull();
    expect(company.closedAt).toBeNull();
    expect(company.isActive).toBe(true);
    expect(company.address.full).toBe('');
    expect(company.address.street).toBeNull();
    expect(company.address.city).toBeNull();
    expect(company.address.psc).toBeNull();
  });
});
