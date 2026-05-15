import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  _ctx: { params: Promise<{ ico: string }> },
) {
  return NextResponse.json({ todo: true }, { status: 501 });
}
