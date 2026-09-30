'use client';

import { useLocale, useTranslations } from 'next-intl';

import {
  Button,
  Display,
  EditorialImage,
  Field,
  Input,
  StepProgress,
  Textarea,
  Kicker,
} from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { useBooking } from '@/hooks/use-booking';
import { upcomingDates, AVAILABLE_TIMES } from '@/lib/booking/dates';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';
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

export function BookingFlow({ experience, media }: BookingFlowProps) {
  const t = useTranslations('booking');
  const common = useTranslations('common');
  const expT = useTranslations('experiences');
  const locale = useLocale();
  const booking = useBooking();
  const dates = upcomingDates(new Date(), 14, locale);
  const stepLabels = [t('steps.date'), t('steps.details'), t('steps.done')];
  const title = expT(`items.${experience.id}.title` as 'items.e1.title');
  const selectedDate = formatSelectedDate(booking.state.date, locale);

  return (
    <div className="fm-editorial-full-bleed fm-container pt-[clamp(100px,12vw,160px)] pb-[220px]">
      {booking.step === 2 ? (
        <section
          aria-live="polite"
          className="rounded-card-lg text-ivory relative isolate min-h-[clamp(460px,52vw,680px)] overflow-hidden"
          data-editorial-media="booking.confirmation"
          role="status"
        >
          <div className="absolute inset-0">
            <EditorialImage
              aspect="16:8"
              className="h-full"
              focalPoint={media.confirmation.position}
              media={media.confirmation}
              overlay="bottom"
              scrim="bottom"
            />
          </div>
          <div className="relative z-10 flex min-h-[clamp(460px,52vw,680px)] max-w-[620px] flex-col justify-end px-[clamp(24px,7vw,84px)] py-[clamp(30px,7vw,84px)]">
            <span className="border-gold/60 bg-void/35 text-gold mb-5 inline-flex size-14 items-center justify-center rounded-full border font-serif text-[24px] backdrop-blur-sm">
              <span aria-hidden="true">✓</span>
              <span className="sr-only">{t('done.title')}</span>
            </span>
            <Display size="md" level="h1">
              {t('done.title')}
            </Display>
            <p className="text-fg-body mt-5 max-w-[42ch] text-[16px] leading-[1.8]">
              {t('done.description')}
            </p>
            <div className="text-fg-soft text-meta tracking-soft mt-5 font-sans leading-[1.8]">
              <p>{title}</p>
              <p>
                {selectedDate} · {booking.state.time}
              </p>
            </div>
            <Button variant="outline" size="lg" className="mt-8 self-start" asChild>
              <Link href="/experiencias">{t('done.cta')}</Link>
            </Button>
          </div>
        </section>
      ) : (
        <section
          className="rounded-card-lg relative isolate overflow-hidden"
          data-editorial-flow="booking"
        >
          <div className="absolute inset-0" data-editorial-media="booking.hero">
            <EditorialImage
              aspect="16:9"
              className="h-full"
              focalPoint={media.hero.position}
              media={media.hero}
              overlay="bottom"
              scrim="bottom"
            />
          </div>
          <div className="bg-void/72 relative z-10 px-[clamp(20px,6vw,84px)] py-[clamp(24px,5vw,64px)] backdrop-blur-[2px]">
            <Link
              href="/experiencias"
              className="text-fg-soft hover:text-ivory text-meta tracking-ui inline-flex min-h-11 items-center py-3 font-sans uppercase transition-colors"
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

              {booking.step === 0 && (
                <div className="mt-8">
                  <Kicker tone="lav" className="mb-4">
                    {t('dateLabel')}
                  </Kicker>
                  <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-3">
                    {dates.map((d) => (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => booking.pickDate(d.iso)}
                        aria-pressed={booking.state.date === d.iso}
                        className={cn(
                          'flex min-h-11 flex-col items-center rounded-[14px] px-2 py-[14px] text-center backdrop-blur-[6px] transition-colors focus-visible:outline',
                          booking.state.date === d.iso
                            ? 'border-lav/55 bg-lav/16 text-ivory border'
                            : 'border-ivory/14 bg-ivory/4 text-fg-body hover:border-lav/30 border',
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
                            ? 'border-lav/55 bg-lav/16 text-ivory border'
                            : 'border-ivory/14 bg-ivory/4 text-fg-soft hover:border-lav/30 border',
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
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={!booking.canContinue}
                    aria-describedby={!booking.canContinue ? 'booking-continue-hint' : undefined}
                    onClick={booking.continue}
                  >
                    {t('continue')}
                  </Button>
                </div>
              )}

              {booking.step === 1 && (
                <div className="mt-8 flex max-w-[620px] flex-col gap-4">
                  <Button variant="ghost" size="sm" className="self-start" onClick={booking.back}>
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
                    size="lg"
                    className="mt-2 w-full sm:w-auto"
                    disabled={!booking.canConfirm}
                    onClick={booking.confirm}
                  >
                    {t('confirm')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
