import type { EditorialMediaAspect, EditorialMediaSlot } from '@/config/editorial-media';

export type { EditorialMediaAspect, EditorialMediaSlot } from '@/config/editorial-media';

export type EditorialMediaKind = 'photo' | 'art-direction' | 'fallback';

export type EditorialMedia = {
  src?: string;
  alt: string;
  aspect: EditorialMediaAspect;
  slot: EditorialMediaSlot;
  kind: EditorialMediaKind;
  position?: string;
  priority?: boolean;
  sizes: string;
};

export type EditorialMediaInput = Partial<Omit<EditorialMedia, 'slot'>>;

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
