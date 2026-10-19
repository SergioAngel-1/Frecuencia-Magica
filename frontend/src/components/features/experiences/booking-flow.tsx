'use client';

import { useLocale, useTranslations } from 'next-intl';

import { BookingConfirmation } from '@/components/features/experiences/booking-confirmation';
import { BookingDateStep, BOOKING_DAYS } from '@/components/features/experiences/booking-date-step';
import { BookingDetailsStep } from '@/components/features/experiences/booking-details-step';
import { Display, EditorialImage, StepProgress, Swap } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { useBooking } from '@/hooks/use-booking';
import { useUpcomingDates } from '@/hooks/use-upcoming-dates';
import { formatPrice } from '@/lib/format';
import type { Experience } from '@/types/content';
import type { EditorialMedia } from '@/types/editorial-media';

export type BookingMedia = {
  hero: EditorialMedia;
  confirmation: EditorialMedia;
};

type BookingFlowProps = {
  experience: Experience;
  media: BookingMedia;
};

function formatSelectedDate(date: string | null, locale: string): string {
  if (!date) return '';

  return new Date(`${date}T12:00:00`).toLocaleDateString(locale, {
    dateStyle: 'long',
  });
}

/** El flujo de reserva en tres pasos: fecha, datos y confirmación. */
export function BookingFlow({ experience, media }: BookingFlowProps) {
  const t = useTranslations('booking');
  const common = useTranslations('common');
  const expT = useTranslations('experiences');
  const locale = useLocale();
  const booking = useBooking();
  const dates = useUpcomingDates(BOOKING_DAYS);
  const stepLabels = [t('steps.date'), t('steps.details'), t('steps.done')];
  const title = expT(`items.${experience.id}.title`);

  return (
    <div className="fm-editorial-full-bleed fm-container pb-section pt-hero">
      <Swap id={booking.step === 2 ? 'confirmed' : 'booking'}>
        {booking.step === 2 ? (
          <BookingConfirmation
            media={media.confirmation}
            title={title}
            date={formatSelectedDate(booking.state.date, locale)}
            time={booking.state.time ?? ''}
          />
        ) : (
          <section
            className="rounded-card-lg relative isolate overflow-hidden"
            data-editorial-flow="booking"
          >
            {/* La foto se ancla arriba a su 16:9 y funde en la noche: el
                formulario crece con sus pasos sin estirarla. */}
            <div
              className="absolute inset-x-0 top-0 aspect-[16/9]"
              data-editorial-media="booking.hero"
            >
              <EditorialImage
                aspect="16:9"
                className="h-full"
                fade="bottom"
                focalPoint={media.hero.position}
                media={media.hero}
                overlay="bottom"
                scrim="bottom"
              />
            </div>
            <div className="bg-scrim/72 relative z-10 px-[clamp(20px,6vw,84px)] py-[clamp(24px,5vw,64px)] backdrop-blur-[2px]">
              <Link
                href="/experiencias"
                className="text-fg-soft hover:text-fg text-meta tracking-ui inline-flex min-h-11 items-center py-3 font-sans uppercase transition-colors"
              >
                ← {common('back')}
              </Link>

              <StepProgress
                variant="labeled"
                current={booking.step}
                steps={stepLabels}
                ariaLabel={t('progress', { current: booking.step + 1, total: 3 })}
                className="my-[38px] max-w-[720px]"
              />

              <div className="max-w-[720px]">
                <Display size="xs" level="h1">
                  {title}
                </Display>
                <p className="text-fg-soft text-meta mt-3 font-sans leading-[1.6]">
                  {formatPrice(experience.price)} · {experience.dur}
                </p>

                <Swap id={`step-${booking.step}`}>
                  {booking.step === 0 && <BookingDateStep booking={booking} dates={dates} />}
                  {booking.step === 1 && <BookingDetailsStep booking={booking} />}
                </Swap>
              </div>
            </div>
          </section>
        )}
      </Swap>
    </div>
  );
}
