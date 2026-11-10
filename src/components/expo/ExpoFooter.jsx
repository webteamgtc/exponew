import { useTranslations } from 'next-intl';

/** Dark footer: risk warning and copyright. */
export default function ExpoFooter() {
  const t = useTranslations('footer');
  return (
    <footer id="footer" className="is-dark bg-brand-950 py-10 text-white">
      <div className="container-x">
        <p className="heading-label">{t('riskTitle')}</p>
        <div className="mt-3 max-w-6xl space-y-3 text-xs leading-relaxed text-white/60">
          {/* dir="auto": languages without a translation show the English text, which must read left to right */}
          {t.raw('risk').map((p) => (
            <p key={p} dir="auto" className="text-start">
              {p}
            </p>
          ))}
        </div>
        <p className="mt-6 border-t border-white/10 pt-5 text-xs text-white/40">{t('copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
