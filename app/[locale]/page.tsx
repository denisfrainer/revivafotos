/*
  app/[locale]/page.tsx
  REVIVA FOTOS — Zero Friction Conversion Page

  Architecture: H1 value proposition + HeroConversion state machine (slider → loading → result).
  No navbar, no footer — the entire page IS the conversion tool.
*/

import { locales } from '@/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { HeroConversion } from '@/components/HeroConversion';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function Home() {
  return (
    <>
      {/* Floating Language Switcher — minimal, top-right, low visual hierarchy */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <main className="min-h-[100svh] flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-black">
        <div className="w-full max-w-5xl flex flex-col items-center gap-8 sm:gap-10">

          {/* VALUE PROPOSITION — Space Grotesk H1 + Inter subtitle */}
          <div className="text-center space-y-3 sm:space-y-4 pt-8 px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              Restaure suas fotos antigas em segundos
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Nossa inteligência artificial remove manchas, arranhões e borrões. Experimente abaixo.
            </p>
          </div>

          {/* THE CONVERSION ENGINE: State Machine (IDLE → LOADING → PREVIEW) */}
          <HeroConversion />

        </div>
      </main>
    </>
  );
}
