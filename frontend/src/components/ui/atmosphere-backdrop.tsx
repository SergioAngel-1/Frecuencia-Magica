import { cn } from '@/lib/cn';

export type AtmosphereBackdropFade = 'top' | 'bottom' | 'both' | 'none';

const FADE_CLASSES: Record<AtmosphereBackdropFade, string> = {
  top: 'fm-fade-top',
  bottom: 'fm-fade-bottom',
  both: 'fm-fade-top fm-fade-bottom',
  none: '',
};

interface AtmosphereBackdropProps {
  /**
   * Bordes que se funden con la noche de la página. Sin fundido, una sección
   * clara corta en seco contra la oscura vecina: el fondo se disuelve en el
   * borde y la noche lo recibe.
   */
  fade?: AtmosphereBackdropFade;
  className?: string;
}

/**
 * Fondo de una sección con atmósfera: el degradado `--atmo-backdrop` del
 * `AtmosphereScope` que la contiene, en una capa propia detrás del contenido.
 * Va aparte para que la máscara del fundido no toque el texto. El contenedor
 * debe ser `relative isolate`.
 *
 * Decorativa (`aria-hidden`) y estática: el fundido es una máscara, sin
 * movimiento.
 */
export function AtmosphereBackdrop({ fade = 'both', className }: AtmosphereBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 -z-10', FADE_CLASSES[fade], className)}
      style={{ background: 'var(--atmo-backdrop)' }}
    />
  );
}
