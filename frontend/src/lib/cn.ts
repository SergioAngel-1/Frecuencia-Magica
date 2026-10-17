import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * `tailwind-merge` no conoce los tokens de `globals.css`: sin esta extensión
 * trataría `text-label` (tamaño) y `text-fg-muted` (color) como el mismo
 * grupo y descartaría uno de los dos. Cada escala nueva de `@theme` debe
 * registrarse aquí.
 */
const twMerge = extendTailwindMerge({
  extend: {
    // Ritmo vertical de `tokens.css` (`py-section`, `gap-block`…).
    theme: { spacing: ['section', 'block'] },
    classGroups: {
      'font-size': [{ text: ['label', 'meta', 'body', 'lead'] }],
      // Semánticos de atmósfera (`tokens.css`, bloques `[data-atmosphere]`).
      'text-color': [
        {
          text: [
            'fg',
            'fg-body',
            'fg-soft',
            'fg-muted',
            'fg-meta',
            'accent',
            'accent-2',
            'accent-3',
            'on-accent',
          ],
        },
      ],
      'border-color': [{ border: ['line', 'line-strong'] }],
      'bg-color': [{ bg: ['surface', 'surface-strong'] }],
      tracking: [{ tracking: ['soft', 'ui', 'label', 'caps', 'kicker', 'eyebrow'] }],
      shadow: [{ shadow: ['glow-gold', 'glow-teal', 'glow-lav', 'glow-card'] }],
      // Capas con nombre de `globals.css`.
      z: [
        {
          z: [
            'world',
            'atmosphere',
            'content',
            'player',
            'nav',
            'header',
            'offline',
            'portal',
            'veil',
            'cursor',
          ],
        },
      ],
    },
  },
});

/**
 * Combina clases resolviendo los conflictos de Tailwind.
 *
 * Es la única forma permitida de concatenar clases en el proyecto: la
 * concatenación manual deja utilidades duplicadas que ganan por orden de
 * declaración en lugar de por intención.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
