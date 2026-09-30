import { cn } from '../../lib/cn'

/** Pista translúcida con relleno teal → oro que avanza con `scaleX` (sólo transform). */
export function ProgressBar({ value, height = 4, ariaLabel, className }) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={cn('bg-ivory/14 w-full overflow-hidden rounded-[3px]', height === 5 ? 'h-[5px]' : 'h-[4px]', className)}
    >
      <div
        className="h-full origin-left rounded-[3px] bg-[linear-gradient(90deg,var(--color-teal),var(--color-gold))] transition-transform duration-500 ease-out"
        style={{ transform: `scaleX(${clamped / 100})` }}
      />
    </div>
  )
}
