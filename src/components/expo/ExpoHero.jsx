'use client';
/**
 * Hero (split screen): navy on the left, light on the right. The left half has the GTC logo + language picker, the headline, a huge
 * outlined "$50" that fills with liquid gold, the Register → Activate → Start trading timeline (it follows the visitor:
 * Register fills as the form is completed, Activate once the account is open) and a moving strip of markets.
 * The account form fills the right half (below on phones, with a floating button that jumps to it).
 * Text is never hidden before scripts load (HeroIn only moves it), so the page paints straight away.
 */
import { useId, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { BadgeCheck, CalendarDays, MapPin } from 'lucide-react';
import { EASE, HeroIn, Marquee, WordReveal } from '@/components/motion';
import Logo from '@/components/shared/Logo';
import LanguagePicker from '@/components/shared/LanguagePicker';
import { EXPO } from '@/config/expo';
import ExpoRegisterForm from './ExpoRegisterForm';
import JumpToForm from './JumpToForm';
import Timeline from './Timeline';

/** Fixed positions (no Math.random, so server and browser render the same) for the drifting gold sparks. */
const SPARKS = [
  { left: '8%', top: '22%', size: 6, dur: 5.5, delay: 0 },
  { left: '82%', top: '14%', size: 4, dur: 6.5, delay: 1.2 },
  { left: '92%', top: '46%', size: 7, dur: 7, delay: 0.6 },
  { left: '14%', top: '58%', size: 4, dur: 6, delay: 2 },
  { left: '70%', top: '72%', size: 5, dur: 5, delay: 0.3 },
  { left: '40%', top: '10%', size: 3, dur: 7.5, delay: 1.8 }
];

export default function ExpoHero() {
  const t = useTranslations('hero');
  const [stage, setStage] = useState(0);
  const [filled, setFilled] = useState(0);

  return (
    <section className="grid lg:min-h-screen lg:grid-cols-2">
      {/* left: navy */}
      <div className="is-dark relative isolate flex flex-col overflow-hidden bg-brand-950 text-white">
        <HeroBackdrop />
        <div className="flex flex-1 flex-col px-6 pb-10 pt-8 md:px-12 lg:ms-auto lg:w-full lg:max-w-[40rem] lg:pt-10">
          <HeroIn className="flex items-center justify-between gap-4">
            <Logo onDark imgClassName="h-10 md:h-11" />
          </HeroIn>

          <HeroIn delay={0.1} as="p" className="mt-10 inline-flex w-fit items-center gap-2.5 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-200 backdrop-blur md:text-xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold-300 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-gold-300" />
            </span>
            {t('kicker')}
          </HeroIn>
          <h1 className="heading-page mt-4">
            <WordReveal text={t('titleLine1')} immediate />
            <br />
            <WordReveal text={t('titleLine2')} immediate delay={0.25} wordClassName="heading-accent" />
          </h1>

          {/* the bonus: liquid-gold amount in a glass card */}
          <HeroIn delay={0.3} className="relative mt-7 overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-sm md:p-6">
            <div aria-hidden className="absolute -start-12 -top-12 size-60 rounded-full bg-gold/25 blur-3xl" />
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-200/60 to-transparent" />
            <div className="relative flex flex-wrap items-center gap-x-6 gap-y-3">
              <LiquidAmount amount={EXPO.bonus} />
              <div className="flex min-w-[9.5rem] flex-1 flex-col items-start gap-1.5 leading-tight">
                <span className="text-2xl font-semibold text-gold-200 md:text-3xl">{EXPO.currency}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-300 md:text-sm">{t('bonusLabel')}</span>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-up/15 px-3 py-1.5 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/25 md:text-sm">
                  <BadgeCheck className="size-4 shrink-0" strokeWidth={2} /> {t('noDeposit')}
                </span>
              </div>
            </div>
            <p className="relative mt-4 max-w-md text-sm leading-relaxed text-white/70 md:text-base">{t('lead', { amount: EXPO.bonus })}</p>
          </HeroIn>

          <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="heading-label mb-6">{t('stepsTitle')}</p>
            <Timeline steps={t.raw('stepsDetailed')} stage={stage} filled={filled} amount={EXPO.bonus} tone="dark" />
          </div>
          <p className="mt-6 text-xs text-white/45">{t('terms')}</p>
        </div>

        <div className="border-t border-white/10 bg-white/[0.03] py-4">
          <p className="sr-only">{t('marketsLabel')}</p>
          <Marquee duration={30} gap="0.75rem" className="mask-fade-x text-sm font-semibold text-white/70">
            {t.raw('markets').map((m) => (
              <span key={m} className="flex items-center gap-2.5 whitespace-nowrap rounded-full bg-white/[0.06] px-4 py-1.5 ring-1 ring-white/10">
                <span className="size-1.5 rounded-full bg-gold-300 shadow-[0_0_8px_rgba(210,166,122,0.9)]" /> {m}
              </span>
            ))}
          </Marquee>
        </div>
      </div>

      {/* right: light, the form */}
      <div className="relative isolate flex flex-col overflow-hidden bg-[linear-gradient(160deg,#f7f8fd_0%,#eceffa_55%,#f6efe7_100%)]">
        <div aria-hidden className="bg-dots-light mask-radial absolute inset-0 -z-10 opacity-60" />
        <motion.div aria-hidden className="absolute -end-24 -top-24 -z-10 size-96 rounded-full bg-brand-200/50 blur-[100px]" animate={{ x: [0, -40, 0], y: [0, 40, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div aria-hidden className="absolute -bottom-24 -start-24 -z-10 size-96 rounded-full bg-gold-200/60 blur-[100px]" animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="flex flex-1 flex-col justify-center px-4 py-10 md:px-12 lg:me-auto lg:w-full lg:max-w-[40rem]">
          <HeroIn className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-brand">
            <span dir="auto" className="inline-flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2 leading-snug shadow-sm ring-1 ring-brand/10">
              <CalendarDays className="size-3.5 shrink-0 text-gold" />
              <span>
                {EXPO.name}, {EXPO.dates}, {EXPO.city} ({EXPO.kind})
              </span>
            </span>
            {EXPO.booth && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 shadow-sm ring-1 ring-brand/10">
                <MapPin className="size-3.5 text-gold" /> {t('boothBadge', { booth: EXPO.booth })}
              </span>
            )}
          </HeroIn>
          {/* a gold-and-navy light travels around the card's edge */}
          <motion.div id="register" initial={{ y: 24 }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: EASE }} className="border-beam scroll-mt-4 rounded-[1.95rem] p-[2px]">
            <ExpoRegisterForm onProgress={setFilled} onDone={() => setStage(1)} onReset={() => setStage(0)} className="shadow-[0_40px_90px_-40px_rgba(41,59,147,0.5)] ring-brand/10" />
          </motion.div>
        </div>
      </div>
      <JumpToForm targetId="register" />
      {/* fixed to the screen corner, so it sits outside the animated columns */}
      <LanguagePicker />
    </section>
  );
}

/** Layers behind the navy half: glow, grid, drifting aurora, a rising chart that draws itself and floating gold sparks. */
function HeroBackdrop() {
  const line = 'M0 175 C40 168 62 122 104 132 S164 164 206 112 S278 92 320 102 S392 44 440 62 S528 22 600 8';
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_0%_0%,rgba(58,75,168,0.55),transparent_70%),radial-gradient(60%_50%_at_100%_100%,rgba(182,135,86,0.22),transparent_70%)]" />
      <div className="bg-grid-dark mask-radial absolute inset-0 opacity-50" />
      <motion.div className="absolute -end-20 top-1/4 size-80 rounded-full bg-brand-400/30 blur-[90px]" animate={{ x: [0, -50, 0], y: [0, 40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute -start-16 bottom-1/4 size-72 rounded-full bg-gold/20 blur-[90px]" animate={{ x: [0, 60, 0], y: [0, -40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />

      <svg viewBox="0 0 600 200" preserveAspectRatio="none" dir="ltr" className="absolute inset-x-0 bottom-0 h-[28%] w-full opacity-30">
        <defs>
          <linearGradient id="hero-chart-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8390d4" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#d2a67a" />
            <stop offset="100%" stopColor="#f1e3d3" />
          </linearGradient>
          <linearGradient id="hero-chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d2a67a" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#d2a67a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={`${line} V200 H0 Z`} fill="url(#hero-chart-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, delay: 1.2 }} />
        <motion.path d={line} fill="none" stroke="url(#hero-chart-stroke)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.6, delay: 0.5, ease: 'easeInOut' }} />
      </svg>

      {SPARKS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold-200 shadow-[0_0_12px_3px_rgba(210,166,122,0.55)]"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
          animate={{ y: [0, -16, 0], opacity: [0.25, 0.9, 0.25] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/** "$50" drawn as gold outline type that fills with liquid gold, with a wave moving across the surface. */
function LiquidAmount({ amount }) {
  const id = useId().replace(/:/g, '');
  const text = `$${amount}`;
  const wave = 'M0 20 Q 65 0 130 20 T 260 20 T 390 20 T 520 20 T 650 20 T 780 20 T 910 20 T 1040 20 V 300 H 0 Z';
  return (
    <svg viewBox="0 0 400 210" dir="ltr" style={{ direction: 'ltr' }} className="h-28 w-auto shrink-0 sm:h-32 md:h-36" role="img" aria-label={`$${amount}`}>
      <defs>
        <clipPath id={`liq-${id}`}>
          <text x="0" y="185" direction="ltr" textAnchor="start" fontSize="220" fontWeight="800" letterSpacing="-14" fontFamily="Inter Variable, Inter, sans-serif">
            {text}
          </text>
        </clipPath>
        <linearGradient id={`gold-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f1e3d3" />
          <stop offset="45%" stopColor="#d2a67a" />
          <stop offset="100%" stopColor="#9a6f43" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#liq-${id})`}>
        <motion.g initial={{ y: 200 }} animate={{ y: -14 }} transition={{ duration: 2.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}>
          <motion.path d={wave} fill={`url(#gold-${id})`} animate={{ x: [0, -260] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }} />
          <motion.path d={wave} fill="#ffffff" opacity="0.18" animate={{ x: [-130, -390] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'linear' }} />
        </motion.g>
      </g>
      <text x="0" y="185" direction="ltr" textAnchor="start" fontSize="220" fontWeight="800" letterSpacing="-14" fontFamily="Inter Variable, Inter, sans-serif" fill="none" stroke="#d2a67a" strokeWidth="2">
        {text}
      </text>
    </svg>
  );
}
