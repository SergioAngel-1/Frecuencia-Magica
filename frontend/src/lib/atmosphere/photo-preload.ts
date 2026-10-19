import { getImageProps } from 'next/image';

import type { AtmosphereId } from '@/types/atmosphere';

/** Una foto montada y las variantes que tiene publicadas. */
type ThemedPhotoEntry = {
  variants: Partial<Record<AtmosphereId, string>>;
  sizes: string;
  /** Contenedor de la foto: sólo se precargan las cercanas al viewport. Sin él, se precarga. */
  element?: Element | null;
};

export type PreloadThemeOptions = {
  /** Tope de espera; se resuelve igualmente al llegar. */
  timeoutMs?: number;
  /** Carga inyectable para poder probar sin DOM. */
  loadImage?: (src: string, sizes: string) => Promise<void>;
};

/** Tope por defecto: acota lo que el velo del cruce puede esperar a las fotos. */
const PRELOAD_TIMEOUT_MS = 2500;

const mountedPhotos = new Set<ThemedPhotoEntry>();

/** Cuántos viewports por encima y por debajo se consideran «cerca»: lo que `lazy` pediría al hacer scroll. */
const NEAR_VIEWPORTS = 1;

/**
 * Las fotos lejos del viewport son `lazy`: pedirlas todas al cruzar traería, en una página
 * larga, más bytes de los que el sitio cargaría solo. Sin elemento o sin DOM, cuenta como cerca.
 */
function isNearViewport(element: Element | null | undefined): boolean {
  if (!element || typeof window === 'undefined') return true;

  const rect = element.getBoundingClientRect();
  const margin = window.innerHeight * NEAR_VIEWPORTS;

  return rect.bottom > -margin && rect.top < window.innerHeight + margin;
}

/**
 * Registra una foto montada con sus variantes por tema. Devuelve la baja para
 * el desmontaje; sin registro no hay nada que precargar.
 */
export function registerThemedPhoto(entry: ThemedPhotoEntry): () => void {
  mountedPhotos.add(entry);

  return () => {
    mountedPhotos.delete(entry);
  };
}

/** Pide la imagen con el `srcset`/`sizes` que usaría `next/image` y espera su decodificación. */
async function defaultLoadImage(src: string, sizes: string): Promise<void> {
  if (typeof Image === 'undefined') return;

  const { props } = getImageProps({ src, alt: '', fill: true, sizes });
  const image = new Image();
  if (props.sizes) image.sizes = props.sizes;
  if (props.srcSet) image.srcset = props.srcSet;
  image.src = props.src;

  if (typeof image.decode === 'function') {
    await image.decode().catch(() => undefined);
  }
}

/**
 * Precarga las variantes de un tema para todas las fotos montadas que lo tengan.
 * Deduplica por `src` dentro de la llamada y nunca rechaza: se resuelve cuando
 * todas las cargas terminan o fallan, o al llegar al tope de tiempo.
 */
export function preloadTheme(
  theme: AtmosphereId,
  options: PreloadThemeOptions = {},
): Promise<void> {
  const { timeoutMs = PRELOAD_TIMEOUT_MS, loadImage: load = defaultLoadImage } = options;
  // El primer `sizes` registrado para cada `src` es el que se usa al deduplicar.
  const sources = new Map<string, string>();

  for (const photo of mountedPhotos) {
    if (!isNearViewport(photo.element)) continue;

    const src = photo.variants[theme];
    if (src && !sources.has(src)) sources.set(src, photo.sizes);
  }

  if (sources.size === 0) return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(finish, timeoutMs);

    const loads = [...sources].map(([src, sizes]) =>
      Promise.resolve()
        .then(() => load(src, sizes))
        .catch(() => undefined),
    );

    void Promise.all(loads).then(finish);
  });
}
