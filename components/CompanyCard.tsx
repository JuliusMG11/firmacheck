'use client';

import { useState } from 'react';
import type { Company } from '@/types/company';
import CompanyMap from '@/components/CompanyMap';
import {
  BookmarkIcon, BookmarkFilledIcon, CopyIcon, CheckIcon, PinIcon, ExternalIcon,
} from '@/components/ui/Icons';

interface CompanyCardProps {
  company: Company;
  coords: { lat: number; lng: number } | null;
  isSaved: boolean;
  saving: boolean;
  onSave: (ico: string, name: string) => void;
}

function StatusPill({ active }: { active: boolean }) {
  if (active) return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/70 rounded-full pl-2 pr-2.5 py-1">
      <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot text-emerald-500" />
      Aktivní
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-amber-700 bg-amber-50 border border-amber-200/70 rounded-full pl-2 pr-2.5 py-1">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
      Zaniklá
    </span>
  );
}

function Fact({ label, value, mono, children }: {
  label: string; value?: string | null; mono?: boolean; children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <div className="text-[11.5px] uppercase tracking-[0.08em] text-slate-400 font-medium">{label}</div>
      <div className={`text-[14px] text-slate-900 leading-snug truncate ${mono ? 'num font-medium' : ''}`}>
        {children ?? value ?? <span className="text-slate-300">—</span>}
      </div>
    </div>
  );
}

function fmtDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

function ageInYears(iso: string | null) {
  if (!iso) return null;
  const diff = (Date.now() - new Date(iso).getTime()) / (365.25 * 24 * 3600 * 1000);
  return Math.floor(diff);
}

export default function CompanyCard({ company, coords, isSaved, saving, onSave }: CompanyCardProps) {
  const [copied, setCopied] = useState(false);

  function copyIco() {
    navigator.clipboard.writeText(company.ico).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  const yrs = ageInYears(company.establishedAt);
  const monogram = company.name[0]?.toUpperCase() ?? '?';

  return (
    <article className="bg-white rounded-3xl hairline-strong overflow-hidden fade-up">
      {/* header strip */}
      <div className="px-6 sm:px-8 pt-7 pb-6 border-b border-slate-100">
        <div className="flex items-start gap-4">
          <div
            className="shrink-0 w-12 h-12 rounded-xl text-white flex items-center justify-center font-semibold text-[18px] tracking-tight"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
          >
            {monogram}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <StatusPill active={company.isActive} />
              <span className="text-[12px] text-slate-400">·</span>
              <span className="text-[12px] text-slate-500">{company.legalForm ?? '—'}</span>
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-semibold tracking-tight text-slate-900 leading-tight">
              {company.name}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-slate-500">
              <span>IČO <span className="num font-medium text-slate-800">{company.ico.padStart(8, '0')}</span></span>
              {company.dic && <><span className="w-px h-3 bg-slate-200" /><span className="num">{company.dic}</span></>}
              {yrs !== null && <><span className="w-px h-3 bg-slate-200" /><span>{yrs} let v registru</span></>}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={copyIco}
              className="inline-flex items-center gap-1.5 text-[13px] text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full px-3 py-1.5 transition"
            >
              {copied
                ? <><CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> Zkopírováno</>
                : <><CopyIcon className="w-3.5 h-3.5" /> IČO</>}
            </button>
            {isSaved ? (
              <button
                disabled
                className="inline-flex items-center gap-1.5 text-[13px] rounded-full px-3 py-1.5 bg-accent-soft border border-transparent"
                style={{ color: 'var(--accent-ink)' }}
              >
                <BookmarkFilledIcon className="w-3.5 h-3.5" /> Uloženo
              </button>
            ) : (
              <button
                onClick={() => onSave(company.ico, company.name)}
                disabled={saving}
                className="inline-flex items-center gap-1.5 text-[13px] text-white btn-primary rounded-full px-3 py-1.5 font-medium disabled:opacity-60"
              >
                <BookmarkIcon className="w-3.5 h-3.5" /> Uložit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* facts grid */}
      <div className="px-6 sm:px-8 py-6 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 border-b border-slate-100">
        <Fact label="IČO" value={company.ico.padStart(8, '0')} mono />
        <Fact label="DIČ" value={company.dic} mono />
        <Fact label="Právní forma" value={company.legalForm} />
        <Fact label="Datum vzniku">
          <span className="text-slate-900">{fmtDate(company.establishedAt) ?? '—'}</span>
        </Fact>
        {company.closedAt && (
          <Fact label="Datum zániku">
            <span className="text-slate-900">{fmtDate(company.closedAt)}</span>
          </Fact>
        )}
      </div>

      {/* address + map */}
      <div className="px-6 sm:px-8 py-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center bg-accent-soft">
            <PinIcon className="w-4 h-4 text-accent" style={{ color: 'var(--accent)' }} />
          </div>
          <div className="flex-1">
            <div className="text-[11.5px] uppercase tracking-[0.08em] text-slate-400 font-medium mb-1">Sídlo</div>
            <div className="text-[15px] text-slate-900">{company.address.street ?? company.address.full}</div>
            {company.address.street && (
              <div className="text-[13.5px] text-slate-500">
                {company.address.psc} {company.address.city}
              </div>
            )}
          </div>
          <a
            href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(company.address.full)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[12px] text-slate-400 hover:text-slate-700 shrink-0"
          >
            <ExternalIcon className="w-3.5 h-3.5" />
          </a>
        </div>
        {coords && <CompanyMap coords={coords} label={company.name} />}
      </div>

      {/* footer */}
      <div className="px-6 sm:px-8 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-[12.5px] text-slate-500">
        <span>Zdroj: <span className="text-slate-700">ARES</span> — data z veřejného registru</span>
      </div>
    </article>
  );
}
