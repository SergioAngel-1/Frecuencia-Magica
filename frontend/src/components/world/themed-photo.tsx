'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';

import { ATMOSPHERE_FADE_SECONDS } from '@/config/motion';
import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useMounted } from '@/hooks/use-mounted';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { registerThemedPhoto } from '@/lib/atmosphere/photo-preload';
import { useAtmosphereShiftStore } from '@/stores/atmosphere-shift-store';
import { usePortalStore } from '@/stores/portal-store';
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

/** Tope para que una capa saliente no se quede encima si la nueva nunca avisa de que cargó. */
const LEAVE_READY_TIMEOUT_MS = 2500;

type LeavingPhoto = {
  src: string;
  style: CSSProperties;
  key: number;
  fading: boolean;
};

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
  const reduced = useReducedMotionSafe();
  const root = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<LeavingPhoto | null>(null);
  const previous = useRef<{ src: string; style: CSSProperties } | null>(null);
  const leaveSequence = useRef(0);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stallTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  useEffect(() => {
    if (!mounted && override === null) return;

    const shown = previous.current;

    if (shown === null) {
      previous.current = { src: current, style: currentStyle };
      return;
    }

    if (shown.src === current) return;

    previous.current = { src: current, style: currentStyle };

    // Con velo en marcha (atmósfera o portal) el cambio ya ocurre tapado; con
    // movimiento reducido no debe haber fundido.
    if (
      reduced ||
      override !== null ||
      useAtmosphereShiftStore.getState().phase !== 'idle' ||
      usePortalStore.getState().phase !== 'idle'
    ) {
      return;
    }

    if (leaveTimer.current !== null) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    if (stallTimer.current !== null) {
      clearTimeout(stallTimer.current);
      stallTimer.current = null;
    }

    const key = ++leaveSequence.current;

    setLeaving({ ...shown, key, fading: false });

    // Si la nueva nunca avisa de que cargó, la saliente empieza a irse igual.
    stallTimer.current = setTimeout(() => {
      stallTimer.current = null;
      setLeaving((value) =>
        value && value.key === key && !value.fading ? { ...value, fading: true } : value,
      );
    }, LEAVE_READY_TIMEOUT_MS);
  }, [current, currentStyle, mounted, override, reduced]);

  // La saliente no se desvanece hasta que la nueva está lista (la base ya lo está).
  useEffect(() => {
    if (!leaving || leaving.fading) return;

    const ready = current === media.src || loaded === current;

    if (!ready) return;

    if (stallTimer.current !== null) {
      clearTimeout(stallTimer.current);
      stallTimer.current = null;
    }

    setLeaving((value) =>
      value && value.key === leaving.key ? { ...value, fading: true } : value,
    );
  }, [leaving, loaded, current, media.src]);

  // Al arrancar el fundido, retira la capa cuando termina.
  useEffect(() => {
    if (!leaving || !leaving.fading) return;

    if (leaveTimer.current !== null) clearTimeout(leaveTimer.current);

    const key = leaving.key;

    leaveTimer.current = setTimeout(
      () => {
        leaveTimer.current = null;
        setLeaving((value) => (value && value.key === key ? null : value));
      },
      ATMOSPHERE_FADE_SECONDS * 1000 + 100,
    );
  }, [leaving]);

  // Los temporizadores viven hasta el desmontaje: no se cancelan al re-renderizar
  // mientras la capa saliente sigue en el DOM.
  useEffect(
    () => () => {
      if (leaveTimer.current !== null) clearTimeout(leaveTimer.current);
      if (stallTimer.current !== null) clearTimeout(stallTimer.current);
    },
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
          fill
          onError={() => setFailed(variant)}
          onLoad={() => setLoaded(variant)}
          priority={priority}
          sizes={sizes}
          src={variant}
          style={{ ...variantStyle, opacity: loaded === variant ? 1 : 0 }}
        />
      ) : null}
      {/* Encima de la nueva: la foto que se va, opaca y sin el lavado del esquema claro. */}
      {leaving ? (
        <Image
          key={`leaving-${leaving.key}`}
          alt=""
          aria-hidden="true"
          className={className}
          data-photo-leaving=""
          fill
          sizes={sizes}
          src={leaving.src}
          style={{
            ...leaving.style,
            opacity: 1,
            filter: 'none',
            animation: leaving.fading
              ? `fm-photo-leave ${ATMOSPHERE_FADE_SECONDS}s ease-in-out forwards`
              : undefined,
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </div>
  );
}
