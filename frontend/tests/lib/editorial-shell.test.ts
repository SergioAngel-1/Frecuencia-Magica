import { describe, expect, it } from 'vitest';

import { getRealm, REALMS } from '@/config/realms';
import { getPageShellClasses } from '@/components/layout/page-shell';

const VISUAL_MODES = new Set(['cosmic', 'editorial', 'quiet']);

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

  it('preserves the existing centered shell when editorial options are omitted', () => {
    expect(getPageShellClasses({})).toContain('mx-auto w-full');
    expect(getPageShellClasses({})).not.toContain('fm-editorial-full-bleed');
    expect(getPageShellClasses({})).not.toContain('fm-shell-reserve-bottom');
  });
});
