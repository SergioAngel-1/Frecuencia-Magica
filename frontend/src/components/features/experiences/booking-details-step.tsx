'use client';

import { useTranslations } from 'next-intl';

import { Button, Field, Input, Textarea } from '@/components/ui';
import type { BookingFlowState } from '@/hooks/use-booking';

type BookingDetailsStepProps = {
  booking: BookingFlowState;
};

/** El segundo paso: los datos de quien reserva. */
export function BookingDetailsStep({ booking }: BookingDetailsStepProps) {
  const t = useTranslations('booking');

  return (
    <div className="mt-8 flex max-w-[620px] flex-col gap-4">
      <Button variant="ghost" className="self-start" onClick={booking.back}>
        ← {t('backToDate')}
      </Button>
      <Field label={t('fields.name')} htmlFor="name">
        <Input
          type="text"
          autoComplete="name"
          placeholder={t('fields.namePlaceholder')}
          value={booking.state.name}
          onChange={(e) => booking.setField('name', e.target.value)}
        />
      </Field>
      <Field label={t('fields.email')} htmlFor="email">
        <Input
          type="email"
          autoComplete="email"
          placeholder={t('fields.emailPlaceholder')}
          value={booking.state.email}
          onChange={(e) => booking.setField('email', e.target.value)}
        />
      </Field>
      <Field label={t('fields.note')} htmlFor="note">
        <Textarea
          placeholder={t('fields.notePlaceholder')}
          value={booking.state.note}
          onChange={(e) => booking.setField('note', e.target.value)}
          rows={3}
        />
      </Field>

      {/* TODO(backend): confirmar sólo avanza el paso. Aquí iría el envío
      real de la reserva y la integración de calendario. */}
      <Button
        variant="primary"
        className="mt-2 w-full sm:w-auto"
        disabled={!booking.canConfirm}
        onClick={booking.confirm}
      >
        {t('confirm')}
      </Button>
    </div>
  );
}
