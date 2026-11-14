import { NextResponse } from 'next/server';
import { clientIp, portalPost, rateLimit, tooMany } from '@/lib/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req) {
  if (!rateLimit(`check:${clientIp(req)}`, 20, 60_000)) return tooMany();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ code: 400, message: 'Invalid request', data: [] }, { status: 400 });
  }
  const email = String(body?.email ?? '').trim().slice(0, 160);
  if (!EMAIL_RE.test(email)) return NextResponse.json({ code: 400, message: 'Invalid email', data: [] }, { status: 400 });

  // only the email is forwarded, never the rest of the request body
  const { data, status } = await portalPost('check_email', { email }, clientIp(req));
  return NextResponse.json(data, { status });
}
