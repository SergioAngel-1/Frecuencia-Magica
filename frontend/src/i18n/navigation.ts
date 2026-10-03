import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

/**
 * APIs de navegación conscientes del idioma.
 *
 * Todo enlace interno del proyecto usa este `Link`, nunca el de `next/link`:
 * es lo que traduce `/resonario` a `/en/resonarium` al cambiar de idioma.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
