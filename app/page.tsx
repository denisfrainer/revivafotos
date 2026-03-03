/*
  app/page.tsx
  Rota raiz — redireciona para o locale padrão /pt
*/

import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n";

export default function RootPage() {
    redirect(`/${defaultLocale}`);
}
