import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { EDITORIAL_ASSETS } from '@/config/editorial-assets.generated';
import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { COURSES } from '@/data';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const readSource = (relativePath: string) =>
  readFileSync(resolve(SOURCE_ROOT, relativePath), 'utf8');

const pageSource = readSource('app/[locale]/academia/(catalogo)/page.tsx');
const coursePageSource = readSource('app/[locale]/academia/[courseId]/page.tsx');
const lessonPageSource = readSource('app/[locale]/academia/[courseId]/[lessonId]/page.tsx');
const listSource = readSource('components/features/academy/course-list.tsx');
const cardSource = readSource('components/features/academy/course-card.tsx');
const detailSource = readSource('components/features/academy/course-detail.tsx');
const lessonListSource = readSource('components/features/academy/lesson-list.tsx');
const moduleListSource = readSource('components/features/academy/module-list.tsx');
const factsSource = readSource('components/features/academy/course-facts.tsx');
const playerSource = readSource('components/features/academy/lesson-player.tsx');
const heroSource = readSource('components/layout/realm-hero.tsx');
const loadingSource = readSource('app/[locale]/academia/(catalogo)/loading.tsx');

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
  it('resolves every academy slot to its published photo or a fallback, never invented media', () => {
    for (const { slot, aspect } of ACADEMY_SLOTS) {
      const media = resolveEditorialMedia(slot, { alt: `Academy ${slot}` });
      // La única fuente legítima es la publicada en el manifiesto; nada se inventa.
      const published = EDITORIAL_ASSETS[slot];

      expect(media).toMatchObject({ kind: published ? 'photo' : 'fallback', slot, aspect });
      expect(media.src).toBe(published);
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
    expect(pageSource).toContain('<RealmHero');
    expect(heroSource).toContain('<FullBleedSection');
    expect(pageSource).toContain('fm-editorial-full-bleed');
    expect(pageSource).toContain('<CourseList media={academyMedia}');
    expect(listSource).toContain('media: AcademyMedia');
    expect(listSource).toContain('media={{ ...media.featuredCourse, band: featured.band }}');
    expect(listSource).toContain('media={courseMedia(course)}');
    expect(listSource).toContain('data-editorial-archive="true"');
  });

  it('resolves one course cover per course, so each published instance paints itself', () => {
    // Una portada compartida haría que `academy-course-cover:c2` nunca se viera.
    expect(pageSource).toContain('COURSES.map((course)');
    expect(pageSource).toContain('instance: course.id');
    expect(listSource).toContain('media.courseCovers[course.id]');
    expect(coursePageSource).toContain('instance: course.id');
    for (const source of [pageSource, coursePageSource]) {
      const resolutions = source.split("resolveEditorialMedia('academy-course-cover'").slice(1);
      expect(resolutions.length).toBeGreaterThan(0);
      for (const call of resolutions) {
        expect(call.slice(0, call.indexOf('})'))).toContain('instance: course.id');
      }
    }
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

  it('always shows free or paid and the modality, on the card and on the detail', () => {
    expect(factsSource).toContain('course.access.type');
    expect(factsSource).toContain('course.modality');
    expect(factsSource).not.toMatch(/\? <|&& </);
    expect(cardSource).toContain('<CourseFacts');
    expect(detailSource).toContain('<CourseFacts');
  });

  it('keeps the detail reading rail and localized lesson routes intact', () => {
    // T2.12: las lecciones se agrupan en módulos plegables (0fr -> 1fr), con la misma nav y el mismo marcador.
    expect(detailSource).toContain('<ModuleList');
    expect(detailSource).toContain('sticky');
    expect(moduleListSource).toContain('<nav');
    expect(moduleListSource).toContain('<LessonList');
    expect(moduleListSource).toContain('grid-rows-[0fr]');
    expect(moduleListSource).toContain('grid-rows-[1fr]');
    expect(lessonListSource).toContain("aria-current={isCurrent ? 'page' : undefined}");
    expect(lessonListSource).toContain('min-h-11');
    expect(lessonPageSource).toContain('<LessonPlayer');
    expect(lessonPageSource).toContain("resolveEditorialMedia('academy-lesson-visual'");
    expect(lessonPageSource).toContain("resolveEditorialMedia('academy.completion'");
    expect(lessonPageSource).toContain('if (!/^\\d+$/.test(lessonId)) notFound();');
    expect(lessonPageSource).toContain(
      'if (lessonIndex < 0 || lessonIndex > lessons.length) notFound();',
    );
    // Una página por lección más la de finalización, y nada fuera del catálogo.
    expect(lessonPageSource).toContain('length: course.lessons + 1');
    expect(lessonPageSource).toContain('export const dynamicParams = false;');
    expect(coursePageSource).toContain('const course = getCourse(courseId);');
    expect(coursePageSource).toContain('if (!course) return {};');
    expect(lessonPageSource).toContain('const course = getCourse(courseId);');
  });

  it('plays the lesson in the shared player bar, with custom video controls', () => {
    const videoSource = readSource('components/features/player/video-player.tsx');
    const veilSource = readSource('hooks/use-fullscreen-veil.ts');
    const slotSource = readSource('components/features/player/video-slot.tsx');
    const barSource = readSource('components/features/player/player-bar.tsx');
    const dockSource = readSource('components/features/player/player-dock.tsx');

    // El cierre del curso usa el panel de confirmación compartido (ver ui/confirmation-panel).
    expect(playerSource).toContain('<ConfirmationPanel');
    expect(playerSource).toContain('media={lessonMedia}');
    expect(playerSource).toContain('data-editorial-media={lessonMedia.slot}');
    // La lección consume la imagen de su curso (por instancia); la escena
    // genérica de lección sólo cubre al curso sin foto publicada.
    const coverCall = lessonPageSource.slice(
      lessonPageSource.indexOf("resolveEditorialMedia('academy-course-cover'"),
    );
    expect(coverCall.slice(0, coverCall.indexOf('})'))).toContain('instance: course.id');
    expect(lessonPageSource).toContain('const lessonMedia = courseCover.src');
    expect(lessonPageSource).toContain("resolveEditorialMedia('academy-lesson-visual'");
    // La lección lleva el espacio de video del sitio (con fuente, su reproductor), nunca el nativo.
    expect(playerSource).toContain('<VideoSlot');
    expect(slotSource).toContain('<VideoPlayer');
    expect(playerSource).toContain('key={lessonIndex}');
    expect(playerSource).not.toMatch(/<audio|<video/);
    expect(videoSource).toContain('<video');
    expect(videoSource).not.toMatch(/<video[^>]*\bcontrols\b/);
    expect(videoSource).toContain('playsInline');
    // Es la misma barra que el dock de frecuencias, con la posición siempre a la vista.
    expect(videoSource).toContain('<PlayerBar');
    expect(videoSource).toContain('timeline="always"');
    expect(dockSource).toContain('<PlayerProgressBar');
    expect(barSource).toContain('<SeekBar');
    // Sonido y pantalla completa propios; sin soporte, el botón no se pinta.
    expect(veilSource).toContain('requestFullscreen');
    expect(veilSource).toContain('document.fullscreenEnabled');
    // Entrar y salir de pantalla completa funde a la noche: nunca un salto.
    expect(veilSource).toContain("setVeil('fade')");
    expect(veilSource).toContain("current === 'clear' ? 'cut' : current");
    expect(videoSource).toContain('data-video-veil={veil}');
    // Sin fuente no hay reproductor: la fuente es obligatoria (ver video-playback-guard).
    expect(videoSource).toContain('  src: string;');
    expect(playerSource).toContain('previousLesson');
    expect(playerSource).toContain('nextLesson');
    expect(playerSource).toContain('completionMedia');
    expect(playerSource).toContain('academy.completion');
    expect(playerSource).not.toMatch(/unsplash|https?:\/\//i);
  });

  it('waits with the shared loading scene, like every other view', () => {
    // Una sola espera en todo el sitio: la esfera de `states.loading` (ver `loading-flow`).
    expect(loadingSource.trim()).toBe(
      "export { RealmLoading as default } from '@/components/layout';",
    );
  });

  it('keeps the editorial sweep on transform rather than background-position', () => {
    const cssSource = readFileSync(resolve(SOURCE_ROOT, 'app/tokens.css'), 'utf8');
    expect(cssSource).toContain('@keyframes fm-editorial-zebra-sweep');
    expect(cssSource).toContain('transform: translateX');
    expect(cssSource).toContain('animation: fm-editorial-zebra-sweep');
    expect(cssSource).not.toContain('animation: fm-shimmer 2.4s linear infinite');
  });

  it('keeps every catalog course represented exactly once in the archive source', () => {
    expect(COURSES).toHaveLength(3);
    expect(listSource.match(/<CourseCard/g)?.length).toBe(1);
    expect(listSource).toContain('function CourseRow');
    expect(listSource).toContain('{others.map');
  });
});

export {};
