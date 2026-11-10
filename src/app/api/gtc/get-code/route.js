import { NextResponse } from 'next/server';
import { clientIp, portalPost, rateLimit, tooMany } from '@/lib/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req) {
  const ip = clientIp(req);
  // each code is an e-mail sent to the address: keep a single caller from flooding anyone's inbox
  if (!rateLimit(`code-ip:${ip}`, 6, 10 * 60_000)) return tooMany();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ code: 400, message: 'Invalid request', data: [] }, { status: 400 });
  }
  const email = String(body?.email ?? '').trim().slice(0, 160);
  if (!EMAIL_RE.test(email)) return NextResponse.json({ code: 400, message: 'Invalid email', data: [] }, { status: 400 });
  if (!rateLimit(`code-email:${email.toLowerCase()}`, 3, 10 * 60_000)) return tooMany();

  // only the email (and the fixed code type) is forwarded, never the rest of the request body
  const { data, status } = await portalPost('get_code', { email, type: '0' });
  return NextResponse.json(data, { status });
}
