// components/MessagesProvider.tsx
"use client";

import { NextIntlClientProvider } from 'next-intl';

type Props = {
  messages: any;
  locale: string;
  children: React.ReactNode;
};

export default function MessagesProvider({
  messages,
  locale,
  children,
}: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}