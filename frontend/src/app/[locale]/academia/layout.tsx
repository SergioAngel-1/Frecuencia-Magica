import { NextIntlClientProvider } from 'next-intl';

import { routeMessages } from '@/i18n/route-messages';

type AcademiaLayoutProps = { children: React.ReactNode };

/** El reino «Academia» vuelve a proveer los mensajes con los namespaces que usa. */
export default async function AcademiaLayout({ children }: AcademiaLayoutProps) {
  return (
    <NextIntlClientProvider messages={await routeMessages('academia')}>
      {children}
    </NextIntlClientProvider>
  );
}
