import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

/** Props mínimas que `Field` necesita poder inyectar en su único hijo (`Input`/`Textarea`). */
interface FieldSlotProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  // Índice de firma: permite fusionar el resto de props del hijo sin que
  // TypeScript rechace las claves por exceso de propiedades.
  [key: string]: unknown;
}

interface FieldProps {
  /** Texto del kicker-etiqueta. Ya traducido: `Field` no llama a `useTranslations`. */
  label: string;
  /** Id del control; también fija el `htmlFor` de la etiqueta. */
  htmlFor: string;
  /** Mensaje de error. Si está presente, gana sobre `hint` y vira etiqueta/borde a `--color-warn`. */
  error?: string;
  /** Texto de ayuda, sólo visible cuando no hay `error`. */
  hint?: string;
  /** Control único: normalmente un `Input` o `Textarea`. */
  children: ReactNode;
  className?: string;
}

/**
 * Envoltorio de campo: etiqueta (estilo kicker) + control + mensaje.
 *
 * No renderiza el control directamente — clona el único hijo para
 * inyectarle `id`, `aria-describedby` y `aria-invalid`. Así el consumidor
 * sólo escribe `<Field label={..} htmlFor="email"><Input /></Field>` sin
 * repetir el id en ambos sitios ni cablear la asociación de accesibilidad
 * a mano. `Input`/`Textarea` leen `aria-invalid` (vía el selector Tailwind
 * `aria-[invalid=true]`) para virar su propio borde a `--color-warn`: el
 * estado de error vive en un único sitio (el atributo ARIA), no en una prop
 * de estilo duplicada.
 *
 * Server Component puro: sin estado, efectos ni listeners.
 */
export function Field({ label, htmlFor, error, hint, children, className }: FieldProps) {
  // El error gana sobre la ayuda: nunca se muestran los dos mensajes a la
  // vez, así que sólo el que se ve de verdad entra en `aria-describedby`.
  const messageId = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;

  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<FieldSlotProps>, {
        id: htmlFor,
        'aria-describedby': messageId,
        'aria-invalid': error ? true : undefined,
      })
    : children;

  return (
    <div className={cn('flex flex-col', className)}>
      <label
        htmlFor={htmlFor}
        className={cn(
          'mb-[7px] font-sans text-[11px] uppercase tracking-[.14em]',
          error ? 'text-warn' : 'text-[rgba(247,244,234,0.55)]',
        )}
      >
        {label}
      </label>
      {control}
      {messageId ? (
        <p
          id={messageId}
          className={cn('mt-[7px] font-sans text-[13px]', error ? 'text-warn' : 'text-[rgba(247,244,234,0.55)]')}
        >
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
