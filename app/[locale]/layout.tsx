/*
  app/[lang]/layout.tsx
  Layout de i18n — envolve children com NextIntlClientProvider.
  <html> e <body> agora vivem em app/layout.tsx (root).
*/

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';

// CRÍTICO para SSG: generateStaticParams pré-renderiza todas as rotas de idioma
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// THE HYBRID CACHE LOCK: Força a página a ser HTML estático imutável, mesmo sem output: 'export'
export const dynamic = 'force-static';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
