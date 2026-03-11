/*
  app/page.tsx
  Rota raiz — Página estática que redireciona via JS para o locale padrão.
  Compatível com output: 'export' (sem redirect() do Next.js).
*/

import { defaultLocale } from "@/i18n";

export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=/${defaultLocale}`} />
      <p>Redirecting…</p>
    </>
  );
}
