'use client';

import { useTranslations } from 'next-intl';

import { Button, Display, EditorialImage, Kicker, Prose } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import type { EditorialMedia } from '@/types/editorial-media';

type OrderConfirmationProps = {
  media: EditorialMedia;
};

export function OrderConfirmation({ media }: OrderConfirmationProps) {
  const t = useTranslations('cart');

  return (
    <section
      className="rounded-card-lg relative isolate min-h-[clamp(360px,45vw,560px)] overflow-hidden"
      data-editorial-media="checkout.confirmation"
      aria-live="polite"
    >
      <div className="absolute inset-0">
        <EditorialImage
          aspect="16:8"
          className="h-full"
          media={media}
          overlay="bottom"
          scrim="bottom"
        />
      </div>
      <div className="relative z-10 flex min-h-[clamp(360px,45vw,560px)] flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <Kicker tone="gold" spacing="widest">
          {t('thanks')}
        </Kicker>
        <Display size="md" level="h1">
          {t('done.title')}
        </Display>
        <Prose maxWidth={44} className="text-ivory/82">
          {t('done.description')}
        </Prose>
        <Button variant="primary" asChild>
          <Link href="/tienda">{t('done.cta')}</Link>
        </Button>
      </div>
    </section>
  );
}
