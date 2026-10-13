import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ authenticated: true, user: { role: 'INSTITUTION_ADMIN' } });
}
