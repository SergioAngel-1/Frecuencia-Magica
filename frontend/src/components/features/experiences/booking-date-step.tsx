'use client';

import { useTranslations } from 'next-intl';

import { Button, Kicker, Skeleton } from '@/components/ui';
import { AVAILABLE_TIMES, type DateOption } from '@/lib/booking/dates';
import { cn } from '@/lib/cn';
import type { BookingFlowState } from '@/hooks/use-booking';

/** Días de reserva que ofrece el formulario. */
export const BOOKING_DAYS = 14;

type BookingDateStepProps = {
  booking: BookingFlowState;
  /** Próximas fechas, aún `null` hasta que el cliente monta (SSG seguro). */
  dates: DateOption[] | null;
};

/** El primer paso: elegir día y hora de la experiencia. */
export function BookingDateStep({ booking, dates }: BookingDateStepProps) {
  const t = useTranslations('booking');

  return (
    <div className="mt-8">
      <Kicker tone="lav" className="mb-4">
        {t('dateLabel')}
      </Kicker>
      <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-3">
        {dates === null
          ? Array.from({ length: BOOKING_DAYS }, (_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="border-fg/14 bg-fg/4 flex min-h-[82px] flex-col items-center justify-center gap-1 rounded-[14px] border px-2 py-[14px]"
              >
                <Skeleton className="h-[11px] w-8" />
                <Skeleton className="h-[28px] w-7" />
                <Skeleton className="h-[11px] w-9" />
              </div>
            ))
          : dates.map((d) => (
              <button
                key={d.iso}
                type="button"
                onClick={() => booking.pickDate(d.iso)}
                aria-pressed={booking.state.date === d.iso}
                className={cn(
                  'flex min-h-11 flex-col items-center rounded-[14px] px-2 py-[14px] text-center backdrop-blur-[6px] transition-colors focus-visible:outline',
                  booking.state.date === d.iso
                    ? 'border-accent-3/55 bg-accent-3/16 text-fg border'
                    : 'border-fg/14 bg-fg/4 text-fg-body hover:border-accent-3/30 border',
                )}
              >
                <span className="text-fg-muted text-label tracking-ui font-sans uppercase">
                  {d.dow}
                </span>
                <span className="font-serif text-[26px] leading-[1.1]">{d.day}</span>
                <span className="text-fg-meta text-label tracking-soft font-sans uppercase">
                  {d.month}
                </span>
              </button>
            ))}
      </div>

      <Kicker tone="lav" className="mb-4">
        {t('timeLabel')}
      </Kicker>
      <div className="mb-8 flex flex-wrap gap-3">
        {AVAILABLE_TIMES.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => booking.pickTime(time)}
            aria-pressed={booking.state.time === time}
            className={cn(
              'text-body min-h-11 rounded-[12px] px-6 py-3 font-sans backdrop-blur-[6px] transition-colors focus-visible:outline',
              booking.state.time === time
                ? 'border-accent-3/55 bg-accent-3/16 text-fg border'
                : 'border-fg/14 bg-fg/4 text-fg-soft hover:border-accent-3/30 border',
            )}
          >
            {time}
          </button>
        ))}
      </div>

      {!booking.canContinue ? (
        <p
          id="booking-continue-hint"
          className="text-fg-muted text-meta mb-4 font-sans leading-[1.5]"
        >
          {t('continueHint')}
        </p>
      ) : null}
      <Button
        variant="primary"
        className="w-full sm:w-auto"
        disabled={!booking.canContinue}
        aria-describedby={!booking.canContinue ? 'booking-continue-hint' : undefined}
        onClick={booking.continue}
      >
        {t('continue')}
      </Button>
    </div>
  );
}
