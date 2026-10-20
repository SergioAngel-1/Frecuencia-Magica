'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';

import { PHOTO_LOAD_FADE_SECONDS } from '@/config/motion';
import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useMounted } from '@/hooks/use-mounted';
import { useThemeFade } from '@/hooks/use-theme-fade';
import { registerThemedPhoto } from '@/lib/atmosphere/photo-preload';
import type { EditorialMedia } from '@/types/editorial-media';

import { LeavingPhoto, type LeavingPhotoLayer } from './leaving-photo';
import { useThemeOverride } from './theme-override';

type ThemedPhotoProps = {
  media: EditorialMedia & { src: string };
  className: string;
  style: CSSProperties;
  sizes: string;
  priority: boolean;
};

const NO_VARIANTS: NonNullable<EditorialMedia['variants']> = {};

/** Tope para que una capa saliente no se quede encima si la nueva nunca avisa de que cargó. */
const LEAVE_READY_TIMEOUT_MS = 2500;

type SeenPhoto = { src: string; style: CSSProperties; changes: number };

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
 *
 * Al cambiar de tema sin velo, la foto que se iba se queda encima y se desvanece
 * (`fm-photo-leave`) mientras la nueva aparece debajo: así el cambio de foto
 * acompaña al fundido del fondo en vez de saltar. Con cruce de atmósfera o de
 * portal, o con movimiento reducido, el velo o el ajuste ya cubren el cambio y
 * la capa saliente no se crea.
 */
export function ThemedPhoto({ media, className, style, sizes, priority }: ThemedPhotoProps) {
  const { atmosphereId } = useAtmosphere();
  const override = useThemeOverride();
  const theme = override ?? atmosphereId;
  const mounted = useMounted();
  const fade = useThemeFade('photo');
  const root = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  // Las fotos que dejaron de verse y aún se desvanecen, de la más antigua a la más reciente.
  const [leaving, setLeaving] = useState<readonly LeavingPhotoLayer[]>([]);
  // La foto que se estaba viendo la última vez que este componente pintó, y cuántas veces ha
  // cambiado: de ahí sale la foto saliente y su `key`. Es estado y no un ref porque se compara y se
  // reescribe durante el render (ver más abajo).
  const [seen, setSeen] = useState<SeenPhoto | null>(null);

  const variants = media.variants ?? NO_VARIANTS;
  const themes = Object.keys(variants).join(' ');
  // El override sólo existe en un cliente ya hidratado: no hace falta esperar al montaje.
  const variant = (override !== null || mounted) && theme !== 'night' ? variants[theme] : undefined;
  const variantFailed = variant !== undefined && failed === variant;
  // Una variante con el sujeto en otro sitio trae su foco, en escritorio y en móvil.
  const position = theme !== 'night' ? media.variantPositions?.[theme] : undefined;
  const variantStyle = position
    ? ({ ...style, '--fm-pos': position, '--fm-pos-mobile': position } as CSSProperties)
    : style;
  // La imagen que se está viendo: la variante del tema o, si no hay, la base nocturna.
  const current = variant !== undefined && !variantFailed ? variant : media.src;
  const currentStyle = variant !== undefined && !variantFailed ? variantStyle : style;

  useEffect(
    () => registerThemedPhoto({ variants, sizes, element: root.current }),
    [variants, sizes],
  );

  // Detecta el cambio de foto visible y deja la anterior encima para fundirla.
  //
  // Se hace durante el render (estado derivado: React vuelve a renderizar este componente antes de
  // confirmar nada) y no en un efecto: la foto saliente tiene que estar en el DOM en el MISMO commit
  // que trae la nueva. Con un efecto pasivo, `setLeaving` se programa para una tarea posterior y el
  // navegador puede pintar un frame en medio, en el que la variante del tema final (ya cargada, si
  // estaba en caché) se ve a opacidad plena o la base reaparece sin nada encima: un salto justo antes
  // de que empiece el fundido. Con el commit atómico, lo primero que se ve sigue siendo la foto vieja.
  //
  // `fade` ya es 0 con ceremonia (velo o portal) o con movimiento reducido: en esos casos el cambio
  // ocurre tapado o es inmediato y no hay capa saliente.
  if ((mounted || override !== null) && seen?.src !== current) {
    setSeen({ src: current, style: currentStyle, changes: (seen?.changes ?? 0) + 1 });

    if (seen !== null && fade !== 0 && override === null) {
      // Se APILA, no se sustituye: si el cambio llega a mitad de otro fundido, la saliente anterior
      // sigue desvaneciéndose y la que acaba de dejar de verse queda debajo, opaca. Sustituir la
      // anterior la cortaba en seco y la nueva reaparecía a opacidad 1 aunque sólo se viera a medias.
      setLeaving([
        ...leaving,
        { src: seen.src, style: seen.style, key: seen.changes, fading: false, duration: fade },
      ]);
    }
  }

  // La nueva está lista: la base ya lo está; una variante, cuando ha cargado.
  const ready = current === media.src || loaded === current;
  const waiting = leaving.some((photo) => !photo.fading);
  const waitingSince = leaving.filter((photo) => !photo.fading).at(-1)?.key;

  // Las salientes no se desvanecen hasta que la nueva está lista.
  useEffect(() => {
    if (!waiting || !ready) return;

    setLeaving((photos) =>
      photos.map((photo) => (photo.fading ? photo : { ...photo, fading: true })),
    );
  }, [waiting, ready]);

  // Si la nueva nunca avisa de que cargó, las salientes empiezan a irse igual.
  useEffect(() => {
    if (waitingSince === undefined) return;

    const timer = setTimeout(() => {
      setLeaving((photos) =>
        photos.map((photo) => (photo.fading ? photo : { ...photo, fading: true })),
      );
    }, LEAVE_READY_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [waitingSince]);

  const retire = useCallback(
    (key: number) => setLeaving((photos) => photos.filter((photo) => photo.key !== key)),
    [],
  );

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
          data-photo-variant=""
          fill
          onError={() => setFailed(variant)}
          onLoad={() => setLoaded(variant)}
          priority={priority}
          sizes={sizes}
          src={variant}
          style={{
            ...variantStyle,
            opacity: loaded === variant ? 1 : 0,
            transition: `opacity ${PHOTO_LOAD_FADE_SECONDS}s ease-out`,
          }}
        />
      ) : null}
      {/* Encima de la nueva: las fotos que se van. La más antigua queda arriba del todo (es la que
          lleva más fundido hecho); la que acaba de dejar de verse, justo sobre la nueva. */}
      {[...leaving].reverse().map((photo) => (
        <LeavingPhoto
          key={`leaving-${photo.key}`}
          photo={photo}
          className={className}
          sizes={sizes}
          onDone={retire}
        />
      ))}
    </div>
  );
}
