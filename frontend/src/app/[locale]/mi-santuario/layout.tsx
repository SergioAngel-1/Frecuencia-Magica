import { NextIntlClientProvider } from 'next-intl';

import { routeMessages } from '@/i18n/route-messages';

type MiSantuarioLayoutProps = { children: React.ReactNode };

/** El reino «Mi Santuario» vuelve a proveer los mensajes con los namespaces que usa. */
export default async function MiSantuarioLayout({ children }: MiSantuarioLayoutProps) {
  return (
    <NextIntlClientProvider messages={await routeMessages('mi-santuario')}>
      {children}
    </NextIntlClientProvider>
  );
}
