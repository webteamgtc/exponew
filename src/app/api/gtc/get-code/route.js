import { NextResponse } from 'next/server';
import { clientIp, crmLang, portalPost, rateLimit, siteHost, siteVisitHeaders, tooMany } from '@/lib/api';

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

  // The CRM wants an encrypted "site visit" proof in x-r-a/b/c before it sends a code (rsa_key -> RSA-OAEP).
  const host = siteHost(req);
  const lang = crmLang(String(body?.locale ?? ''));
  const proof = await siteVisitHeaders(host, ip);
  const headers = { 'app-type': 'web', 'Accept-Language': lang, 'X-App-Lang': lang, ...proof };

  // only the email (and the fixed code type) is forwarded, never the rest of the request body
  const { data, status } = await portalPost('get_code', { email, type: '0' }, ip, { headers, origin: host });
  return NextResponse.json(data, { status });
}
