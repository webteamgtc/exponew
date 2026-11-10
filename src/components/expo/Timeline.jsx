'use client';
/**
 * Vertical Register → Activate → Start trading timeline with a short line of text per step.
 * The line between the dots fills as the visitor completes the form, then turns to the next step.
 * tone 'dark' (on navy, the hero) or 'light' (on white).
 */
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Timeline({ steps, stage, filled, amount, tone = 'light', className }) {
  const dark = tone === 'dark';
  return (
    <ol className={cn('relative grid gap-7', className)}>
      {steps.map((s, i) => {
        const state = i < stage ? 'done' : i === stage ? 'now' : 'next';
        const fill = state === 'done' ? 1 : state === 'now' ? (i === 0 ? filled : 0.3) : 0;
        return (
          <li key={s.id} className="relative flex gap-4">
            {i < steps.length - 1 && (
              <span aria-hidden className={cn('absolute start-[1.1875rem] top-11 -bottom-6 w-0.5 overflow-hidden rounded-full', dark ? 'bg-white/10' : 'bg-brand/10')}>
                <motion.span className="block w-full origin-top bg-gradient-to-b from-gold-300 to-gold" style={{ height: '100%' }} initial={false} animate={{ scaleY: fill }} transition={{ type: 'spring', stiffness: 80, damping: 20 }} />
              </span>
            )}
            <motion.span
              layout
              className={cn(
                'relative grid size-10 shrink-0 place-items-center rounded-2xl text-sm font-bold tabular-nums transition-colors duration-500',
                state === 'done' ? 'bg-gradient-to-br from-gold-300 to-gold text-white' : state === 'now' ? (dark ? 'bg-white text-brand-900' : 'bg-brand text-white') : dark ? 'bg-white/5 text-white/40 ring-1 ring-white/15' : 'bg-white text-ink/35 ring-1 ring-brand/15'
              )}
            >
              {state === 'now' && <span aria-hidden className={cn('absolute -inset-1.5 animate-ping rounded-[1.1rem] opacity-30', dark ? 'bg-white/40' : 'bg-brand/30')} style={{ animationDuration: '2.4s' }} />}
              {state === 'done' ? <Check className="size-5" /> : String(i + 1).padStart(2, '0')}
            </motion.span>
            <span className="pt-1">
              <strong className={cn('block text-base', state === 'next' ? (dark ? 'text-white/50' : 'text-ink/45') : dark ? 'text-white' : 'text-ink')}>{s.label}</strong>
              <span className={cn('mt-0.5 block text-sm', dark ? 'text-white/55' : 'text-ink/55')}>{s.text.replace('{amount}', amount)}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
