/**
 * Atributo que activa la transición de colores de todo el sitio durante el
 * cambio de tema (`[data-theme-switching]` en `globals.css`).
 */
const SWITCHING_ATTRIBUTE = 'data-theme-switching';

/**
 * Marca un cambio de tema durante `ms` milisegundos: mientras el atributo está
 * puesto, los colores del sitio transitan en vez de saltar. Devuelve la
 * limpieza, que SIEMPRE retira el atributo —al vencer o si se llama antes
 * (cambio de `reduced` o desmontaje)—, de modo que la marca nunca queda colgada.
 */
export function beginThemeSwitch(root: HTMLElement, ms: number): () => void {
  root.setAttribute(SWITCHING_ATTRIBUTE, '');
  const timer = setTimeout(() => root.removeAttribute(SWITCHING_ATTRIBUTE), ms);

  return () => {
    clearTimeout(timer);
    root.removeAttribute(SWITCHING_ATTRIBUTE);
  };
}
