import { cn } from '../../lib/cn'
import { Display } from '../ui/Display'
import { Kicker } from '../ui/Kicker'

/** Bloque del showcase: kicker, titular, entradilla y contenido sobre el eje de página. */
export function Section({ id, kicker, title, lead, tone = 'gold', children, className }) {
  return (
    <section id={id} className={cn('fm-container scroll-mt-24 py-[clamp(40px,7vw,88px)]', className)}>
      <header className="mb-[clamp(24px,4vw,44px)] max-w-[60ch]">
        <Kicker tone={tone}>{kicker}</Kicker>
        <Display level="h2" size="sm" className="mt-3">{title}</Display>
        {lead ? <p className="text-fg-body text-lead mt-4 leading-[1.7]">{lead}</p> : null}
      </header>
      {children}
    </section>
  )
}

/** Muestra con etiqueta: lo que se ve, su nombre y la regla de uso. */
export function Specimen({ title, note, children, className }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-col gap-1">
        <h3 className="text-ivory font-serif text-[22px] leading-tight">{title}</h3>
        {note ? <p className="text-fg-muted text-meta tracking-soft max-w-[62ch] font-sans leading-[1.6]">{note}</p> : null}
      </div>
      {children}
    </div>
  )
}

/** Valor técnico en línea (nombre de token, medida). */
export function Mono({ children, className }) {
  return <code className={cn('text-fg-soft text-meta tracking-soft font-sans', className)}>{children}</code>
}
