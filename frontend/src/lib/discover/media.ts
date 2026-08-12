import type { EditorialMedia } from '@/types/editorial-media';

export const DISCOVER_MEDIA_SLOTS = {
  intro: 'discover.hero',
  questions: 'discover.question-atmosphere',
  tuning: 'discover.tuning',
  result: 'discover.result',
} as const;

export type DiscoverPhase = keyof typeof DISCOVER_MEDIA_SLOTS;

export type DiscoverMedia = {
  hero: EditorialMedia;
  question: EditorialMedia;
  tuning: EditorialMedia;
  result: EditorialMedia;
};

export function selectDiscoverMedia(phase: DiscoverPhase, media: DiscoverMedia): EditorialMedia {
  switch (phase) {
    case 'intro':
      return media.hero;
    case 'questions':
      return media.question;
    case 'tuning':
      return media.tuning;
    case 'result':
      return media.result;
  }
}
