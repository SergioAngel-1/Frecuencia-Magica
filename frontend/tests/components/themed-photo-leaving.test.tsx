import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import { act, createElement, type ComponentProps } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AtmosphereId } from '@/types/atmosphere';

const controls = vi.hoisted(() => ({ theme: 'night' as string, fade: 1.5 }));

vi.mock('next/image', () => ({
  default: ({ fill: _fill, priority: _priority, ...props }: Record<string, unknown>) =>
    createElement('img', props),
}));
vi.mock('@/hooks/use-atmosphere', () => ({
  useAtmosphere: () => ({ atmosphereId: controls.theme, scheme: 'dark' }),
}));
vi.mock('@/hooks/use-theme-fade', () => ({ useThemeFade: () => controls.fade }));
vi.mock('@/hooks/use-mounted', () => ({ useMounted: () => true }));

import { ThemedPhoto } from '@/components/world/themed-photo';

type Props = ComponentProps<typeof ThemedPhoto>;

const props: Props = {
  media: {
    src: '/base.avif',
    variants: { dawn: '/dawn.avif', dusk: '/dusk.avif' },
    alt: 'Foto',
    aspect: '16:9',
    slot: 'portal.portal-field',
    kind: 'photo',
    fallback: 'zebra',
    sizes: '100vw',
  } as Props['media'],
  className: 'photo',
  style: {},
  sizes: '100vw',
  priority: false,
};

let host: HTMLDivElement;
let root: Root;

/** Un cambio de tema que llega como una actualización síncrona (un clic): sin `act` ni esperas. */
function switchTo(theme: AtmosphereId) {
  controls.theme = theme;
  flushSync(() => root.render(createElement(ThemedPhoto, props)));
}

const leaving = () => host.querySelector('[data-photo-leaving]');
const allLeaving = () =>
  [...host.querySelectorAll('[data-photo-leaving]')].map((img) => img.getAttribute('src'));

/**
 * Invariante del fundido de fotos: al cambiar de tema sin velo, la foto que se iba tiene que estar
 * ya en el DOM en el mismo commit en que la nueva entra. Si la capa saliente se monta en una tarea
 * posterior (estado escrito desde un efecto pasivo), el navegador puede pintar un frame en medio,
 * y en él se ve la foto del tema final a opacidad plena (o la base oculta sin nada encima): un
 * salto justo antes de que empiece el fundido.
 */
describe('ThemedPhoto: la foto saliente llega con el cambio de tema', () => {
  beforeEach(async () => {
    controls.theme = 'night';
    controls.fade = 1.5;
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
    await act(async () => root.render(createElement(ThemedPhoto, props)));
    // Lo que sigue son actualizaciones fuera de `act`, como las de un clic real.
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = false;
  });

  afterEach(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    flushSync(() => root.unmount());
    host.remove();
  });

  it('no hay foto saliente mientras el tema no cambia', () => {
    expect(leaving()).toBeNull();
  });

  it('de la noche a una variante: la base queda encima desde el primer commit', () => {
    switchTo('dawn');

    expect(leaving()?.getAttribute('src')).toBe('/base.avif');
  });

  it('de una variante a la noche: la variante queda encima desde el primer commit', () => {
    switchTo('dawn');
    switchTo('night');

    expect(leaving()?.getAttribute('src')).toBe('/dawn.avif');
  });

  it('entre dos variantes: la anterior queda encima desde el primer commit', () => {
    switchTo('dawn');
    switchTo('dusk');

    expect(leaving()?.getAttribute('src')).toBe('/dawn.avif');
  });

  /**
   * La saliente es un `<img>` nuevo que nace opaco encima de la foto que se estaba viendo. Si es
   * `lazy` o se decodifica en asíncrono, Safari (iOS) no la pinta en el primer frame —no tiene el
   * atajo de Chrome para imágenes ya en caché— y por el hueco se ve el fondo del tema viejo: un
   * destello oscuro entre dos temas. Tiene que pedirse ya y decodificarse antes de pintar.
   */
  it('la foto saliente se carga ya y se decodifica antes de pintar, para no abrir un hueco', () => {
    switchTo('dawn');

    expect(leaving()?.getAttribute('loading')).toBe('eager');
    expect(leaving()?.getAttribute('decoding')).toBe('sync');
  });

  it('con ceremonia (fundido de 0 s) no se crea capa saliente: el velo ya cubre el cambio', () => {
    controls.fade = 0;
    switchTo('dawn');

    expect(leaving()).toBeNull();
  });

  /**
   * Regresión: elegir otra emoción antes de que acabe el fundido anterior reemplazaba la foto
   * saliente por una nueva a opacidad 1, aunque la anterior estaba a medio desvanecer: la foto
   * del tema intermedio saltaba de, p. ej., el 45 % al 100 %. Las salientes se apilan: la más
   * antigua queda encima y sigue su propio fundido; la que acaba de dejar de verse queda debajo.
   */
  it('un segundo cambio a mitad de fundido apila otra foto saliente sin quitar la primera', () => {
    switchTo('dawn');
    switchTo('dusk');

    // La más antigua (la base nocturna, la que se está desvaneciendo) queda encima del todo.
    expect(allLeaving()).toEqual(['/dawn.avif', '/base.avif']);
  });

  it('tres cambios seguidos conservan las tres fotos que dejaron de verse, la más vieja encima', () => {
    switchTo('dawn');
    switchTo('dusk');
    switchTo('night');

    expect(allLeaving()).toEqual(['/dusk.avif', '/dawn.avif', '/base.avif']);
  });

  /**
   * Regresión: la variante pasaba de `opacity` 0 a 1 en un único frame al terminar de cargar (un
   * escalón de luminancia 5–8 veces el de su fundido), con la foto apareciendo de golpe sobre el
   * fondo del tema. Ahora entra con una transición de `opacity`.
   */
  it('la variante que entra al cargar lo hace con un fundido de opacidad', () => {
    switchTo('dawn');

    const variant = host.querySelector<HTMLImageElement>(
      '[data-photo-variant]:not([data-photo-leaving])',
    );

    expect(variant?.getAttribute('src')).toBe('/dawn.avif');
    expect(variant?.style.transition).toMatch(/opacity/);
  });
});
