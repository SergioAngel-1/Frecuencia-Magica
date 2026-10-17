'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { fadeDuration } from '@/lib/atmosphere/engine-profile';
import { usePortalStore } from '@/stores/portal-store';
import type { AtmosphereId } from '@/types/atmosphere';

/**
 * Una de las dos capas. `id` es la atmósfera que pinta: su `data-atmosphere`
 * cascadea a `--atmo-bg`. Sin id hereda la de `<html>`, que ya fija el script de
 * arranque. `key` cambia en cada fundido: la capa se monta de nuevo y nace
 * transparente, sin depender de en qué punto estaba el fundido anterior.
 * `fade` es la duración del fundido en curso (0 si no hay); `lit` si se ve.
 */
type Slot = { id: AtmosphereId | undefined; key: number; fade: number; lit: boolean };
type Backdrop = { top: 0 | 1; slots: readonly [Slot, Slot] };

const START: Backdrop = {
  top: 0,
  slots: [
    { id: undefined, key: 0, fade: 0, lit: true },
    { id: undefined, key: 0, fade: 0, lit: false },
  ],
};

function withSlot(slots: readonly [Slot, Slot], index: 0 | 1, slot: Slot): readonly [Slot, Slot] {
  return index === 0 ? [slot, slots[1]] : [slots[0], slot];
}

/** Primera atmósfera: sin fundido, en la capa de encima. */
function place(state: Backdrop, id: AtmosphereId): Backdrop {
  const top = state.slots[state.top];

  return { ...state, slots: withSlot(state.slots, state.top, { ...top, id }) };
}

/**
 * Fundido: la capa de abajo sigue con su fondo y la nueva, en la de encima, nace
 * transparente y sube a opaca. Sólo se anima `opacity`.
 */
function crossfade(state: Backdrop, id: AtmosphereId, fade: number): Backdrop {
  const next = state.top === 0 ? 1 : 0;
  const incoming: Slot = { id, key: state.slots[next].key + 1, fade, lit: true };

  return { top: next, slots: withSlot(state.slots, next, incoming) };
}

/** Fin del fundido: sólo queda la capa de encima. */
function settle(state: Backdrop): Backdrop {
  const [a, b] = state.slots;
  const done = (slot: Slot, lit: boolean): Slot => ({ ...slot, fade: 0, lit });

  return state.top === 0
    ? { top: 0, slots: [done(a, true), done(b, false)] }
    : { top: 1, slots: [done(a, false), done(b, true)] };
}

function layerStyle({ fade, lit }: Slot, top: boolean): CSSProperties {
  return {
    background: 'var(--atmo-bg)',
    opacity: lit ? 1 : 0,
    zIndex: top ? 1 : 0,
    animation: fade > 0 ? `fm-atmo-fade ${fade}s ease-in-out both` : undefined,
  };
}

/**
 * Fondo de la atmósfera activa, fijo bajo todo el motor. Mantiene dos capas y
 * funde por `opacity` al cambiar de atmósfera. Con movimiento reducido o con el
 * portal ocupado el cambio es inmediato: el velo ya cubre la pantalla.
 */
export function AtmosphereBackdrop() {
  const { atmosphereId } = useAtmosphere();
  const reduced = useReducedMotionSafe();
  const busy = usePortalStore((state) => state.phase !== 'idle');
  const [backdrop, setBackdrop] = useState(START);
  const shown = useRef<AtmosphereId | undefined>(undefined);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (shown.current === atmosphereId) return;

    const first = shown.current === undefined;
    shown.current = atmosphereId;
    clearTimeout(settleTimer.current);

    if (first) {
      setBackdrop((state) => place(state, atmosphereId));
      return;
    }

    const fade = busy ? 0 : fadeDuration(reduced);
    setBackdrop((state) => crossfade(state, atmosphereId, fade));

    if (fade === 0) setBackdrop(settle);
    else settleTimer.current = setTimeout(() => setBackdrop(settle), fade * 1000);
  }, [atmosphereId, busy, reduced]);

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  return (
    <div aria-hidden="true" className="z-world pointer-events-none fixed inset-0">
      {backdrop.slots.map((slot, index) => (
        <div
          key={`${index}-${slot.key}`}
          data-atmosphere={slot.id}
          className="absolute inset-0"
          style={layerStyle(slot, index === backdrop.top)}
        />
      ))}
    </div>
  );
}
