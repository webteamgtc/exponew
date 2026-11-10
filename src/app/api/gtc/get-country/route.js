import { NextResponse } from 'next/server';
import { clientIp, portalPost, rateLimit, tooMany } from '@/lib/api';

export async function POST(req) {
  if (!rateLimit(`country:${clientIp(req)}`, 30, 60_000)) return tooMany();
  const { data, status } = await portalPost('get_country');
  return NextResponse.json(data, { status });
}
