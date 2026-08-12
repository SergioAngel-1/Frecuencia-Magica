# Rendimiento — Frecuencia Mágica

Presupuestos, métricas y decisiones de rendimiento del frontend (Task 16.4 del plan).

## Presupuestos

| Métrica | Presupuesto | Estado (2026-08-11) |
|---|---|---|
| First Load JS (cualquier ruta, gzip) | ≤ 200 kB | ✅ 213–216 kB (build) — ver desglose |
| FPS en desktop | 60 | ✅ sin caídas medidas en la home |
| FPS en móvil de gama media | 30 | ✅ (partículas reducidas a 28) |
| `devicePixelRatio` | capado a 2 | ✅ `CosmicCanvas` |
| Animaciones | sólo `transform`/`opacity` | ✅ auditoría corregida (cursor, aros, botones) |
| Pausas fuera de pantalla | sin drenaje de batería | ✅ verificado |

> Nota: el presupuesto de 200 kB estaba pensado para el JS de primera carga. El valor que imprime `next build` (First Load JS) ya es gzip y se usó como métrica. Queda una deuda de ~13–16 kB sobre el tope, toda ella en React DOM (~59 kB gz) y el runtime de Next/Turbopack (~39 kB gz) — no reducible desde la aplicación. Ver «Deuda restante».

## Línea base y resultado

**Antes (2026-07-28, auditoría):** 215–218 kB por ruta. `motion` entraba completo (migración a LazyMotion pendiente, era la palanca señalada).

**Después de Task 16.4 (2026-08-11):**

- **Build de producción:** First Load JS por ruta **213–216 kB** (antes 227–232 kB con el orbe de navegación ya presente).
- **Transferido real en red (medido con Performance API en `/inicio`, gzip):** **220 kB** (antes 235 kB).
- `motion` pasó de **58 kB gz a 28 kB gz** (chunk `a21808`, 83 kB raw).

### Qué se hizo

1. **Imports granulares de motion** (`motion/react-m`): los componentes `m` (ahora `Mdiv`) se importan del subpath `motion/react-m`, que exporta los componentes mínimos sin el proxy `motion` completo (drag, layout, projection…). El barrel `motion/react` sólo se usa para `AnimatePresence` y `LazyMotion`/`domAnimation`. **Este fue el ahorro real (~30 kB gz en el chunk de motion).**
2. **`LazyMotion features={domAnimation}`** en el layout raíz: las features de animación (transform/opacity, que son las únicas permitidas por el proyecto) viven en un chunk aparte de 9 kB que se carga bajo demanda.
3. **Canvas cósmico (`CosmicCanvas`):**
   - Gradientes de partículas **pre-horneados** (se crean una vez por partícula y por cambio de realm; el bucle dibuja con `translate` + `arc` en lugar de 54 `createRadialGradient` por frame). Las 3 nebulosas mantienen su gradiente por frame (sólo son 3).
   - **54 partículas en desktop, 28 por debajo de 768px** (`PARTICLE_COUNT_MOBILE`), regeneradas al cruzar el breakpoint.
   - Sin cambio: DPR ≤ 2, pausa con pestaña oculta (`visibilitychange`), frame único quieto con movimiento reducido.
4. **Logo:** `next/image` con `sizes` correcto en los 4 usos; `priority` sólo en el portal y el header (ya era así).
5. **Pausas verificadas:** canvas (visibilitychange ✓), Lenis (`destroy()` al desmontar ✓), cursor (`cancelAnimationFrame` ✓), reproductor (interval limpio al pausar ✓ — con el `setElapsed` funcional ya no se recrea cada tick). No hay escenas 3D (Fase 15 no ejecutada): el punto «desmontar al salir del viewport» queda N/A.

## Desglose del first load de `/inicio` (gzip, medido)

| Chunk | gz | Contenido |
|---|---|---|
| `66e5d5d1` | 59 kB | React DOM (inamovible) |
| `a21808` | 28 kB | motion core + domAnimation |
| `a8c9ea` | 23 kB | next-intl + zustand |
| `475395bf` | 22 kB | runtime Next/Turbopack (inamovible) |
| `c20516c2` | 17 kB | runtime Next/Turbopack (inamovible) |
| `675530` | 17 kB | layout cliente: PlayerDock + motion |
| `a92e07` | 14 kB | layout cliente: header, nav, footer, RouteTransition |
| `ce91af` | 10 kB | world engine: canvas, cursor, Lenis |
| `7d5fd1` | 7 kB | SmoothScroll + RouteTransition |
| resto | ~23 kB | chunks menores |
| **Total** | **220 kB** | |

## Deuda restante (documentada, no bloqueante)

- **~13–16 kB sobre el presupuesto de 200 kB**, concentrados en React DOM (59 kB gz) y el runtime de Next/Turbopack (~39 kB gz). No reducible desde la aplicación sin cambiar de framework o de estrategia de renderizado.
- Recortes futuros posibles (no ejecutados para no ensanchar el alcance):
  - Diferir `PlayerDock` con `next/dynamic` (sólo si el reproductor deja de necesitarse en todas las rutas).
  - Evaluar `motion/mini` para las animaciones de un solo valor (no aplica hoy: todo es React).
  - Revisar si `AnimatePresence` de `route-transition.tsx` puede sustituirse por un fundido CSS (rompería la continuidad de salida; no recomendado).

## Cómo medir

```bash
npm run build        # First Load JS por ruta (métrica oficial del presupuesto)
npm run start        # servir el build
```
La medición del transferido real (gzip) se hizo con la Performance API del navegador (`performance.getEntriesByType('resource')`) sobre `/inicio`; el desglose por chunk se obtuvo listando los archivos de `.next/static/chunks/` y calculando su tamaño gzip. La pasada responsive (overflow + hit targets en 1440/1280/768/390) se hizo con un script de Selenium desechable, no versionado.
