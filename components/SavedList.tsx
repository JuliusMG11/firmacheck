'use client';

import type { SavedCompany } from '@/types/company';

interface SavedListProps {
  companies: SavedCompany[];
  onRemove: (ico: string) => void;
  onSelect: (ico: string) => void;
}

export default function SavedList({ companies, onRemove, onSelect }: SavedListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-700">Uložené firmy</h2>
        {companies.length > 0 && (
          <a
            href="/api/export"
            download
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            Exportovat CSV
          </a>
        )}
      </div>

      {companies.length === 0 && (
        <p className="text-xs text-slate-400">Zatím žádné uložené firmy.</p>
      )}

      <ul className="flex flex-col gap-2">
        {companies.map((company) => (
          <li key={company.ico} className="relative group">
            <button
              onClick={() => onSelect(company.ico)}
              className="w-full text-left rounded-xl border border-slate-200 bg-white px-4 py-3
                hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <p className="text-sm font-medium text-slate-800 pr-5 truncate">
                {company.name}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                IČO {company.ico}
              </p>
            </button>
            <button
              onClick={() => onRemove(company.ico)}
              className="absolute top-2 right-2 h-5 w-5 flex items-center justify-center
                rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50
                opacity-0 group-hover:opacity-100 transition-all text-xs"
              aria-label="Odebrat"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
