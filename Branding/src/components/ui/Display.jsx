import { cn } from '../../lib/cn'

const SIZES = {
  hero: 'text-[clamp(46px,8vw,104px)] leading-[.98]',
  xl: 'text-[clamp(46px,6.2vw,86px)] leading-[1]',
  feature: 'text-[clamp(38px,6vw,78px)] leading-[.92]',
  lg: 'text-[clamp(36px,5.5vw,72px)] leading-[1]',
  md: 'text-[clamp(30px,4.4vw,56px)] leading-[1.05]',
  sm: 'text-[clamp(28px,3.6vw,46px)] leading-[1.05]',
  xs: 'text-[clamp(28px,4vw,44px)] leading-[1.05]',
}

/** Titular en Cormorant Garamond peso 300. `size` fija la escala; `level` el elemento. */
export function Display({ children, level: Tag = 'h2', size = 'lg', italic = false, className }) {
  return <Tag className={cn('font-serif font-light', SIZES[size], italic && 'italic', className)}>{children}</Tag>
}

/** Fragmento cursivo con degradado oro → teal → lavanda (`heroTitleEm`). */
export function GradientText({ children }) {
  return (
    <em className="bg-[linear-gradient(100deg,var(--color-gold),var(--color-teal)_55%,var(--color-lav))] bg-clip-text text-transparent">
      {children}
    </em>
  )
}
