/**
 * Motor del mundo — la capa inmersiva.
 *
 * `WorldEngine` se monta una sola vez en el layout de locale y sobrevive a
 * los cambios de ruta: el fondo, el cursor y el drone son continuos, y sólo
 * cambian de color y de afinación al entrar en otro realm.
 *
 * El resto son piezas componibles que las vistas usan directamente.
 */

export { BrandFigures } from './brand-figures';
export { CosmicCanvas } from './cosmic-canvas';
export { Halo } from './halo';
export { LuminousCursor } from './luminous-cursor';
export { NebulaLayer } from './nebula-layer';
export { OrbitalRings, type Ring } from './orbital-rings';
export { PortalAnnouncer, PortalTransition } from './portal-transition';
export { RealmGlyph } from './realm-glyph';
export { RealmContext, RealmProvider, type RealmContextValue } from './realm-provider';
export { SmoothScroll } from './smooth-scroll';
export { WaveSeparator } from './wave-separator';
export { WorldEngine } from './world-engine';
