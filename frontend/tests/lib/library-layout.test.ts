import { describe, expect, it } from 'vitest';

import { AUDIOS } from '@/data';
import { splitFeaturedAudio } from '@/lib/library/layout-slots';

describe('splitFeaturedAudio', () => {
  it('separa el destacado sin repetirlo entre los secundarios', () => {
    const { featured, others } = splitFeaturedAudio(AUDIOS);

    expect(featured?.id).toBe('a1');
    expect(others).toHaveLength(AUDIOS.length - 1);
    expect(others.some((audio) => audio.id === featured?.id)).toBe(false);
  });
});
