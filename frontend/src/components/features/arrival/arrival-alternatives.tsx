'use client';

import { useTranslations } from 'next-intl';
import type { KeyboardEvent } from 'react';

import { IconButton, Kicker, Swap } from '@/components/ui';
import { cn } from '@/lib/cn';

type ArrivalAlternativesProps = {
  /** El tipo de escucha de la alternativa en curso («Naturaleza»), ya traducido. */
  kind: string;
  /** El nombre de la pista, ya traducido. */
  title: string;
  /** La pista pide auriculares (binaural, guiadas). */
  headphones: boolean;
  /** Alternativa en curso, desde 0, y cuántas hay. */
  index: number;
  count: number;
  /** Identidad de lo mostrado: al cambiar, el nombre se funde en vez de saltar. */
  swapId: string;
  onStep(delta: 1 | -1): void;
};

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === 'left' ? 'M14.5 6.5L9 12l5.5 5.5' : 'M9.5 6.5L15 12l-5.5 5.5'} />
    </svg>
  );
}

/**
 * Las alternativas de escucha de una llegada, como un solo bloque: el tipo de escucha sobre el
 * nombre de la pista —lo que se ofrece, en serif y lo bastante grande para leerse de un vistazo—
 * entre dos flechas de 44 px, y debajo un punto por alternativa (la activa, alargada). Antes eran
 * cinco líneas de texto pequeño del mismo peso, con «Anterior» y «Siguiente» como enlaces sueltos.
 *
 * El recorrido envuelve en los dos extremos, así que las flechas nunca se apagan. Con una sola
 * alternativa no hay flechas ni puntos. Las flechas del teclado también recorren el grupo. El
 * anuncio de «x de y» lo hace la región `role="status"` del panel; los puntos son decorativos.
 * La activa se alarga con `transform` (no con el ancho), igual que el resto del sitio.
 */
export function ArrivalAlternatives({
  kind,
  title,
  headphones,
  index,
  count,
  swapId,
  onStep,
}: ArrivalAlternativesProps) {
  const t = useTranslations('arrival');
  const several = count > 1;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!several) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onStep(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      onStep(1);
    }
  };

  return (
    <div
      role="group"
      aria-label={t('listenKind')}
      onKeyDown={handleKeyDown}
      className="border-line flex w-full flex-col items-center gap-3 border-y py-5"
    >
      <Kicker tone="teal" spacing="wide">
        {kind}
      </Kicker>

      <div className="flex w-full items-center justify-between gap-2">
        {several ? (
          <IconButton variant="glass" label={t('previous')} onClick={() => onStep(-1)}>
            <Chevron direction="left" />
          </IconButton>
        ) : null}

        <Swap id={swapId} className="min-w-0 flex-1 text-center">
          <p className="text-fg text-serif-xl font-serif leading-tight text-balance">{title}</p>
          {headphones ? (
            <p className="text-fg-meta text-meta tracking-ui mt-1.5 font-sans">{t('headphones')}</p>
          ) : null}
        </Swap>

        {several ? (
          <IconButton variant="glass" label={t('next')} onClick={() => onStep(1)}>
            <Chevron direction="right" />
          </IconButton>
        ) : null}
      </div>

      {several ? (
        <div aria-hidden="true" className="flex h-1.5 items-center gap-2.5">
          {Array.from({ length: count }, (_, position) => (
            <span
              key={position}
              className={cn(
                'size-1.5 rounded-full transition-[background-color,transform] duration-500',
                position === index ? 'bg-accent scale-x-[2.6]' : 'bg-fg/20',
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
