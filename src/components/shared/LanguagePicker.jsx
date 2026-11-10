'use client';
/**
 * Floating language picker, fixed to the top-right corner of the screen (top-left in right-to-left languages) so it is
 * always in reach while the page scrolls. A dark glass pill that reads on both the navy and the light half of the hero;
 * it opens a panel with every language as a flag tile. Same languages as the main site (src/i18n/locales.js).
 * Switching keeps the link's query (?ref=…, ?code=…) so the invitation code survives.
 * Render it outside any animated (transformed) parent, otherwise `fixed` is measured from that parent.
 */
import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/1x1';
import { usePathname, useRouter } from '@/i18n/navigation';
import { LOCALES, getLocale } from '@/i18n/locales';
import { EASE } from '@/components/motion';
import { cn } from '@/lib/utils';

const OPTIONS = LOCALES.filter((l) => !l.hideInLanguageSelector);

function Flag({ code, className }) {
  const F = code ? Flags[code] : null;
  return (
    <span className={cn('grid size-6 shrink-0 place-items-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/25', className)}>
      {F ? <F className="size-full" /> : <Globe className="size-4 text-white" />}
    </span>
  );
}

export default function LanguagePicker({ className }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = getLocale(locale);

  useEffect(() => {
    if (!open) return;
    const off = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', off);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', off);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  const pick = (code) => {
    setOpen(false);
    if (code === locale) return;
    router.replace(`${pathname}${window.location.search}`, { locale: code, scroll: false });
  };

  return (
    <div ref={ref} className={cn('fixed end-3 top-3 z-50 md:end-5 md:top-5', className)}>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={current.native}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          'group flex h-11 items-center gap-2.5 rounded-full bg-brand-950/80 py-1 ps-1.5 pe-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(10,14,38,0.8)] ring-1 ring-white/15 backdrop-blur-xl transition-colors hover:bg-brand-950 hover:ring-gold/60',
          open && 'bg-brand-950 ring-gold/60'
        )}
      >
        <Flag code={current.flag} className="size-8" />
        <span className="max-sm:hidden">{current.native}</span>
        <ChevronDown className={cn('size-4 text-gold-200 transition-transform duration-300', open && 'rotate-180')} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="absolute end-0 top-14 w-[min(24rem,calc(100vw-1.5rem))] origin-top overflow-hidden rounded-3xl bg-brand-950/95 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/15 backdrop-blur-2xl"
          >
            <div aria-hidden className="pointer-events-none absolute -end-10 -top-10 size-36 rounded-full bg-gold/25 blur-3xl" />
            <ul role="listbox" aria-label="Language" className="no-scrollbar relative grid max-h-[min(70vh,26rem)] grid-cols-2 gap-1.5 overflow-y-auto p-1">
              {OPTIONS.map((l, i) => {
                const on = l.code === locale;
                return (
                  <motion.li key={l.code} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 + i * 0.015, duration: 0.3, ease: EASE }}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={on}
                      onClick={() => pick(l.code)}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-2xl px-2.5 py-2 text-start transition-colors',
                        on ? 'bg-gradient-to-br from-gold/30 to-gold/10 text-white ring-1 ring-gold/50' : 'bg-white/[0.04] text-white/80 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <Flag code={l.flag} />
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="block truncate text-[13px] font-semibold">{l.native}</span>
                        <span className="block truncate text-[10px] text-white/45">{l.label}</span>
                      </span>
                      {on && <Check className="size-4 shrink-0 text-gold-200" />}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
