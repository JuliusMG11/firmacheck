import { BuildingIcon } from '@/components/ui/Icons';

export default function EmptyState() {
  return (
    <div className="bg-white rounded-3xl hairline px-8 py-16 text-center">
      <div className="mx-auto w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
        <BuildingIcon className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-[18px] font-semibold tracking-tight text-slate-900">Začněte s IČO</h3>
      <p className="mt-2 text-[14px] text-slate-500 max-w-sm mx-auto">
        Zadejte osmimístné IČO české firmy. Výsledky se zobrazí zde včetně mapy a informací z registru.
      </p>
    </div>
  );
}
