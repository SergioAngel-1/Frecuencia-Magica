import { cn } from '../../lib/cn'
import { OrbitalRings } from './OrbitalRings'

/** Vacío con dirección: una constelación dormida y una invitación, nunca un lamento. */
export function EmptyState({ title, body, action, className }) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-[50px] text-center', className)}>
      <OrbitalRings size={120} spin={140} rings={[{ r: 96, stroke: 'rgba(247,244,234,0.14)', width: 0.8 }, { r: 62, stroke: 'rgba(247,244,234,0.10)', width: 0.7, dash: '1 8' }]} />
      <p className="text-fg-muted mt-[26px] max-w-[34ch] font-serif text-[clamp(20px,2.6vw,24px)] leading-[1.4] italic">{title}</p>
      {body ? <p className="text-fg-meta text-body mt-3 max-w-[42ch] font-sans leading-[1.7]">{body}</p> : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  )
}
