import { FullBleedSection, LoadingOrb } from '@/components/ui';
import type { EditorialMedia } from '@/types/editorial-media';

export interface LoadingSceneProps {
  /** `states.loading`, ya resuelto por quien la pinta. */
  media: EditorialMedia;
  /** Texto del orbe, ya traducido (`states.loading`). */
  label: string;
}

/**
 * La espera del sitio: la esfera de `states.loading` ocupa el viewport y el
 * orbe espera sobre el agua, en el tercio inferior, para no tapar la luz que
 * respira. Mientras se ve, la página no tiene scroll: no hay nada debajo que
 * leer todavía. Es la misma en una carga directa (`RealmLoading`, desde cada
 * `loading.tsx`) y entre vistas (`RouteTransition`): una sola forma de esperar.
 *
 * Presentacional y sin hooks, para que la usen un Server Component y uno de
 * cliente.
 */
export function LoadingScene({ media, label }: LoadingSceneProps) {
  return (
    <FullBleedSection
      media={media}
      mode="viewport"
      overlay="bottom"
      fade="bottom"
      className="fm-editorial-shell"
      contentClassName="min-h-[100svh]"
    >
      {/* `data-loading-scene`: mientras la espera está en pantalla, la página
          no se desplaza (regla `html:has(...)` de `globals.css` y `SmoothScroll`). */}
      <div
        aria-busy="true"
        data-loading-scene="true"
        className="flex min-h-[100svh] flex-col items-center justify-end px-6 pt-[108px] pb-[150px] md:pb-[110px]"
      >
        <LoadingOrb label={label} size={96} tone="gold" />
      </div>
    </FullBleedSection>
  );
}
