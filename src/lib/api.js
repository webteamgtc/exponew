import 'server-only';
import { NextResponse } from 'next/server';

/**
 * Helpers shared by the API routes that talk to the GTC portal API:
 *  - rateLimit: small in-memory limiter (per server instance; use a shared store such as Redis/Upstash if the site
 *    runs on several instances or serverless functions and you need a hard limit),
 *  - clientIp: caller's IP from the proxy headers,
 *  - portalPost: POST JSON to the portal with a timeout; resolves to { ok, data } and never throws.
 */
export const PORTAL_API = process.env.GTC_PORTAL_API || 'https://web.mygtc.app/api/pub';
export const PORTAL_TIMEOUT_MS = 10_000;

const buckets = new Map();

/** true when `key` is still under `limit` requests per `windowMs`. */
export function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, b] of buckets) if (b.reset <= now) buckets.delete(k);
  const b = buckets.get(key);
  if (!b || b.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

export function clientIp(req) {
  const fwd = req.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0].trim() : req.headers.get('x-real-ip')) || 'unknown';
}

export const tooMany = () => NextResponse.json({ code: 429, message: 'Too many requests, please try again in a minute.', data: [] }, { status: 429 });

export async function portalPost(path, body) {
  try {
    const response = await fetch(`${PORTAL_API}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(PORTAL_TIMEOUT_MS)
    });
    const data = await response.json().catch(() => null);
    if (data === null) return { ok: false, status: 502, data: { code: 502, message: 'Unexpected response from GTC API', data: [] } };
    return { ok: true, status: response.status, data };
  } catch {
    return { ok: false, status: 502, data: { code: 502, message: 'Failed to reach GTC API', data: [] } };
  }
}
