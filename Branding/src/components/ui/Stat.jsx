import { cn } from '../../lib/cn'

const TONES = { gold: 'text-accent', teal: 'text-accent-2', lav: 'text-accent-3', ivory: 'text-fg' }
const SIZES = {
  hero: { value: 'mb-[4px] text-[34px]', label: 'text-label tracking-label' },
  sanctuary: { value: 'mb-[6px] text-[40px]', label: 'text-meta tracking-ui' },
}

/** Cifra en serif con su etiqueta. `hero` (34px) o `sanctuary` (40px). */
export function Stat({ value, label, tone = 'gold', size = 'hero', className }) {
  return (
    <div className={className}>
      <p className={cn('font-serif leading-none font-light', SIZES[size].value, TONES[tone])}>{value}</p>
      <p className={cn('text-fg-meta font-sans uppercase', SIZES[size].label)}>{label}</p>
    </div>
  )
}
