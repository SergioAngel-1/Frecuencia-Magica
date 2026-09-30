import { cn } from '@/lib/cn';
import type { ClassValue } from 'clsx';

export type ArrowLinkTone = 'gold' | 'teal' | 'lav';

const TONE_CLASSES: Record<ArrowLinkTone, string> = {
  gold: 'border-gold/70 text-gold focus-visible:ring-gold',
  teal: 'border-teal/70 text-teal focus-visible:ring-teal',
  lav: 'border-lav/70 text-lav focus-visible:ring-lav',
};

/**
 * Enlace editorial con flecha («Ver todo →», «Entrar a la academia →»).
 *
 * Es una pieza de estilo, no un componente con `href`: el UI Kit no importa
 * de `i18n/`, así que cada consumidor pone su `Link` de `@/i18n/navigation`
 * (o un `<button>`) y le aplica estas clases. Subrayado fino en el acento del
 * realm, etiqueta en mayúsculas y hit target de 44px.
 *
 * ```tsx
 * <Link href="/biblioteca" className={arrowLinkClasses('teal')}>
 *   {label}
 *   <ArrowGlyph />
 * </Link>
 * ```
 */
export function arrowLinkClasses(tone: ArrowLinkTone = 'gold', className?: ClassValue): string {
  return cn(
    'inline-flex min-h-11 w-fit items-center border-b pb-1 font-sans text-label tracking-caps uppercase outline-none focus-visible:ring-2',
    TONE_CLASSES[tone],
    className,
  );
}

/** La flecha del enlace: decorativa, el destino lo dice la etiqueta. */
export function ArrowGlyph() {
  return (
    <span aria-hidden="true" className="ml-3 text-[18px] leading-none">
      →
    </span>
  );
}
