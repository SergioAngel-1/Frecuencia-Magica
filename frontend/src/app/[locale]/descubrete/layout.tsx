import { NextIntlClientProvider } from 'next-intl';

import { routeMessages } from '@/i18n/route-messages';

type DescubreteLayoutProps = { children: React.ReactNode };

/** El reino «Descúbrete» vuelve a proveer los mensajes con los namespaces que usa. */
export default async function DescubreteLayout({ children }: DescubreteLayoutProps) {
  return (
    <NextIntlClientProvider messages={await routeMessages('descubrete')}>
      {children}
    </NextIntlClientProvider>
  );
}
