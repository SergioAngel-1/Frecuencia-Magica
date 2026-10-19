'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { EditorialImage, Float, Swap } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { GalleryViewKind } from '@/lib/store/gallery';
import type { EditorialMedia, EditorialMediaAspect } from '@/types/editorial-media';

/** La caja de la imagen sigue el ratio de lo que pinta: el objeto a 1:1, la atmósfera a 16:8. */
const DETAIL_ASPECT: Record<EditorialMediaAspect, string> = {
  viewport: 'aspect-[16/9]',
  '16:9': 'aspect-[16/9]',
  '16:8': 'aspect-[16/8]',
  '3:4': 'aspect-[3/4]',
  '1:1': 'aspect-square',
};

export type ProductGalleryItem = { kind: GalleryViewKind; media: EditorialMedia };

type ProductGalleryProps = {
  /** El visual del producto primero y, tras él, las vistas que Marisol entregó. */
  items: readonly ProductGalleryItem[];
};

/**
 * Galería de la ficha: la imagen elegida a su ratio y, sólo si el producto tiene
 * más de una vista, las miniaturas para cambiar. Con una sola vista (hoy, los
 * ocho productos) no hay controles que no lleven a nada. El cambio de imagen
 * va en `Swap`: la anterior se funde antes de que entre la nueva.
 */
export function ProductGallery({ items }: ProductGalleryProps) {
  const t = useTranslations('store');
  const [selected, setSelected] = useState<GalleryViewKind>(items[0]!.kind);
  const current = items.find((item) => item.kind === selected) ?? items[0]!;

  return (
    <div className="lg:sticky lg:top-[112px]">
      <Float
        as="section"
        className={cn(
          'rounded-card-lg border-line relative isolate overflow-hidden border',
          DETAIL_ASPECT[items[0]!.media.aspect],
        )}
        data-editorial-media={current.media.slot}
      >
        <Swap id={current.kind} className="h-full">
          <EditorialImage
            aspect={current.media.aspect}
            className="h-full"
            media={current.media}
            overlay={false}
            priority
            scrim={false}
          />
        </Swap>
      </Float>

      {items.length > 1 ? (
        <div
          role="group"
          aria-label={t('gallery.label')}
          className="mt-3 flex flex-wrap gap-2"
          data-product-gallery-thumbs
        >
          {items.map(({ kind }) => (
            <button
              key={kind}
              type="button"
              aria-pressed={kind === current.kind}
              onClick={() => setSelected(kind)}
              className={cn(
                'rounded-pill text-meta tracking-ui min-h-11 border px-4 font-sans transition-colors duration-300',
                kind === current.kind
                  ? 'border-line-strong text-fg bg-surface-strong'
                  : 'border-line text-fg-soft hover:text-fg',
              )}
            >
              {t(`gallery.views.${kind}`)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
