import { getTranslations } from 'next-intl/server';

import { AuthAside, AuthForm } from '@/components/features/auth';
import { PageShell } from '@/components/layout';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'auth' });

  return { title: t('login.title') };
}

export default async function AuthPage({ params }: PageProps) {
  await resolveLocale(params);

  return (
    <PageShell width="wide" padding="none">
      {/* Por debajo de 900px el aside pasa arriba (order-1): el logo y la
          cita reciben al usuario antes que el formulario. */}
      <div className="grid grid-cols-1 min-[900px]:grid-cols-[1fr_360px]">
        <div className="order-2 min-[900px]:order-1">
          <AuthForm />
        </div>
        <div className="order-1 min-[900px]:order-2">
          <AuthAside />
        </div>
      </div>
    </PageShell>
  );
}
