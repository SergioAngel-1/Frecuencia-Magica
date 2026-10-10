import { describe, expect, it } from 'vitest';

import { ROUTE_WAIT_DELAY_MS } from '@/config/motion';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

const LOADINGS = sourceFiles(`${SRC}/app`, /[\\/]loading\.tsx$/);
const TRANSITION = readSource(`${SRC}/components/layout/route-transition.tsx`);
const REALM_LOADING = readSource(`${SRC}/components/layout/realm-loading.tsx`);

describe('one waiting flow for the whole site', () => {
  it('makes every loading boundary the shared wait over the states.loading sphere', () => {
    expect(LOADINGS.length).toBeGreaterThan(0);
    for (const file of LOADINGS) {
      expect(readSource(file).trim(), fromSrc(file)).toBe(
        "export { RealmLoading as default } from '@/components/layout';",
      );
    }
    expect(REALM_LOADING).toContain("resolveEditorialMedia('states.loading'");
    expect(REALM_LOADING).toContain('<LoadingScene');
  });

  it('shows the same scene between views, not a veil of its own', () => {
    expect(TRANSITION).toContain('<LoadingScene');
    expect(TRANSITION).toContain("resolveEditorialMedia('states.loading'");
    expect(TRANSITION).not.toMatch(/backdrop-blur/);
  });

  it('waits a moment before showing it, so a prefetched view does not flash', () => {
    expect(ROUTE_WAIT_DELAY_MS).toBeGreaterThanOrEqual(200);
    expect(ROUTE_WAIT_DELAY_MS).toBeLessThanOrEqual(400);
    expect(TRANSITION).toContain('ROUTE_WAIT_DELAY_MS');
  });

  it('fades the wait out as it faded in, instead of unmounting it at once', () => {
    // La capa de espera vive dentro de un `AnimatePresence` con su propia salida.
    const wait = TRANSITION.slice(TRANSITION.lastIndexOf('<AnimatePresence'));
    expect(wait).toContain('exit={');
    expect(wait).toContain('<LoadingScene');
  });
});
