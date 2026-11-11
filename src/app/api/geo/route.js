import { NextResponse } from 'next/server';
import { clientIp, rateLimit, tooMany } from '@/lib/api';
import { visitorCountry } from '@/lib/geo';

/** { country: "UZ" } for the visitor's IP address ("" when unknown): the register form preselects it. */
export async function GET(req) {
  if (!rateLimit(`geo:${clientIp(req)}`, 30, 60_000)) return tooMany();
  const country = await visitorCountry(req);
  return NextResponse.json({ country }, { headers: { 'Cache-Control': 'private, no-store' } });
}
