'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { ATMOSPHERES } from '@/config/atmospheres';
import { useAtmosphere } from '@/hooks/use-atmosphere';
import type { AtmosphereId } from '@/types/atmosphere';

const THEME_COLOR_META = 'meta[name="theme-color"]';

/** Escribe `theme-color` (la barra del navegador). Crea la etiqueta si falta. */
function setThemeColor(color: string) {
  let meta = document.querySelector<HTMLMetaElement>(THEME_COLOR_META);

  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }

  meta.content = color;
}

/**
 * Aplica la atmósfera activa al documento: `data-atmosphere` y `data-scheme` en
 * `<html>` (de ahí cuelgan los tokens de todo el sitio, también los portales),
 * el `theme-color` y, al cambiar de atmósfera, un anuncio en una región
 * `aria-live`. No pinta nada: el primer render sólo deja la región vacía.
 *
 * El arranque sin destello lo hace `atmosphereBootScript` antes de hidratar; las
 * dos rutas derivan el valor con las mismas funciones y `atmosphere-boot.test`
 * comprueba que coinciden.
 */
export function AtmosphereProvider({ children }: { children: ReactNode }) {
  const { atmosphereId, scheme } = useAtmosphere();
  const t = useTranslations('atmospheres');
  const [announcement, setAnnouncement] = useState('');
  const previous = useRef<AtmosphereId | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-atmosphere', atmosphereId);
    root.setAttribute('data-scheme', scheme);
    setThemeColor(ATMOSPHERES[atmosphereId].themeColor);
  }, [atmosphereId, scheme]);

  useEffect(() => {
    // La primera pasada sólo recuerda la atmósfera de partida: anunciar sólo
    // los cambios, nunca la carga de la página.
    const changed = previous.current !== null && previous.current !== atmosphereId;
    previous.current = atmosphereId;

    if (changed) setAnnouncement(t(`${atmosphereId}.name`));
  }, [atmosphereId, t]);

  return (
    <>
      {children}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </>
  );
}
