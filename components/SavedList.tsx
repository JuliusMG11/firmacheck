'use client';

import type { SavedCompany } from '@/types/company';
import { BookmarkIcon, DownloadIcon, XIcon } from '@/components/ui/Icons';

interface SavedListProps {
  companies: SavedCompany[];
  activeIco: string | null;
  onRemove: (ico: string) => void;
  onSelect: (ico: string) => void;
}

export default function SavedList({ companies, activeIco, onRemove, onSelect }: SavedListProps) {
  return (
    <aside className="w-full lg:w-75 shrink-0">
      <div className="sticky top-6">
        <div className="bg-white rounded-3xl hairline overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-semibold tracking-tight text-slate-900">Uložené firmy</h3>
              <span className="num text-[11px] font-medium text-slate-500 bg-slate-100 rounded-full px-1.5 py-0.5">
                {companies.length}
              </span>
            </div>
            <a
              href="/api/export"
              download
              className={`inline-flex items-center gap-1 text-[12px] text-slate-600 hover:text-slate-900 transition ${companies.length === 0 ? 'pointer-events-none opacity-40' : ''}`}
              aria-disabled={companies.length === 0}
            >
              <DownloadIcon className="w-3.5 h-3.5" /> CSV
            </a>
          </div>

          <div className="px-5 pb-3 text-[12px] text-slate-500 leading-snug">
            Váš seznam. Klikněte na kartu pro zobrazení detailu.
          </div>

          <div className="px-3 pb-3 max-h-130 overflow-y-auto nice-scroll">
            {companies.length === 0 ? (
              <div className="text-center py-8 px-3">
                <div className="mx-auto w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center mb-3">
                  <BookmarkIcon className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-[13px] text-slate-700 font-medium">Zatím nic uloženo</div>
                <div className="text-[12px] text-slate-500 mt-1">Vyhledejte IČO a klikněte Uložit.</div>
              </div>
            ) : (
              <ul className="flex flex-col gap-1">
                {companies.map((company) => {
                  const active = activeIco === company.ico;
                  return (
                    <li key={company.ico}>
                      <button
                        onClick={() => onSelect(company.ico)}
                        className={`group w-full text-left rounded-xl px-3 py-2.5 transition flex items-center gap-3 border ${
                          active ? 'border-transparent' : 'bg-white border-transparent hover:bg-slate-50'
                        }`}
                        style={active ? { background: 'var(--accent-soft)' } : undefined}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-[13px] font-semibold ${
                            active ? 'text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                          style={active ? { background: 'var(--accent)' } : undefined}
                        >
                          {company.name[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13.5px] font-medium text-slate-900 truncate">{company.name}</div>
                          <div className="text-[12px] text-slate-500 num">IČO {company.ico.padStart(8, '0')}</div>
                        </div>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); onRemove(company.ico); }}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onRemove(company.ico); } }}
                          className="opacity-0 group-hover:opacity-100 transition w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white shrink-0"
                          aria-label="Odebrat"
                        >
                          <XIcon className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
