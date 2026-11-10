'use client';
/**
 * Phones only: a floating "Get my $50 bonus" button that scrolls to the form, shown while the form is off screen.
 */
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Gift } from 'lucide-react';
import { EXPO } from '@/config/expo';

export default function JumpToForm({ targetId }) {
  const t = useTranslations('form');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top > 0), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [targetId]);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="bonus-cta fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex h-13 items-center justify-center gap-2 rounded-full text-base font-semibold text-white lg:hidden"
        >
          <Gift className="size-5" /> {t('submit', { amount: EXPO.bonus })}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
