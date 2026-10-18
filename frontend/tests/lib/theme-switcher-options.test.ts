import { describe, expect, it } from 'vitest';

import { pressedOption, switcherOptions } from '@/lib/atmosphere/switcher';

describe('theme switcher options', () => {
  it('lists the five themes and, last, the automatic option', () => {
    expect(switcherOptions()).toEqual(['night', 'dusk', 'dawn', 'moon', 'forest', 'auto']);
  });

  it('presses automatic when nothing was chosen, and the chosen theme otherwise', () => {
    expect(pressedOption(null)).toBe('auto');
    expect(pressedOption('forest')).toBe('forest');
    expect(pressedOption('night')).toBe('night');
  });
});
