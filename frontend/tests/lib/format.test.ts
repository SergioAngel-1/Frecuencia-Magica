import { describe, expect, it } from 'vitest';

import { formatDuration, formatPrice, parseDuration } from '@/lib/format';

describe('formatPrice', () => {
  it('formatea un precio entero con prefijo de dólar', () => {
    expect(formatPrice(28)).toBe('$28');
  });

  it('no añade decimales a precios redondos', () => {
    expect(formatPrice(0)).toBe('$0');
  });
});

describe('formatDuration', () => {
  it('formatea segundos como mm:ss', () => {
    expect(formatDuration(1080)).toBe('18:00');
  });

  it('rellena los segundos a dos dígitos', () => {
    expect(formatDuration(670)).toBe('11:10');
  });

  it('formatea duraciones de más de una hora en minutos totales', () => {
    expect(formatDuration(3720)).toBe('62:00');
  });
});

describe('parseDuration', () => {
  it('parsea una etiqueta mm:ss a segundos', () => {
    expect(parseDuration('42:00')).toBe(2520);
  });

  it('parsea y formatea son inversos', () => {
    // Las siete duraciones reales del catálogo. Dos llevan cero a la izquierda
    // en los minutos, así que formatDuration debe rellenar también los minutos.
    const catalogo = ['18:00', '11:20', '24:40', '42:00', '09:10', '07:30', '15:40'];

    for (const etiqueta of catalogo) {
      expect(formatDuration(parseDuration(etiqueta))).toBe(etiqueta);
    }
  });
});
