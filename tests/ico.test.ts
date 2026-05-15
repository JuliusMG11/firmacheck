import { describe, it, expect } from 'vitest';
import { validateIco } from '@/lib/ico';

describe('validateIco', () => {
  it.each([
    ['27074358', 'Alza'],
    ['00006947', '7-digit padded with leading zero'],
    ['68407700', 'ČVUT'],
  ])('accepts valid IČO %s (%s)', (ico) => {
    expect(validateIco(ico)).toBe(true);
  });

  it.each([
    ['', 'empty string'],
    ['1234567', '7 digits'],
    ['123456789', '9 digits'],
    ['27074359', 'wrong checksum — off by one from Alza'],
    ['abcdefgh', 'letters'],
    ['2707 4358', 'space in middle'],
  ])('rejects invalid IČO %s (%s)', (ico) => {
    expect(validateIco(ico)).toBe(false);
  });
});
