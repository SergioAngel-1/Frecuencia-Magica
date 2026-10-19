import { NextIntlClientProvider } from 'next-intl';

import { routeMessages } from '@/i18n/route-messages';

type InicioLayoutProps = { children: React.ReactNode };

/** El reino «Inicio» vuelve a proveer los mensajes con los namespaces que usa. */
export default async function InicioLayout({ children }: InicioLayoutProps) {
  return (
    <NextIntlClientProvider messages={await routeMessages('inicio')}>
      {children}
    </NextIntlClientProvider>
  );
}
