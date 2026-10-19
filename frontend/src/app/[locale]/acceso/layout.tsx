import { NextIntlClientProvider } from 'next-intl';

import { routeMessages } from '@/i18n/route-messages';

type AccesoLayoutProps = { children: React.ReactNode };

/** El reino «Acceso» vuelve a proveer los mensajes con los namespaces que usa. */
export default async function AccesoLayout({ children }: AccesoLayoutProps) {
  return (
    <NextIntlClientProvider messages={await routeMessages('acceso')}>
      {children}
    </NextIntlClientProvider>
  );
}
