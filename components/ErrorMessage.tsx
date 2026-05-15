import { SearchIcon, AlertIcon } from '@/components/ui/Icons';

interface ErrorMessageProps {
  code: string;
  message: string;
}

const NOT_FOUND_CODES = new Set(['NOT_FOUND', 'INVALID_ICO']);

export default function ErrorMessage({ code, message }: ErrorMessageProps) {
  const isNotFound = NOT_FOUND_CODES.has(code);

  return (
    <div className="bg-white rounded-3xl hairline px-8 py-12 text-center fade-up">
      <div className={`mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isNotFound ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
        {isNotFound
          ? <SearchIcon className="w-5 h-5 text-amber-600" />
          : <AlertIcon className="w-5 h-5 text-red-600" />}
      </div>
      <h3 className="text-[18px] font-semibold tracking-tight text-slate-900">
        {code === 'NOT_FOUND' ? 'Firma nebyla nalezena' :
         code === 'INVALID_ICO' ? 'Neplatné IČO' :
         code === 'ARES_UNAVAILABLE' ? 'ARES nedostupný' : 'Nastala chyba'}
      </h3>
      <p className="mt-2 text-[14px] text-slate-500 max-w-sm mx-auto">{message}</p>
    </div>
  );
}
