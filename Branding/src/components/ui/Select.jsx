import { cn } from '../../lib/cn'
import { FIELD } from './Input'

const ARROW =
  "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%23D8B978' stroke-width='1.5'%3E%3Cpath d='M1 1.5l5 5 5-5'/%3E%3C/svg%3E\")] bg-[length:12px_8px] bg-[right_16px_center] bg-no-repeat"

/** Select nativo con el mismo cromo que `Input` y una flecha dorada. */
export function Select({ options = [], placeholder, className, ...rest }) {
  return (
    <select className={cn(FIELD, ARROW, 'appearance-none pr-10', className)} defaultValue="" {...rest}>
      {placeholder ? (
        <option value="" disabled className="bg-void text-fg-meta">
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-void text-ivory">
          {option.label}
        </option>
      ))}
    </select>
  )
}
