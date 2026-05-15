import { NextResponse } from 'next/server';
import { validateIco } from '@/lib/ico';
import { getCompanyByIco } from '@/lib/ares';
import { geocode } from '@/lib/geocode';
import { AppError } from '@/lib/errors';

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ ico: string }> },
) {
  try {
    const { ico } = await ctx.params;

    if (!validateIco(ico)) {
      return NextResponse.json(
        { code: 'INVALID_ICO', message: 'IČO musí mít 8 číslic a platný kontrolní součet.' },
        { status: 400 },
      );
    }

    const company = await getCompanyByIco(ico);
    const coords = await geocode(company.address.full);

    return NextResponse.json({ company, coords });
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ code: e.code, message: e.message }, { status: e.status });
    }
    return NextResponse.json({ code: 'UNKNOWN', message: 'Internal error' }, { status: 500 });
  }
}
