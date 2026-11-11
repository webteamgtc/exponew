import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Runs before every page: a URL without a language (/) goes to the visitor's language, and every page lives under its
 * language (/en-intl, /ar, /uz, /ru…), like the main site. This is what a scanned QR code opens.
 *
 * Which language a link without a language gets:
 *   1. the browser's language when it is one we have (a phone set to Uzbek → /uz, Russian → /ru, Arabic → /ar…),
 *   2. otherwise, a visitor located in a country listed in COUNTRY_LOCALE gets that country's language
 *      (in Uzbekistan → /uz, in Russia → /ru) even when the phone is set to English,
 *   3. otherwise English (/en-intl).
 * The country comes from the hosting platform's geo header (Vercel, Cloudflare or CloudFront); without one (plain
 * Node server, local development) only steps 1 and 3 apply. A link with a language (/uz, /ru…) is never changed, so a
 * QR code can also point straight at /uz or /ru.
 */
const COUNTRY_LOCALE = { UZ: 'uz', RU: 'ru' };

const intl = createMiddleware(routing);

function visitorCountry(req) {
  const raw = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || req.headers.get('cloudfront-viewer-country') || '';
  return raw.trim().toUpperCase();
}

/** Language of the browser's first (most preferred) entry in Accept-Language: "ru-RU,ru;q=0.9" → "ru". */
function preferredBrowserLanguage(req) {
  const header = req.headers.get('accept-language') || '';
  const ranked = header
    .split(',')
    .map((part, i) => {
      const [tag, ...params] = part.trim().split(';');
      const q = Number(params.find((p) => p.trim().startsWith('q='))?.split('=')[1]);
      return { lang: tag.trim().toLowerCase().split('-')[0], q: Number.isNaN(q) ? 1 : q, i };
    })
    .filter((e) => e.lang && e.lang !== '*')
    .sort((a, b) => b.q - a.q || a.i - b.i);
  return ranked[0]?.lang ?? '';
}

export default function proxy(req) {
  const { pathname, search } = req.nextUrl;
  const first = pathname.split('/')[1];
  const hasLocale = routing.locales.includes(first);

  if (!hasLocale) {
    const regional = COUNTRY_LOCALE[visitorCountry(req)];
    // the browser only loses to the visitor's country when it is set to English (or sends no language at all)
    const browser = preferredBrowserLanguage(req);
    if (regional && (browser === '' || browser === 'en')) {
      const url = new URL(`/${regional}${pathname === '/' ? '' : pathname}${search}`, req.url);
      const res = NextResponse.redirect(url);
      res.headers.set('Cache-Control', 'private, no-store');
      res.headers.set('Vary', 'Accept-Language');
      return res;
    }
  }
  return intl(req);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
