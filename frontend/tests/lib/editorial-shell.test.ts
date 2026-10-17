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

const REALM_MENU_SOURCE = readFileSync(
  resolve(process.cwd(), 'src/components/layout/realm-menu.tsx'),
  'utf8',
);

const EXPECTED_VISUAL_MODES = {
  portal: 'cosmic',
  home: 'editorial',
  auth: 'quiet',
  descubrete: 'editorial',
  resonario: 'editorial',
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

  it('keeps inactive realm names in the mobile menu above the contrast floor without stacked opacity', () => {
    const inactive = REALM_MENU_SOURCE.match(/active \? 'text-fg' : '([^']*)'/)?.[1];

    expect(inactive, 'inactive menu row').toBeDefined();
    expect(inactive).toContain('text-fg-body');
    expect(REALM_MENU_SOURCE).not.toMatch(/\bopacity-\d/);
    expect(REALM_MENU_SOURCE).toContain("aria-current={active ? 'page' : undefined}");
  });

  it('never truncates realm names: a header menu at every width, dots only from 1024px', () => {
    expect(REALM_NAV_SOURCE).not.toContain('truncate');
    expect(REALM_MENU_SOURCE).not.toContain('truncate');
    // The header menu opens the modal at every width; the constellation's dots
    // appear from 1024px. The scrolling bottom bar is gone, and so is its fight
    // with the player.
    expect(REALM_NAV_SOURCE).toContain('hidden -translate-y-1/2 lg:block');
    expect(REALM_NAV_SOURCE).not.toContain('max-lg:');
    expect(REALM_MENU_SOURCE).not.toContain('lg:hidden');
    expect(REALM_MENU_SOURCE).toContain("tHeader('menu')");
    expect(REALM_MENU_SOURCE).toContain('<Modal');
    expect(REALM_MENU_SOURCE).toContain('NAV_REALMS.map');
    expect(REALM_MENU_SOURCE).toContain('aria-haspopup="dialog"');
    // Persistent labels on desktop collided with content starting on the page
    // axis; the destination appears on hover/focus through the badge instead.
    expect(REALM_NAV_SOURCE).not.toContain('lg:inline');
  });

  it('preserves the existing centered shell when editorial options are omitted', () => {
    expect(getPageShellClasses({})).toContain('mx-auto w-full');
    expect(getPageShellClasses({})).not.toContain('fm-editorial-full-bleed');
    expect(getPageShellClasses({})).not.toContain('fm-shell-reserve-bottom');
  });
});
