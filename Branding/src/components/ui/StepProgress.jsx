import { cn } from '../../lib/cn'

/** Pasos discretos: `dashes` (quiz) o `labeled` (reserva). Completado y actual en lavanda. */
export function StepProgress({ variant = 'dashes', steps, current, ariaLabel, className }) {
  if (variant === 'dashes') {
    return (
      <div role="group" aria-label={ariaLabel} className={cn('flex justify-center gap-2', className)}>
        {Array.from({ length: steps }, (_, i) => (
          <span key={i} aria-hidden="true" className={cn('h-[3px] w-11 rounded-[2px] transition-colors duration-500', i <= current ? 'bg-lav' : 'bg-ivory/14')} />
        ))}
      </div>
    )
  }

  return (
    <div role="group" aria-label={ariaLabel} className={cn('flex gap-3', className)}>
      {steps.map((label, i) => (
        <div key={label} className="flex-1 text-center">
          <div aria-hidden="true" className={cn('mb-[10px] h-[3px] rounded-[2px] transition-colors duration-500', i <= current ? 'bg-lav' : 'bg-ivory/14')} />
          <span className={cn('text-label tracking-label font-sans uppercase', i === current ? 'text-ivory' : 'text-fg-meta')}>{label}</span>
        </div>
      ))}
    </div>
  )
}
