'use client';

import { useTranslations } from 'next-intl';

import { Button, ConfirmationPanel } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import type { EditorialMedia } from '@/types/editorial-media';

type BookingConfirmationProps = {
  media: EditorialMedia;
  /** Título de la experiencia reservada, ya traducido. */
  title: string;
  /** Fecha elegida, ya formateada para el idioma activo. */
  date: string;
  /** Hora elegida (de `AVAILABLE_TIMES`). */
  time: string;
};

/** El paso final: la reserva queda confirmada sobre su foto. */
export function BookingConfirmation({ media, title, date, time }: BookingConfirmationProps) {
  const t = useTranslations('booking');

  return (
    <ConfirmationPanel
      announce
      className="text-fg"
      media={media}
      slot="booking.confirmation"
      title={t('done.title')}
      description={t('done.description')}
      iconLabel={t('done.title')}
      minHeightClass="min-h-[clamp(460px,52vw,680px)]"
      contentClassName="max-w-[620px]"
    >
      <div className="text-fg-soft text-meta tracking-soft mt-5 font-sans leading-[1.8]">
        <p>{title}</p>
        <p>
          {date} · {time}
        </p>
      </div>
      <Button variant="outline" className="mt-8 self-start" asChild>
        <Link href="/experiencias">{t('done.cta')}</Link>
      </Button>
    </ConfirmationPanel>
  );
}
