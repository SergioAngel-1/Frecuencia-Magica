'use client';

import { useEffect } from 'react';

// Bloqueos activos y el estilo que había antes del primero. Dos esperas
// pueden solaparse (la de `RouteTransition` saliendo con su fundido mientras
// entra la de un `loading.tsx`) y desmontarse en cualquier orden: sólo la
// última devuelve el scroll.
let locks = 0;
let saved = { overflow: '', scrollbarGutter: '' };

/**
 * Mientras está montado, la página no se desplaza. Lo monta la escena de
 * espera: bajo ella no hay nada que leer todavía (el footer del layout en una
 * carga directa, la vista anterior entre vistas).
 *
 * Se hace aquí y no con un `html:has(...)` en CSS: el proyecto reserva su
 * único `:has()` para la cadena de bandas (`tests/lib/band-chain.test.ts`).
 * El hueco de la barra de scroll se conserva para que nada salte de sitio al
 * bloquear y al soltar.
 */
export function ScrollLock() {
  useEffect(() => {
    const root = document.documentElement;

    if (locks++ === 0) {
      saved = { overflow: root.style.overflow, scrollbarGutter: root.style.scrollbarGutter };
      root.style.overflow = 'hidden';
      root.style.scrollbarGutter = 'stable';
    }

    return () => {
      if (--locks === 0) {
        root.style.overflow = saved.overflow;
        root.style.scrollbarGutter = saved.scrollbarGutter;
      }
    };
  }, []);

  return null;
}
