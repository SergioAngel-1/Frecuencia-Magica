import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const readSource = (relativePath: string) =>
  readFileSync(resolve(SOURCE_ROOT, relativePath), 'utf8');

const authPageSource = readSource('app/[locale]/acceso/page.tsx');
const authAsideSource = readSource('components/features/auth/auth-aside.tsx');
const authFormSource = readSource('components/features/auth/auth-form.tsx');

const AUTH_SLOTS = [
  { slot: 'auth.hero' as const, aspect: '16:9' as const },
  { slot: 'auth.form-atmosphere' as const, aspect: '3:4' as const },
];

describe('auth editorial composition', () => {
  it('resolves both access surfaces to named zebra fallbacks without inventing a source', () => {
    for (const { slot, aspect } of AUTH_SLOTS) {
      const media = resolveEditorialMedia(slot, { alt: 'Editorial access atmosphere' });

      expect(media.kind).toBe('fallback');
      expect(media.src).toBeUndefined();
      expect(media.slot).toBe(slot);
      expect(media.aspect).toBe(aspect);
    }
  });

  it('keeps both access media alts localized and specific to their slots', () => {
    expect(esMessages.auth).toHaveProperty('media.alt.hero');
    expect(esMessages.auth).toHaveProperty('media.alt.formAtmosphere');
    expect(enMessages.auth).toHaveProperty('media.alt.hero');
    expect(enMessages.auth).toHaveProperty('media.alt.formAtmosphere');

    expect(authPageSource).toContain("alt: t('media.alt.hero')");
    expect(authPageSource).toContain("alt: t('media.alt.formAtmosphere')");
    expect(authPageSource).not.toContain("alt: t('quoteBy')");
    expect(authPageSource).not.toContain("alt: t('kicker')");
  });

  it('keeps the access route in split mode and gives the form its own atmosphere layer', () => {
    expect(authPageSource).toContain("resolveEditorialMedia('auth.hero'");
    expect(authPageSource).toContain("resolveEditorialMedia('auth.form-atmosphere'");
    expect(authPageSource).toContain('<AuthAside media={authMedia.hero}');
    expect(authPageSource).toContain('<AuthForm media={authMedia.formAtmosphere}');
    expect(authPageSource).toContain('data-auth-layout="split"');
    expect(authPageSource).toContain('min-[900px]:grid-cols-');

    expect(authAsideSource).toContain('<EditorialImage');
    expect(authAsideSource).toContain('media: EditorialMedia');
    expect(authAsideSource).toContain('h-[clamp(230px,42vw,360px)]');
    expect(authAsideSource).toContain('min-[900px]:min-h-[100svh]');
    expect(authFormSource).toContain('<EditorialImage');
    expect(authFormSource).toContain('data-auth-layout="form"');
  });
});
