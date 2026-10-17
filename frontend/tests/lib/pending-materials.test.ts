import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  provisionalAudios,
  publishableAudios,
  renderPendingMaterials,
  soonAudios,
} from '@/lib/materials/pending';
import type { Audio } from '@/types/content';

import { collectPendingInputs } from '../../scripts/pending-materials-inputs.mjs';

const DOC = resolve(process.cwd(), '../docs/materiales-pendientes.md');
const input = collectPendingInputs();

/** Una pista mínima para probar la guarda sin depender del catálogo. */
function track(patch: Partial<Audio>): Audio {
  return {
    id: 'x1',
    kind: 'nature',
    intents: ['calm'],
    titleKey: 'resonario.audios.a1.title',
    tagKey: 'resonario.tags.meditation',
    tagId: 'meditation',
    duration: '10:00',
    hz: null,
    band: 'linear-gradient(150deg,#000,#000)',
    voice: false,
    availability: 'ready',
    source: { type: 'synth', recipe: { sea: {} } },
    license: 'synthetic',
    headphones: false,
    compositionKey: 'resonario.audios.a1.composition',
    guideKey: 'resonario.audios.a1.guide',
    ...patch,
  };
}

describe('registro de materiales pendientes', () => {
  it('el documento committed coincide con lo que genera el script', () => {
    expect(readFileSync(DOC, 'utf8')).toBe(renderPendingMaterials(input));
  });

  it('toda pista con síntesis provisional o «próximamente» consta en la lista de pendientes', () => {
    const doc = readFileSync(DOC, 'utf8');
    const pending = input.audios.filter(
      (audio) => audio.license === 'provisional' || audio.availability === 'soon',
    );

    expect(pending.length).toBeGreaterThan(0);
    for (const audio of pending) expect(doc, audio.id).toContain(`| \`${audio.id}\` |`);
  });

  it('ninguna pista provisional figura como publicable en el documento', () => {
    const doc = readFileSync(DOC, 'utf8');
    const section = doc.slice(doc.indexOf('### Listo para publicar'), doc.indexOf('## Video'));

    for (const audio of input.audios.filter((a) => a.license === 'provisional')) {
      expect(section, audio.id).not.toContain(`| \`${audio.id}\` |`);
    }
  });

  it('la guarda falla si una pista provisional se declarara publicable', () => {
    const provisional = track({ license: 'provisional' });
    const soon = track({ id: 'x2', availability: 'soon', source: null, license: 'provisional' });

    expect(publishableAudios([provisional, soon])).toEqual([]);
    expect(provisionalAudios([provisional, soon])).toEqual([provisional]);
    expect(soonAudios([provisional, soon])).toEqual([soon]);
    expect(publishableAudios([track({ license: 'own' })])).toHaveLength(1);
  });

  it('todos los videos sin fuente constan', () => {
    const doc = readFileSync(DOC, 'utf8');

    for (const video of input.videos) {
      const lesson = /^lesson\.([^.]+)\.\d+$/.exec(video.id);
      expect(doc, video.id).toContain(lesson ? `lesson.${lesson[1]}.1–` : `\`${video.id}\``);
    }
  });

  it('los productos y los cursos provisionales constan', () => {
    const doc = readFileSync(DOC, 'utf8');

    for (const product of input.products.filter((p) => p.provisional)) {
      expect(doc, product.id).toContain(`| \`${product.id}\` |`);
    }
    for (const course of input.courses.filter((c) => c.provisional)) {
      expect(doc, course.id).toContain(`| \`${course.id}\` |`);
    }
  });

  it('lleva el formato de entrega de las fotos de producto y la nota del copy de llegada', () => {
    const doc = readFileSync(DOC, 'utf8');

    expect(doc).toContain('Formato de entrega de las fotos de producto');
    expect(doc).toContain('`cover`');
    expect(doc).toContain('Copy de llegada a revisar cuando melodías y guiadas pasen a `ready`');
  });

  it('consta cada imagen provisional del brief', () => {
    const doc = readFileSync(DOC, 'utf8');

    expect(input.photos.length).toBeGreaterThan(0);
    for (const group of input.photos) {
      for (const file of group.files) expect(doc, file).toContain(`\`${file}\``);
    }
  });
});
