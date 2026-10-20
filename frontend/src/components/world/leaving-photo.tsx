'use client';

import { useEffect, type CSSProperties } from 'react';
import Image from 'next/image';

import { photoLeaveMs } from '@/lib/atmosphere/theme-fade';

/** Una foto que dejó de ser la visible y se desvanece encima de la que la sustituye. */
export type LeavingPhotoLayer = {
  src: string;
  style: CSSProperties;
  key: number;
  /** `false` mientras la nueva carga: la saliente espera opaca a que esté lista. */
  fading: boolean;
  /** Duración congelada al crearse: un cambio de ceremonia a mitad no la acorta. */
  duration: number;
};

type LeavingPhotoProps = {
  photo: LeavingPhotoLayer;
  className: string;
  sizes: string;
  /** Se llama con su `key` cuando el fundido terminó y la capa ya puede salir del DOM. */
  onDone: (key: number) => void;
};

/**
 * Capa saliente de `ThemedPhoto`: opaca y sin el lavado del esquema claro (no lleva
 * `data-photo-night`), se desvanece con `fm-photo-leave` cuando la foto nueva está lista y se retira
 * sola al terminar. Cada capa lleva su propio temporizador: si el tema cambia otra vez a mitad de
 * fundido, las anteriores siguen su camino y no se cortan.
 */
export function LeavingPhoto({ photo, className, sizes, onDone }: LeavingPhotoProps) {
  const { fading, duration, key } = photo;

  useEffect(() => {
    if (!fading) return;

    const timer = setTimeout(() => onDone(key), photoLeaveMs(duration));

    return () => clearTimeout(timer);
  }, [fading, duration, key, onDone]);

  return (
    <Image
      alt=""
      aria-hidden="true"
      className={className}
      data-photo-leaving=""
      fill
      sizes={sizes}
      src={photo.src}
      style={{
        ...photo.style,
        opacity: 1,
        filter: 'none',
        animation: fading ? `fm-photo-leave ${duration}s ease-in-out forwards` : undefined,
        pointerEvents: 'none',
      }}
    />
  );
}
