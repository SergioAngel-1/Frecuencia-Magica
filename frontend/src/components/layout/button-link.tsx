'use client';

import type { ComponentProps, ReactNode } from 'react';

import { Button, type ButtonProps } from '@/components/ui';
import { Link } from '@/i18n/navigation';

type LinkHref = ComponentProps<typeof Link>['href'];

type ButtonLinkProps = Pick<
  ButtonProps,
  'variant' | 'size' | 'tone' | 'iconLeft' | 'iconRight' | 'className'
> & {
  /** Destino localizado: cadena o `{ pathname, params }` de `@/i18n/navigation`. */
  href: LinkHref;
  children: ReactNode;
};

/**
 * Botón con forma de enlace, apto para Server Components.
 *
 * `Button asChild` clona su hijo con `cloneElement`. Cuando ese hijo es el
 * `Link` de `@/i18n/navigation` creado dentro de un Server Component, el
 * `Link` resuelve su locale con un `use()` sobre una promesa que no cruza
 * la frontera servidor→cliente como elemento válido: `Button` recibe algo que
 * `isValidElement` rechaza y devuelve `null` en silencio, sin error ni
 * warning. El mismo patrón sí funciona cuando el `Link` nace ya en el
 * cliente — por eso este wrapper es `'use client'` y recibe `href` como dato.
 *
 * Regla: en un Server Component nunca se escribe `<Button asChild><Link>`;
 * se usa `<ButtonLink href>` (lo vigila `tests/lib/button-link.test.ts`).
 */
export function ButtonLink({ href, children, ...button }: ButtonLinkProps) {
  return (
    <Button {...button} asChild>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
