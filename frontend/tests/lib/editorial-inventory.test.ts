import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { EDITORIAL_ASSETS } from '@/config/editorial-assets.generated';
import { ATMOSPHERES, PICKER_ATMOSPHERES } from '@/config/atmospheres';
import { EDITORIAL_MEDIA_SLOTS } from '@/config/editorial-media';

import { readSource, SRC, sourceFiles } from '../helpers/source-files';

const README = readSource(resolve(process.cwd(), 'public/editorial/README.md'));

const PAINTING_HOOK = readSource(resolve(SRC, 'hooks/use-atmosphere-painting.ts'));

const SOURCE = sourceFiles(SRC)
  .map((file) => readSource(file))
  .join('\n');

/** Fila del inventario por id: `| `slot` | … | Estado |`, con o sin relleno de columnas. */
function inventoryRow(slot: string): string | undefined {
  return README.split('\n').find((line) => line.replace(/\s+/g, ' ').startsWith(`| \`${slot}\` |`));
}

/**
 * Paisajes que pintan las vistas sin llamar a `resolveEditorialMedia` con el
 * literal: los de las atmósferas elegibles en el selector (Resonario y el resultado
 * de Descúbrete, vía `useAtmospherePainting`).
 */
const PAINTED_BY_PICKER = new Set(
  PICKER_ATMOSPHERES.map((id) => ATMOSPHERES[id].backdropSlot).filter(Boolean),
);

describe('editorial slot inventory', () => {
  it('has a row for every registered slot', () => {
    for (const slot of EDITORIAL_MEDIA_SLOTS) {
      expect(inventoryRow(slot), slot).toBeDefined();
    }
  });

  it('reports the real wiring status of each slot', () => {
    for (const slot of EDITORIAL_MEDIA_SLOTS) {
      // Un paisaje del selector sólo cuenta como cableado si su hook llama a `atmospherePainting`.
      const wired =
        SOURCE.includes(`resolveEditorialMedia('${slot}'`) ||
        (PAINTED_BY_PICKER.has(slot) && PAINTING_HOOK.includes('atmospherePainting('));
      const row = inventoryRow(slot) ?? '';

      if (wired) {
        expect(row, `${slot} is wired in code`).toContain('slot cableado');
        expect(row, `${slot} is wired in code`).not.toContain('sin cablear');
      } else {
        expect(row, `${slot} is not wired in code`).toContain('sin cablear');
      }
    }
  });

  it('reports as published exactly the slots that the manifest publishes', () => {
    const keys = Object.keys(EDITORIAL_ASSETS);
    for (const slot of EDITORIAL_MEDIA_SLOTS) {
      const stem = slot.endsWith('.*') ? slot.slice(0, -2) : slot;
      const published = keys.some((key) => key === slot || key.startsWith(`${stem}:`));
      const row = inventoryRow(slot) ?? '';

      expect(row.includes('Publicado'), `${slot} published: ${published}`).toBe(published);
      expect(row.includes('Pendiente de asset'), slot).toBe(!published);
    }
  });
});
