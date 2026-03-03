/*
  app/[locale]/page.tsx
  Main page with i18n and generateStaticParams for SSG
*/

import { locales } from '@/i18n';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-14">
        <HeroSection />

        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
