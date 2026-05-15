import type { Company } from '@/types/company';

export async function getCompanyByIco(_ico: string): Promise<Company> {
  throw new Error('not implemented');
}

export function mapAresToCompany(_raw: unknown): Company {
  throw new Error('not implemented');
}
