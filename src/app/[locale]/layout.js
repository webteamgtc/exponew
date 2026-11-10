import { EXPO } from '@/config/expo';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '../globals.css';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { LOCALES, getDir, hreflangOf } from '@/i18n/locales';
import Providers from '@/components/Providers';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Set NEXT_PUBLIC_SITE_URL (e.g. https://expo.gtcfx.com) to add canonical, hreflang and Open Graph URLs.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const title = t('title', { expo: EXPO.name, amount: EXPO.bonus });
  const description = t('description', { expo: EXPO.name, amount: EXPO.bonus });
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', locale: hreflangOf(locale) },
    ...(SITE_URL && {
      metadataBase: new URL(SITE_URL),
      alternates: {
        canonical: `/${locale}`,
        languages: Object.fromEntries(LOCALES.map((l) => [hreflangOf(l.code), `/${l.code}`]))
      }
    })
  };
}

export const viewport = { themeColor: '#0a0e26' };

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html lang={hreflangOf(locale)} dir={getDir(locale)}>
      <body className="bg-white text-ink antialiased">
        <NextIntlClientProvider messages={await getMessages()}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
