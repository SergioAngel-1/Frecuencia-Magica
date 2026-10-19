import { describe, expect, it } from 'vitest';

import { pressedOption, switcherOptions } from '@/lib/atmosphere/switcher';

describe('theme switcher options', () => {
  it('lists the automatic option first and then the five themes', () => {
    expect(switcherOptions()).toEqual(['auto', 'night', 'dusk', 'dawn', 'moon', 'forest']);
  });

  it('presses automatic when nothing was chosen, and the chosen theme otherwise', () => {
    expect(pressedOption(null)).toBe('auto');
    expect(pressedOption('forest')).toBe('forest');
    expect(pressedOption('night')).toBe('night');
  });
});
