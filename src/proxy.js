import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Runs before every page: a URL without a language (/) goes to the visitor's language from the browser
 * (/ar, /zh, … or /en-intl), and every page lives under its language (/en-intl, /ar…), like the main site.
 */
export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
