import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';

import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * Middleware de next-intl + guard del catálogo de desarrollo.
 *
 * El UI Kit vive en `/kit` y es una herramienta de desarrollo: fuera de
 * desarrollo devuelve 404. El guard no puede vivir sólo en la página: el
 * layout `[locale]` prerenderiza con `generateStaticParams` +
 * `setRequestLocale`, y el branch `NODE_ENV === 'production'` se evalúa en
 * build time (Turbopack puede eliminarlo como código muerto), de modo que
 * la página se servía en producción. El middleware corre por request con el
 * NODE_ENV real.
 */
export default function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    const { pathname } = request.nextUrl;
    // /kit, /es/kit, /en/kit (con o sin barra final). El sufijo basta: el
    // único realm con ese segmento final es el kit.
    if (/(^|\/)kit\/?$/.test(pathname)) {
      return new NextResponse(null, { status: 404 });
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Todo salvo API, internos de Next/Vercel y ficheros con extensión.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
