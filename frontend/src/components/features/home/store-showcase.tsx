import { ButtonLink } from '@/components/layout';
import { ScopeBackdrop, AtmosphereScope, Display, EditorialImage, Kicker } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import type { AtmosphereScheme } from '@/types/atmosphere';
import type { EditorialMedia } from '@/types/editorial-media';

export type StoreShowcaseItem = {
  id: string;
  title: string;
  price: string;
  /** La foto del producto, ya resuelta con su instancia y su alt traducido. */
  media: EditorialMedia;
};

export type StoreShowcaseProps = {
  kicker: string;
  title: string;
  description: string;
  cta: string;
  items: readonly StoreShowcaseItem[];
  /** Esquema de la atmósfera `store` (lo pasa la vista desde `config/atmospheres`). */
  scheme: AtmosphereScheme;
};

/**
 * Bloque de Tienda en la Home: una banda clara, dentro de la atmósfera `store`,
 * con unos pocos productos y la puerta a la tienda. Presentacional: recibe el
 * texto y los productos ya resueltos.
 */
export function StoreShowcase({
  kicker,
  title,
  description,
  cta,
  items,
  scheme,
}: StoreShowcaseProps) {
  return (
    // `-mt-section`: sube un `fade-band` sobre el pie del bloque de llegada (su relleno
    // inferior vale lo mismo) y su borde superior, que se funde, deja ver el fondo de ese
    // bloque: un cruce de claro a claro en vez de una arista.
    <AtmosphereScope atmosphere="store" scheme={scheme} className="-mt-section">
      <section
        className="fm-editorial-full-bleed text-fg py-section relative isolate"
        aria-labelledby="store-showcase-title"
      >
        {/* El mismo degradado que pinta el sitio en la Tienda. Arriba se cruza con
            el fondo del bloque de llegada; abajo se funde con la noche del bento. */}
        <ScopeBackdrop fade="both" />
        <div className="fm-container flex flex-col gap-10">
          <div className="flex flex-col items-start gap-4">
            <Kicker tone="teal" spacing="wide">
              {kicker}
            </Kicker>
            <Display level="h2" size="lg" id="store-showcase-title" className="max-w-[18ch]">
              {title}
            </Display>
            <p className="text-fg-body text-body max-w-[52ch] leading-[1.8]">{description}</p>
          </div>

          <ul className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {items.map((item) => (
              <li key={item.id} data-product-id={item.id}>
                <Link
                  href={{ pathname: '/tienda/[productId]', params: { productId: item.id } }}
                  className="group flex flex-col gap-3"
                >
                  <div className="rounded-card relative aspect-square overflow-hidden">
                    <EditorialImage
                      className="h-full"
                      media={item.media}
                      overlay={false}
                      scrim={false}
                    />
                  </div>
                  <span className="text-fg group-hover:text-accent font-serif text-[clamp(18px,2vw,22px)] leading-tight transition-colors">
                    {item.title}
                  </span>
                  <span className="text-fg-meta text-meta tracking-soft font-sans">
                    {item.price}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div>
            <ButtonLink variant="outline" href="/tienda">
              {cta}
            </ButtonLink>
          </div>
        </div>
      </section>
    </AtmosphereScope>
  );
}
