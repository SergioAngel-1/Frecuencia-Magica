import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { EXPERIENCES } from '@/data';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const readSource = (relativePath: string) =>
  readFileSync(resolve(SOURCE_ROOT, relativePath), 'utf8');

const pageSource = readSource('app/[locale]/experiencias/page.tsx');
const bookingPageSource = readSource('app/[locale]/experiencias/[experienceId]/reservar/page.tsx');
const listSource = readSource('components/features/experiences/experience-list.tsx');
const rowSource = readSource('components/features/experiences/experience-row.tsx');
const bookingSource = readSource('components/features/experiences/booking-flow.tsx');
const loadingSource = readSource('app/[locale]/experiencias/loading.tsx');

const EXPERIENCE_SLOTS = [
  { slot: 'experiences.hero' as const, aspect: '16:9' as const, alt: 'hero' },
  { slot: 'experiences.featured' as const, aspect: '16:8' as const, alt: 'featured' },
  { slot: 'experiences-visual' as const, aspect: '16:9' as const, alt: 'row' },
  { slot: 'booking.hero' as const, aspect: '16:9' as const, alt: 'hero' },
  { slot: 'booking.confirmation' as const, aspect: '16:8' as const, alt: 'confirmation' },
];

type MediaMessages = { media: { alt: Record<string, string> } };
const esExperiences = esMessages.experiences as unknown as MediaMessages;
const enExperiences = enMessages.experiences as unknown as MediaMessages;
const esBooking = esMessages.booking as unknown as MediaMessages;
const enBooking = enMessages.booking as unknown as MediaMessages;

describe('experiences editorial composition contracts', () => {
  it('resolves every experiences and booking slot to a zebra fallback without inventing media', () => {
    for (const { slot, aspect } of EXPERIENCE_SLOTS) {
      const media = resolveEditorialMedia(slot, { alt: `Editorial ${slot}` });

      expect(media).toMatchObject({ kind: 'fallback', slot, aspect });
      expect(media.src).toBeUndefined();
      expect(EDITORIAL_MEDIA_REGISTRY[slot]).toBeDefined();
    }

    expect(EDITORIAL_MEDIA_REGISTRY['experiences.featured'].position).toBe('50% 45%');
  });

  it('provides distinct bilingual alt copy through the real media namespaces', () => {
    const experienceAltKeys = ['hero', 'featured', 'row'];
    const bookingAltKeys = ['hero', 'confirmation'];

    for (const key of experienceAltKeys) {
      const esAlt = esExperiences.media.alt[key];
      const enAlt = enExperiences.media.alt[key];

      expect(esAlt).toBeTruthy();
      expect(enAlt).toBeTruthy();
      expect(enAlt).not.toBe(esAlt);
    }

    for (const key of bookingAltKeys) {
      const esAlt = esBooking.media.alt[key];
      const enAlt = enBooking.media.alt[key];

      expect(esAlt).toBeTruthy();
      expect(enAlt).toBeTruthy();
      expect(enAlt).not.toBe(esAlt);
    }
  });

  it('composes a localized full-width hero and passes media into the experiences archive', () => {
    expect(pageSource).toContain('const locale = await resolveLocale(params);');
    expect(pageSource).toContain("getTranslations({ locale, namespace: 'experiences' })");
    expect(pageSource).toContain("resolveEditorialMedia('experiences.hero'");
    expect(pageSource).toContain("resolveEditorialMedia('experiences.featured'");
    expect(pageSource).toContain("resolveEditorialMedia('experiences-visual'");
    expect(pageSource).toContain('<FullBleedSection');
    expect(pageSource).toContain('fm-editorial-full-bleed');
    expect(pageSource).toContain('<ExperienceList media={experienceMedia}');
    expect(listSource).toContain('media: ExperienceMedia');
    expect(listSource).toContain('media={media.featured}');
    expect(listSource).toContain('media={experienceMedia(exp)}');
  });

  it('keeps the featured encounter and standard rows image-led with localized metadata rails', () => {
    expect(rowSource).toContain('<EditorialImage');
    expect(rowSource).toContain('data-editorial-media="experiences.featured"');
    expect(rowSource).toContain('data-editorial-media="experiences-visual"');
    expect(rowSource).toContain('media={media}');
    expect(rowSource).toContain('formatPrice(experience.price)');
    expect(rowSource).toContain('experience.dur');
    expect(rowSource).toContain('dateTime={date.iso}');
    expect(rowSource).toContain('{date.dow} {date.day} {date.month}');
    expect(listSource).toContain('upcomingDates(new Date(), EXPERIENCES.length, locale)');
    expect(listSource).toContain('date={dates[0]!}');
    expect(listSource).toContain('date={dates[index + 1]!}');
    expect(rowSource).toContain('<Link');
    expect(rowSource).toContain("pathname: '/experiencias/[experienceId]/reservar'");
    expect(rowSource).not.toMatch(/unsplash|https?:\/\//i);
    expect(EXPERIENCES).toHaveLength(4);
    expect(listSource.match(/<ExperienceRow/g)?.length).toBe(2);
    expect(listSource).toContain('{others.map');
  });

  it('adds booking atmosphere and a quiet confirmation while preserving the flow seam', () => {
    expect(bookingPageSource).toContain('const locale = await resolveLocale(params);');
    expect(bookingPageSource).toContain("getTranslations({ locale, namespace: 'booking' })");
    expect(bookingPageSource).toContain("resolveEditorialMedia('booking.hero'");
    expect(bookingPageSource).toContain("resolveEditorialMedia('booking.confirmation'");
    expect(bookingPageSource).toContain(
      '<BookingFlow experience={experience} media={bookingMedia}',
    );
    expect(bookingSource).toContain('media: BookingMedia');
    expect(bookingSource).toContain('data-editorial-media="booking.hero"');
    expect(bookingSource).toContain('data-editorial-media="booking.confirmation"');
    expect(bookingSource).toContain('<EditorialImage');
    expect(bookingSource).toContain('aria-live="polite"');
    expect(bookingSource).toContain('aria-pressed={booking.state.date === d.iso}');
    expect(bookingSource).toContain('aria-pressed={booking.state.time === time}');
    expect(bookingSource).toContain('booking.canContinue');
    expect(bookingSource).toContain('booking.canConfirm');
    expect(bookingSource).toContain('booking.back');
    expect(bookingSource).toContain('booking.continue');
    expect(bookingSource).toContain('booking.confirm');
    expect(bookingSource).toContain('TODO(backend)');
    expect(bookingSource).toContain('toLocaleDateString(locale');
    expect(bookingSource).toContain('min-h-11');
    expect(bookingSource).not.toMatch(/unsplash|https?:\/\//i);
  });

  it('mirrors the image-led listing in loading with zebra slots instead of gray placeholders', () => {
    expect(loadingSource).toContain('aria-busy="true"');
    expect(loadingSource).toContain('<MediaSkeleton');
    for (const { slot } of EXPERIENCE_SLOTS.slice(0, 3)) {
      expect(loadingSource).toContain(`slot="${slot}"`);
    }
    expect(loadingSource).toContain('motion-safe:');
    expect(loadingSource).not.toContain('bg-gray');
  });
});

export {};
