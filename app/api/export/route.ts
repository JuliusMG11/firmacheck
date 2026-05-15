import { getSavedCompanies, getCachedCompany } from '@/lib/db';
import { toCsv } from '@/lib/csv';

const HEADERS = ['IČO', 'Název', 'DIČ', 'Právní forma', 'Datum vzniku', 'Datum zániku', 'Adresa', 'Uloženo'];

export async function GET() {
  try {
    const saved = await getSavedCompanies();

    const rows = await Promise.all(
      saved.map(async (s) => {
        const cached = await getCachedCompany(s.ico);
        const c = cached?.data;
        return {
          'IČO': s.ico,
          'Název': s.name,
          'DIČ': c?.dic ?? '',
          'Právní forma': c?.legalForm ?? '',
          'Datum vzniku': c?.establishedAt ?? '',
          'Datum zániku': c?.closedAt ?? '',
          'Adresa': c?.address.full ?? '',
          'Uloženo': s.savedAt,
        };
      }),
    );

    const csv = toCsv(HEADERS, rows);
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="firmacheck.csv"',
      },
    });
  } catch {
    return new Response('Internal error', { status: 500 });
  }
}
