import { NextIntlClientProvider } from 'next-intl';

import { routeMessages } from '@/i18n/route-messages';

type ExperienciasLayoutProps = { children: React.ReactNode };

/** El reino «Experiencias» vuelve a proveer los mensajes con los namespaces que usa. */
export default async function ExperienciasLayout({ children }: ExperienciasLayoutProps) {
  return (
    <NextIntlClientProvider messages={await routeMessages('experiencias')}>
      {children}
    </NextIntlClientProvider>
  );
}
