import { Cormorant_Garamond, Jost } from 'next/font/google';

/**
 * Serif de marca. Títulos, cifras de frecuencia, precios y texto poético.
 * Se usa mucho el peso 300 a tamaños grandes; la cursiva marca los acentos.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

/** Sans de interfaz. Kickers, labels, meta y controles. */
export const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-jost',
});
