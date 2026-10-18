import { describe, expect, it } from 'vitest';

import { readSource, SRC } from '../helpers/source-files';

/**
 * El tramo denso del velo (`--scrim-deep`) lo define cada tema. En el claro (dawn)
 * debe ser su propio `--scrim`: si no, el borde del velo dibuja una franja oscura
 * sobre la foto (kicker ilegible y banda casi negra).
 */
const TOKENS = readSource(`${SRC}/app/tokens.css`);

function blockOf(selector: string): string {
  const start = TOKENS.indexOf(selector);
  expect(start, selector).toBeGreaterThan(-1);
  return TOKENS.slice(start, TOKENS.indexOf('}', start));
}

const value = (block: string, name: string) =>
  block.match(new RegExp(`--${name}: ([\\d ]+);`))?.[1]?.trim();

describe('scrim-deep token', () => {
  it('is defined in :root and in the night block with the navy of the night', () => {
    expect(value(blockOf(':root {'), 'scrim-deep')).toBe('10 18 32');
    expect(value(blockOf("[data-atmosphere='night'] {"), 'scrim-deep')).toBe('10 18 32');
  });

  it('equals the scrim of every light theme, so no dark stripe reaches the photo', () => {
    for (const id of ['dawn']) {
      const block = blockOf(`[data-atmosphere='${id}'] {`);
      expect(value(block, 'scrim-deep'), id).toBe(value(block, 'scrim'));
    }
  });

  it('is defined in every theme block', () => {
    for (const id of ['dusk', 'dawn', 'moon', 'forest']) {
      expect(value(blockOf(`[data-atmosphere='${id}'] {`), 'scrim-deep'), id).toBeDefined();
    }
  });
});
