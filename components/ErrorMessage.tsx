interface ErrorMessageProps {
  code: string;
  message: string;
}

const codeLabels: Record<string, string> = {
  INVALID_ICO: 'Neplatné IČO',
  NOT_FOUND: 'Firma nenalezena',
  ARES_UNAVAILABLE: 'Registr ARES nedostupný',
  NETWORK: 'Chyba sítě',
};

export default function ErrorMessage({ code, message }: ErrorMessageProps) {
  const label = codeLabels[code] ?? 'Chyba';
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <p className="text-sm font-medium text-red-800 dark:text-red-400">{label}</p>
      <p className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p>
    </div>
  );
}
