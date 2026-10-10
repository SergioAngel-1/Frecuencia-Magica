import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';

const OG_FILE = resolve(process.cwd(), 'public/editorial/og-image.jpg');
const layoutSource = readFileSync(resolve(process.cwd(), 'src/app/[locale]/layout.tsx'), 'utf8');

describe('open graph image', () => {
  it('is a JPEG within the 300 KB budget of the photographic brief', () => {
    const bytes = readFileSync(OG_FILE);

    // Las plataformas sociales no leen AVIF de forma fiable: tiene que ser JPEG de verdad.
    expect([...bytes.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
    expect(statSync(OG_FILE).size).toBeLessThanOrEqual(300 * 1024);
  });

  it('is declared in the layout metadata at the size the file really has', () => {
    expect(layoutSource).toContain("url: '/editorial/og-image.jpg'");
    expect(layoutSource).toContain('width: 1200');
    expect(layoutSource).toContain('height: 630');
    expect(layoutSource).toContain("t('ogImageAlt')");
  });

  it('has a translated alt in both locales', () => {
    expect(esMessages.common.ogImageAlt.length).toBeGreaterThan(0);
    expect(enMessages.common.ogImageAlt).not.toBe(esMessages.common.ogImageAlt);
  });
});
