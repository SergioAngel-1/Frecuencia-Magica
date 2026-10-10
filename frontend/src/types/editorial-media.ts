import type {
  EditorialMediaAspect,
  EditorialMediaFallback,
  EditorialMediaSlot,
} from '@/config/editorial-media';

export type {
  EditorialMediaAspect,
  EditorialMediaFallback,
  EditorialMediaSlot,
} from '@/config/editorial-media';

export type EditorialMediaKind = 'photo' | 'art-direction' | 'fallback';

export type EditorialMedia = {
  src?: string;
  alt: string;
  aspect: EditorialMediaAspect;
  slot: EditorialMediaSlot;
  kind: EditorialMediaKind;
  /** Lo que pinta el slot sin `src`; lo fija el contrato, no la vista. */
  fallback: EditorialMediaFallback;
  /** Gradiente del ítem del catálogo para los slots `band` (`product.band`…). */
  band?: string;
  position?: string;
  priority?: boolean;
  sizes: string;
};

export type EditorialMediaInput = Partial<Omit<EditorialMedia, 'slot' | 'fallback'>> & {
  /** Id del ítem del catálogo (`a1`, `c1`, `p1`…) para los slots que se repiten por ítem. */
  instance?: string;
};

/** Lo que `EditorialImage` pinta de verdad para un slot resuelto. */
export type EditorialVisual = 'photo' | 'zebra' | 'band' | 'none';

export type EditorialMediaMode = 'viewport' | 'banner' | 'portrait' | 'cover' | 'split' | 'quiet';

export type EditorialOverlayDirection = 'left' | 'right' | 'bottom' | 'top' | 'none';
export type EditorialTone = 'gold' | 'teal' | 'lav' | 'ivory';

export interface EditorialOverlayProps {
  direction?: EditorialOverlayDirection;
  tone?: EditorialTone;
  className?: string;
}

export interface MediaSkeletonProps {
  slot: EditorialMediaSlot;
  label: string;
  aspect?: EditorialMediaAspect;
  tone?: EditorialTone;
  animated?: boolean;
  className?: string;
}

export type { EditorialMediaAspect as EditorialAspect };
