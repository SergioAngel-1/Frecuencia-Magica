'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';

import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useMounted } from '@/hooks/use-mounted';
import { registerThemedPhoto } from '@/lib/atmosphere/photo-preload';
import type { EditorialMedia } from '@/types/editorial-media';

import { useThemeOverride } from './theme-override';

type ThemedPhotoProps = {
  media: EditorialMedia & { src: string };
  className: string;
  style: CSSProperties;
  sizes: string;
  priority: boolean;
};

const NO_VARIANTS: NonNullable<EditorialMedia['variants']> = {};

/**
 * Foto de un slot que tiene imagen propia en algunos temas. La base (la de la
 * noche) va en el HTML sin `<link rel="preload">`: `lazy` salvo en las fotos
 * prioritarias (el héroe, que en la noche —portal y Home— es la imagen de
 * arranque y se pide ya). Mientras el tema activo tenga variante, su regla de
 * `globals.css` oculta la base con `display: none`: una foto `lazy` oculta no se
 * descarga (el héroe prioritario sí, una vez, hasta que `ThemedPhoto` hidrata).
 * Tras montar, la variante del tema activo entra encima con un fundido y hereda
 * la prioridad del slot.
 *
 * Nunca se ve la foto equivocada: mientras la variante carga se ve el fondo del
 * tema. Si la variante falla, `data-variant-failed` devuelve la base. La foto se
 * registra para que el cruce de atmósfera precargue su variante durante el velo.
 *
 * Con un `ThemeOverrideProvider` (la espera entre vistas) manda el tema impuesto,
 * no el de la ruta: la base lleva el ocultado en línea porque las reglas de
 * `globals.css` miran el tema de `<html>`, que todavía es el de origen.
 */
export function ThemedPhoto({ media, className, style, sizes, priority }: ThemedPhotoProps) {
  const { atmosphereId } = useAtmosphere();
  const override = useThemeOverride();
  const theme = override ?? atmosphereId;
  const mounted = useMounted();
  const root = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  const variants = media.variants ?? NO_VARIANTS;
  const themes = Object.keys(variants).join(' ');
  // El override sólo existe en un cliente ya hidratado: no hace falta esperar al montaje.
  const variant = (override !== null || mounted) && theme !== 'night' ? variants[theme] : undefined;

  useEffect(
    () => registerThemedPhoto({ variants, sizes, element: root.current }),
    [variants, sizes],
  );
  const variantFailed = variant !== undefined && failed === variant;
  // Una variante con el sujeto en otro sitio trae su foco, en escritorio y en móvil.
  const position = theme !== 'night' ? media.variantPositions?.[theme] : undefined;
  const variantStyle = position
    ? ({ ...style, '--fm-pos': position, '--fm-pos-mobile': position } as CSSProperties)
    : style;
  // Con override las reglas de `globals.css` no aplican (miran `<html>`): la base se oculta aquí, con
  // `display: none` para que tampoco se descargue, y sin el lavado del esquema claro de origen.
  const baseStyle = override
    ? {
        ...style,
        display: variant && !variantFailed ? 'none' : undefined,
        opacity: 1,
        filter: 'none',
      }
    : style;

  return (
    <div
      ref={root}
      className="absolute inset-0"
      data-photo-themes={themes}
      data-photo-override={override ? '' : undefined}
      data-variant-failed={variantFailed ? 'true' : undefined}
    >
      <Image
        alt={media.alt}
        className={className}
        data-photo-base
        data-photo-night=""
        fill
        fetchPriority={priority ? 'high' : undefined}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        src={media.src}
        style={baseStyle}
      />
      {variant && !variantFailed ? (
        <Image
          key={variant}
          alt=""
          aria-hidden="true"
          className={className}
          fill
          onError={() => setFailed(variant)}
          onLoad={() => setLoaded(variant)}
          priority={priority}
          sizes={sizes}
          src={variant}
          style={{ ...variantStyle, opacity: loaded === variant ? 1 : 0 }}
        />
      ) : null}
    </div>
  );
}
