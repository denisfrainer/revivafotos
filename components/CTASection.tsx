'use client';

import { useTranslations } from 'next-intl';

export function CTASection() {
  const t = useTranslations('CTASection');

  return (
    <section
      id="contact"
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center border-t border-white/20"
    >
      <div className="bg-[var(--primary)] rounded-3xl border border-white/20 p-8 sm:p-12 lg:p-16">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          {t('title')}
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('description')}
        </p>
        <a
          href="#"
          className="inline-block bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] text-white font-semibold px-8 py-4 rounded-lg text-[20px] transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          {t('button')}
        </a>
      </div>
    </section>
  );
}
