import { cn } from '../../lib/cn'
import { MediaSkeleton } from './MediaSkeleton'
import { OrbitalRings } from './OrbitalRings'

/**
 * Vacío con dirección: una constelación dormida y una invitación, nunca un lamento.
 * Con `media` (`{ slot, label }`) se pinta en su propio marco, sobre la materia del slot (aquí, la
 * zebra) y el scrim inferior, como en la web. Con `fill` el marco no impone alto: dentro de un panel,
 * mide lo que su texto (o crece si el padre es flex) y no estira la columna vecina.
 */
export function EmptyState({ title, body, action, media, fill = false, className }) {
  const content = (
    <div className={cn('flex flex-col items-center px-6 py-[50px] text-center', media ? 'relative z-10' : className)}>
      <OrbitalRings size={120} spin={140} rings={[{ r: 96, stroke: 'rgba(247,244,234,0.14)', width: 0.8 }, { r: 62, stroke: 'rgba(247,244,234,0.10)', width: 0.7, dash: '1 8' }]} />
      <p className="text-fg-muted mt-[26px] max-w-[34ch] font-serif text-[clamp(20px,2.6vw,24px)] leading-[1.4] italic">{title}</p>
      {body ? <p className="text-fg-meta text-body mt-3 max-w-[42ch] font-sans leading-[1.7]">{body}</p> : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  )

  if (!media) return content

  return (
    <div className={cn('relative isolate grid place-items-center overflow-hidden rounded-card', fill ? 'flex-1' : 'min-h-[clamp(380px,48vw,600px)]', className)}>
      <div className="absolute inset-0">
        <MediaSkeleton slot={media.slot} label={media.label} aspect="16:9" className="h-full w-full" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgb(var(--scrim)_/_0.88)_100%)]" />
      </div>
      {content}
    </div>
  )
}
