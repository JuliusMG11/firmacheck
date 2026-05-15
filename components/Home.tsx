'use client';

import { useState } from 'react';
import type { Company } from '@/types/company';
import { api, HttpError } from '@/lib/http';
import SearchBar from '@/components/SearchBar';
import CompanyCard from '@/components/CompanyCard';
import CompanyMap from '@/components/CompanyMap';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import Skeleton from '@/components/ui/Skeleton';

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; company: Company; coords: { lat: number; lng: number } | null }
  | { status: 'error'; error: { code: string; message: string } };

export default function Home() {
  const [state, setState] = useState<SearchState>({ status: 'idle' });

  async function handleSearch(ico: string) {
    setState({ status: 'loading' });
    try {
      const { company, coords } = await api.getCompany(ico);
      setState({ status: 'success', company, coords });
    } catch (e) {
      if (e instanceof HttpError) {
        setState({ status: 'error', error: { code: e.code, message: e.message } });
      } else {
        setState({ status: 'error', error: { code: 'UNKNOWN', message: 'Nastala neočekávaná chyba.' } });
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-linear-to-b from-slate-50 to-white px-4 pt-24 pb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          FirmaCheck
        </h1>
        <p className="mt-4 text-lg text-slate-500 max-w-md mx-auto">
          Vyhledejte libovolnou firmu v registru ARES podle IČO
        </p>
        <div className="mt-10 max-w-lg mx-auto">
          <SearchBar onSearch={handleSearch} loading={state.status === 'loading'} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {state.status === 'idle' && <EmptyState />}

        {state.status === 'loading' && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}

        {state.status === 'success' && (
          <>
            <CompanyCard company={state.company} />
            {state.coords && (
              <div className="mt-4">
                <CompanyMap coords={state.coords} label={state.company.name} />
              </div>
            )}
            <p className="mt-4 text-sm text-slate-400">
              Uložení firem bude dostupné v plné verzi.
            </p>
          </>
        )}

        {state.status === 'error' && (
          <ErrorMessage code={state.error.code} message={state.error.message} />
        )}
      </div>
    </div>
  );
}
