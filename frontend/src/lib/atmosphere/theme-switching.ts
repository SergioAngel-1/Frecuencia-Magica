/**
 * Atributo que activa la transición de colores de todo el sitio durante el
 * cambio de tema (`[data-theme-switching]` en `globals.css`).
 */
const SWITCHING_ATTRIBUTE = 'data-theme-switching';

/**
 * Variables CSS con la duración de cada transición. El CSS no repite los números:
 * los lee de aquí, para que la tinta, los velos y el resto de capas no puedan divergir.
 * - `ink`: color, borde, relleno y trazo de cada elemento.
 * - `scrim`: los tokens de velo y luz (`--scrim`, `--halo`, `--nebula-*`), registrados con
 *   `@property` en `tokens.css`: los degradados que se pintan con ellos funden en vez de saltar.
 */
export const THEME_INK_DURATION_PROPERTY = '--theme-ink-duration';
export const THEME_SCRIM_DURATION_PROPERTY = '--theme-scrim-duration';

export type ThemeSwitchDurations = { ink: number; scrim?: number };

/**
 * Marca un cambio de tema: mientras el atributo está puesto y las variables fijan las
 * duraciones (en milisegundos), los colores del sitio transitan en vez de saltar. Dura lo que
 * la más larga de ellas. Devuelve la limpieza, que SIEMPRE retira el atributo y las
 * variables —al vencer o si se llama antes (cambio de `reduced` o desmontaje)—, de modo
 * que la marca nunca queda colgada.
 */
export function beginThemeSwitch(root: HTMLElement, durations: number | ThemeSwitchDurations) {
  const { ink, scrim } = typeof durations === 'number' ? { ink: durations } : durations;
  const total = Math.max(ink, scrim ?? 0);

  root.setAttribute(SWITCHING_ATTRIBUTE, '');
  root.style.setProperty(THEME_INK_DURATION_PROPERTY, `${ink}ms`);
  root.style.setProperty(THEME_SCRIM_DURATION_PROPERTY, `${scrim ?? ink}ms`);

  const clear = () => {
    root.removeAttribute(SWITCHING_ATTRIBUTE);
    root.style.removeProperty(THEME_INK_DURATION_PROPERTY);
    root.style.removeProperty(THEME_SCRIM_DURATION_PROPERTY);
  };
  const timer = setTimeout(clear, total);

  return () => {
    clearTimeout(timer);
    clear();
  };
}
