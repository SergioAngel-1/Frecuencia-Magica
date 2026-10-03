import { cn } from '../../lib/cn'
import { FIELD } from './Input'

/** `journal` es la variante del diario: serif 17px sobre vacío al 35%. */
export function Textarea({ variant = 'default', className, ...rest }) {
  return (
    <textarea
      className={cn(FIELD, 'resize-y', variant === 'journal' && 'bg-void/35 font-serif text-[17px] leading-[1.6]', className)}
      {...rest}
    />
  )
}
