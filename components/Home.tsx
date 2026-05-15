'use client';

import { useState, useEffect, useRef } from 'react';
import type { Company, SavedCompany } from '@/types/company';
import { api, HttpError } from '@/lib/http';
import { validateIco } from '@/lib/ico';
import CompanyCard from '@/components/CompanyCard';
import SavedList from '@/components/SavedList';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import { SearchIcon, ArrowIcon, CheckIcon, LogoIcon } from '@/components/ui/Icons';

const SUGGESTIONS = [
  { ico: '27082440', name: 'Alza.cz' },
  { ico: '00177041', name: 'Škoda Auto' },
  { ico: '24261980', name: 'Kofola' },
  { ico: '26168685', name: 'Seznam.cz' },
];

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; company: Company; coords: { lat: number; lng: number } | null }
  | { status: 'error'; error: { code: string; message: string } };

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl hairline-strong overflow-hidden">
      <div className="px-8 pt-7 pb-6 border-b border-slate-100 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl shimmer shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 shimmer rounded" />
          <div className="h-6 w-2/3 shimmer rounded" />
          <div className="h-3 w-1/2 shimmer rounded" />
        </div>
      </div>
      <div className="px-8 py-6 grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-2.5 w-16 shimmer rounded" />
            <div className="h-4 w-24 shimmer rounded" />
          </div>
        ))}
      </div>
      <div className="px-8 pb-8">
        <div className="h-64 w-full shimmer rounded-2xl" />
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [icoError, setIcoError] = useState<string | undefined>();
  const [state, setState] = useState<SearchState>({ status: 'idle' });
  const [savedCompanies, setSavedCompanies] = useState<SavedCompany[]>([]);
  const [saving, setSaving] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getSaved().then(setSavedCompanies).catch(() => {});
  }, []);

  async function handleSearch(ico: string) {
    const clean = ico.replace(/\D/g, '');
    if (!validateIco(clean)) {
      setIcoError('IČO musí mít 8 číslic a platný kontrolní součet.');
      return;
    }
    setIcoError(undefined);
    setState({ status: 'loading' });
    try {
      const { company, coords } = await api.getCompany(clean);
      setState({ status: 'success', company, coords });
    } catch (e) {
      if (e instanceof HttpError) {
        setState({ status: 'error', error: { code: e.code, message: e.message } });
      } else {
        setState({ status: 'error', error: { code: 'UNKNOWN', message: 'Nastala neočekávaná chyba.' } });
      }
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSearch(query);
  }

  function handleSuggestion(ico: string, name: string) {
    setQuery(ico);
    setIcoError(undefined);
    handleSearch(ico);
    void name;
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

  const isSaved = state.status === 'success' && savedCompanies.some((c) => c.ico === state.company.ico);
  const activeIco = state.status === 'success' ? state.company.ico : null;
  const resultName = state.status === 'loading' ? 'Vyhledávám…'
    : state.status === 'success' ? state.company.name
    : state.status === 'error' ? 'Žádný výsledek'
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid pointer-events-none" />
        <div className="absolute inset-0 hero-glow pointer-events-none" />

        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 pt-14 pb-12 lg:pt-20 lg:pb-16">
          {/* eyebrow */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 text-[12px] text-slate-600 bg-white/70 backdrop-blur border border-slate-200 rounded-full pl-2 pr-3 py-1 hairline">
              <LogoIcon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              Napojeno na oficiální ARES registr
              <ArrowIcon className="w-3 h-3" />
            </span>
          </div>

          {/* heading */}
          <h1 className="text-center text-[44px] sm:text-[56px] lg:text-[68px] leading-[1.02] tracking-[-0.02em] font-semibold text-slate-900">
            Vyhledejte libovolnou<br />
            českou firmu{' '}
            <span className="font-serif italic font-normal" style={{ color: 'var(--accent)' }}>
              okamžitě.
            </span>
          </h1>
          <p className="text-center mt-5 text-[17px] lg:text-[18px] text-slate-500 max-w-xl mx-auto leading-relaxed">
            Zadejte <span className="num text-slate-700 font-medium">IČO</span> a FirmaCheck načte právní formu, adresu, stav a údaje z registru — přímo z veřejných zdrojů.
          </p>

          {/* search */}
          <form onSubmit={handleSubmit} className="mt-9 max-w-[640px] mx-auto">
            <div className={`search-shell rounded-full flex items-center pl-5 pr-1.5 py-1.5 transition ${focused ? 'ring-accent' : ''}`}>
              <SearchIcon className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value.replace(/\D/g, ''));
                  if (icoError) setIcoError(undefined);
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                inputMode="numeric"
                maxLength={8}
                placeholder="Zadejte IČO  např.  27 082 440"
                className="flex-1 bg-transparent outline-none px-3 py-2.5 text-[16px] num placeholder:text-slate-400 text-slate-900"
              />
              <button
                type="submit"
                disabled={state.status === 'loading'}
                className="btn-primary text-white rounded-full px-4 sm:px-5 py-2.5 text-[14px] font-medium inline-flex items-center gap-1.5 shadow-sm disabled:opacity-60 transition"
              >
                Vyhledat <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            {icoError && (
              <p className="mt-2 text-center text-[13px] text-red-600">{icoError}</p>
            )}

            {/* suggestion chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-[12.5px] text-slate-500">
              <span className="mr-1">Zkuste:</span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.ico}
                  type="button"
                  onClick={() => handleSuggestion(s.ico, s.name)}
                  className="num inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition rounded-full px-2.5 py-1 whitespace-nowrap"
                >
                  <span className="text-slate-400 text-[11px]">{s.name}</span>
                  <span className="text-slate-700 font-medium">{s.ico}</span>
                </button>
              ))}
            </div>
          </form>

          {/* trust bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[12.5px] text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> 4,1M firem v registru
            </span>
            <span className="hidden sm:inline w-px h-3 bg-slate-200" />
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> Živá synchronizace s ARES
            </span>
            <span className="hidden sm:inline w-px h-3 bg-slate-200" />
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> Bez registrace, zdarma
            </span>
          </div>
        </div>
      </section>

      {/* Main two-column layout */}
      <main className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-24 pt-4">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left: result */}
          <div className="flex-1 min-w-0">
            {resultName && (
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="text-[11.5px] uppercase tracking-[0.1em] text-slate-400 font-medium">Výsledek</div>
                  <h2 className="text-[18px] font-semibold tracking-tight text-slate-900">{resultName}</h2>
                </div>
                {state.status === 'success' && (
                  <div className="text-[12px] text-slate-500">
                    IČO <span className="num font-medium text-slate-800">{state.company.ico.padStart(8, '0')}</span>
                  </div>
                )}
              </div>
            )}

            {state.status === 'idle' && <EmptyState />}
            {state.status === 'loading' && <SkeletonCard />}
            {state.status === 'success' && (
              <CompanyCard
                company={state.company}
                coords={state.coords}
                isSaved={isSaved}
                saving={saving}
                onSave={handleSave}
              />
            )}
            {state.status === 'error' && (
              <ErrorMessage code={state.error.code} message={state.error.message} />
            )}
          </div>

          {/* Right: sidebar */}
          <SavedList
            companies={savedCompanies}
            activeIco={activeIco}
            onRemove={handleRemove}
            onSelect={handleSelectSaved}
          />
        </div>
      </main>
    </div>
  );
}
