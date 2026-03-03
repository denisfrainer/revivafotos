/*
  i18n.ts
  Configuração de i18n para next-intl com SSG (Static Export)
  Tipagem estrita para evitar erros
*/

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Definição explícita das locales (PT como padrão, EN como alternativa)
export const locales = ['pt', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];

// Locale padrão
export const defaultLocale: Locale = 'pt';

// Validação de locale
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// Configuração do next-intl para SSG
export default getRequestConfig(async ({ locale }) => {
  // Validação de locale no build time
  const validatedLocale = locale ?? defaultLocale;
  
  if (!isValidLocale(validatedLocale)) {
    notFound();
  }

  return {
    locale: validatedLocale,
    messages: (await import(`./locales/${validatedLocale}.json`)).default,
  };
});
