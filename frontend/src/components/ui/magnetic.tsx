'use client';

import { useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';

import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { magneticOffset } from '@/lib/magnetic-offset';

/** Tope de desplazamiento fijado por el PRD Parte 3. */
const MAX_OFFSET = 8;

/**
 * Muelle sobreamortiguado: se acerca al valor final sin rebote ni
 * sobreimpulso perceptible (relación de amortiguación > 1), pero sigue
 * sintiéndose vivo en vez de un simple "tween" lineal.
 */
const SPRING = { type: 'spring', stiffness: 120, damping: 26, mass: 1 } as const;

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

function subscribeFinePointer(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};

  const media = window.matchMedia(FINE_POINTER_QUERY);
  media.addEventListener('change', onChange);

  return () => media.removeEventListener('change', onChange);
}

function getFinePointerSnapshot(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;

  return window.matchMedia(FINE_POINTER_QUERY).matches;
}

function getFinePointerServerSnapshot(): boolean {
  return false;
}

/** `true` sólo con ratón/trackpad (hover real + puntero fino). */
function useFinePointer(): boolean {
  return useSyncExternalStore(subscribeFinePointer, getFinePointerSnapshot, getFinePointerServerSnapshot);
}

interface MagneticProps {
  children: ReactNode;
  /** Desplazamiento máximo en px. Por defecto 8 (tope del PRD Parte 3). */
  strength?: number;
  disabled?: boolean;
}

/**
 * Envoltorio que atrae su contenido hacia el puntero dentro de su propio
 * área, con el vector calculado por la función pura `magneticOffset`.
 *
 * Añade `data-magnetic` para que `LuminousCursor` reaccione, incluso cuando
 * el hijo ya sea un `<a>`/`<button>` propio (el CSS de `cursor: none` del
 * layout también los cubre por etiqueta).
 *
 * Inerte por completo — sin listeners, offset fijo en `{0,0}` — con
 * movimiento reducido, sin puntero fino/hover real (táctil) o si `disabled`
 * es verdadero, tal como pide el PRD.
 */
export function Magnetic({ children, strength = MAX_OFFSET, disabled = false }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotionSafe();
  const finePointer = useFinePointer();

  const isActive = !disabled && !reducedMotion && finePointer;

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (!isActive || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    setOffset(magneticOffset({ x: event.clientX, y: event.clientY }, rect, strength));
  };

  const handlePointerLeave = (): void => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      data-magnetic
      className="inline-flex h-full w-full items-center justify-center"
      animate={isActive ? offset : { x: 0, y: 0 }}
      transition={SPRING}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </motion.div>
  );
}
