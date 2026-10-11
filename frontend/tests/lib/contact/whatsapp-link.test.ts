import { describe, expect, it } from 'vitest';

import { whatsappLink } from '@/lib/contact/whatsapp-link';

describe('whatsappLink', () => {
  it('keeps only the digits of the number', () => {
    expect(whatsappLink('+34 600-11 22 33', '')).toBe('https://wa.me/34600112233');
  });

  it('encodes the opening message', () => {
    expect(whatsappLink('34600112233', 'Hola, Marisol. ¿Hablamos?')).toBe(
      'https://wa.me/34600112233?text=Hola%2C%20Marisol.%20%C2%BFHablamos%3F',
    );
  });

  it('leaves the recipient open when there is no number', () => {
    expect(whatsappLink('', ' Hola ')).toBe('https://wa.me/?text=Hola');
  });
});
