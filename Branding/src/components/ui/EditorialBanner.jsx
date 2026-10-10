import { cn } from '../../lib/cn'
import { Display } from './Display'
import { Kicker } from './Kicker'
import { MediaSkeleton } from './MediaSkeleton'

const ALIGN = { left: 'items-start text-left', center: 'items-center text-center', right: 'items-end text-right' }
const KICKER_TONES = { gold: 'gold', teal: 'teal', lav: 'lav', ivory: 'muted' }
const FADES = { both: 'fm-fade-top fm-fade-bottom', top: 'fm-fade-top', bottom: 'fm-fade-bottom', none: '' }

/**
 * Banda editorial: materia fotográfica (aquí, el skeleton zebra) con el texto sobre un scrim
 * inferior. En la web es siempre a sangre de viewport y el texto arranca en el eje de página
 * (`fm-container`); en el showcase ocupa el ancho de su marco.
 *
 * `fade` funde los bordes de la capa de medios (materia y scrim) con una máscara: por defecto
 * los dos, para que dos bandas seguidas se encuentren en la noche sin arista.
 */
export function EditorialBanner({ slot, label, eyebrow, title, body, action, align = 'left', tone = 'gold', fade = 'both', className }) {
  return (
    <section className={cn('relative isolate flex min-h-[clamp(280px,35vw,420px)] flex-col overflow-hidden rounded-card-lg', className)}>
      <div className={cn('absolute inset-0', FADES[fade])}>
        <MediaSkeleton slot={slot} label={label} aspect="16:8" tone={tone} className="h-full w-full" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(15,27,46,0.88)_100%)]" />
      </div>
      <div className={cn('relative z-20 flex flex-1 flex-col justify-end gap-4 p-[clamp(24px,5vw,56px)]', ALIGN[align])}>
        <Kicker tone={KICKER_TONES[tone]}>{eyebrow}</Kicker>
        <Display level="h3" size="sm" className="max-w-3xl">{title}</Display>
        {body ? <p className="text-fg-body text-lead max-w-2xl leading-relaxed">{body}</p> : null}
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </section>
  )
}
