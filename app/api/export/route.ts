import { getSavedCompanies } from '@/lib/db';
import { toCsv } from '@/lib/csv';

export async function GET() {
  try {
    const companies = await getSavedCompanies();
    const rows = companies.map((c) => ({
      ico: c.ico,
      name: c.name,
      savedAt: c.savedAt,
    }));
    const csv = toCsv(['ico', 'name', 'savedAt'], rows);
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
