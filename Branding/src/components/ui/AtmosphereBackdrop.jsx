import { cn } from '../../lib/cn'

const FADE_CLASSES = {
  top: 'fm-fade-top',
  bottom: 'fm-fade-bottom',
  both: 'fm-fade-top fm-fade-bottom',
  none: '',
}

/**
 * Fondo de una sección con atmósfera: el degradado `--atmo-backdrop` del scope que la contiene,
 * en una capa propia detrás del contenido. `fade` funde los bordes con la noche de la página
 * (máscara `fm-fade-*`); sin fundido, una sección clara corta en seco contra la oscura vecina.
 * El contenedor debe ser `relative isolate`.
 */
export function AtmosphereBackdrop({ fade = 'both', className }) {
  return <div aria-hidden="true" className={cn('absolute inset-0 -z-10', FADE_CLASSES[fade], className)} style={{ background: 'var(--atmo-backdrop)' }} />
}
