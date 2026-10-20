'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { ATMOSPHERES } from '@/config/atmospheres';
import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useThemeFade } from '@/hooks/use-theme-fade';
import { beginThemeSwitch } from '@/lib/atmosphere/theme-switching';
import { useAtmosphereStore } from '@/stores/atmosphere-store';
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
  const choice = useAtmosphereStore((state) => state.choice);
  const t = useTranslations('atmospheres');
  const [announcement, setAnnouncement] = useState('');
  const previous = useRef<AtmosphereId | null>(null);
  const ink = useThemeFade('ink');
  const scrim = useThemeFade('scrim');

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-atmosphere', atmosphereId);
    root.setAttribute('data-scheme', scheme);
    setThemeColor(ATMOSPHERES[atmosphereId].themeColor);
  }, [atmosphereId, scheme]);

  useEffect(() => {
    // Los tokens cambian de golpe y el fondo funde: durante el fundido el color, el borde y el
    // relleno de todo el sitio transitan (`[data-theme-switching]` en globals.css) para que el
    // texto no se vea un instante con la tinta del tema viejo sobre el fondo del nuevo.
    //
    // `ink` ya es 0 con ceremonia (velo o portal) o con movimiento reducido: en esos casos el
    // cambio está tapado o es inmediato y la tinta no debe transitar. Se comprueba en este
    // mismo render, cuando `atmosphereId` acaba de cambiar.
    if (previous.current === null || previous.current === atmosphereId || ink === 0) return;

    // La limpieza del efecto retira el atributo y la variable de duración siempre, también si
    // un cambio de `ink` o el desmontaje cancelan el fundido a mitad.
    return beginThemeSwitch(document.documentElement, { ink: ink * 1000, scrim: scrim * 1000 });
  }, [atmosphereId, ink, scrim]);

  useEffect(() => {
    // La primera pasada sólo recuerda la atmósfera de partida: anunciar sólo
    // los cambios, nunca la carga de la página. En automático tampoco se
    // anuncia: los cambios por lugar o por escucha no deben hablar solos.
    const changed = previous.current !== null && previous.current !== atmosphereId;
    previous.current = atmosphereId;

    if (changed && choice !== null) setAnnouncement(t(`${atmosphereId}.name`));
  }, [atmosphereId, t, choice]);

  return (
    <>
      {children}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </>
  );
}
