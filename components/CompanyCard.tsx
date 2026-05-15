import type { Company } from '@/types/company';
import Badge from '@/components/ui/Badge';

interface CompanyCardProps {
  company: Company;
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-32 shrink-0 text-slate-500">{label}</span>
      <span className="text-slate-800">{value}</span>
    </div>
  );
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="flex items-start justify-between gap-3 mb-5">
        <h2 className="text-xl font-semibold text-slate-900">
          {company.name}
        </h2>
        <Badge active={company.isActive} />
      </div>
      <div className="flex flex-col gap-2">
        <Row label="IČO" value={company.ico} />
        <Row label="DIČ" value={company.dic} />
        <Row label="Právní forma" value={company.legalForm} />
        <Row label="Datum vzniku" value={company.establishedAt} />
        {company.closedAt && <Row label="Datum zániku" value={company.closedAt} />}
        <Row label="Adresa" value={company.address.full} />
      </div>
    </div>
  );
}
