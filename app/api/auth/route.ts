import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'GET /api/auth' });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  return NextResponse.json({ message: 'POST /api/auth', body });
}
