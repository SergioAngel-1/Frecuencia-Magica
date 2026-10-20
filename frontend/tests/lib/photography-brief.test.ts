import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { EDITORIAL_MEDIA_REGISTRY, EDITORIAL_MEDIA_SLOTS } from '@/config/editorial-media';
import { AUDIOS } from '@/data/audios';
import { COURSES } from '@/data/courses';
import { EXPERIENCES } from '@/data/experiences';
import { PRODUCTS } from '@/data/products';

import en from '../../messages/en.json';
import es from '../../messages/es.json';
import {
  FAMILIES,
  GLOBAL,
  LANGUAGE,
  PRESETS,
  SAFE,
  SLOTS,
  baseFor,
  expandAll,
  isAtmosphere,
} from '../../../Branding/src/data/photography.js';
import { renderBrief } from '../../../Branding/src/data/photography-brief.js';

function lookup(catalog: unknown, key: string): string {
  return key
    .split('.')
    .reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], catalog) as string;
}

const RATIO: Record<string, number> = { '16:9': 16 / 9, '16:8': 2, '3:4': 3 / 4, '1:1': 1 };

describe('photography brief', () => {
  it('has exactly one brief entry per registered slot', () => {
    expect(SLOTS.map((slot) => slot.id).sort()).toEqual([...EDITORIAL_MEDIA_SLOTS].sort());
  });

  it('follows the slot contract: ratio, priority and focal point', () => {
    for (const slot of SLOTS) {
      const contract = EDITORIAL_MEDIA_REGISTRY[slot.id as keyof typeof EDITORIAL_MEDIA_REGISTRY];

      expect(PRESETS[slot.preset as keyof typeof PRESETS].ratio, slot.id).toBe(contract.aspect);
      expect(slot.priority, slot.id).toBe(contract.priorityTier);
      expect(slot.focal, slot.id).toBe(contract.position);
    }
  });

  it('declares the same mobile focal point and backdrop as the contract', () => {
    for (const slot of SLOTS as { id: string; mobileFocal?: string; backdrop?: true }[]) {
      const contract = EDITORIAL_MEDIA_REGISTRY[slot.id as keyof typeof EDITORIAL_MEDIA_REGISTRY];

      expect(slot.mobileFocal, slot.id).toBe(contract.mobilePosition);
      expect(slot.backdrop, slot.id).toBe(contract.backdrop);
    }
  });

  it('shows the mobile focal point and the backdrop in the rendered brief', () => {
    const brief = renderBrief();

    expect(brief).toContain('foco móvil 75% 40%');
    expect(brief).toMatch(
      /discover\.question-atmosphere[\s\S]*?fondo a pantalla completa \(`backdrop`\)/,
    );
  });

  it('only places the body of light in registered slots', () => {
    for (const id of LANGUAGE.bodyOfLight.slots) {
      expect(EDITORIAL_MEDIA_SLOTS, id).toContain(id);
    }
  });

  it('keeps every preset size at its ratio', () => {
    for (const [name, preset] of Object.entries(PRESETS)) {
      for (const [width, height] of [preset.master, preset.tablet, preset.mobile]) {
        expect(width! / height!, `${name} ${width}x${height}`).toBeCloseTo(RATIO[preset.ratio]!, 1);
      }
    }
  });

  it('expands one row per catalog item for the instance slots', () => {
    expect(FAMILIES.audio.instances.map((item) => item.slug)).toEqual(
      AUDIOS.map((item) => item.id),
    );
    expect(FAMILIES.course.instances.map((item) => item.slug)).toEqual(
      COURSES.map((item) => item.id),
    );
    expect(FAMILIES.experience.instances.map((item) => item.slug)).toEqual(
      EXPERIENCES.map((item) => item.id),
    );
    expect(FAMILIES.product.instances.map((item) => item.slug)).toEqual(
      PRODUCTS.map((item) => item.id),
    );
  });

  it('names each instance exactly as the catalog does, in both languages', () => {
    const catalogs = [
      [FAMILIES.audio, AUDIOS],
      [FAMILIES.course, COURSES],
      [FAMILIES.experience, EXPERIENCES],
      [FAMILIES.product, PRODUCTS],
    ] as const;

    for (const [family, items] of catalogs) {
      for (const [index, instance] of family.instances.entries()) {
        const key = items[index]!.titleKey;

        expect(instance.es, key).toBe(lookup(es, key));
        expect(instance.en, key).toBe(lookup(en, key));
      }
    }
  });

  it('gives every image a unique file and a complete, on-brand prompt', () => {
    const rows = expandAll();
    const files = rows.map((row: { file: string }) => row.file);

    expect(new Set(files).size).toBe(files.length);

    for (const row of rows as { id: string; file: string; safe: string; prompt: string }[]) {
      expect(SAFE, row.id).toHaveProperty(row.safe);
      expect(row.prompt, row.id).toContain(baseFor(row));
      expect(row.prompt, row.id).not.toMatch(/unsplash|stock photo/i);
      expect(row.file, row.id).toMatch(/^[a-z0-9-]+\.(avif|jpg)$/);
    }
  });

  it('gives the atmosphere images their own grade, with colors by name and nobody in the frame', () => {
    const rows = (
      expandAll() as { id: string; prompt: string; treatment: string; person?: boolean }[]
    ).filter((row) => isAtmosphere(row) && !row.person);

    expect(rows.length).toBeGreaterThan(0);

    for (const row of rows) {
      expect(row.prompt, row.id).toContain('No people.');
      expect(row.prompt, row.id).toContain(GLOBAL.atmosphere.treatments[row.treatment as never]);
      // La paleta nocturna no se cuela en una atmósfera: sus colores van por nombre, no por hex.
      expect(row.prompt, row.id).not.toMatch(/#[0-9a-f]{6}/i);
      expect(row.prompt, row.id).not.toContain(GLOBAL.base);
    }
  });

  it('relights the portrait of Marisol from its published sibling instead of drawing a new face', () => {
    const rows = (
      expandAll() as {
        id: string;
        prompt: string;
        person?: boolean;
        sibling?: string;
        realShoot?: boolean;
        theme?: string;
      }[]
    ).filter((row) => row.person);

    expect(rows.map((row) => row.id).sort()).toEqual(
      ['dawn', 'dusk', 'forest', 'moon'].map((theme) => `home-marisol-portrait@${theme}`),
    );

    for (const row of rows) {
      expect(row.sibling, row.id).toBe('home-marisol-portrait.png');
      expect(row.realShoot, row.id).toBeUndefined();
      expect(row.prompt, row.id).toContain('attached photograph');
      expect(row.prompt, row.id).toContain(
        'The only person is the woman in the attached photograph',
      );
      expect(row.prompt, row.id).not.toContain('No people.');
      expect(row.prompt, row.id).not.toMatch(/#[0-9a-f]{6}/i);
    }
  });

  it('flags the store products as provisional, to be photographed for real by Marisol', () => {
    const products = (expandAll() as { slotId: string; provisional?: string }[]).filter(
      (row) => row.slotId === 'store-product-visual',
    );

    expect(products).toHaveLength(PRODUCTS.length);

    for (const row of products) expect(row.provisional, row.slotId).toMatch(/Marisol/);
  });

  it('keeps interface wording out of the prompts, where the model draws it as an object', () => {
    for (const row of expandAll() as { id: string; prompt: string }[]) {
      expect(row.prompt, row.id).not.toMatch(
        /glass form|scrim|check mark|sits on top of this image/i,
      );
    }
  });

  it('is committed as docs/brief-fotografico.md in sync with its data', () => {
    const committed = readFileSync(resolve(process.cwd(), '../docs/brief-fotografico.md'), 'utf8');

    expect(committed, 'run `npm run export:photo-brief` in Branding/').toBe(renderBrief());
  });
});
