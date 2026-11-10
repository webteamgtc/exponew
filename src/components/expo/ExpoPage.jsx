'use client';
/**
 * Expo landing page. The hero (bonus + account form), then sections brought over from gtcfx.com so visitors at the booth
 * see who GTC is: the numbers, why start here, awards, regulation, platforms and an expo FAQ. Backgrounds alternate
 * navy / white / grey like the main homepage. The form opens the account in the CRM through /api/expo/register.
 */
import { HeadingStyle } from '@/components/shared/blocks';
import { Stats } from '@/components/sections/Stats';
import { Awards } from '@/components/sections/Awards';
import { Legal } from '@/components/sections/Legal';
import { Platforms } from '@/components/sections/Platforms';
import { Faq } from '@/components/sections/Faq';
import Toaster from '@/components/shared/Toaster';
import ExpoHero from './ExpoHero';
import Benefits from './Benefits';
import ExpoFooter from './ExpoFooter';

export default function ExpoPage() {
  return (
    <HeadingStyle.Provider value="index">
      <main>
        <ExpoHero />
        <div className="is-dark relative bg-brand-950 text-white">
          <Stats />
        </div>
        <Benefits />
        <Legal />
        <Platforms />
        <Faq />
        <Awards />
      </main>
      <ExpoFooter />
      <Toaster />
    </HeadingStyle.Provider>
  );
}
