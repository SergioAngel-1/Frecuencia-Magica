import { describe, expect, it } from 'vitest';

import en from '../../messages/en.json';
import es from '../../messages/es.json';
import { NAV_REALMS, NAV_STORY } from '@/config/navigation';
import { routing } from '@/i18n/routing';

import { readSource, SRC } from '../helpers/source-files';

const NAV = readSource(`${SRC}/components/layout/realm-nav.tsx`);
const MENU = readSource(`${SRC}/components/layout/realm-menu.tsx`);

describe('site navigation', () => {
  it('adds the site story after the realms, as its own entry', () => {
    expect(NAV_STORY.href).toBe('/sobre-marisol');
    expect(Object.keys(routing.pathnames)).toContain(NAV_STORY.href);
    expect(NAV_REALMS.map((realm) => realm.href)).not.toContain(NAV_STORY.href);
    // Marfil: no es un realm y no toma el acento de ninguno.
    expect(NAV_STORY.accent).toBe('#F7F4EA');
  });

  it('shows the story in the desktop constellation and in the menu', () => {
    expect(NAV).toContain('NAV_STORY');
    expect(NAV).toContain("t('story.label')");
    expect(MENU).toContain('NAV_STORY.href');
    expect(MENU).toContain("t('story.label')");
    expect(MENU).toContain("t('story.emotion')");
  });

  it('names the story in both languages', () => {
    expect(es.nav.story.label).toBeTruthy();
    expect(en.nav.story.label).toBeTruthy();
    expect(en.nav.story.label).not.toBe(es.nav.story.label);
    expect(en.nav.story.emotion).not.toBe(es.nav.story.emotion);
  });
});
