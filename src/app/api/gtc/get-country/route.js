import { NextResponse } from 'next/server';
import { clientIp, portalPost, rateLimit, tooMany } from '@/lib/api';
import { fallbackCountries } from '@/lib/countries';

let lastGood = null; // the CRM's last good answer, served if it starts failing

/**
 * The CRM's country list. When the CRM does not answer with a list (it has been returning { code: 400, message: "Fail" }),
 * the last good answer is served, else the built-in list (src/lib/countries.js), so the form never ends up empty.
 */
export async function POST(req) {
  if (!rateLimit(`country:${clientIp(req)}`, 30, 60_000)) return tooMany();
  const { ok, data, status } = await portalPost('get_country');
  if (ok && data?.code === 200 && Array.isArray(data.data) && data.data.length) {
    lastGood = data;
    return NextResponse.json(data, { status });
  }
  console.warn('[countries] CRM list unavailable, using', lastGood ? 'the last good list' : 'the built-in list', '|', data?.code, data?.message);
  return NextResponse.json(lastGood ?? { code: 200, message: 'fallback', data: fallbackCountries(), fallback: true });
}
