'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useThemeFade } from '@/hooks/use-theme-fade';
import {
  INITIAL_LAYERS,
  placeInitialLayer,
  pushThemeLayer,
  settleLayers,
  type LayerStack,
  type ThemeLayer,
} from '@/lib/atmosphere/layer-stack';
import type { ThemeFadeLayer } from '@/lib/atmosphere/theme-fade';
import type { AtmosphereId } from '@/types/atmosphere';

/**
 * Las capas de una pieza que se pinta con los tokens del tema (el fondo, la viñeta): cada una lleva
 * el `data-atmosphere` del tema que pinta, de modo que al cambiar de tema las viejas conservan su
 * aspecto y la nueva sube por encima con la duración de su capa (`ThemeFadeLayer`). Se pintan en
 * orden, de abajo arriba. Con ceremonia o con movimiento reducido el cambio es inmediato.
 *
 * Los tokens de `<html>` cambian de golpe; un degradado hecho con ellos no puede transitar, así que
 * saltaría al aspecto del tema nuevo antes de que nada funda. Por eso las piezas anchas pintadas con
 * degradados se montan sobre estas capas. Son una pila (`lib/atmosphere/layer-stack`) y no dos
 * ranuras: un cambio a mitad de fundido apila otra capa sin tocar las anteriores.
 */
export function useThemeCrossfade(layer: ThemeFadeLayer): LayerStack {
  const { atmosphereId } = useAtmosphere();
  const fade = useThemeFade(layer);
  const [layers, setLayers] = useState(INITIAL_LAYERS);
  const shown = useRef<AtmosphereId | undefined>(undefined);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (shown.current === atmosphereId) return;

    const first = shown.current === undefined;
    shown.current = atmosphereId;
    clearTimeout(settleTimer.current);

    if (first) {
      setLayers((current) => placeInitialLayer(current, atmosphereId));
      return;
    }

    setLayers((current) => pushThemeLayer(current, atmosphereId, fade));

    // Cada cambio rearma el plazo: sólo cuando la capa de encima termina de subir sobran las demás.
    if (fade > 0) settleTimer.current = setTimeout(() => setLayers(settleLayers), fade * 1000);
  }, [atmosphereId, fade]);

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  return layers;
}

/** Fundido de entrada de una capa, si lo tiene: sólo `opacity`, de 0 a 1. */
export function layerStyle({ fade }: ThemeLayer): CSSProperties {
  return { animation: fade > 0 ? `fm-atmo-fade ${fade}s ease-in-out both` : undefined };
}
