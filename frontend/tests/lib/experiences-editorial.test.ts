import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { EDITORIAL_ASSETS } from '@/config/editorial-assets.generated';
import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { EXPERIENCES } from '@/data';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const readSource = (relativePath: string) =>
  readFileSync(resolve(SOURCE_ROOT, relativePath), 'utf8');

const pageSource = readSource('app/[locale]/experiencias/(catalogo)/page.tsx');
const bookingPageSource = readSource('app/[locale]/experiencias/[experienceId]/reservar/page.tsx');
const listSource = readSource('components/features/experiences/experience-list.tsx');
const rowSource = readSource('components/features/experiences/experience-row.tsx');
const bookingSource = readSource('components/features/experiences/booking-flow.tsx');
const heroSource = readSource('components/layout/realm-hero.tsx');
const loadingSource = readSource('app/[locale]/experiencias/(catalogo)/loading.tsx');

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
  it('resolves every experiences and booking slot to its published photo or a fallback, never invented media', () => {
    for (const { slot, aspect } of EXPERIENCE_SLOTS) {
      const media = resolveEditorialMedia(slot, { alt: `Editorial ${slot}` });
      // La única fuente legítima es la publicada en el manifiesto; nada se inventa.
      const published = EDITORIAL_ASSETS[slot];

      expect(media).toMatchObject({ kind: published ? 'photo' : 'fallback', slot, aspect });
      expect(media.src).toBe(published);
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
    expect(pageSource).toContain('<RealmHero');
    expect(heroSource).toContain('<FullBleedSection');
    expect(listSource).toContain('fm-editorial-full-bleed');
    expect(pageSource).toContain('<ExperienceList');
    expect(pageSource).toContain('media={experienceMedia}');
    expect(pageSource).toContain('hero={');
    expect(listSource).toContain('media: ExperienceMedia');
    expect(listSource).toContain('media={{ ...media.featured, band: featured.band }}');
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
    // El CTA es un ButtonLink (cliente): Button asChild + Link desaparece en Server Components.
    expect(rowSource).toContain('<ButtonLink');
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

  it('waits with the shared loading scene, like every other view', () => {
    // Una sola espera en todo el sitio: la esfera de `states.loading` (ver `loading-flow`).
    expect(loadingSource.trim()).toBe(
      "export { RealmLoading as default } from '@/components/layout';",
    );
  });
  it('anchors the booking hero at its 16:9 on top of the card instead of stretching it', () => {
    const hero = bookingSource.slice(
      bookingSource.lastIndexOf(
        '<div',
        bookingSource.indexOf('data-editorial-media="booking.hero"'),
      ),
      bookingSource.indexOf('</div>', bookingSource.indexOf('data-editorial-media="booking.hero"')),
    );
    expect(hero).toContain('aspect-[16/9]');
    expect(hero).toContain('top-0');
    expect(hero).not.toContain('inset-0');
    expect(hero).toContain('fade="bottom"');
  });
  it('paints each experience row at 16:9 from 768px', () => {
    const row = rowSource.slice(
      rowSource.indexOf('data-editorial-media="experiences-visual"') - 400,
    );
    expect(row).toContain('md:aspect-[16/9]');
    expect(row).toContain('md:min-h-0');
  });
});

export {};
