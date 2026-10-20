/**
 * Atributo que activa la transición de colores de todo el sitio durante el
 * cambio de tema (`[data-theme-switching]` en `globals.css`).
 */
const SWITCHING_ATTRIBUTE = 'data-theme-switching';

/**
 * Variable CSS con la duración de esa transición. El CSS no repite el número:
 * lo lee de aquí, para que la tinta y el resto de capas no puedan divergir.
 */
export const THEME_INK_DURATION_PROPERTY = '--theme-ink-duration';

/**
 * Marca un cambio de tema durante `ms` milisegundos: mientras el atributo está
 * puesto y la variable fija la duración, los colores del sitio transitan en vez
 * de saltar. Devuelve la limpieza, que SIEMPRE retira ambos —al vencer o si se
 * llama antes (cambio de `reduced` o desmontaje)—, de modo que la marca nunca
 * queda colgada.
 */
export function beginThemeSwitch(root: HTMLElement, ms: number): () => void {
  root.setAttribute(SWITCHING_ATTRIBUTE, '');
  root.style.setProperty(THEME_INK_DURATION_PROPERTY, `${ms}ms`);

  const clear = () => {
    root.removeAttribute(SWITCHING_ATTRIBUTE);
    root.style.removeProperty(THEME_INK_DURATION_PROPERTY);
  };
  const timer = setTimeout(clear, ms);

  return () => {
    clearTimeout(timer);
    clear();
  };
}
