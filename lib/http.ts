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

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    let code = 'UNKNOWN';
    let message = 'Request failed';
    try {
      const body = await res.json();
      code = body.code ?? code;
      message = body.message ?? message;
    } catch { /* ignore */ }
    throw new HttpError(res.status, code, message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getCompany: (ico: string) =>
    request<{ company: Company; coords: { lat: number; lng: number } | null }>(
      `/api/company/${ico}`,
    ),

  getSaved: () =>
    request<SavedCompany[]>('/api/saved'),

  save: (ico: string, name: string) =>
    request<SavedCompany>('/api/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ico, name }),
    }),

  remove: (ico: string) =>
    fetch(`/api/saved/${ico}`, { method: 'DELETE' }).then((res) => {
      if (!res.ok) throw new HttpError(res.status, 'NOT_FOUND', 'Delete failed');
      return { ok: true as const };
    }),
};
