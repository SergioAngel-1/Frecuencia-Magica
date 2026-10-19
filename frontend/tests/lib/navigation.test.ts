import { describe, expect, it } from 'vitest';

import en from '../../messages/en.json';
import es from '../../messages/es.json';
import { NAV_REALMS, NAV_STORY } from '@/config/navigation';
import { routing } from '@/i18n/routing';

import { readSource, SRC } from '../helpers/source-files';

const NAV = readSource(`${SRC}/components/layout/realm-nav.tsx`);
const MENU = readSource(`${SRC}/components/layout/realm-menu.tsx`);
const HEADER = readSource(`${SRC}/components/layout/site-header.tsx`);
const STORE = readSource(`${SRC}/components/layout/store-link.tsx`);
const SECTION = readSource(`${SRC}/components/layout/current-section-label.tsx`);

describe('site navigation', () => {
  it('adds the site story after the realms, as its own entry', () => {
    expect(NAV_STORY.href).toBe('/sobre-marisol');
    expect(Object.keys(routing.pathnames)).toContain(NAV_STORY.href);
    expect(NAV_REALMS.map((realm) => realm.href)).not.toContain(NAV_STORY.href);
    // Marfil del tema (`--color-fg`): no es un realm y no toma el acento de ninguno.
    expect(NAV_STORY.accent).toBe('var(--color-fg)');
  });

  it('opens the constellation with the store', () => {
    expect(NAV_REALMS[0]?.id).toBe('tienda');
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

  it('opens the same menu from the header at every width and from the constellation above 1024px', () => {
    expect(MENU).toContain('useNavMenuStore');
    // El botón del header es visible en todos los anchos: ya no sólo por debajo de 1024px.
    expect(MENU).not.toContain('lg:hidden');
    expect(NAV).toContain('useNavMenuStore');
    expect(NAV).toContain('onClick={openMenu}');
    expect(NAV).toContain('aria-haspopup="dialog"');
    // Un aro hueco, no un punto: no se confunde con un realm.
    expect(NAV).toContain('rounded-full border');
  });

  it('labels the menu button «Menú» with an icon, and names the current section next to it', () => {
    expect(MENU).toContain("tHeader('menu')");
    // El botón es el control principal de la cápsula de navegación del header.
    expect(MENU).toContain('dockSegmentClasses({ primary: true');
    expect(HEADER).toContain('<CurrentSectionLabel');
    expect(HEADER).toContain('<RealmMenu');
    // Idioma, sonido y tema comparten una cápsula; tienda, cuenta y menú, otra.
    expect(HEADER.match(/<ControlDock /g)).toHaveLength(2);
    expect(SECTION).toContain('currentSection(');
    expect(SECTION).toContain("t('current.home')");
    expect(SECTION).toContain("t('story.label')");
    expect(SECTION).toContain('lg:inline-block');
    expect(SECTION).toContain("key === 'tienda'");
  });

  it('gives the store a text link in the header, and moves it into the menu below 460px', () => {
    expect(HEADER).toContain('<StoreLink');
    expect(STORE).toContain('href="/tienda"');
    expect(STORE).toContain("t('store')");
    expect(STORE).toContain('useCartCount');
    // Por debajo de 460px el enlace se oculta en el header y el carrito pasa al panel del menú.
    expect(STORE).toMatch(/\bhidden\b/);
    expect(STORE).toContain('min-[460px]:inline-flex');
    expect(STORE).toContain("tCart('items'");
    expect(MENU).toContain('href="/tienda/carrito"');
    expect(MENU).toContain('min-[460px]:hidden');
  });
});
