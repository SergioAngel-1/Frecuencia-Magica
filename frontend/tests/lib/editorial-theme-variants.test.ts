import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { ATMOSPHERE_IDS } from '@/config/atmospheres';
import { EDITORIAL_ASSETS } from '@/config/editorial-assets.generated';
import {
  EDITORIAL_MEDIA_SLOTS,
  THEME_VARIANTS,
  THEME_VARIANT_POSITIONS,
  type EditorialMediaSlot,
} from '@/config/editorial-media';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

import { THEME_VARIANTS as BRIEF_VARIANTS } from '../../../Branding/src/data/photography-themes.js';
import { expandAll } from '../../../Branding/src/data/photography.js';
import { statusOf } from '../../../Branding/src/data/photography-status.js';
import { readSource, SRC } from '../helpers/source-files';

const PUBLIC = resolve(process.cwd(), 'public/editorial');
// Prettier parte los selectores largos en varias líneas: se compara sin saltos.
const GLOBALS = readSource(`${SRC}/app/globals.css`).replace(/\s+/g, ' ');

type BriefRow = {
  id: string;
  slotId: string;
  file: string;
  theme?: string;
  preset: string;
  priority: string;
};

const briefRows = () => expandAll() as BriefRow[];

const contractPairs = Object.entries(THEME_VARIANTS).flatMap(([slot, themes]) =>
  (themes ?? []).map((theme) => `${slot}@${theme}`),
);

describe('theme image variants', () => {
  it('only name registered slots and the four non-night themes', () => {
    const slots: readonly string[] = EDITORIAL_MEDIA_SLOTS;

    for (const [slot, themes] of Object.entries(THEME_VARIANTS)) {
      expect(slots, slot).toContain(slot);
      for (const theme of themes ?? []) {
        expect(ATMOSPHERE_IDS, `${slot}@${theme}`).toContain(theme);
        expect(theme, `${slot}@${theme}`).not.toBe('night');
      }
    }
  });

  it('are the same set in the contract and in the brief', () => {
    const brief = BRIEF_VARIANTS.map(
      (variant: { base: string; theme: string }) => `${variant.base}@${variant.theme}`,
    );

    expect([...brief].sort()).toEqual([...contractPairs].sort());
  });

  it('give every variant a brief row that inherits the ratio and priority of its slot', () => {
    const rows = briefRows();

    for (const pair of contractPairs) {
      const row = rows.find((candidate) => candidate.id === pair);
      const base = rows.find((candidate) => candidate.id === row?.slotId);
      expect(row, pair).toBeDefined();
      expect(base, pair).toBeDefined();
      expect(row!.preset, pair).toBe(base!.preset);
      expect(row!.priority, pair).toBe(base!.priority);
      expect(row!.file, pair).toBe(`${base!.file.replace(/\.avif$/, '')}-${row!.theme}.avif`);
    }
  });

  it('are published exactly when the brief says so, and the file exists', () => {
    const rows = briefRows();

    for (const pair of contractPairs) {
      const row = rows.find((candidate) => candidate.id === pair)!;
      const published = statusOf(row.file).state !== 'faltante';

      expect(pair in EDITORIAL_ASSETS, `${pair} in manifest`).toBe(published);
      if (published) expect(existsSync(resolve(PUBLIC, row.file)), row.file).toBe(true);
    }
  });

  it('only position variants that exist', () => {
    for (const key of Object.keys(THEME_VARIANT_POSITIONS)) {
      expect(key in EDITORIAL_ASSETS, key).toBe(true);
    }
  });

  it('reach the resolved media as variants, with the night photo as the base', () => {
    const media = resolveEditorialMedia('academy.hero', { alt: 'x' });

    expect(media.src).toBe(EDITORIAL_ASSETS['academy.hero']);
    expect(media.variants?.dawn).toBe(EDITORIAL_ASSETS['academy.hero@dawn']);
    expect(media.variants).not.toHaveProperty('night');
    expect(media.variantPositions?.dawn).toBe('70% 50%');
  });

  it('leave a slot without variants untouched, and an explicit src ignores them', () => {
    const plain = resolveEditorialMedia('not-found.hero', { alt: 'x' });
    const explicit = resolveEditorialMedia('academy.hero', {
      alt: 'x',
      src: '/editorial/own.avif',
    });

    expect(plain).not.toHaveProperty('variants');
    expect(explicit.src).toBe('/editorial/own.avif');
    expect(explicit).not.toHaveProperty('variants');
  });

  it('hide the base photo with one CSS rule per theme that has variants', () => {
    for (const theme of ['dusk', 'dawn', 'moon', 'forest']) {
      expect(GLOBALS, theme).toContain(
        `[data-atmosphere='${theme}'] [data-photo-themes~='${theme}']:not([data-variant-failed]) > [data-photo-base]`,
      );
    }
  });

  it('are mounted by a client child, so EditorialImage stays a server component', () => {
    const image = readFileSync(
      resolve(process.cwd(), 'src/components/ui/editorial-image.tsx'),
      'utf8',
    );
    const themed = readFileSync(
      resolve(process.cwd(), 'src/components/world/themed-photo.tsx'),
      'utf8',
    );

    expect(image).not.toMatch(/^'use client'/);
    expect(image).toContain('<ThemedPhoto');
    expect(themed.startsWith("'use client'")).toBe(true);
    expect(themed).toContain('useMounted()');
  });

  it('keep a slot with variants out of the slots that are item content', () => {
    const content: EditorialMediaSlot[] = [
      'resonario.audio-cover.*',
      'academy-course-cover',
      'experiences-visual',
      'store-product-visual',
    ];

    for (const slot of content) expect(THEME_VARIANTS, slot).not.toHaveProperty(slot);
  });
});

describe('fondos con variante de Amanecer en lugar del lavado', () => {
  it('todo fondo que el tema claro lavaba tiene su variante declarada', () => {
    const lavados = [
      'states.loading',
      'states.empty',
      'states.error',
      'states.offline',
      'sanctuary.continue',
      'sanctuary.daily',
      'sanctuary.journal',
      'sanctuary.empty',
      'cart.empty',
      'checkout.confirmation',
      'discover.tuning',
      'discover.result',
      'booking.confirmation',
      'academy.completion',
    ] as const;

    for (const slot of lavados) {
      expect(THEME_VARIANTS[slot], slot).toContain('dawn');
    }
  });

  it('el 404 raíz no lleva variantes: está fuera del proveedor de tema', () => {
    expect(THEME_VARIANTS['not-found.hero']).toBeUndefined();
    expect(resolveEditorialMedia('not-found.hero', { alt: 'x' })).not.toHaveProperty('variants');
  });
});
