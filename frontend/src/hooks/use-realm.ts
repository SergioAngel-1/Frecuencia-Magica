'use client';

import { useContext } from 'react';

import { RealmContext, type RealmContextValue } from '@/components/world/realm-provider';

/** Lee el realm activo. Debe usarse dentro de `<RealmProvider>`. */
export function useRealm(): RealmContextValue {
  const value = useContext(RealmContext);

  if (value === null) {
    throw new Error('useRealm debe usarse dentro de RealmProvider');
  }

  return value;
}
