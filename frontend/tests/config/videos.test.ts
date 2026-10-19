import { describe, expect, it } from 'vitest';

import { VIDEOS, videoState, type VideoEntry } from '@/config/videos';
import { COURSES } from '@/data';

const poster = { slot: 'resonario.hero' } as const;

describe('videoState', () => {
  it('con fuente está listo; sin ella (o vacía) es «próximamente»', () => {
    const entry: VideoEntry = { id: 'x', poster, duration: null };

    expect(videoState(entry)).toBe('soon');
    expect(videoState({ ...entry, src: '' })).toBe('soon');
    expect(videoState({ ...entry, src: '/video/x.mp4' })).toBe('ready');
  });
});

describe('VIDEOS', () => {
  it('declara los espacios de bienvenida, presentación y guía de respiración', () => {
    for (const id of ['welcome', 'marisol-intro', 'breathing-guide']) {
      expect(VIDEOS[id], id).toBeDefined();
    }
  });

  it('declara la presentación de cada curso y una lección por cada lección del curso', () => {
    for (const course of COURSES) {
      expect(VIDEOS[`course-intro.${course.id}`], course.id).toBeDefined();
      for (let n = 1; n <= course.lessons; n++) {
        expect(VIDEOS[`lesson.${course.id}.${n}`], `${course.id}.${n}`).toBeDefined();
      }
      expect(VIDEOS[`lesson.${course.id}.${course.lessons + 1}`]).toBeUndefined();
    }
  });

  it('cada entrada lleva su propio id como clave', () => {
    for (const [key, entry] of Object.entries(VIDEOS)) expect(entry.id).toBe(key);
  });

  it('ninguno trae fuente hoy: Marisol aún no entrega videos y no se inventan (R13)', () => {
    for (const entry of Object.values(VIDEOS)) {
      expect(entry.src, entry.id).toBeUndefined();
      expect(videoState(entry), entry.id).toBe('soon');
    }
  });

  it('la duración de una lección es la planificada del curso; las demás aún no la tienen', () => {
    expect(VIDEOS['lesson.c1.1']!.duration).toBeGreaterThan(0);
    expect(VIDEOS['welcome']!.duration).toBeNull();
  });
});
