import type { EditorialMediaSlot } from '@/config/editorial-media';
import { COURSES } from '@/data';
import { buildLessons, lessonSeconds } from '@/lib/academy/lessons';

/** Imagen de póster de un video: un slot editorial que ya existe (y su instancia). */
export type VideoPoster = { slot: EditorialMediaSlot; instance?: string };

/**
 * Un espacio de video. Sin `src` es «próximamente»: se pinta el póster, sin
 * botón de play ni reloj. `duration` (segundos) sólo existe cuando se conoce de
 * antemano (las lecciones); el resto la tendrá con el video.
 */
export type VideoEntry = {
  id: string;
  src?: string;
  poster: VideoPoster;
  duration: number | null;
};

export type VideoState = 'ready' | 'soon';

/** Con fuente, listo; sin ella, «próximamente». Nunca se declara listo a mano. */
export function videoState(entry: VideoEntry): VideoState {
  return entry.src ? 'ready' : 'soon';
}

export const courseIntroId = (courseId: string) => `course-intro.${courseId}`;
export const lessonVideoId = (courseId: string, lessonNumber: number) =>
  `lesson.${courseId}.${lessonNumber}`;

function entry(id: string, poster: VideoPoster, duration: number | null = null): VideoEntry {
  return { id, poster, duration };
}

const FIXED: VideoEntry[] = [
  // Bienvenida de la Home y presentación de Sobre Marisol: Marisol los graba.
  entry('welcome', { slot: 'atmosphere.marisol' }),
  entry('marisol-intro', { slot: 'atmosphere.marisol' }),
  // Su video respirando con la persona (spec §5.4): hasta entonces, el orbe.
  entry('breathing-guide', { slot: 'atmosphere.dawn' }),
];

const COURSE_VIDEOS: VideoEntry[] = COURSES.flatMap((course) => {
  const poster: VideoPoster = { slot: 'academy-course-cover', instance: course.id };

  return [
    entry(courseIntroId(course.id), poster),
    // Una lección por cada lección del curso, con su duración planificada.
    ...buildLessons(course).map((lesson) =>
      entry(lessonVideoId(course.id, lesson.index + 1), poster, lessonSeconds(lesson)),
    ),
  ];
});

/**
 * Registro de videos (spec §8). Ninguno trae `src`: Marisol aún no entrega
 * grabaciones y no se inventan (R13). Cuando llegue una, se añade su `src` aquí
 * y el espacio pasa solo a «ready».
 */
export const VIDEOS: Readonly<Record<string, VideoEntry>> = Object.fromEntries(
  [...FIXED, ...COURSE_VIDEOS].map((video) => [video.id, video]),
);

/** El video registrado con ese id; lanza si no existe (un id mal escrito es un error de código). */
export function getVideo(id: string): VideoEntry {
  const video = VIDEOS[id];
  if (!video) throw new Error(`video sin registrar: ${id}`);

  return video;
}
