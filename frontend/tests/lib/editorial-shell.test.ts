import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { getRealm, REALMS } from '@/config/realms';
import { getPageShellClasses } from '@/components/layout/page-shell';

const VISUAL_MODES = new Set(['cosmic', 'editorial', 'quiet']);
const REALM_NAV_SOURCE = readFileSync(
  resolve(process.cwd(), 'src/components/layout/realm-nav.tsx'),
  'utf8',
);

const EXPECTED_VISUAL_MODES = {
  portal: 'cosmic',
  home: 'editorial',
  auth: 'quiet',
  descubrete: 'editorial',
  biblioteca: 'editorial',
  academia: 'editorial',
  experiencias: 'editorial',
  tienda: 'editorial',
  sanctuario: 'quiet',
} as const;

describe('editorial shell contracts', () => {
  it('gives every realm an explicit visual mode and photo treatment', () => {
    expect(REALMS).toHaveLength(9);

    for (const realm of REALMS) {
      expect(VISUAL_MODES.has(realm.visualMode), `${realm.id} visual mode`).toBe(true);
      expect(realm.photoTreatment, `${realm.id} photo treatment`).toEqual(expect.any(String));
      expect(realm.photoTreatment.length, `${realm.id} photo treatment`).toBeGreaterThan(0);
      expect(realm.visualMode).toBe(EXPECTED_VISUAL_MODES[realm.id]);
    }
  });

  it('keeps accent and base note contracts while resolving a realm mode', () => {
    const academia = getRealm('academia');

    expect(academia.accent).toBe('#96C6BC');
    expect(academia.baseNote).toBe(146.8);
    expect(academia.visualMode).toBe('editorial');
  });

  it('breaks out editorial content and reserves the fixed mobile controls', () => {
    const classes = getPageShellClasses({
      fullBleed: true,
      editorial: true,
    });

    expect(classes).toContain('fm-editorial-full-bleed');
    expect(classes).toContain('fm-editorial-shell');
    expect(classes).toContain('fm-shell-reserve-bottom');
  });

  it('keeps inactive realm labels above the contrast floor without stacked opacity', () => {
    const linkClasses = REALM_NAV_SOURCE.match(
      /'group relative flex h-11 min-w-11 flex-col items-center justify-center([^']*)'/,
    )?.[0];

    expect(linkClasses).toBeDefined();
    expect(linkClasses).not.toContain('opacity-60');

    for (const viewportClass of ['lg:hidden', 'lg:inline']) {
      const labelClasses = REALM_NAV_SOURCE.match(
        new RegExp(`className="([^"]*text-ivory/60[^"]*${viewportClass})"`),
      )?.[1];

      expect(labelClasses, `${viewportClass} inactive label`).toBeDefined();
      expect(labelClasses).not.toContain('opacity-');
    }

    expect(REALM_NAV_SOURCE).toContain('aria-[current=page]:text-ivory');
    expect(REALM_NAV_SOURCE).toContain('group-hover:text-ivory group-focus-visible:text-ivory');
  });

  it('preserves the existing centered shell when editorial options are omitted', () => {
    expect(getPageShellClasses({})).toContain('mx-auto w-full');
    expect(getPageShellClasses({})).not.toContain('fm-editorial-full-bleed');
    expect(getPageShellClasses({})).not.toContain('fm-shell-reserve-bottom');
  });
});
