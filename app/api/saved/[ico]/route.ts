import { NextResponse } from 'next/server';
import { validateIco } from '@/lib/ico';
import { deleteCompany } from '@/lib/db';
import { AppError } from '@/lib/errors';

export async function DELETE(
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

    const deleted = await deleteCompany(ico);
    if (!deleted) {
      return NextResponse.json(
        { code: 'NOT_FOUND', message: 'Firma nebyla nalezena v uložených.' },
        { status: 404 },
      );
    }

    return new Response(null, { status: 204 });
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ code: e.code, message: e.message }, { status: e.status });
    }
    return NextResponse.json({ code: 'UNKNOWN', message: 'Internal error' }, { status: 500 });
  }
}
