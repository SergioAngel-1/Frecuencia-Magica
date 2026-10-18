import { ButtonLink } from '@/components/layout';
import { Display, EditorialImage, Kicker } from '@/components/ui';
import { Link } from '@/i18n/navigation';
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
};

/**
 * Bloque de Tienda en la Home: unos pocos productos y la puerta a la tienda. Presentacional: recibe el
 * texto y los productos ya resueltos.
 */
export function StoreShowcase({ kicker, title, description, cta, items }: StoreShowcaseProps) {
  return (
    <section
      className="fm-editorial-full-bleed text-fg py-section relative"
      aria-labelledby="store-showcase-title"
    >
      <div className="fm-container flex flex-col gap-10">
        <div className="flex flex-col items-start gap-4">
          <Kicker tone="teal" spacing="wide">
            {kicker}
          </Kicker>
          <Display level="h2" size="lg" id="store-showcase-title" className="max-w-measure-xs">
            {title}
          </Display>
          <p className="text-fg-body text-body max-w-measure-wide leading-[1.8]">{description}</p>
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
                <span className="text-fg-meta text-meta tracking-soft font-sans">{item.price}</span>
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
  );
}
