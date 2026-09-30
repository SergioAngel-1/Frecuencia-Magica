import { cloneElement } from 'react'
import { cn } from '../../lib/cn'

/** Etiqueta (estilo kicker) + control + mensaje. El error gana sobre la ayuda y vira a terracota. */
export function Field({ label, htmlFor, error, hint, children, className }) {
  const messageId = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined

  return (
    <div className={cn('flex flex-col', className)}>
      <label htmlFor={htmlFor} className={cn('text-label tracking-label mb-[7px] font-sans uppercase', error ? 'text-warn' : 'text-fg-meta')}>
        {label}
      </label>
      {cloneElement(children, { id: htmlFor, 'aria-describedby': messageId, 'aria-invalid': error ? true : undefined })}
      {messageId ? (
        <p id={messageId} aria-live={error ? 'polite' : undefined} className={cn('text-meta mt-2 font-sans', error ? 'text-warn' : 'text-fg-muted')}>
          {error ?? hint}
        </p>
      ) : null}
    </div>
  )
}
