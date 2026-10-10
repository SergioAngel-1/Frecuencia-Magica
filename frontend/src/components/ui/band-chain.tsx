import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface BandChainProps {
  children: ReactNode;
  /**
   * La última banda de la cadena continúa en el banner del footer: el footer
   * anula su hueco superior y las dos se encuentran en la noche.
   */
  intoFooter?: boolean;
  className?: string;
}

/**
 * Encadena bandas a sangre consecutivas sin hueco. Cada banda hija funde el
 * borde que comparte con su vecina hasta encontrarse con ella en una línea de
 * noche, sin solaparse: lo resuelve el CSS por posición (`data-band-chain` en
 * `tokens.css`), así que sirve en Server Components y no obliga a sus bandas
 * a ser cliente. Fuera de una cadena, la vista separa con `section`.
 */
export function BandChain({ children, intoFooter = false, className }: BandChainProps) {
  return (
    <div
      className={cn('relative flex flex-col', className)}
      data-band-chain={intoFooter ? 'footer' : 'true'}
    >
      {children}
    </div>
  );
}
