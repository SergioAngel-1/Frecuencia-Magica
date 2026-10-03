'use client';

import { createContext, useEffect, useMemo, type ReactNode } from 'react';

import { getRealm } from '@/config/realms';
import { usePathname } from '@/i18n/navigation';
import { realmFromPathname } from '@/lib/realm-from-pathname';
import type { RealmId } from '@/types/realm';

export type RealmContextValue = {
  realmId: RealmId;
  /** Acento del realm en hexadecimal. */
  accent: string;
  /** Nota base del drone ambiental, en hercios. */
  baseNote: number;
};

export const RealmContext = createContext<RealmContextValue | null>(null);

/**
 * Deriva el realm activo de la ruta y lo expone a todo el motor del mundo.
 *
 * Además escribe el acento activo en el elemento raíz como `--realm-accent`,
 * de modo que cualquier capa (bordes, glows, focos) pueda leerlo desde CSS sin
 * pasar por React ni provocar renders.
 */
export function RealmProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const realmId = realmFromPathname(pathname);

  const value = useMemo<RealmContextValue>(() => {
    const realm = getRealm(realmId);
    return { realmId, accent: realm.accent, baseNote: realm.baseNote };
  }, [realmId]);

  useEffect(() => {
    document.documentElement.style.setProperty('--realm-accent', value.accent);
  }, [value.accent]);

  return <RealmContext.Provider value={value}>{children}</RealmContext.Provider>;
}
