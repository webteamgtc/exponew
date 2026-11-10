'use client';
import { MotionConfig } from 'motion/react';

/** Motion follows the visitor's reduced-motion setting everywhere (same as the main site). */
export default function Providers({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
