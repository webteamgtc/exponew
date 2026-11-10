'use client';
/**
 * Six boxes for the email code. Typing moves to the next box, Backspace to the previous one, and pasting
 * (or the phone's one-time-code suggestion) fills them all. The value is the plain digit string.
 * `highlight` gently pulses the boxes once the code has been sent.
 */
import { useRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function OtpBoxes({ value, onChange, onBlur, invalid, highlight, labelFor = (n) => `Digit ${n} of 6` }) {
  const refs = useRef([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? '');

  const put = (i, raw) => {
    const typed = raw.replace(/\D/g, '');
    if (!typed) return;
    // never leave a gap: a digit typed in a box past the end goes to the first empty box
    const start = Math.min(i, value.length);
    const next = (value.slice(0, start) + typed + value.slice(start + typed.length)).slice(0, 6);
    onChange(next);
    refs.current[Math.min(start + typed.length, 5)]?.focus();
  };

  const onKey = (i) => (e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[i]) onChange(value.slice(0, i) + value.slice(i + 1));
      else if (i > 0) {
        onChange(value.slice(0, i - 1) + value.slice(i));
        refs.current[i - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    else if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <div className="grid grid-cols-6 gap-2" dir="ltr" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && onBlur?.()}>
      {digits.map((d, i) => (
        <motion.input
          key={i}
          id={`expo-otp-${i}`}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          onChange={(e) => put(i, e.target.value)}
          onKeyDown={onKey(i)}
          onFocus={(e) => e.target.select()}
          onPaste={(e) => {
            e.preventDefault();
            put(0, e.clipboardData.getData('text'));
          }}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={6}
          aria-label={labelFor(i + 1)}
          animate={highlight && !value ? { borderColor: ['rgba(41,59,147,0.15)', 'rgba(182,135,86,0.8)', 'rgba(41,59,147,0.15)'] } : {}}
          transition={{ duration: 1.6, delay: i * 0.08, repeat: highlight && !value ? Infinity : 0 }}
          className={cn(
            'h-12 w-full min-w-0 rounded-xl border bg-white text-center text-lg font-semibold tabular-nums text-ink outline-none transition-[box-shadow,border-color] focus:ring-4',
            invalid ? 'border-down/60 focus:border-down focus:ring-down/10' : d ? 'border-brand/40 focus:border-brand focus:ring-brand/10' : 'border-brand/15 focus:border-brand focus:ring-brand/10'
          )}
        />
      ))}
    </div>
  );
}
