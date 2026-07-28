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
    <PageShell width="focus" padding="centered">
      <div className="grid gap-10 md:grid-cols-[1fr_360px] md:items-start">
        <AuthForm />
        <AuthAside />
      </div>
    </PageShell>
  );
}
