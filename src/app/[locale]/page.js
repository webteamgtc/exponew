import { setRequestLocale } from 'next-intl/server';
import ExpoPage from '@/components/expo/ExpoPage';

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ExpoPage />;
}
