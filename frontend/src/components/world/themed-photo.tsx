'use client';

import { useState, type CSSProperties } from 'react';
import Image from 'next/image';

import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useMounted } from '@/hooks/use-mounted';
import type { EditorialMedia } from '@/types/editorial-media';

type ThemedPhotoProps = {
  media: EditorialMedia & { src: string };
  className: string;
  style: CSSProperties;
  sizes: string;
  priority: boolean;
};

/**
 * Foto de un slot que tiene imagen propia en algunos temas. La base (la de la
 * noche) va en el HTML; tras montar, la variante del tema activo entra encima con
 * un fundido. Sólo se descarga la variante del tema activo.
 *
 * Una regla de `globals.css` oculta la base cuando el tema activo tiene variante
 * (`data-photo-themes`), de modo que nunca se ve la foto equivocada: mientras la
 * variante carga se ve el fondo del tema. Si la variante falla, `data-variant-failed`
 * devuelve la base.
 */
export function ThemedPhoto({ media, className, style, sizes, priority }: ThemedPhotoProps) {
  const { atmosphereId } = useAtmosphere();
  const mounted = useMounted();
  const [loaded, setLoaded] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  const variants = media.variants ?? {};
  const themes = Object.keys(variants).join(' ');
  const variant = mounted && atmosphereId !== 'night' ? variants[atmosphereId] : undefined;
  const variantFailed = variant !== undefined && failed === variant;
  // Una variante con el sujeto en otro sitio trae su foco, en escritorio y en móvil.
  const position = atmosphereId !== 'night' ? media.variantPositions?.[atmosphereId] : undefined;
  const variantStyle = position
    ? ({ ...style, '--fm-pos': position, '--fm-pos-mobile': position } as CSSProperties)
    : style;

  return (
    <div
      className="absolute inset-0"
      data-photo-themes={themes}
      data-variant-failed={variantFailed ? 'true' : undefined}
    >
      <Image
        alt={media.alt}
        className={`${className} transition-opacity duration-700 ease-out motion-reduce:duration-0`}
        data-photo-base
        fill
        priority={priority}
        sizes={sizes}
        src={media.src}
        style={style}
      />
      {variant && !variantFailed ? (
        <Image
          key={variant}
          alt=""
          aria-hidden="true"
          className={`${className} transition-opacity duration-700 ease-out motion-reduce:duration-0`}
          fill
          onError={() => setFailed(variant)}
          onLoad={() => setLoaded(variant)}
          sizes={sizes}
          src={variant}
          style={{ ...variantStyle, opacity: loaded === variant ? 1 : 0 }}
        />
      ) : null}
    </div>
  );
}
