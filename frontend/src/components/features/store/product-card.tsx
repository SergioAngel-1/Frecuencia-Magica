'use client';

import type { Product } from '@/types/content';

import { useTranslations } from 'next-intl';

import { Badge, Band, Button, GlassPanel, GradientText } from '@/components/ui';
import { formatPrice } from '@/lib/format';
import { useCartStore } from '@/stores/cart-store';
import { cn } from '@/lib/cn';

type ProductCardProps = {
  product: Product;
  featured?: boolean;
  className?: string;
};

export function ProductCard({ product, featured, className }: ProductCardProps) {
  const t = useTranslations('store');
  const add = useCartStore((s) => s.add);

  return (
    <GlassPanel
      radius={featured ? 26 : 22}
      glow={featured}
      as="article"
      className={cn(
        'group flex flex-col overflow-hidden',
        featured ? 'min-h-[440px]' : 'min-h-[340px]',
        className,
      )}
    >
      <Band
        gradient={product.band}
        aspect={featured ? '16/8' : 'square'}
        overlay="bottom"
        className={cn('shrink-0', featured ? 'h-[200px] md:h-[260px]' : 'h-[180px]')}
      >
        <div className="flex h-full flex-col justify-end p-4">
          {featured ? (
            <Badge solid>{t('featuredBadge')}</Badge>
          ) : null}
        </div>
      </Band>

      <div className={cn('flex flex-1 flex-col gap-2 p-4', featured && 'p-5')}>
        {featured ? null : <span className="font-sans text-[11px] tracking-[.14em] uppercase text-ivory/50">{t(`categories.${product.catKey}`)}</span>}
        <h3 className={cn('font-serif leading-tight text-ivory', featured ? 'text-[22px]' : 'text-[17px]')}>
          {featured ? (
            <GradientText>{t(`products.${product.id}.title`)}</GradientText>
          ) : (
            t(`products.${product.id}.title`)
          )}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-serif text-[19px] tracking-[.04em] text-gold">
            {formatPrice(product.price)}
          </span>
          <Button
            variant="accent"
            size="sm"
            tone="gold"
            onClick={() => add(product.id)}
          >
            {t('add')}
          </Button>
        </div>
      </div>
    </GlassPanel>
  );
}
