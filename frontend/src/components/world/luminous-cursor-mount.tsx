'use client';

import dynamic from 'next/dynamic';

import { useMediaQuery } from '@/hooks/use-media-query';

/** Ratón o trackpad: hover real y puntero fino. */
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

const LuminousCursor = dynamic(
  () => import('./luminous-cursor').then((module) => module.LuminousCursor),
  { ssr: false },
);

/**
 * Monta el cursor luminoso sólo donde tiene sentido: con ratón o trackpad.
 *
 * En táctil no se pinta nada (ahorra su chunk y sus efectos); el cursor real
 * de `luminous-cursor` entra en un chunk aparte con `next/dynamic`.
 */
export function LuminousCursorMount() {
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);

  return finePointer ? <LuminousCursor /> : null;
}
