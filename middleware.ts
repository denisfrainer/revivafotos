/*
  middleware.ts
  Middleware de i18n para SSG com next-intl
  NOTA: Com output: 'export', middleware NÃO roda em produção (é ignorado).
  Ele só é utilizado em `next dev`. Mantido para DX local.
*/

import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,

  // 'as-needed' = prefix apenas para locales não-default
  localePrefix: 'as-needed',
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, assets, certificates (public folders)
     * - *.* (any file with an extension, e.g. .css, .js, .svg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|assets|certificates|.*\\..*|.*\\..*).*)',
    '/',
    '/(pt|en|es)/:path*'
  ]
};
