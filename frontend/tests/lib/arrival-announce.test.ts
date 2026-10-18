import { describe, expect, it } from 'vitest';

import { arrivalAnnouncement } from '@/lib/arrival/announce';

describe('arrivalAnnouncement', () => {
  it('une explicación, tipo: título y posición, en ese orden', () => {
    expect(
      arrivalAnnouncement({
        explanation: 'Un momento de calma, con agua y aire cerca.',
        kind: 'Naturaleza',
        title: 'Orilla de mar',
        position: '1 de 2',
      }),
    ).toBe('Un momento de calma, con agua y aire cerca. Naturaleza: Orilla de mar. 1 de 2.');
  });

  it('sin pista (no hay alternativas) sólo anuncia la explicación', () => {
    expect(arrivalAnnouncement({ explanation: 'Para cuando sólo necesitas respirar' })).toBe(
      'Para cuando sólo necesitas respirar.',
    );
  });

  it('cada frase termina en signo: respeta el que trae y no duplica el punto', () => {
    expect(
      arrivalAnnouncement({
        explanation: '¿Cómo llegas?',
        kind: 'Frecuencia',
        title: 'Calma',
        position: '2 de 3.',
      }),
    ).toBe('¿Cómo llegas? Frecuencia: Calma. 2 de 3.');
  });

  it('sin nada que decir devuelve cadena vacía, para que el aviso no suene', () => {
    expect(arrivalAnnouncement({ explanation: '' })).toBe('');
  });
});
