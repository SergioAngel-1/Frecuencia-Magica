import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { COURSES } from '@/data';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const readSource = (relativePath: string) =>
  readFileSync(resolve(SOURCE_ROOT, relativePath), 'utf8');

const pageSource = readSource('app/[locale]/academia/page.tsx');
const coursePageSource = readSource('app/[locale]/academia/[courseId]/page.tsx');
const lessonPageSource = readSource('app/[locale]/academia/[courseId]/[lessonId]/page.tsx');
const listSource = readSource('components/features/academy/course-list.tsx');
const cardSource = readSource('components/features/academy/course-card.tsx');
const detailSource = readSource('components/features/academy/course-detail.tsx');
const lessonListSource = readSource('components/features/academy/lesson-list.tsx');
const playerSource = readSource('components/features/academy/lesson-player.tsx');
const loadingSource = readSource('app/[locale]/academia/loading.tsx');

const ACADEMY_SLOTS = [
  { slot: 'academy.hero' as const, aspect: '16:9' as const, alt: 'hero' },
  { slot: 'academy.featured-course' as const, aspect: '16:8' as const, alt: 'featured' },
  { slot: 'academy-course-cover' as const, aspect: '16:8' as const, alt: 'courseCover' },
  { slot: 'academy-lesson-visual' as const, aspect: '16:8' as const, alt: 'lesson' },
  { slot: 'academy.completion' as const, aspect: '16:8' as const, alt: 'completion' },
];

type AcademyMediaMessages = { media: { alt: Record<string, string> } };
const esAcademy = esMessages.academy as unknown as AcademyMediaMessages;
const enAcademy = enMessages.academy as unknown as AcademyMediaMessages;

describe('academy editorial composition contracts', () => {
  it('resolves every academy slot to a localized zebra fallback without inventing media', () => {
    for (const { slot, aspect } of ACADEMY_SLOTS) {
      const media = resolveEditorialMedia(slot, { alt: `Academy ${slot}` });

      expect(media).toMatchObject({ kind: 'fallback', slot, aspect });
      expect(media.src).toBeUndefined();
      expect(EDITORIAL_MEDIA_REGISTRY[slot]).toBeDefined();
    }
  });

  it('provides distinct bilingual alt copy for each academy slot', () => {
    for (const { alt } of ACADEMY_SLOTS) {
      const esAlt = esAcademy.media.alt[alt];
      const enAlt = enAcademy.media.alt[alt];

      expect(esAlt).toBeTruthy();
      expect(enAlt).toBeTruthy();
      expect(enAlt).not.toBe(esAlt);
    }
  });

  it('composes a localized full-width hero and passes editorial media into the course archive', () => {
    expect(pageSource).toContain('const locale = await resolveLocale(params);');
    expect(pageSource).toContain("getTranslations({ locale, namespace: 'academy' })");
    expect(pageSource).toContain("resolveEditorialMedia('academy.hero'");
    expect(pageSource).toContain("resolveEditorialMedia('academy.featured-course'");
    expect(pageSource).toContain("resolveEditorialMedia('academy-course-cover'");
    expect(pageSource).toContain('<FullBleedSection');
    expect(pageSource).toContain('fm-editorial-full-bleed');
    expect(pageSource).toContain('<CourseList media={academyMedia}');
    expect(listSource).toContain('media: AcademyMedia');
    expect(listSource).toContain('media={media.featuredCourse}');
    expect(listSource).toContain('media={courseMedia(course)}');
    expect(listSource).toContain('data-editorial-archive="true"');
  });

  it('keeps course covers as EditorialImage fields with the card crop and localized alt', () => {
    expect(cardSource).toContain('<EditorialImage');
    expect(cardSource).toContain('data-editorial-media="academy-course-cover"');
    expect(cardSource).toContain('aspect="1:1"');
    expect(detailSource).toContain('media: EditorialMedia');
    expect(detailSource).toContain('media={media}');
    expect(detailSource).toContain('<EditorialImage');
    expect(coursePageSource).toContain("alt: t('media.alt.courseCover'");
  });

  it('keeps the detail reading rail and localized lesson routes intact', () => {
    expect(detailSource).toContain('<LessonList');
    expect(detailSource).toContain('sticky');
    expect(lessonListSource).toContain('<nav');
    expect(lessonListSource).toContain("aria-current={isCurrent ? 'page' : undefined}");
    expect(lessonListSource).toContain('min-h-11');
    expect(lessonPageSource).toContain('<LessonPlayer');
    expect(lessonPageSource).toContain("resolveEditorialMedia('academy-lesson-visual'");
    expect(lessonPageSource).toContain("resolveEditorialMedia('academy.completion'");
  });

  it('uses the lesson visual fallback and native audio controls while preserving navigation', () => {
    expect(playerSource).toContain('<EditorialImage');
    expect(playerSource).toContain('media={lessonMedia}');
    expect(playerSource).toContain('data-editorial-media="academy-lesson-visual"');
    expect(playerSource).toContain('<audio');
    expect(playerSource).toContain('controls');
    expect(playerSource).toContain('aria-describedby');
    expect(playerSource).toContain('previousLesson');
    expect(playerSource).toContain('nextLesson');
    expect(playerSource).toContain('completionMedia');
    expect(playerSource).toContain('academy.completion');
    expect(playerSource).not.toMatch(/unsplash|https?:\/\//i);
  });

  it('mirrors the editorial spread in loading without gray placeholders', () => {
    expect(loadingSource).toContain('aria-busy="true"');
    expect(loadingSource).toContain('<MediaSkeleton');
    for (const { slot } of ACADEMY_SLOTS.slice(0, 3)) {
      expect(loadingSource).toContain(`slot="${slot}"`);
    }
    expect(loadingSource).toContain('data-editorial-archive="true"');
    expect(loadingSource).toContain('motion-safe:');
  });

  it('keeps every catalog course represented exactly once in the archive source', () => {
    expect(COURSES).toHaveLength(3);
    expect(listSource.match(/<CourseCard/g)?.length).toBe(2);
    expect(listSource).toContain('{others.map');
  });
});

export {};
