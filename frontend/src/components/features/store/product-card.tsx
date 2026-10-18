'use client';

import type { Product } from '@/types/content';

import { useTranslations } from 'next-intl';

import { Badge, Button, EditorialImage, GradientText } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/format';
import { categoryKey } from '@/lib/store/category-key';
import { productSpecs } from '@/lib/store/gallery';
import { cn } from '@/lib/cn';
import { useCartStore } from '@/stores/cart-store';
import type { EditorialMedia, EditorialMediaAspect } from '@/types/editorial-media';

const ASPECT_FIELD: Record<EditorialMediaAspect, string> = {
  viewport: 'min-h-[100svh]',
  '16:9': 'aspect-[16/9]',
  '16:8': 'aspect-[16/8]',
  '3:4': 'aspect-[3/4]',
  '1:1': 'aspect-square',
};

type ProductCardProps = {
  product: Product;
  media: EditorialMedia;
  /**
   * El destacado: imagen y texto en columnas desde `md` (apilados en móvil,
   * con la imagen a su 1:1). En columnas, la imagen cubre todo el alto de la
   * ficha.
   */
  featured?: boolean;
  className?: string;
};

export function ProductCard({ product, media: baseMedia, featured, className }: ProductCardProps) {
  const t = useTranslations('store');
  const add = useCartStore((s) => s.add);
  const title = t(`products.${product.id}.title`);
  // El tamaño sólo se pinta si el producto lo declara (lo confirma Marisol).
  const size = productSpecs(product).find((spec) => spec.id === 'size');
  const media: EditorialMedia = {
    ...baseMedia,
    alt:
      baseMedia.slot === 'product.related'
        ? t('media.alt.related', { title })
        : t('media.alt.product', { title }),
  };

  return (
    <article
      className={cn(
        'group rounded-card-lg border-line bg-surface hover:border-accent/45 relative flex flex-col overflow-hidden border transition-colors',
        className,
      )}
      data-product-id={product.id}
      data-editorial-media={media.slot}
    >
      {/* Sólo la zona editorial navega al detalle; la acción de añadir permanece separada. */}
      <Link
        href={{ pathname: '/tienda/[productId]', params: { productId: product.id } }}
        className={cn(
          'flex min-h-11 flex-1 flex-col focus-visible:rounded-[inherit]',
          featured && 'md:flex-row',
        )}
      >
        {/* La caja de la imagen tiene el ratio del slot: un producto a 1:1, el
            ambiente de relacionados a su 16:8. El texto vive debajo, no sobre
            la foto, así que el objeto se pinta sin velo: con él quedaba opaco.
            En el destacado, desde `md`, la imagen deja su caja y cubre la
            columna entera, de arriba abajo de la ficha. */}
        <div
          className={cn('relative shrink-0', featured && 'md:w-1/2 md:self-stretch')}
          data-featured-column={featured ? 'true' : undefined}
        >
          <div
            className={cn(
              'relative w-full',
              ASPECT_FIELD[media.aspect],
              featured && 'md:absolute md:inset-0 md:aspect-auto',
            )}
          >
            <EditorialImage
              aspect={media.aspect}
              className="h-full"
              media={media}
              overlay={false}
              scrim={false}
            />
          </div>
          {featured ? (
            <div className="absolute top-5 left-5 z-10">
              <Badge solid>{t('featuredBadge')}</Badge>
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            'flex flex-col gap-2 p-5',
            featured && 'p-6 md:w-1/2 md:justify-center md:pb-[96px]',
          )}
        >
          {featured ? null : (
            <span className="text-fg-meta text-label tracking-label font-sans uppercase">
              {t(categoryKey(product.catKey))}
            </span>
          )}
          <h3
            className={cn(
              'text-fg group-hover:text-accent font-serif leading-tight transition-colors',
              featured ? 'text-[clamp(24px,3vw,34px)]' : 'text-[20px]',
            )}
          >
            {featured ? (
              <GradientText>{t(`products.${product.id}.title`)}</GradientText>
            ) : (
              t(`products.${product.id}.title`)
            )}
          </h3>
          {size ? (
            <span className="text-fg-meta text-meta tracking-ui font-sans">
              {t(size.key.replace(/^store\./, '') as 'notes')}
            </span>
          ) : null}
          {featured ? (
            <p className="text-fg-soft text-body mt-1 max-w-[52ch] leading-[1.75]">
              {t('featuredDescription')}
            </p>
          ) : null}
        </div>
      </Link>

      <div
        className={cn(
          'mt-auto flex items-center justify-between gap-4 p-5 pt-3',
          // En columnas, la acción cierra la columna del texto.
          featured && 'px-6 pb-6 md:absolute md:right-0 md:bottom-0 md:w-1/2',
        )}
      >
        <span className="text-accent tracking-soft font-serif text-[21px]">
          {formatPrice(product.price)}
        </span>
        <Button variant="accent" tone="gold" onClick={() => add(product.id)}>
          {t('add')}
        </Button>
      </div>
    </article>
  );
}
