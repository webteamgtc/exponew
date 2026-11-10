import { useTranslations } from 'next-intl';
import { ClipboardList, ShieldCheck, WalletCards } from 'lucide-react';
import { Reveal, SpotlightCard, Stagger, StaggerItem } from '@/components/motion';
import { EXPO } from '@/config/expo';

const ICONS = { funds: WalletCards, deposit: ShieldCheck, next: ClipboardList };

/** "A better way to begin": three reasons, cards that lift and glow under the pointer. */
export default function Benefits() {
  const t = useTranslations('benefits');
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-24">
      <div aria-hidden className="bg-dots-light mask-radial absolute inset-0 opacity-50" />
      <div className="container-x relative">
        <Reveal>
          <p className="heading-label">{t('kicker')}</p>
          <h2 className="heading-section mt-3">
            {t('title')} <span className="heading-accent">{t('titleAccent')}</span>
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
          {t.raw('items').map((item) => {
            const Icon = ICONS[item.id] ?? ShieldCheck;
            return (
              <StaggerItem key={item.id} className="h-full">
                <SpotlightCard className="h-full rounded-3xl border border-brand/10 bg-white p-7 shadow-[0_20px_50px_-30px_rgba(41,59,147,0.45)] transition-transform duration-500 hover:-translate-y-1.5">
                  <span className="relative grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-gold-50 to-gold-100 text-gold-600 ring-1 ring-gold/25 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon className="size-7" strokeWidth={1.6} />
                  </span>
                  <h3 className="heading-title relative mt-6">{item.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-ink/65">{item.text.replace('{amount}', EXPO.bonus)}</p>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
