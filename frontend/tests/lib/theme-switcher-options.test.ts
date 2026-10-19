import { describe, expect, it } from 'vitest';

import { feelingOptions, pressedOption, switcherOptions } from '@/lib/atmosphere/switcher';

describe('theme switcher options', () => {
  it('lists the automatic option first and then the five themes', () => {
    expect(switcherOptions()).toEqual(['auto', 'night', 'dusk', 'dawn', 'moon', 'forest']);
  });

  it('lists the seven portal emotions in their order', () => {
    expect(feelingOptions()).toEqual([
      'mood:calm',
      'mood:tiredness',
      'mood:nostalgia',
      'mood:sadness',
      'mood:joy',
      'mood:gratitude',
      'mood:clarity',
    ]);
  });

  it('presses automatic when nothing was chosen, even with a saved feeling', () => {
    expect(pressedOption(null)).toBe('auto');
    expect(pressedOption(null, 'mood:calm')).toBe('auto');
  });

  it('presses the theme when the choice did not come from an emotion', () => {
    expect(pressedOption('forest')).toBe('forest');
    expect(pressedOption('night', null)).toBe('night');
  });

  it('presses the emotion that originated the choice, even if two emotions share a theme', () => {
    expect(pressedOption('dawn', 'mood:calm')).toBe('mood:calm');
    expect(pressedOption('dawn', 'mood:joy')).toBe('mood:joy');
  });

  it('falls back to the theme when the saved feeling does not propose it', () => {
    expect(pressedOption('night', 'mood:calm')).toBe('night');
    expect(pressedOption('dawn', 'intent:calm')).toBe('dawn');
  });
});
