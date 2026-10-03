'use client';

import Lenis from 'lenis';
import { useEffect, useRef, type ReactNode } from 'react';

import { useRealm } from '@/hooks/use-realm';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { usePathname } from '@/i18n/navigation';

/** Easing exponencial: arranque firme, frenada larga y cinematográfica. */
const easeOutExpo = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * Scroll suave con inercia. No se instancia con movimiento reducido ni en las
 * pantallas de altura fija (portal, acceso): ahí manda el scroll nativo. Al
 * cambiar de ruta, el scroll vuelve arriba de inmediato.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotionSafe();
  const { realmId } = useRealm();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  const enabled = !reduced && realmId !== 'portal' && realmId !== 'auth';

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: easeOutExpo,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  // Al cambiar de ruta, arriba del todo (replica el scrollTo(0,0) del prototipo).
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
