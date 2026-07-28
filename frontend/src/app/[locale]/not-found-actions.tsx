'use client';

import { Button } from '@/components/ui';
import { Link } from '@/i18n/navigation';

interface NotFoundActionsProps {
  /** Texto ya traducido — este archivo no importa de `i18n/` para leerlo él mismo. */
  homeLabel: string;
  realmsLabel: string;
}

/**
 * Los dos botones del 404, aislados en su propio Client Component.
 *
 * `Button asChild` clona su hijo con `cloneElement`; cuando ese hijo es el
 * `Link` de `@/i18n/navigation` y el árbol que lo renderiza es un Server
 * Component (como `not-found.tsx`), el `Link` resuelve su locale con un
 * `use()` sobre una promesa async (`getServerLocale`) que nunca llega a
 * cruzar la frontera servidor→cliente como un elemento válido: `Button`
 * recibe algo que `isValidElement` rechaza y devuelve `null` en silencio —
 * sin error, sin warning. El mismo patrón SÍ funciona en cuanto el padre ya
 * es `'use client'` (compárese con `HeroSection`, que sí renderiza sus CTAs).
 * Aislar sólo estos dos botones aquí es el workaround mínimo: evita que
 * `not-found.tsx` tenga que convertirse entero en cliente por dos enlaces.
 *
 * (El mismo bug afecta hoy a otros Server Components del proyecto —
 * `realms-grid.tsx`, `membership-section.tsx`, `experience-row.tsx` — pero
 * arreglarlo allí es una tarea aparte, fuera del alcance de la 16.1.)
 */
export function NotFoundActions({ homeLabel, realmsLabel }: NotFoundActionsProps) {
  return (
    <div className="mt-[32px] flex flex-wrap items-center justify-center gap-4">
      <Button variant="primary" asChild>
        <Link href="/">{homeLabel}</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/inicio">{realmsLabel}</Link>
      </Button>
    </div>
  );
}
