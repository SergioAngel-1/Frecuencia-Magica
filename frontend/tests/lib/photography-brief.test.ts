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
  PRESETS,
  SAFE,
  SLOTS,
  expandAll,
} from '../../../Branding/src/data/photography.js';
import { renderBrief } from '../../../Branding/src/data/photography-brief.js';

function lookup(catalog: unknown, key: string): string {
  return key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], catalog) as string;
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

  it('keeps every preset size at its ratio', () => {
    for (const [name, preset] of Object.entries(PRESETS)) {
      for (const [width, height] of [preset.master, preset.tablet, preset.mobile]) {
        expect(width! / height!, `${name} ${width}x${height}`).toBeCloseTo(RATIO[preset.ratio]!, 1);
      }
    }
  });

  it('expands one row per catalog item for the instance slots', () => {
    expect(FAMILIES.audio.instances.map((item) => item.slug)).toEqual(AUDIOS.map((item) => item.id));
    expect(FAMILIES.course.instances.map((item) => item.slug)).toEqual(COURSES.map((item) => item.id));
    expect(FAMILIES.experience.instances.map((item) => item.slug)).toEqual(EXPERIENCES.map((item) => item.id));
    expect(FAMILIES.product.instances.map((item) => item.slug)).toEqual(PRODUCTS.map((item) => item.id));
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
      expect(row.prompt, row.id).toContain(GLOBAL.base);
      expect(row.prompt, row.id).not.toMatch(/unsplash|stock photo/i);
      expect(row.file, row.id).toMatch(/^[a-z0-9-]+\.(avif|jpg)$/);
    }
  });

  it('is committed as docs/brief-fotografico.md in sync with its data', () => {
    const committed = readFileSync(resolve(process.cwd(), '../docs/brief-fotografico.md'), 'utf8');

    expect(committed, 'run `npm run export:photo-brief` in Branding/').toBe(renderBrief());
  });
});
