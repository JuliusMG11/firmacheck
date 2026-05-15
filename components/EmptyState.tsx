export default function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-600">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Zadejte IČO a vyhledejte firmu
      </p>
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
        IČO je osmimístný identifikátor firmy (např. 27074358)
      </p>
    </div>
  );
}
