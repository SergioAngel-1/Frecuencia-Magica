'use client';

import { useEffect, useRef, useState } from 'react';

import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useThemeFade } from '@/hooks/use-theme-fade';
import type { ThemeFadeLayer } from '@/lib/atmosphere/theme-fade';
import type { AtmosphereId } from '@/types/atmosphere';

/**
 * Una de las dos capas. `id` es la atmósfera que pinta: su `data-atmosphere`
 * cascadea los tokens (`--atmo-bg`, `--scrim-deep`…) sólo a esa capa, así que lo que
 * se pinta con ellos funde en vez de saltar con el tema de `<html>`. Sin id hereda
 * la de `<html>`, que ya fija el script de arranque. `key` cambia en cada fundido: la
 * capa se monta de nuevo y nace transparente, sin depender de en qué punto estaba el
 * fundido anterior. `fade` es la duración del fundido en curso (0 si no hay); `lit`
 * si se ve.
 */
export type ThemeSlot = { id: AtmosphereId | undefined; key: number; fade: number; lit: boolean };
export type ThemeCrossfade = { top: 0 | 1; slots: readonly [ThemeSlot, ThemeSlot] };

const START: ThemeCrossfade = {
  top: 0,
  slots: [
    { id: undefined, key: 0, fade: 0, lit: true },
    { id: undefined, key: 0, fade: 0, lit: false },
  ],
};

function withSlot(
  slots: readonly [ThemeSlot, ThemeSlot],
  index: 0 | 1,
  slot: ThemeSlot,
): readonly [ThemeSlot, ThemeSlot] {
  return index === 0 ? [slot, slots[1]] : [slots[0], slot];
}

/** Primera atmósfera: sin fundido, en la capa de encima. */
function place(state: ThemeCrossfade, id: AtmosphereId): ThemeCrossfade {
  const top = state.slots[state.top];

  return { ...state, slots: withSlot(state.slots, state.top, { ...top, id }) };
}

/**
 * Fundido: la capa de abajo sigue con su tema y la nueva, en la de encima, nace
 * transparente y sube a opaca. Sólo se anima `opacity`.
 */
function crossfade(state: ThemeCrossfade, id: AtmosphereId, fade: number): ThemeCrossfade {
  const next = state.top === 0 ? 1 : 0;
  const incoming: ThemeSlot = { id, key: state.slots[next].key + 1, fade, lit: true };

  return { top: next, slots: withSlot(state.slots, next, incoming) };
}

/** Fin del fundido: sólo queda la capa de encima. */
function settle(state: ThemeCrossfade): ThemeCrossfade {
  const [a, b] = state.slots;
  const done = (slot: ThemeSlot, lit: boolean): ThemeSlot => ({ ...slot, fade: 0, lit });

  return state.top === 0
    ? { top: 0, slots: [done(a, true), done(b, false)] }
    : { top: 1, slots: [done(a, false), done(b, true)] };
}

/**
 * Las dos capas de una pieza que se pinta con los tokens del tema (el fondo, la viñeta):
 * cada una lleva el `data-atmosphere` del tema que pinta, de modo que al cambiar de tema
 * la vieja conserva su aspecto y la nueva sube por encima con la duración de su capa
 * (`ThemeFadeLayer`). Con ceremonia o con movimiento reducido el cambio es inmediato.
 *
 * Los tokens de `<html>` cambian de golpe; un degradado hecho con ellos no puede
 * transitar, así que saltaría al aspecto del tema nuevo antes de que nada funda. Por eso
 * las piezas anchas pintadas con degradados se montan sobre estas dos capas.
 */
export function useThemeCrossfade(layer: ThemeFadeLayer): ThemeCrossfade {
  const { atmosphereId } = useAtmosphere();
  const fade = useThemeFade(layer);
  const [state, setState] = useState(START);
  const shown = useRef<AtmosphereId | undefined>(undefined);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (shown.current === atmosphereId) return;

    const first = shown.current === undefined;
    shown.current = atmosphereId;
    clearTimeout(settleTimer.current);

    if (first) {
      setState((current) => place(current, atmosphereId));
      return;
    }

    setState((current) => crossfade(current, atmosphereId, fade));

    if (fade === 0) setState(settle);
    else settleTimer.current = setTimeout(() => setState(settle), fade * 1000);
  }, [atmosphereId, fade]);

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  return state;
}

/** Estilo común de una capa: opaca si se ve, y con su fundido de entrada si lo hay. */
export function slotStyle({ fade, lit }: ThemeSlot, top: boolean) {
  return {
    opacity: lit ? 1 : 0,
    zIndex: top ? 1 : 0,
    animation: fade > 0 ? `fm-atmo-fade ${fade}s ease-in-out both` : undefined,
  };
}
