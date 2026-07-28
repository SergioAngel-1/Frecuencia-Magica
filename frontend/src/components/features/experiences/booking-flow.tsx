'use client';

import { useLocale, useTranslations } from 'next-intl';

import { Button, Display, Field, Input, StepProgress, Textarea } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { useBooking } from '@/hooks/use-booking';
import { upcomingDates, AVAILABLE_TIMES } from '@/lib/booking/dates';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { Experience } from '@/types/content';

type BookingFlowProps = {
  experience: Experience;
};

export function BookingFlow({ experience }: BookingFlowProps) {
  const t = useTranslations('booking');
  const common = useTranslations('common');
  const expT = useTranslations('experiences');
  const locale = useLocale();
  const booking = useBooking();
  const dates = upcomingDates(new Date(), 14, locale);
  const stepLabels = [t('steps.date'), t('steps.details'), t('steps.done')];

  const title = expT(`items.${experience.id}.title` as 'items.e1.title');

  return (
    <div className="mx-auto max-w-[720px]">
      <Link
        href="/experiencias"
        className="font-sans text-[13px] uppercase tracking-[.12em] text-ivory/60 transition-colors hover:text-ivory"
      >
        ← {common('back')}
      </Link>

      <StepProgress
        variant="labeled"
        current={booking.step}
        steps={stepLabels}
        ariaLabel={t('progress', { current: booking.step + 1, total: 3 })}
        className="my-[38px]"
      />

      <Display size="xs" level="h1">
        {booking.step === 2 ? t('done.title') : title}
      </Display>
      {booking.step < 2 && (
        <p className="font-sans text-[13px] leading-[1.6] text-ivory/60 mt-2">
          {formatPrice(experience.price)} · {experience.dur}
        </p>
      )}

      {booking.step === 0 && (
        <div className="mt-8">
          {/* Fechas */}
          <p className="font-sans text-[11px] uppercase tracking-[.3em] text-lav mb-4">
            {t('dateLabel')}
          </p>
          <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-3">
            {dates.map((d) => (
              <button
                key={d.iso}
                type="button"
                onClick={() => booking.pickDate(d.iso)}
                className={cn(
                  'flex flex-col items-center rounded-[14px] px-2 py-[14px] text-center transition-colors backdrop-blur-[6px]',
                  booking.state.date === d.iso
                    ? 'border border-lav/55 bg-lav/16 text-ivory'
                    : 'border border-ivory/14 bg-ivory/4 text-ivory/80 hover:border-lav/30',
                )}
              >
                <span className="font-sans text-[11px] uppercase tracking-[.08em] text-ivory/60">
                  {d.dow}
                </span>
                <span className="font-serif text-[26px] leading-[1.1]">{d.day}</span>
                <span className="font-sans text-[10px] uppercase tracking-[.06em] text-ivory/50">
                  {d.month}
                </span>
              </button>
            ))}
          </div>

          {/* Horas */}
          <p className="font-sans text-[11px] uppercase tracking-[.3em] text-lav mb-4">
            {t('timeLabel')}
          </p>
          <div className="mb-8 flex flex-wrap gap-3">
            {AVAILABLE_TIMES.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => booking.pickTime(time)}
                className={cn(
                  'rounded-[12px] px-6 py-3 font-sans text-[15px] transition-colors backdrop-blur-[6px]',
                  booking.state.time === time
                    ? 'border border-lav/55 bg-lav/16 text-ivory'
                    : 'border border-ivory/14 bg-ivory/4 text-ivory/70 hover:border-lav/30',
                )}
              >
                {time}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!booking.canContinue}
            onClick={booking.continue}
          >
            {t('continue')}
          </Button>
        </div>
      )}

      {booking.step === 1 && (
        <div className="mt-8 flex flex-col gap-4">
          <Field label={t('fields.name')} htmlFor="name">
            <Input
              type="text"
              placeholder={t('fields.namePlaceholder')}
              value={booking.state.name}
              onChange={(e) => booking.setField('name', e.target.value)}
            />
          </Field>
          <Field label={t('fields.email')} htmlFor="email">
            <Input
              type="email"
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
            size="lg"
            className="w-full"
            disabled={!booking.canConfirm}
            onClick={booking.confirm}
          >
            {t('confirm')}
          </Button>
        </div>
      )}

      {booking.step === 2 && (
        <div className="mt-10 flex flex-col items-center text-center">
          <div
            aria-hidden="true"
            className="mb-6 size-[120px] animate-fm-breathe rounded-full"
            style={{
              background:
                'radial-gradient(circle at 42% 38%, rgba(247,244,234,0.9), rgba(185,176,214,0.55) 44%, transparent 72%)',
              boxShadow: '0 0 80px 22px rgba(185,176,214,0.3)',
            }}
          />
          <p className="text-ivory/72 max-w-[40ch] text-[15px] leading-[1.8]">
            {t('done.description')}
          </p>
          <div className="mt-4 text-[13px] leading-[1.8] text-ivory/60">
            <p>{title}</p>
            <p>{booking.state.date} · {booking.state.time}</p>
          </div>
          <Button variant="outline" size="lg" className="mt-8" asChild>
            <Link href="/experiencias">{t('done.cta')}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
