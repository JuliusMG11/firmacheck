import { NextResponse } from 'next/server';
import { validateIco } from '@/lib/ico';
import { getSavedCompanies, saveCompany } from '@/lib/db';
import { AppError } from '@/lib/errors';

export async function GET() {
  try {
    const companies = await getSavedCompanies();
    return NextResponse.json(companies);
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ code: e.code, message: e.message }, { status: e.status });
    }
    return NextResponse.json({ code: 'UNKNOWN', message: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { code: 'INVALID_ICO', message: 'Request body must be valid JSON.' },
        { status: 400 },
      );
    }

    const { ico, name } = body as Record<string, unknown>;

    if (typeof ico !== 'string' || typeof name !== 'string') {
      return NextResponse.json(
        { code: 'INVALID_ICO', message: 'ico and name are required strings.' },
        { status: 400 },
      );
    }

    if (!validateIco(ico)) {
      return NextResponse.json(
        { code: 'INVALID_ICO', message: 'IČO musí mít 8 číslic a platný kontrolní součet.' },
        { status: 400 },
      );
    }

    const saved = await saveCompany(ico, name);
    return NextResponse.json(saved, { status: 201 });
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ code: e.code, message: e.message }, { status: e.status });
    }
    return NextResponse.json({ code: 'UNKNOWN', message: 'Internal error' }, { status: 500 });
  }
}
