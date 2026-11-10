import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * GTCFX logo (white on dark backgrounds, colour on light), from S3 like the main site.
 * Review-link builds (NEXT_PUBLIC_STATIC_EXPORT=1) use the local copy, because the review host blocks other sites.
 */
const S3 = 'https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/logo';
const PREVIEW = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1';
export const logoSrc = (onDark) =>
  PREVIEW
    ? onDark ? '/images/preview-logo-white.png' : '/images/preview-logo.png'
    : onDark ? `${S3}/footer-logo.webp` : `${S3}/main-logo.webp`;

export default function Logo({ className, onDark = false, imgClassName }) {
  return (
    <span className={cn('inline-flex items-center', className)}>
      <Image src={logoSrc(onDark)} alt="GTCFX" width={174} height={62} priority className={cn('h-11 w-auto md:h-12', imgClassName)} />
    </span>
  );
}
