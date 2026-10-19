'use client';

import { createContext, useContext, type ReactNode } from 'react';

import type { AtmosphereId } from '@/types/atmosphere';

const ThemeOverrideContext = createContext<AtmosphereId | null>(null);

/**
 * Impone un tema a un subárbol. Lo usa la espera entre vistas: mientras dura,
 * la ruta todavía es la de origen, pero la escena debe pintarse con el tema de
 * la vista de llegada. Fuera del proveedor no cambia nada.
 */
export function ThemeOverrideProvider({
  theme,
  children,
}: {
  theme: AtmosphereId;
  children: ReactNode;
}) {
  return <ThemeOverrideContext.Provider value={theme}>{children}</ThemeOverrideContext.Provider>;
}

/** Tema impuesto por el proveedor más cercano, o `null` si no hay ninguno. */
export function useThemeOverride(): AtmosphereId | null {
  return useContext(ThemeOverrideContext);
}
