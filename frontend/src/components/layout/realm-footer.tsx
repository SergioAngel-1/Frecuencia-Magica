'use client';

import { useRealm } from '@/hooks/use-realm';
import type { RealmId } from '@/types/realm';

import { SiteFooter } from './site-footer';

/**
 * Realms que cierran con footer.
 *
 * Portal, acceso, descúbrete y santuario quedan fuera a propósito: son
 * experiencias a pantalla completa, y un footer debajo invitaría a
 * abandonarlas justo cuando piden atención.
 */
const WITH_FOOTER: readonly RealmId[] = [
  'home',
  'biblioteca',
  'academia',
  'experiencias',
  'tienda',
];

/** Decide si la vista actual lleva footer. */
export function RealmFooter() {
  const { realmId } = useRealm();

  if (!WITH_FOOTER.includes(realmId)) return null;

  return <SiteFooter />;
}
