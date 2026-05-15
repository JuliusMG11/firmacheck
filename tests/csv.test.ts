import { describe, it, expect } from 'vitest';
import { toCsv } from '@/lib/csv';

describe('toCsv', () => {
  it('emits a header row and data rows', () => {
    const out = toCsv(
      ['ico', 'name'],
      [{ ico: '27074358', name: 'Alza' }],
    );
    expect(out).toBe('ico,name\r\n27074358,Alza\r\n');
  });

  it('escapes quotes by doubling them', () => {
    const out = toCsv(['name'], [{ name: 'Quoted "name"' }]);
    expect(out).toBe('name\r\n"Quoted ""name"""\r\n');
  });

  it('wraps fields that contain a comma', () => {
    const out = toCsv(['name'], [{ name: 'Smith, John' }]);
    expect(out).toBe('name\r\n"Smith, John"\r\n');
  });

  it('wraps fields that contain a newline', () => {
    const out = toCsv(['name'], [{ name: 'line1\nline2' }]);
    expect(out).toBe('name\r\n"line1\nline2"\r\n');
  });

  it('wraps fields that contain a carriage return', () => {
    const out = toCsv(['name'], [{ name: 'line1\rline2' }]);
    expect(out).toBe('name\r\n"line1\rline2"\r\n');
  });

  it('handles an empty rows array', () => {
    const out = toCsv(['ico', 'name'], []);
    expect(out).toBe('ico,name\r\n');
  });
});
