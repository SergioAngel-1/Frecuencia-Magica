'use client';

import { useRealm } from '@/hooks/use-realm';

import { SiteFooter } from './site-footer';

/**
 * Todos los realms cierran con el mismo footer. La única excepción es el
 * portal: es el umbral, una sola pantalla sin navegación, y lo que hay
 * «debajo» de él es entrar. Las rutas desconocidas resuelven a `portal` y
 * tampoco lo llevan.
 */
export function RealmFooter() {
  const { realmId } = useRealm();

  if (realmId === 'portal') return null;

  return (
    <div className="z-content relative">
      <SiteFooter />
    </div>
  );
}
