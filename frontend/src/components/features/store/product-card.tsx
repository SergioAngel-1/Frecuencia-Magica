'use client';

import type { Product } from '@/types/content';

import { useTranslations } from 'next-intl';

import { Badge, Button, EditorialImage, GradientText } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/format';
import { categoryKey } from '@/lib/store/category-key';
import { cn } from '@/lib/cn';
import { useCartStore } from '@/stores/cart-store';
import type { EditorialMedia } from '@/types/editorial-media';

type ProductCardProps = {
  product: Product;
  media: EditorialMedia;
  featured?: boolean;
  className?: string;
};

export function ProductCard({ product, media: baseMedia, featured, className }: ProductCardProps) {
  const t = useTranslations('store');
  const add = useCartStore((s) => s.add);
  const title = t(`products.${product.id}.title`);
  const media: EditorialMedia = {
    ...baseMedia,
    alt: t('media.alt.product', { title }),
  };

  return (
    <article
      className={cn(
        'group rounded-card-lg border-gold/20 bg-glass hover:border-gold/45 flex flex-col overflow-hidden border transition-colors',
        featured ? 'min-h-[520px]' : 'min-h-[390px]',
        className,
      )}
      data-product-id={product.id}
      data-editorial-media={media.slot}
    >
      {/* Sólo la zona editorial navega al detalle; la acción de añadir permanece separada. */}
      <Link
        href={{ pathname: '/tienda/[productId]', params: { productId: product.id } }}
        className="flex min-h-11 flex-1 flex-col focus-visible:rounded-[inherit]"
      >
        <div
          className={cn(
            'relative shrink-0',
            featured ? 'h-[clamp(210px,26vw,340px)]' : 'h-[clamp(190px,22vw,260px)]',
          )}
        >
          <EditorialImage
            aspect={featured ? '16:8' : '1:1'}
            className="h-full"
            media={media}
            overlay="bottom"
            scrim="bottom"
          />
          {featured ? (
            <div className="absolute top-5 left-5 z-10">
              <Badge solid>{t('featuredBadge')}</Badge>
            </div>
          ) : null}
        </div>

        <div className={cn('flex flex-col gap-2 p-5', featured && 'p-6')}>
          {featured ? null : (
            <span className="text-ivory/55 font-sans text-[11px] tracking-[.14em] uppercase">
              {t(categoryKey(product.catKey))}
            </span>
          )}
          <h3
            className={cn(
              'text-ivory group-hover:text-gold font-serif leading-tight transition-colors',
              featured ? 'text-[clamp(24px,3vw,34px)]' : 'text-[20px]',
            )}
          >
            {featured ? (
              <GradientText>{t(`products.${product.id}.title`)}</GradientText>
            ) : (
              t(`products.${product.id}.title`)
            )}
          </h3>
        </div>
      </Link>

      <div
        className={cn(
          'mt-auto flex items-center justify-between gap-4 p-5 pt-3',
          featured && 'px-6 pb-6',
        )}
      >
        <span className="text-gold font-serif text-[21px] tracking-[.04em]">
          {formatPrice(product.price)}
        </span>
        <Button variant="accent" size="sm" tone="gold" onClick={() => add(product.id)}>
          {t('add')}
        </Button>
      </div>
    </article>
  );
}
