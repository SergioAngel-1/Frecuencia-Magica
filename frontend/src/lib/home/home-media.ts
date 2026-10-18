import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import type { Translator } from '@/lib/home/translator';

/** Las fotografías editoriales de la Home, con su alt traducido. */
export function buildHomeMedia(t: Translator) {
  return {
    hero: resolveEditorialMedia('home.hero', { alt: t('media.alt.hero') }),
    daily: resolveEditorialMedia('home.daily-frequency', {
      alt: t('media.alt.dailyFrequency'),
    }),
    realms: resolveEditorialMedia('home.realms-banner', { alt: t('media.alt.realmsBanner') }),
    marisol: resolveEditorialMedia('home-marisol-portrait', {
      alt: t('media.alt.marisolPortrait'),
    }),
    membership: resolveEditorialMedia('home-membership', { alt: t('media.alt.membership') }),
  };
}
