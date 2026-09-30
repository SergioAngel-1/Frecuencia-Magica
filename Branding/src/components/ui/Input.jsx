import { cn } from '../../lib/cn'

export const FIELD =
  'rounded-field border-glass-brd bg-glass min-h-11 w-full border px-[16px] py-[14px] text-ivory text-body placeholder:text-fg-meta font-sans ' +
  'transition-[border-color,box-shadow] duration-300 ease-out outline-none ' +
  'focus:border-gold/55 focus:shadow-[0_0_0_3px_rgba(216,185,120,0.12)] aria-[invalid=true]:border-warn disabled:opacity-45'

/** Campo de texto: cristal, borde `glass-brd`, radio 14px, 44px de alto, foco dorado con halo de 3px. */
export function Input({ className, ...rest }) {
  return <input className={cn(FIELD, className)} {...rest} />
}
