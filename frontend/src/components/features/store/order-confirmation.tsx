'use client';

import { useTranslations } from 'next-intl';

import { Button, Display, Kicker, Prose } from '@/components/ui';
import { Link } from '@/i18n/navigation';

export function OrderConfirmation() {
  const t = useTranslations('cart');

  return (
    <div className="flex flex-col items-center gap-6 py-20 text-center">
      <Kicker tone="gold" spacing="widest">
        {t('thanks')}
      </Kicker>
      <Display size="md" level="h1">
        {t('done.title')}
      </Display>
      <Prose maxWidth={44}>{t('done.description')}</Prose>
      <Button variant="primary" asChild>
        <Link href="/tienda">{t('done.cta')}</Link>
      </Button>
    </div>
  );
}
