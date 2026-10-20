'use client';

import { slotStyle, useThemeCrossfade } from '@/hooks/use-theme-crossfade';

/**
 * Fondo de la atmósfera activa, bajo todo el motor. Va anclado al documento (el
 * `body` es su bloque contenedor), como el gradiente que antes pintaba el body: se
 * estira con la página y no con el viewport. Mantiene dos capas (`useThemeCrossfade`)
 * y funde por `opacity` al cambiar de atmósfera. Con movimiento reducido o con
 * ceremonia (velo o portal) el cambio es inmediato: el velo ya cubre la pantalla.
 */
export function AtmosphereBackdrop() {
  const backdrop = useThemeCrossfade('backdrop');

  return (
    <div aria-hidden="true" className="z-world pointer-events-none absolute inset-0">
      {backdrop.slots.map((slot, index) => (
        <div
          key={`${index}-${slot.key}`}
          data-atmosphere={slot.id}
          className="absolute inset-0"
          style={{ background: 'var(--atmo-bg)', ...slotStyle(slot, index === backdrop.top) }}
        />
      ))}
    </div>
  );
}
