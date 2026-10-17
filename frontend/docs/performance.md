# Rendimiento — Frecuencia Mágica

Presupuestos, métricas y decisiones de rendimiento del frontend (Task 16.4 del plan).

## Presupuestos

| Métrica                              | Presupuesto                | Estado (2026-08-11)                            |
| ------------------------------------ | -------------------------- | ---------------------------------------------- |
| First Load JS (cualquier ruta, gzip) | ≤ 200 kB                   | ✅ 213–216 kB (build) — ver desglose           |
| FPS en desktop                       | 60                         | ✅ sin caídas medidas en la home               |
| FPS en móvil de gama media           | 30                         | ✅ (partículas reducidas a 28)                 |
| `devicePixelRatio`                   | capado a 2                 | ✅ `CosmicCanvas`                              |
| Animaciones                          | sólo `transform`/`opacity` | ✅ auditoría corregida (cursor, aros, botones) |
| Pausas fuera de pantalla             | sin drenaje de batería     | ✅ verificado                                  |

> Nota: el presupuesto de 200 kB estaba pensado para el JS de primera carga. El valor que imprime `next build` (First Load JS) ya es gzip y se usó como métrica. Queda una deuda de ~13–16 kB sobre el tope, toda ella en React DOM (~59 kB gz) y el runtime de Next/Turbopack (~39 kB gz) — no reducible desde la aplicación. Ver «Deuda restante».

> **Medición 2026-09-30 (auditoría de coherencia visual): el presupuesto se ha degradado.** Suma de los chunks JS de `/inicio` (manifest de la ruta, gzip): **246.7 kB**; `next build` imprime 248–254 kB por ruta (compartido 148 kB). Son ~32 kB más que los 220 kB medidos el 2026-08-11 y ~47 kB sobre el tope. La pasada de armonización visual la movió +1–2 kB (`/inicio` 252 → 253 kB, `/experiencias` 248 → 250 kB: `ButtonLink` y los nuevos slots de Mi Santuario); la regresión de fondo es anterior. Sospechosos por medir con `@next/bundle-analyzer`: `next/image` presente en todas las rutas por `EditorialImage`, catálogo de mensajes completo en el cliente, `PlayerDock` en el layout. No se ha perfilado FPS en móvil de gama media con las bandas a sangre ni con las 14 superficies con `backdrop-filter`.

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
   - **Fuera del hilo principal (2026-10-10):** la escena (`lib/cosmic/scene.ts`) se pinta en un worker sobre un `OffscreenCanvas` (`lib/cosmic/cosmic.worker.ts`); sin soporte, o si el worker falla, el mismo código pinta en el hilo principal. Sin su `requestAnimationFrame` en la página, el navegador deja de producir un frame de documento por cada frame del fondo. El alfa de las estrellas va en `globalAlpha` (sin 220 cadenas `rgba()` por frame) y el bucle no pinta por encima de 60 fps en pantallas de 120 Hz.
4. **Logo:** `next/image` con `sizes` correcto en los 4 usos; `priority` sólo en el portal y el header (ya era así).
5. **Pausas verificadas:** canvas (visibilitychange ✓), Lenis (`destroy()` al desmontar ✓), cursor (`cancelAnimationFrame` ✓), reproductor (interval limpio al pausar ✓ — con el `setElapsed` funcional ya no se recrea cada tick). No hay escenas 3D (Fase 15 no ejecutada): el punto «desmontar al salir del viewport» queda N/A.

## Desglose del first load de `/inicio` (gzip, medido)

| Chunk      | gz         | Contenido                                            |
| ---------- | ---------- | ---------------------------------------------------- |
| `66e5d5d1` | 59 kB      | React DOM (inamovible)                               |
| `a21808`   | 28 kB      | motion core + domAnimation                           |
| `a8c9ea`   | 23 kB      | next-intl + zustand                                  |
| `475395bf` | 22 kB      | runtime Next/Turbopack (inamovible)                  |
| `c20516c2` | 17 kB      | runtime Next/Turbopack (inamovible)                  |
| `675530`   | 17 kB      | layout cliente: PlayerDock + motion                  |
| `a92e07`   | 14 kB      | layout cliente: header, nav, footer, RouteTransition |
| `ce91af`   | 10 kB      | world engine: canvas, cursor, Lenis                  |
| `7d5fd1`   | 7 kB       | SmoothScroll + RouteTransition                       |
| resto      | ~23 kB     | chunks menores                                       |
| **Total**  | **220 kB** |                                                      |

## Imagen editorial (2026-10-10)

Las imágenes se comprimen **una sola vez**, desde el PNG original de `.editorial-originals/`, con `npm run editorial:ingest` (AVIF q88, `effort` 6; la calidad se calibró a 1:1 contra el PNG, ver el comentario de `scripts/editorial-ingest.mjs`). Cada imagen se publica en variantes por ancho (`<archivo>-<ancho>.avif`) y el loader de `next/image` (`src/lib/editorial/image-loader.ts`) elige la menor que cubre el ancho pedido: `next/image` ya no re-codifica a WebP. Las fuentes miden 1672/1774 px (16:9 y 2:1), 1086 px (3:4) y 1254 px (1:1); no se amplían (decisión de 2026-10-10), así que la variante mayor es el ancho de la fuente.

| Variante                                                           | Archivos | Peso total   | Media | Máximo |
| ------------------------------------------------------------------ | -------- | ------------ | ----- | ------ |
| 640                                                                | 50       | 1,04 MB      | 21 KB | 63 KB  |
| 828                                                                | 50       | 1,62 MB      | 33 KB | 97 KB  |
| 1200                                                               | 46       | 2,74 MB      | 61 KB | 167 KB |
| Ancho de la fuente (1086–1774)                                     | 50       | 4,41 MB      | 90 KB | 200 KB |
| `<archivo>.avif` (copia de la mayor, para consumidores sin loader) | 50       | 4,41 MB      | 90 KB | 200 KB |
| **`public/editorial/` (AVIF)**                                     | **246**  | **14,22 MB** |       |        |

La imagen de la espera (`states.loading`) se precarga cuando el navegador queda libre tras la primera carga (`RouteTransition`, `requestIdleCallback`), en la misma variante que pedirá la escena: la espera entre vistas sólo se ve con la red lenta, justo cuando una imagen pedida en ese momento ya no llegaría. Cuesta una descarga de 50–90 KB por visita.

El logo (`/logo.png`) no está en el manifiesto: sus cuatro usos llevan `unoptimized`, así que se sirve tal cual y no pasa ni por el loader ni por el optimizador. **Deuda:** es un PNG de 500×500 y 81 KB que el header pinta a 46 px; supera de largo lo razonable para el header (~30 KB). Conviene exportarlo a la medida de sus usos (46, 110–190 px a DPR 2) en una pasada propia.

Cada visitante descarga una sola variante por imagen visible: en 390 px las de 828 o 1200 (33–61 KB de media); en 1440 a DPR 2, la mayor (90 KB de media, ≤ 200 KB, dentro del presupuesto del brief de ≤ 260 KB y ≤ 320 KB en P0).

## Isotipo 3D (2026-10-10)

`Isotype` (`components/world`) pinta el isotipo girando con un visor WebGL propio, sin three.js ni decodificadores. Nada entra en el JS de primera carga: el visor (`lib/isotype/viewer.ts`) llega por `import()` y el modelo por `fetch`, los dos al entrar el componente en pantalla. Hasta entonces, sin WebGL o con movimiento reducido, se ve un póster SVG. Con `still` (portal y acceso) el modelo se pinta una sola vez, de frente y sin bucle de animación; como no se mueve, también con movimiento reducido.

| Recurso                              | Bruto   | gzip    |
| ------------------------------------ | ------- | ------- |
| `isotipo-sm.glb` (óptica, ≤ ~120 px) | 25,4 kB | 13,4 kB |
| `isotipo.glb` (detalle, ≥ ~160 px)   | 46,0 kB | 26,1 kB |
| Póster SVG (cada uno)                | ~11 kB  | ~3 kB   |

Dos llamadas de dibujo por instancia, DPR capado a 2, y el bucle se detiene fuera del viewport y con la pestaña oculta. Cada instancia abre su propio contexto WebGL: una o dos por vista. **Sin medir:** FPS en móvil de gama media y el tamaño del chunk del visor en `next build` (en la prueba fuera de Next, ~1,8 kB gzip minificado).

## Ambientes v2 (2026-10-17): imágenes de atmósfera y motor de audio

**Imágenes de atmósfera.** Nueve paisajes (`atmosphere.*`, ya ingeridos por `editorial:ingest`: 16:9, fuente de 1672 px). Cada visitante descarga una sola variante por paisaje visible, y sólo los que su ruta pinta (un realm = una atmósfera; el selector manual añade la elegida). `priority` sigue siendo exclusivo del primer viewport (ninguna atmósfera lo pide: son P1/P2).

| Variante                    | Archivos | Peso total |
| --------------------------- | -------- | ---------- |
| 640                         | 9        | 0,41 MB    |
| 828                         | 9        | 0,63 MB    |
| 1200                        | 9        | 1,10 MB    |
| Ancho de la fuente (1672)   | 9        | 1,72 MB    |
| Copia sin sufijo (la mayor) | 9        | 1,72 MB    |

La más pesada es `atmosphere-forest` (372 KB a 1672 px; 133 KB a 828) y la más ligera `atmosphere-moon` (98 KB). Cuenta contra el presupuesto de ≤ 260 KB del brief: sólo `forest` y `forest-autumn` (381 KB, sin cablear) lo superan a la variante mayor; a 390 px se sirve la de 828 (133–142 KB).

**Motor de audio.** `lib/audio/engine/` (~21 kB de fuente: contexto Web Audio único, síntesis de tonos, binaurales y texturas de mar y lluvia con ruido filtrado, fundidos y volumen por `GainNode`) vive en el layout con el dock, así que entra en el JS de primera carga. `next build` (First Load JS, gzip): `/inicio` 309 kB, `/descubrete` 296 kB, `/resonario` 284 kB, `/mi-santuario` 284 kB, `/tienda` 282 kB, `/academia` 280 kB. Contra los 248–254 kB de la medición del 2026-09-30 suben ~30–55 kB (motor de audio, atmósferas, «¿Cómo llegas hoy?» y la guía de respiración, galería y módulos); el presupuesto de 200 kB sigue superado y la deuda crece. Palanca pendiente: cargar el motor con `import()` en el primer gesto de reproducción (hoy se crea al abrir una pista, pero su código va en el chunk compartido).

El motor no crea el `AudioContext` hasta un gesto de la persona (`getSharedAudioContext` se llama al pulsar play o activar el ambiente) y no suena nada al cargar. Las texturas son ruido filtrado en un buffer corto en bucle: sin descarga de audio. Con archivos reales el coste pasará a ser de red: el `<audio>` se crea al abrir la pista y hoy pide `preload = 'auto'` (`file-source.ts`); conviene bajarlo a `metadata` cuando lleguen las grabaciones largas.

**Pasada móvil (390 px, CPU ×4).** `/academia` 60 fps, `/resonario` 58–59 fps (peor fotograma 50–67 ms), `/inicio` 60 fps: las 16 esferas del Resonario no cuestan frente a un control (halo estático; sólo `transform` y `opacity` se animan). Sin medir en un móvil físico. Ver `docs/superpowers/audits/2026-10-17-ambientes-movil.md`.

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
