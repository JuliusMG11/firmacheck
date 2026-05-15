'use client';

import type { SavedCompany } from '@/types/company';
import Button from '@/components/ui/Button';

interface SavedListProps {
  companies: SavedCompany[];
  onRemove: (ico: string) => void;
}

export default function SavedList({ companies, onRemove }: SavedListProps) {
  if (companies.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Uložené firmy
        </h2>
        <a
          href="/api/export"
          download
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium
            bg-slate-100 text-slate-700 hover:bg-slate-200
            dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Exportovat CSV
        </a>
      </div>
      <ul className="flex flex-col gap-2">
        {companies.map((company) => (
          <li
            key={company.ico}
            className="flex items-center justify-between rounded-lg border border-slate-200
              bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
          >
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {company.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                IČO {company.ico} · uloženo {new Date(company.savedAt).toLocaleDateString('cs-CZ')}
              </p>
            </div>
            <Button
              variant="danger"
              onClick={() => onRemove(company.ico)}
              className="text-xs px-2 py-1"
            >
              Odebrat
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
