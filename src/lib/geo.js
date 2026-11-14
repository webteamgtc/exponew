import 'server-only';
import { clientIp, isPrivateIp } from '@/lib/api';

/**
 * The visitor's country (ISO code like "UZ") from their IP address, or '' when unknown.
 *   1. the hosting platform's country header (Vercel x-vercel-ip-country, Cloudflare cf-ipcountry, CloudFront
 *      cloudfront-viewer-country): free and instant, the normal case in production;
 *   2. otherwise a lookup of the IP at ipwho.is (2 s timeout, answers cached for an hour). Set GEOIP_LOOKUP=off to
 *      never send visitor IPs to that service;
 *   3. private / local addresses (development) are never looked up.
 */
const LOOKUP_URL = 'https://ipwho.is';
const LOOKUP_TIMEOUT_MS = 2000;
const CACHE_MS = 60 * 60 * 1000;
const cache = new Map();

const isIso = (v) => /^[A-Z]{2}$/.test(v) && v !== 'XX' && v !== 'T1';

export async function visitorCountry(req) {
  const header = (req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || req.headers.get('cloudfront-viewer-country') || '').trim().toUpperCase();
  if (isIso(header)) return header;

  if (process.env.GEOIP_LOOKUP === 'off') return '';
  const ip = clientIp(req);
  if (isPrivateIp(ip)) return '';

  const hit = cache.get(ip);
  if (hit && hit.until > Date.now()) return hit.country;
  try {
    const res = await fetch(`${LOOKUP_URL}/${encodeURIComponent(ip)}?fields=success,country_code`, { signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS), cache: 'no-store' });
    const data = await res.json();
    const country = data?.success && isIso(String(data.country_code).toUpperCase()) ? String(data.country_code).toUpperCase() : '';
    if (cache.size > 5000) cache.clear();
    cache.set(ip, { country, until: Date.now() + CACHE_MS });
    return country;
  } catch {
    return '';
  }
}
