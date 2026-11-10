import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { langOf } from './locales';

/**
 * Same rules as the main site (gtcrevamp2: src/i18n/request.js): every website language is a route (/en-intl, /ar,
 * /zh…, see locales.js); the text comes from messages/<lang>.json and any key missing in a language falls back to
 * English. English, Arabic and Chinese are translated, like the main site; the other languages show English for now.
 */
function merge(base, extra) {
  if (Array.isArray(base) && Array.isArray(extra)) return extra.map((item, i) => (i < base.length ? merge(base[i], item) : item));
  if (!extra || typeof extra !== 'object' || Array.isArray(extra)) return extra ?? base;
  const out = { ...base };
  for (const k of Object.keys(extra)) out[k] = base && typeof base[k] === 'object' && base[k] && typeof extra[k] === 'object' ? merge(base[k], extra[k]) : extra[k];
  return out;
}

async function load(lang) {
  try {
    return (await import(`../../messages/${lang}.json`)).default;
  } catch {
    return null; // no translation yet: English
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const en = await load('en');
  const lang = langOf(locale);
  const own = lang === 'en' ? null : await load(lang);
  return { locale, messages: own ? merge(en, own) : en };
});
