import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Todo salvo API, internos de Next/Vercel y ficheros con extensión.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
