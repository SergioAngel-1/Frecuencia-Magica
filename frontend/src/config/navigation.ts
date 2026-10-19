import { NAV_REALMS } from './realms';

/**
 * La entrada de la narrativa del sitio en la navegación: «Sobre Marisol» no
 * es un realm (hereda el de la home), pero cuenta quién hay detrás y por qué.
 * Va después de los realms, en el marfil del tema (`--color-fg`), para no
 * confundirse con los acentos de los realms.
 */
export const NAV_STORY = {
  id: 'story',
  href: '/sobre-marisol',
  accent: 'var(--color-fg)',
} as const;

export { NAV_REALMS };
