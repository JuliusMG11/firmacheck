import type { Company, SavedCompany } from '@/types/company';

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export const api = {
  getCompany: (_ico: string): Promise<Company> => {
    throw new Error('not implemented');
  },
  getSaved: (): Promise<SavedCompany[]> => {
    throw new Error('not implemented');
  },
  save: (_ico: string): Promise<SavedCompany> => {
    throw new Error('not implemented');
  },
  remove: (_ico: string): Promise<{ ok: true }> => {
    throw new Error('not implemented');
  },
};
