import { getTranslations } from 'next-intl/server';
import { HeroInteractiveZone } from './HeroInteractiveZone';

/**
 * HERO SECTION - POLISHED (UX GOD METHODOLOGY)
 * 1. Viewport Fit: Optimized for 100svh to ensure H1 -> CTA fits above the fold.
 * 2. Tightened Rhythm: Reduced gaps and optimized typography for mobile.
 * 3. Premium Hierarchy: Punchy H1 and refined H2 for instant conversion.
 */
export async function HeroSection() {
  const t = await getTranslations('HeroSection');

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 bg-black py-12 md:py-20">
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center">

        {/* Step 1: Punchy H1 - Tightened leading */}
        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-center mb-4 md:mb-6 leading-[0.95] tracking-tighter text-white">
          {t('title')}
        </h1>

        {/* Step 2: Supportive H2 - Refined for mobile fit */}
        <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-400 text-center mb-8 md:mb-12 max-w-[280px] sm:max-w-2xl md:max-w-4xl mx-auto leading-relaxed font-light opacity-90">
          {t('subtitle')}
        </p>

        {/* Step 3: The Interactive Zone - Zero CLS swap */}
        <div className="w-full">
          <HeroInteractiveZone
            beforeImage="/assets/antes.webp"
            afterImage="/assets/depois.webp"
            ctaText={t('ctaSecondary')}
            cancelText={t('cancel')}
          />
        </div>

      </div>

      {/* Premium subtle glow (CSS only) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(64,78,237,0.08),transparent_60%)] pointer-events-none"></div>
    </section>
  );
}
