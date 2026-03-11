import { locales } from '@/i18n';
import { HeroConversion } from '@/components/HeroConversion';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// CRÍTICO para SSG: generateStaticParams pré-renderiza todas as rotas de idioma
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// THE HYBRID CACHE LOCK: Força a página a ser HTML estático imutável, mesmo sem output: 'export'
export const dynamic = 'force-static';

export default function Home() {
  return (
    <>
      {/* Persistent Language Switcher — always visible */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <main className="min-h-[100svh] flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-black">
        <div className="w-full max-w-5xl flex flex-col items-center gap-8 sm:gap-10">
          {/* Primary Client Island — owns all state internally */}
          <HeroConversion />
        </div>
      </main>

      {/* WhatsApp CTA — visibility controlled by HeroConversion internally via portal or always-on */}
      <FloatingWhatsApp />
    </>
  );
}
