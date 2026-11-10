'use client';
/**
 * Links in the sections brought over from gtcfx.com (Platforms, Legal, Awards, FAQ) point to pages of the main site.
 * A site path ('/company/regulations') opens that page on gtcfx.com in the visitor's language, in a new tab, so the
 * expo form stays open. Full URLs and #anchors are left as they are.
 */
import { useLocale } from 'next-intl';
import { MAIN_SITE } from '@/config/expo';

export default function NavLink({ href = '', children, ...rest }) {
  const locale = useLocale();
  const external = href.startsWith('/') && !href.startsWith('//');
  const url = external ? `${MAIN_SITE}/${locale}${href}` : href;
  return (
    <a href={url} {...(external || /^https?:/.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
    </a>
  );
}
