'use client';

import type { CSSProperties } from 'react';

import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { usePortalStore } from '@/stores/portal-store';

const centered: CSSProperties = { position: 'absolute', left: '50%', top: '50%' };

const GIANT_GRADIENT =
  'radial-gradient(circle, #f7f4ea 0%, #e8d199 22%, #96C6BC 46%, #16273f 70%, #0F1B2E 100%)';

/**
 * Overlay del cruce de portal. En `in` estalla un núcleo blanco, se expanden
 * dos anillos y gira la geometría sagrada mientras un círculo cubre la pantalla;
 * en `out` ese círculo se desvanece. Con movimiento reducido, un fundido simple.
 *
 * Port de las líneas 91–105 del prototipo.
 */
export function PortalTransition() {
  const phase = usePortalStore((state) => state.phase);
  const reduced = useReducedMotionSafe();

  if (phase === 'idle') return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9000] overflow-hidden"
    >
      {reduced ? (
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--color-void-2)',
            opacity: phase === 'in' ? 1 : 0,
            transition: 'opacity .2s ease',
          }}
        />
      ) : (
        <>
          {/* Círculo gigante que cubre la pantalla y luego se disuelve. */}
          <div
            style={{
              ...centered,
              width: '300vmax',
              height: '300vmax',
              borderRadius: '50%',
              background: GIANT_GRADIENT,
              animation:
                phase === 'in'
                  ? 'fm-portal-expand 1s cubic-bezier(.7,0,.3,1) forwards'
                  : 'fm-portal-fade .9s ease forwards',
            }}
          />

          {phase === 'in' && (
            <>
              {/* Núcleo blanco que estalla. */}
              <div
                style={{
                  ...centered,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: '#f7f4ea',
                  boxShadow: '0 0 120px 60px rgba(247,244,234,0.7)',
                  animation: 'fm-portal-core 1.1s ease-in forwards',
                }}
              />
              {/* Dos anillos que se expanden. */}
              <div
                style={{
                  ...centered,
                  width: 280,
                  height: 280,
                  borderRadius: '50%',
                  border: '1px solid rgba(247,244,234,0.7)',
                  animation: 'fm-portal-ring 1.1s ease-out forwards',
                }}
              />
              <div
                style={{
                  ...centered,
                  width: 280,
                  height: 280,
                  borderRadius: '50%',
                  border: '1px solid rgba(216,185,120,0.6)',
                  animation: 'fm-portal-ring 1.1s ease-out .18s forwards',
                }}
              />
              {/* Geometría sagrada que gira. */}
              <svg
                viewBox="0 0 400 400"
                style={{
                  ...centered,
                  width: 620,
                  height: 620,
                  opacity: 0.55,
                  animation: 'fm-portal-spin 1.1s ease-out forwards',
                }}
              >
                <circle cx="200" cy="200" r="150" fill="none" stroke="#f7f4ea" strokeWidth="1" />
                <circle
                  cx="200"
                  cy="200"
                  r="110"
                  fill="none"
                  stroke="#D8B978"
                  strokeWidth="1"
                  strokeDasharray="3 10"
                />
                <polygon
                  points="200,60 320,300 80,300"
                  fill="none"
                  stroke="#D8B978"
                  strokeWidth="1"
                />
              </svg>
            </>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Región que anuncia el destino del cruce a los lectores de pantalla. Se
 * mantiene fuera del overlay `aria-hidden` para que sí se lea.
 */
export function PortalAnnouncer({ destination }: { destination?: string }) {
  const phase = usePortalStore((state) => state.phase);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {phase === 'in' && destination ? destination : ''}
    </div>
  );
}
