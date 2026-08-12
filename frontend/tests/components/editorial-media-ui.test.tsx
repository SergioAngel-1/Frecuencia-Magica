import { createElement, type ComponentProps } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { EditorialMedia } from '@/types/editorial-media';

vi.mock('@/config/editorial-media', () => {
  throw new Error('EditorialImage must not load application editorial config');
});

vi.mock('next/image', () => ({
  default: (props: ComponentProps<'img'>) => createElement('img', props),
}));

import { EditorialImage } from '@/components/ui/editorial-image';

describe('EditorialImage UI Kit boundary', () => {
  it('renders the caller-provided fallback aspect without loading the slot registry', () => {
    const media: EditorialMedia = {
      alt: 'A caller-owned editorial fallback',
      kind: 'fallback',
      position: '21% 34%',
      sizes: '100vw',
      slot: 'home.hero',
    };

    render(createElement(EditorialImage, { aspect: '3:4', media }));

    const label = screen.getByText(media.alt);
    const skeleton = label.parentElement;

    expect(skeleton?.getAttribute('data-media-slot')).toBe(media.slot);
    expect(skeleton?.className).toContain('aspect-[3/4]');
  });

  it('uses the EditorialMedia focal position for real media without a registry lookup', () => {
    const media: EditorialMedia = {
      alt: 'A caller-owned editorial image',
      kind: 'photo',
      position: '21% 34%',
      sizes: '100vw',
      slot: 'home.hero',
      src: '/editorial/caller-owned.webp',
    };

    render(createElement(EditorialImage, { media }));

    const image = screen.getByRole('img', { name: media.alt });

    expect(image.style.objectPosition).toBe(media.position);
  });
});

export {};
