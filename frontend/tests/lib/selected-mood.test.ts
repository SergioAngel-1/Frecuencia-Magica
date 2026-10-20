import { describe, expect, it } from 'vitest';

import { ARRIVALS, type ArrivalKey } from '@/config/arrivals';
import { activeMood, selectedMood } from '@/lib/arrival/selected-mood';

describe('selectedMood', () => {
  it('extrae el id de una emoción', () => {
    expect(selectedMood('mood:tiredness')).toBe('tiredness');
  });

  it('ignora intenciones y emociones desconocidas', () => {
    expect(selectedMood('intent:calm')).toBeNull();
    expect(selectedMood('mood:inventado' as ArrivalKey)).toBeNull();
    expect(selectedMood(null)).toBeNull();
  });
});

describe('activeMood', () => {
  it('nombra la emoción mientras el tema elegido sea el que propone', () => {
    expect(activeMood(ARRIVALS['mood:tiredness'].atmosphere, 'mood:tiredness')).toBe('tiredness');
  });

  it('calla si el tema elegido ya no es el que propone la emoción', () => {
    const other = ARRIVALS['mood:tiredness'].atmosphere === 'night' ? 'dawn' : 'night';

    expect(activeMood(other, 'mood:tiredness')).toBeNull();
  });

  it('calla en automático, aunque llegue una emoción guardada', () => {
    expect(activeMood(null, 'mood:tiredness')).toBeNull();
  });

  it('calla con una tarjeta de tema (sin emoción)', () => {
    expect(activeMood('dawn', null)).toBeNull();
  });

  it('una intención no marca una píldora de emoción', () => {
    expect(activeMood(ARRIVALS['intent:clarity'].atmosphere, 'intent:clarity')).toBeNull();
  });
});
