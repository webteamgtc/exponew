'use client';
/**
 * Shown in the form card once the account is open: a burst of gold confetti, a tick that draws itself, a thank-you with
 * the e-mail the username and password were sent to (the password is made on the server and only sent there), the
 * three next steps (check the e-mail → download "GTCFX: GTC GO" → log in and trade), the app download card with the
 * App Store / Google Play buttons (links in EXPO.apps), the web-portal login and "Register another visitor"
 * (clears the form for the next person).
 */
import Image from 'next/image';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Apple, ArrowRight, Mail, RotateCcw, Smartphone, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavLink from '@/components/shared/nav/NavLink';
import { EASE } from '@/components/motion';
import { EXPO } from '@/config/expo';
import { PLATFORM_LINKS } from '@/config/menu';
import { cn } from '@/lib/utils';

const CONFETTI = Array.from({ length: 26 }, (_, i) => ({
  x: ((i * 47) % 100) - 50,
  r: (i * 61) % 360,
  d: (i % 7) * 0.06,
  gold: i % 3 !== 0
}));

const STEP_ICONS = { email: Mail, app: Smartphone, trade: TrendingUp };

/** Google Play's triangle (lucide has no brand icons) */
function PlayIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M4 2.6v18.8a1 1 0 0 0 1.5.9l15-9.4a1 1 0 0 0 0-1.7L5.5 1.7A1 1 0 0 0 4 2.6Z" fill="currentColor" />
    </svg>
  );
}

export default function RegisterSuccess({ name, email, amount, emailSent = true, onAnother }) {
  const t = useTranslations('success');
  // no store link set yet → the GTC Go page of the main site, in the visitor's language
  const storeLink = (url) => url || PLATFORM_LINKS.gtcgo;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="relative overflow-hidden px-5 pb-6 pt-9 text-center sm:px-8"
      role="status"
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64">
        {CONFETTI.map((c, i) => (
          <motion.span
            key={i}
            className={cn('absolute left-1/2 top-24 h-3 w-2 rounded-[2px]', c.gold ? 'bg-gold-300' : 'bg-brand-400')}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x: c.x * 4, y: [0, -120 - (i % 5) * 18, 220], rotate: c.r + 360, opacity: [1, 1, 0] }}
            transition={{ duration: 2.2, delay: 0.2 + c.d, ease: 'easeOut' }}
          />
        ))}
      </div>

      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }}
        className="relative mx-auto grid size-20 place-items-center rounded-full bg-gradient-to-br from-gold-200 to-gold text-white shadow-[0_18px_40px_-14px_rgba(182,135,86,0.9)]"
      >
        <svg viewBox="0 0 24 24" className="size-10" aria-hidden>
          <motion.path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.5 }} />
        </svg>
      </motion.span>

      <p className="heading-label mt-6">{t('eyebrow')}</p>
      <h2 className="heading-card mt-2 text-balance text-2xl">{t('title', { name })}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/65">{t(emailSent ? 'text' : 'textNoEmail', { email })}</p>

      {/* where the login details went */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, ease: EASE }}
        className="mx-auto mt-5 max-w-md rounded-2xl border border-brand/10 bg-brand-50/70 px-4 py-3"
      >
        <p dir="ltr" className="flex items-center justify-center gap-2 break-all text-sm font-semibold text-brand">
          <Mail className="size-4 shrink-0 text-gold" /> {email}
        </p>
        <p className="mt-1 text-xs text-ink/50">{t('inboxTip')}</p>
      </motion.div>

      {/* what to do next */}
      <ol className="mt-6 grid gap-2 text-start">
        {t.raw('steps').map((s, i) => {
          const Icon = STEP_ICONS[s.id] ?? Mail;
          return (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 + i * 0.12, ease: EASE }}
              className={cn('flex items-start gap-3 rounded-xl border p-3', i === 0 ? 'border-gold/40 bg-gold-50' : 'border-brand/10 bg-white')}
            >
              <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl', i === 0 ? 'bg-gradient-to-br from-gold-300 to-gold text-white' : 'bg-brand-50 text-brand')}>
                <Icon className="size-[18px]" />
              </span>
              <span className="min-w-0">
                <strong className="block text-sm">
                  <span className="me-1.5 text-gold-600 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  {s.label}
                </strong>
                <span className="text-xs leading-relaxed text-ink/60">{s.text.replace('{amount}', amount)}</span>
              </span>
            </motion.li>
          );
        })}
      </ol>

      {/* the app */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, ease: EASE }}
        className="is-dark relative mt-6 overflow-hidden rounded-3xl bg-brand-950 p-5 text-start text-white sm:p-6"
      >
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_80%_at_100%_100%,rgba(182,135,86,0.35),transparent_70%),radial-gradient(60%_60%_at_0%_0%,rgba(58,75,168,0.5),transparent_70%)]" />
        <div className="relative grid items-center gap-4 sm:grid-cols-[minmax(0,1fr)_7rem]">
          <div>
            <h3 className="heading-card text-lg">{t('app.title')}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-white/65">{t('app.text')}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <NavLink href={storeLink(EXPO.apps.appStore)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-brand-950 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-gold-50">
                <Apple className="size-5" /> {t('app.appStore')}
              </NavLink>
              <NavLink href={storeLink(EXPO.apps.googlePlay)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-brand-950 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-gold-50">
                <PlayIcon className="size-4" /> {t('app.googlePlay')}
              </NavLink>
            </div>
          </div>
          <motion.div className="relative mx-auto hidden h-32 w-28 overflow-hidden sm:block" animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <Image src="/metatrade5.png" alt="GTC GO" width={210} height={411} sizes="112px" className="absolute inset-x-0 top-1 h-auto w-full drop-shadow-2xl" draggable={false} />
          </motion.div>
        </div>
      </motion.div>

      <div className="mt-5 grid gap-1">
        <Button as="a" href={EXPO.loginUrl} target="_blank" rel="noopener noreferrer" variant="ghost" size="md" className="w-full text-brand">
          {t('login')} <ArrowRight className="rtl:-scale-x-100" />
        </Button>
        <Button type="button" variant="ghost" size="md" onClick={onAnother} className="w-full text-ink/55 hover:text-brand">
          <RotateCcw /> {t('another')}
        </Button>
      </div>
    </motion.div>
  );
}
