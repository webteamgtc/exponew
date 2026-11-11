'use client';
/**
 * Legal Information (dark). A dotted world map with a pin for every regulated entity: an arc of light travels from the
 * Dubai head office to the selected jurisdiction while a gold spotlight glides between the pins. Beside it, a "licence
 * card" with the regulator, licence type, licence number (copyable), address and a link to the regulator's register.
 * A rail of jurisdictions underneath; it moves on by itself while on screen (pauses on hover, with a pause button and
 * for reduced motion). Pins and rail are both clickable.
 * Data: regulationsPage.entities (same text as gtcfx.com/company/regulations), titles: companyPage.legalSection.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, Copy, Pause, Play, ShieldCheck } from 'lucide-react';
import { AE, ZA, VU, KM, AU, MU, KH } from 'country-flag-icons/react/3x2';
import ArrowLink from '@/components/shared/ArrowLink';
import { AccentTitle } from '@/components/shared/SectionIntro';
import { Reveal, EASE } from '@/components/motion';
import { goToForm } from '@/components/expo/goToForm';
import { cn } from '@/lib/utils';
import { mapDots, project } from './mapDots';

const FLAGS = { AE, ZA, VU, KM, AU, MU, KH };
/** lon, lat of each entity's city (same as the main site's regulations map) */
const GEO = {
  uae: [55.3, 25.2], // Dubai, the head office itself: no arc is drawn to it
  southAfrica: [18.4, -33.9],
  comoros: [44.4, -12.2],
  mauritius: [57.5, -20.2],
  cambodia: [104.9, 11.6],
  australia: [151.2, -33.9],
  vanuatu: [168.3, -17.7]
};
const HQ = project(55.3, 25.2); // Dubai
/** part of the 126 × 62 map that holds every entity: Africa → the Pacific */
const VIEW = { x: 52, y: 8, w: 76, h: 44 };
const AUTO_MS = 6000;

const pct = (p) => ({
  left: `${((p.x - VIEW.x) / VIEW.w) * 100}%`,
  top: `${((p.y - VIEW.y) / VIEW.h) * 100}%`
});

function Flag({ code, className }) {
  const F = FLAGS[code];
  return F ? <F className={cn('inline-block shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/20', className)} /> : null;
}

export function Legal() {
  const t = useTranslations('companyPage.legalSection');
  const te = useTranslations('regulationsPage.entities');
  const tf = useTranslations('form'); // "Register now"
  const items = useMemo(() => te.raw('items').filter((e) => GEO[e.id]), [te]);
  const labels = te.raw('labels');
  const n = items.length;

  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [hover, setHover] = useState(false);
  const [paused, setPaused] = useState(false);
  const progress = useMotionValue(0);

  const goTo = useCallback(
    (k, d) => {
      progress.set(0);
      setDir(d ?? 1);
      setI(((k % n) + n) % n);
    },
    [n, progress]
  );

  // auto-advance with a progress line on the active rail item
  const running = inView && !hover && !paused && !reduce;
  useEffect(() => {
    if (!running) return;
    const ctl = animate(progress, 1, {
      duration: (AUTO_MS / 1000) * (1 - progress.get()),
      ease: 'linear',
      onComplete: () => goTo(i + 1, 1)
    });
    return () => ctl.stop();
  }, [running, i, goTo, progress]);

  const e = items[i];

  return (
    <section id="legal" ref={ref} className="is-dark relative scroll-mt-24 overflow-hidden bg-brand-950 py-16 text-white md:py-24">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_0%,rgba(58,75,168,0.45),transparent_70%),radial-gradient(45%_45%_at_90%_100%,rgba(182,135,86,0.18),transparent_70%)]"
      />
      <div aria-hidden className="bg-grid-dark mask-radial absolute inset-0 opacity-40" />

      <div className="container-x relative">
        {/* intro */}
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
          <Reveal y={16}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-gold-200 ring-1 ring-white/10">
              <ShieldCheck className="size-4" /> {t('count', { count: n })}
            </span>
            <h2 className="heading-section mt-5">
              <AccentTitle text={t('title')} />
            </h2>
            <p className="mt-3 text-base font-semibold text-gold-300 md:text-lg">{t('subtitle')}</p>
          </Reveal>
          <Reveal y={12} delay={0.1}>
            <p className="text-pretty text-[15px] leading-relaxed text-white/60 md:text-base">{t('description')}</p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-[1.3fr_1fr]" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          {/* map */}
          <Reveal y={24} className="relative flex items-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-3 sm:p-5">
            <WorldMap items={items} active={i} onPick={(k) => goTo(k, k > i ? 1 : -1)} hqLabel={t('hq')} play={inView} />
          </Reveal>

          {/* licence card */}
          <Reveal y={24} delay={0.1} className="relative order-3 min-h-[420px] lg:order-none lg:min-h-[470px]">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <LicenceCard key={e.id} e={e} labels={labels} te={te} entityLabel={t('entity')} dir={dir} />
            </AnimatePresence>
          </Reveal>

          {/* jurisdiction rail */}
          <div className="order-2 flex min-w-0 items-center gap-2 lg:order-none lg:col-span-2">
            <div role="tablist" aria-label={t('choose')} className="no-scrollbar -mx-1 flex flex-1 gap-2 overflow-x-auto px-1 py-1">
              {items.map((x, k) => {
                const on = k === i;
                return (
                  <button
                    key={x.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => goTo(k, k > i ? 1 : -1)}
                    className={cn(
                      'relative flex shrink-0 items-center gap-2.5 overflow-hidden rounded-2xl px-4 py-3 text-start transition-colors lg:flex-1',
                      on ? 'text-ink' : 'bg-white/[0.04] text-white/70 ring-1 ring-white/10 hover:bg-white/[0.08] hover:text-white'
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId="legal-rail"
                        className="absolute inset-0 rounded-2xl bg-white shadow-xl shadow-black/30"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 34
                        }}
                      />
                    )}
                    <Flag code={x.code} className="relative h-4 w-6" />
                    <span className="relative leading-tight">
                      <span className="block text-sm font-bold">{x.short}</span>
                      <span className={cn('block text-[11px]', on ? 'text-ink/55' : 'text-white/45')}>{x.country}</span>
                    </span>
                    {on && (
                      <span className="absolute inset-x-3 bottom-1 h-0.5 overflow-hidden rounded-full bg-brand/10">
                        <motion.span className="block h-full origin-left bg-gold rtl:origin-right" style={{ scaleX: progress }} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {!reduce && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? t('play') : t('pause')}
                className="grid size-12 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white ring-1 ring-white/15 transition-colors hover:bg-white/15"
              >
                {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
              </button>
            )}
          </div>
        </div>

        <Reveal y={12} className="mt-10 flex justify-center">
          <ArrowLink href="#register" variant="light" onClick={goToForm}>
            {tf('title')}
          </ArrowLink>
        </Reveal>
      </div>
    </section>
  );
}

/** Dotted map (SVG) with HTML pins on top. The map is geography, so it stays left-to-right in every language. */
function WorldMap({ items, active, onPick, hqLabel, play }) {
  const dots = useMemo(
    () =>
      mapDots({
        x0: VIEW.x,
        x1: VIEW.x + VIEW.w,
        y0: VIEW.y,
        y1: VIEW.y + VIEW.h
      }),
    []
  );
  const pins = items.map((e) => ({ ...e, p: project(...GEO[e.id]) }));
  const a = pins[active].p;
  const dist = Math.hypot(a.x - HQ.x, a.y - HQ.y);
  const atHq = dist < 0.5;
  const arc = `M ${HQ.x} ${HQ.y} Q ${(HQ.x + a.x) / 2} ${Math.min(HQ.y, a.y) - dist * 0.45} ${a.x} ${a.y}`;

  return (
    <div dir="ltr" className="relative w-full">
      <svg viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} className="block h-auto w-full overflow-visible" aria-hidden>
        <defs>
          <radialGradient id="legal-spot">
            <stop offset="0%" stopColor="#d2a67a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#d2a67a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="legal-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f1e3d3" />
          </linearGradient>
          <clipPath id="legal-sweep">
            <motion.rect x={VIEW.x} y={VIEW.y} height={VIEW.h} initial={{ width: 0 }} animate={{ width: play ? VIEW.w : 0 }} transition={{ duration: 1.8, ease: EASE }} />
          </clipPath>
        </defs>

        {/* land dots, revealed with a sweep from west to east */}
        <g clipPath="url(#legal-sweep)" fill="#ffffff" fillOpacity="0.16">
          {dots.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="0.28" />
          ))}
        </g>

        {/* gold spotlight that glides to the selected pin */}
        <motion.circle r="9" fill="url(#legal-spot)" initial={false} animate={{ cx: a.x, cy: a.y }} transition={{ type: 'spring', stiffness: 60, damping: 16 }} />

        {/* arc from the head office, with a travelling spark (none when the entity is the head office) */}
        {!atHq && (
          <>
            <motion.path
              key={`arc-${active}`}
              d={arc}
              fill="none"
              stroke="url(#legal-arc)"
              strokeWidth="0.35"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease: EASE }}
            />
            <circle key={`spark-${active}`} r="0.55" fill="#ffffff">
              <animateMotion dur="2.2s" repeatCount="indefinite" path={arc} />
            </circle>
          </>
        )}
      </svg>

      {/* head office */}
      <span className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={pct(HQ)}>
        <span className="relative grid size-3 place-items-center">
          <span className="absolute size-3 rotate-45 rounded-[2px] bg-white shadow-[0_0_14px_rgba(255,255,255,0.8)]" />
        </span>
        <span className="absolute start-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80 ring-1 ring-white/15 backdrop-blur max-sm:hidden">
          {hqLabel}
        </span>
      </span>

      {/* entity pins */}
      {pins.map((e, k) => {
        const on = k === active;
        const below = e.p.y < 30; // labels under northern pins so they stay inside the map
        return (
          <button key={e.id} type="button" onClick={() => onPick(k)} aria-label={`${e.country} · ${e.short}`} className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 p-2" style={pct(e.p)}>
            <span className="relative grid size-3.5 place-items-center">
              <span className={cn('absolute size-full rounded-full bg-gold-300', on ? 'animate-ping' : 'opacity-0 group-hover:animate-ping group-hover:opacity-100')} />
              <motion.span
                className={cn('relative rounded-full ring-2', on ? 'bg-white ring-gold-300' : 'bg-gold-300 ring-brand-950')}
                animate={{ width: on ? 14 : 9, height: on ? 14 : 9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              />
            </span>
            <AnimatePresence>
              {on && (
                <motion.span
                  initial={{ opacity: 0, y: below ? -6 : 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={cn(
                    'absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-ink shadow-xl shadow-black/40',
                    below ? 'top-full mt-1' : 'bottom-full mb-1'
                  )}
                >
                  <Flag code={e.code} className="h-3 w-[18px]" /> {e.city} · {e.short}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}

/** Glass "licence card" for one entity; slides and un-blurs in the direction you move. */
function LicenceCard({ e, labels, te, entityLabel, dir, ref }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(e.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  const rows = e.rows.filter((r) => r.id !== 'address');
  const address = e.rows.find((r) => r.id === 'address');

  return (
    <motion.article
      ref={ref}
      custom={dir}
      variants={{
        enter: (d) => ({ opacity: 0, x: d * 40, filter: 'blur(8px)' }),
        center: { opacity: 1, x: 0, filter: 'blur(0px)' },
        exit: (d) => ({ opacity: 0, x: d * -40, filter: 'blur(8px)' })
      }}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: EASE }}
      className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.02] p-6 backdrop-blur-sm md:p-8"
    >
      {/* light sweep across the card on every change */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '0%' }}
        animate={{ x: '400%' }}
        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.15 }}
      />
      <div aria-hidden className="absolute -end-16 -top-16 size-48 rounded-full bg-gold/20 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Flag code={e.code} className="h-9 w-[54px] rounded-md shadow-lg shadow-black/40" />
          <div className="leading-tight">
            <p className="text-sm font-semibold">{e.country}</p>
            <p className="text-xs text-white/50">{e.city}</p>
          </div>
        </div>
        <span className="text-gradient-gold text-3xl font-extrabold tracking-tight md:text-4xl">{e.short}</span>
      </div>

      <span className="relative mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-200">
        <ShieldCheck className="size-3.5" /> {entityLabel}
      </span>
      <h3 className="relative mt-3 text-xl font-bold tracking-tight md:text-2xl">{e.name}</h3>

      <dl className="relative mt-5 grid gap-3 border-t border-white/10 pt-5">
        {rows.map((r, k) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + k * 0.07, ease: EASE }}
            className="grid grid-cols-[minmax(0,9rem)_1fr] items-baseline gap-3"
          >
            <dt className="text-xs text-white/45">{labels[r.id]}</dt>
            <dd className="flex min-w-0 items-center gap-2 text-sm font-semibold">
              {r.id === 'licence' ? (
                <>
                  <span dir="ltr" className="truncate font-mono text-gold-100">
                    {r.value}
                  </span>
                  <button
                    type="button"
                    onClick={copy}
                    aria-label={copied ? te('copied') : te('copy')}
                    className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    {copied ? <Check className="size-3.5 text-up" /> : <Copy className="size-3.5" />}
                  </button>
                </>
              ) : (
                <span dir="auto" className="min-w-0">
                  {r.value}
                </span>
              )}
            </dd>
          </motion.div>
        ))}
      </dl>
      {address && (
        <p dir="auto" className="relative mt-4 text-start text-xs leading-relaxed text-white/45">
          {address.value}
        </p>
      )}

      <div className="relative mt-auto pt-6">
        {e.registerUrl ? (
          <a href={e.registerUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gold-200 hover:text-white">
            {te('verify', { regulator: e.short })}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
          </a>
        ) : (
          <span className="text-xs text-white/40">{te('verifySoon')}</span>
        )}
      </div>
    </motion.article>
  );
}
