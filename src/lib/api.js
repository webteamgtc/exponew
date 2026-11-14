import 'server-only';
import { NextResponse } from 'next/server';
import { constants, createPublicKey, publicEncrypt } from 'node:crypto';

/**
 * Helpers shared by the API routes that talk to the GTC portal API:
 *  - rateLimit: small in-memory limiter (per server instance; use a shared store such as Redis/Upstash if the site
 *    runs on several instances or serverless functions and you need a hard limit),
 *  - clientIp: caller's IP from the proxy headers,
 *  - portalPost: POST JSON to the portal with a timeout; resolves to { ok, data } and never throws. Pass the visitor's IP
 *    (clientIp(req)) so the CRM sees the visitor, not our server: it is sent as X-Real-IP, HTTP-X-REAL-IP and
 *    X-Forwarded-For (the same headers the CRM's nginx uses), which its rate limit and checks can rely on.
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

/** Loopback / private-network addresses: a proxy in front of the site, not a visitor. */
export function isPrivateIp(ip) {
  return (
    !ip ||
    ip === 'unknown' ||
    ip === '::1' ||
    /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip) ||
    /^(fc|fd|fe80)/i.test(ip)
  );
}

/**
 * The visitor's IP. Behind nginx, X-Real-IP holds the visitor ($remote_addr) while X-Forwarded-For may only hold the
 * proxy (Next.js fills it in with the connecting address when nginx sends none), so X-Real-IP is read first, then the
 * X-Forwarded-For chain; the first public address wins, else the first one found ('unknown' when there is none).
 */
export function clientIp(req) {
  const real = req.headers.get('x-real-ip')?.trim();
  const chain = (req.headers.get('x-forwarded-for') || '').split(',').map((v) => v.trim()).filter(Boolean);
  const candidates = [real, ...chain].filter(Boolean);
  return candidates.find((ip) => !isPrivateIp(ip)) ?? candidates[0] ?? 'unknown';
}

export const tooMany = () => NextResponse.json({ code: 429, message: 'Too many requests, please try again in a minute.', data: [] }, { status: 429 });

/** The site's own hostname as the visitor sees it (no scheme, port or path), e.g. "uz.gtcpromo.com". */
export function siteHost(req) {
  const raw = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(',')[0].trim();
  return raw.replace(/:\d+$/, '').toLowerCase();
}

/** Language values the CRM understands (Accept-Language / X-App-Lang); our locales map onto them. */
const CRM_LANG = { en: 'en', ar: 'ar', zh: 'zhCn', ru: 'ru', uz: 'en' };
export const crmLang = (locale) => CRM_LANG[locale] || 'en';

const RSA_ALGS = new Set(['RSA-OAEP', 'RSA-OAEP-256', 'RSA-OAEP-SHA256', 'RSA-OAEP/SHA-256']);

/**
 * The "site visit" proof the CRM requires on get_code (see the CRM's RSA document). Steps:
 *  1. POST rsa_key {scene:'site_visit', client:'pc'} -> kid, public_key, nonce,
 *  2. build {v, kid, scene, nonce, ts, client, h} (h = our site hostname), encrypt it with RSA-OAEP / SHA-256 and
 *     Base64URL-encode the result,
 *  3. return the headers x-r-a / x-r-b / x-r-c.
 * A fresh key + nonce is fetched for every call. Resolves to {} on any failure: the CRM's own web app then sends
 * get_code without the headers too, so the request still goes out.
 */
/** Headers the CRM expects on PC2.0 web calls (get_code, reg, …): language, app-type, and the encrypted site-visit proof. */
export async function crmWebContext(req, locale) {
  const ip = clientIp(req);
  const host = siteHost(req);
  const lang = crmLang(String(locale ?? ''));
  const proof = await siteVisitHeaders(host, ip);
  return {
    ip,
    host,
    headers: { 'app-type': 'web', 'Accept-Language': lang, 'X-App-Lang': lang, ...proof },
  };
}

export async function siteVisitHeaders(host, ip) {
  try {
    const { ok, data } = await portalPost('rsa_key', { scene: 'site_visit', client: 'pc' }, ip, { origin: host });
    const key = data?.data ?? data;
    if (!ok || (data?.code !== undefined && Number(data.code) !== 200)) return {};
    const { kid, public_key: pem, nonce } = key || {};
    if (!kid || !pem || !nonce || typeof pem !== 'string') return {};
    if (key.alg && !RSA_ALGS.has(String(key.alg).trim().toUpperCase())) return {};
    if (key.expires_in !== undefined && !(Number(key.expires_in) > 0)) return {};

    const publicKey = createPublicKey(pem);
    const bits = publicKey.asymmetricKeyDetails?.modulusLength;
    if (!Number.isFinite(bits) || bits < 2048) return {};

    const plaintext = Buffer.from(JSON.stringify({ v: 1, kid, scene: 'site_visit', nonce, ts: Date.now(), client: 'pc', h: host }), 'utf8');
    if (plaintext.byteLength > bits / 8 - 2 * 32 - 2) return {};

    const encrypted = publicEncrypt({ key: publicKey, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, plaintext);
    return { 'x-r-a': 'v1', 'x-r-b': kid, 'x-r-c': `rsa:v1:${kid}:${encrypted.toString('base64url')}` };
  } catch {
    return {};
  }
}

/**
 * opts.headers: extra request headers; opts.origin: our site hostname, sent as Origin / Referer (the CRM checks the
 * page origin of browser calls, so server calls identify the site the same way).
 */
export async function portalPost(path, body, ip, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  if (opts.origin) {
    const scheme = opts.origin === 'localhost' ? 'http' : 'https';
    headers.Origin = `${scheme}://${opts.origin}`;
    headers.Referer = `${scheme}://${opts.origin}/`;
  }
  if (ip && ip !== 'unknown') {
    headers['X-Real-IP'] = ip;
    headers['HTTP-X-REAL-IP'] = ip;
    headers['X-Forwarded-For'] = ip;
  }
  try {
    const response = await fetch(`${PORTAL_API}/${path}`, {
      method: 'POST',
      headers,
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
