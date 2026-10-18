import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import type { EditorialMedia, EditorialMediaAspect } from '@/types/editorial-media';

import { Display } from './display';
import { EditorialImage } from './editorial-image';

export interface ConfirmationPanelProps {
  media: EditorialMedia;
  /** Título del momento, ya traducido. */
  title: string;
  /** Párrafo de apoyo, ya traducido. */
  description: string;
  /** Nombre accesible del aro con ✓, ya traducido. */
  iconLabel: string;
  /** Espacio de la materia fotográfica (`data-editorial-media`). */
  slot: string;
  /** Alto mínimo de la tarjeta y de su columna de texto. */
  minHeightClass: string;
  /** Ancho máximo de la columna de texto. */
  contentClassName?: string;
  /** Recorte de la materia: por defecto, 16:8 como el resto del catálogo. */
  aspect?: EditorialMediaAspect;
  /** Anuncia el momento al lector de pantalla (una reserva, una lección superada). */
  announce?: boolean;
  /** Metadatos o acciones bajo el párrafo. */
  children?: ReactNode;
  className?: string;
}

/**
 * El cierre de un flujo, sobre su foto: el aro con ✓, el titular y el
 * párrafo, con lo que cada flujo añada debajo (metadatos o acciones). Puro:
 * recibe todo el texto por props.
 */
export function ConfirmationPanel({
  media,
  title,
  description,
  iconLabel,
  slot,
  minHeightClass,
  contentClassName,
  aspect = '16:8',
  announce = false,
  children,
  className,
}: ConfirmationPanelProps) {
  return (
    <section
      className={cn('rounded-card-lg relative isolate overflow-hidden', minHeightClass, className)}
      data-editorial-media={slot}
      role={announce ? 'status' : undefined}
      aria-live={announce ? 'polite' : undefined}
    >
      <div className="absolute inset-0">
        <EditorialImage
          aspect={aspect}
          className="h-full"
          focalPoint={media.position}
          media={media}
          overlay="bottom"
          scrim="bottom"
        />
      </div>
      <div
        className={cn(
          'relative z-10 flex flex-col justify-end px-[clamp(24px,7vw,84px)] py-[clamp(30px,7vw,84px)]',
          minHeightClass,
          contentClassName,
        )}
      >
        <span className="border-accent/60 bg-scrim/35 text-accent mb-5 inline-flex size-14 items-center justify-center rounded-full border font-serif text-[24px] backdrop-blur-sm">
          <span aria-hidden="true">✓</span>
          <span className="sr-only">{iconLabel}</span>
        </span>
        <Display size="md" level="h1">
          {title}
        </Display>
        <p className="text-fg-body mt-5 max-w-[42ch] text-[16px] leading-[1.8]">{description}</p>
        {children}
      </div>
    </section>
  );
}
