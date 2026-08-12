import type {
  EditorialMediaMode,
  EditorialOverlayDirection,
} from '@/types/editorial-media';

export type EditorialViewport = 'mobile' | 'tablet' | 'desktop';

export type MediaLayoutViewport =
  | EditorialViewport
  | string
  | {
      focalPoint?: string;
      viewport?: EditorialViewport;
    };

export interface MediaLayout {
  ratio: 'viewport' | '16:9' | '16:8' | '3:4' | '1:1';
  objectPosition: string;
  overlay: EditorialOverlayDirection;
  sizes: string;
}

const DEFAULT_POSITIONS: Record<EditorialMediaMode, string> = {
  viewport: '50% 40%',
  banner: '50% 50%',
  portrait: '50% 50%',
  cover: '50% 50%',
  split: '62% 45%',
  quiet: '50% 50%',
};

const RATIOS: Record<EditorialMediaMode, MediaLayout['ratio']> = {
  viewport: 'viewport',
  banner: '16:8',
  portrait: '3:4',
  cover: '1:1',
  split: '16:9',
  quiet: '16:8',
};

const OVERLAYS: Record<EditorialMediaMode, EditorialOverlayDirection> = {
  viewport: 'left',
  banner: 'bottom',
  portrait: 'bottom',
  cover: 'bottom',
  split: 'left',
  quiet: 'bottom',
};

const SIZES: Record<EditorialMediaMode, Record<EditorialViewport, string>> = {
  viewport: {
    mobile: '100vw',
    tablet: '100vw',
    desktop: '100vw',
  },
  banner: {
    mobile: '100vw',
    tablet: '100vw',
    desktop: '100vw',
  },
  portrait: {
    mobile: '100vw',
    tablet: '(min-width: 768px) 50vw, 100vw',
    desktop: '(min-width: 1280px) 33vw, 50vw',
  },
  cover: {
    mobile: '100vw',
    tablet: '(min-width: 768px) 33vw, 100vw',
    desktop: '(min-width: 1280px) 25vw, 33vw',
  },
  split: {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '50vw',
  },
  quiet: {
    mobile: '100vw',
    tablet: '100vw',
    desktop: '100vw',
  },
};

function readViewport(viewport: MediaLayoutViewport): EditorialViewport {
  if (typeof viewport === 'object') return viewport.viewport ?? 'desktop';
  if (viewport === 'mobile' || viewport === 'tablet' || viewport === 'desktop') {
    return viewport;
  }
  return 'desktop';
}

function readFocalPoint(viewport: MediaLayoutViewport, fallback: string): string {
  if (typeof viewport === 'object' && viewport.focalPoint) return viewport.focalPoint;
  if (typeof viewport === 'string' && viewport.includes('%')) return viewport;
  return fallback;
}

export function mediaLayout(
  mode: EditorialMediaMode,
  viewport: MediaLayoutViewport = 'desktop',
): MediaLayout {
  const position = readFocalPoint(viewport, DEFAULT_POSITIONS[mode]);

  return {
    ratio: RATIOS[mode],
    objectPosition: position,
    overlay: OVERLAYS[mode],
    sizes: SIZES[mode][readViewport(viewport)],
  };
}
