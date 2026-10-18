'use client';

import type { Product } from '@/types/content';

import { useTranslations } from 'next-intl';

import { PlayPauseIcon } from '@/components/features/player/player-icons';
import { Badge, Button, Float, Kicker, Prose, SectionHeading } from '@/components/ui';
import { PRODUCTS } from '@/data/products';
import { messageKey } from '@/i18n/keys';
import { useRouter } from '@/i18n/navigation';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';
import { categoryKey } from '@/lib/store/category-key';
import { productSpecs } from '@/lib/store/gallery';
import { relatedProducts } from '@/lib/store/related';
import { useCartStore } from '@/stores/cart-store';
import { useAudioPlayback, usePlayerStore } from '@/stores/player-store';
import type { EditorialMedia } from '@/types/editorial-media';

import { ProductCard } from './product-card';
import { ProductGallery, type ProductGalleryItem } from './product-gallery';
import { ProductSections } from './product-sections';

export type ProductMedia = {
  /** La imagen del propio producto (`store-product-visual`); sin ella, la atmósfera de `product.detail`. */
  detail: EditorialMedia;
  /** Vistas propias que el producto declara (etiqueta, textura, en uso); casi siempre vacío. */
  gallery?: Partial<Record<'label' | 'texture' | 'inUse', EditorialMedia>>;
  related: Record<(typeof PRODUCTS)[number]['id'], EditorialMedia>;
};

type ProductDetailProps = {
  product: Product;
  media: ProductMedia;
};

export function ProductDetail({ product, media }: ProductDetailProps) {
  const t = useTranslations('store');
  const tResonario = useTranslations('resonario');
  const add = useCartStore((state) => state.add);
  const tPlayer = useTranslations('player');
  const toggleAudio = usePlayerStore((state) => state.toggleAudio);
  const frequency = useAudioPlayback(product.relatedAudioId);
  const router = useRouter();
  const related = relatedProducts(product, PRODUCTS, 3);
  const title = t(`products.${product.id}.title`);
  const specs = productSpecs(product);
  const galleryItems: ProductGalleryItem[] = [
    { kind: 'cover', media: media.detail },
    ...(['label', 'texture', 'inUse'] as const).flatMap((kind) => {
      const view = media.gallery?.[kind];
      return view ? [{ kind, media: view }] : [];
    }),
  ];
  const frequencyTitle = tResonario(`audios.${product.relatedAudioId}.title`);

  return (
    <div>
      {/* La imagen es la de la tarjeta que se eligió en la tienda, a su mismo
          ratio y sin velo: desde `lg` acompaña a la ficha mientras se lee. */}
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <ProductGallery items={galleryItems} />

        <div className="flex flex-col gap-6">
          <div>
            <Badge solid>{t(categoryKey(product.catKey))}</Badge>
            <Kicker tone="gold" spacing="widest" className="mt-6">
              {t('kicker')}
            </Kicker>
            <h1 className="text-fg mt-4 font-serif text-[clamp(36px,5vw,72px)] leading-[0.94]">
              {title}
            </h1>
            <p className="text-accent tracking-soft text-serif-2xl mt-6 font-serif">
              {formatPrice(product.price)}
            </p>
          </div>

          <Prose maxWidth={48}>{t('productDescription')}</Prose>
          {/* Tamaño y contenido sólo si el dato existe: lo confirma Marisol. */}
          {specs.length > 0 ? (
            <dl aria-label={t('specs.label')} className="grid gap-2" data-product-specs>
              {specs.map(({ id, key }) => (
                <div key={id} className="flex flex-wrap gap-x-3">
                  <dt className="text-fg-meta text-label tracking-label font-sans uppercase">
                    {t(`specs.${id}`)}
                  </dt>
                  <dd className="text-fg-soft text-body font-sans">
                    {t(messageKey('store', key))}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          <ul className="space-y-2">
            {(t.raw('notes') as string[]).map((note) => (
              <li key={note} className="text-fg-soft text-body tracking-soft font-sans">
                — {note}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="primary" onClick={() => add(product.id)}>
              {t('add')}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                add(product.id);
                router.push('/tienda/carrito');
              }}
            >
              {t('buyNow')}
            </Button>
          </div>

          {/* La frecuencia del producto comparte estado con el reproductor: se
              enciende mientras es la que está abierta y su play pasa a pausa
              mientras suena, igual que en el dock. */}
          <button
            type="button"
            aria-label={`${frequency.playing ? tPlayer('pause') : tPlayer('play')} — ${frequencyTitle}`}
            onClick={() => toggleAudio(product.relatedAudioId)}
            className={cn(
              'bg-surface hover:border-accent/60 mt-1 flex min-h-11 items-center gap-3 self-start rounded-full border px-5 py-3 text-left transition-[border-color,box-shadow] duration-300',
              frequency.active ? 'border-accent/60 shadow-glow-card' : 'border-line',
            )}
            data-frequency-state={
              frequency.playing ? 'playing' : frequency.active ? 'paused' : 'idle'
            }
          >
            <span
              aria-hidden="true"
              className={cn(
                'text-accent flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300',
                frequency.active ? 'border-accent/70 bg-accent/15' : 'border-accent/50',
              )}
            >
              <PlayPauseIcon playing={frequency.playing} size={12} />
            </span>
            <span className="flex flex-col">
              <span className="text-accent-2 text-label tracking-label font-sans uppercase">
                {t('relatedFrequencyLabel')}
              </span>
              <span className="text-fg text-serif-sm font-serif">{frequencyTitle}</span>
            </span>
          </button>

          <ProductSections />
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-section" data-editorial-media="product.related">
          <SectionHeading
            kicker={t('relatedHeading.kicker')}
            title={t('relatedHeading.title')}
            className="mb-8"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((relatedProduct, index) => (
              <Float key={relatedProduct.id} order={index} className="grid">
                <ProductCard media={media.related[relatedProduct.id]!} product={relatedProduct} />
              </Float>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
