'use client';

import { useState, useEffect } from 'react';
import type { Company, SavedCompany } from '@/types/company';
import { api, HttpError } from '@/lib/http';
import SearchBar from '@/components/SearchBar';
import CompanyCard from '@/components/CompanyCard';
import CompanyMap from '@/components/CompanyMap';
import SavedList from '@/components/SavedList';
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
  const [savedCompanies, setSavedCompanies] = useState<SavedCompany[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSaved().then(setSavedCompanies).catch(() => {});
  }, []);

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

  async function handleSave(ico: string, name: string) {
    setSaving(true);
    try {
      const saved = await api.save(ico, name);
      setSavedCompanies((prev) =>
        prev.some((c) => c.ico === saved.ico) ? prev : [saved, ...prev],
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(ico: string) {
    await api.remove(ico);
    setSavedCompanies((prev) => prev.filter((c) => c.ico !== ico));
  }

  const isSaved =
    state.status === 'success' &&
    savedCompanies.some((c) => c.ico === state.company.ico);

  async function handleSelectSaved(ico: string) {
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
      <div className="bg-linear-to-b from-slate-50 to-white px-4 pt-16 pb-10 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          FirmaCheck
        </h1>
        <p className="mt-4 text-lg text-slate-500 max-w-md mx-auto">
          Vyhledejte libovolnou firmu v registru ARES podle IČO
        </p>
        <div className="mt-8 max-w-lg mx-auto">
          <SearchBar onSearch={handleSearch} loading={state.status === 'loading'} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8 items-start">
        <div className="flex-1 min-w-0">
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
              <CompanyCard
                company={state.company}
                isSaved={isSaved}
                saving={saving}
                onSave={handleSave}
              />
              {state.coords && (
                <div className="mt-4">
                  <CompanyMap coords={state.coords} label={state.company.name} />
                </div>
              )}
            </>
          )}

          {state.status === 'error' && (
            <ErrorMessage code={state.error.code} message={state.error.message} />
          )}
        </div>

        <div className="w-72 shrink-0">
          <SavedList
            companies={savedCompanies}
            onRemove={handleRemove}
            onSelect={handleSelectSaved}
          />
        </div>
      </div>
    </div>
  );
}
