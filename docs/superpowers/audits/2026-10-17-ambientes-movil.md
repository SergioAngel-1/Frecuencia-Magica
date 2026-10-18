# Pasada móvil y tapados (Fase 2, T2.14)

Fecha: 2026-10-17. Rama `feat/ambientes-v2-fase2`. Build de producción (`next build` + `next start -p 3102`), Playwright (Chromium) con emulación táctil a 390 × 844 y 768 × 1024.

## Qué se midió

Para cada ruta de compra y de escucha, con el reproductor cerrado y abierto, y en el borde superior y el inferior del scroll, el script cruza el rectángulo de cada enlace, botón y campo del contenido con el de los fijos (el dock del reproductor y «Hablar ahora»). Rutas: `/tienda`, `/tienda/p1`, `/tienda/carrito`, `/resonario` (con una pista sonando), `/academia`, `/academia/c1`, `/academia/c1/2` e `/inicio`.

## Resultado

| Comprobación                                                                                                   | 390                                                                                                       | 768                                     |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Dock expandido y «Hablar ahora» en la misma fila, sin solape                                                   | dock x 12–310, «Hablar ahora» x 310–378                                                                   | dock x 24–550, «Hablar ahora» x 550–744 |
| Tapados **al final del scroll** (borde inferior) en las ocho rutas                                             | ninguno                                                                                                   | ninguno                                 |
| Ningún botón de compra («Añadir», «Comprar ya», «Realizar pedido») bajo un flotante en reposo (borde superior) | cumple; el «Añadir» de la tienda queda a 43 × 56 px bajo el disco sólo en el primer viewport de `/tienda` | cumple                                  |
| Constelación (puntos laterales)                                                                                | sólo desde 1024 px: no existe en estos anchos                                                             | ídem                                    |
| Desborde horizontal                                                                                            | 0 px                                                                                                      | 0 px                                    |

El dock y «Hablar ahora» ya no se solapan: lo resolvió T2.4 (fila fija compartida). El «dock en móvil mide ~298 px» sigue siendo cierto expandido, pero ahora ocupa su columna y el disco de «Hablar ahora» la suya (capturas `movil-resonario-dock-390.webp`).

Los cruces que aparecen en el borde **superior** son transitorios: un control que pasa bajo un flotante mientras se desplaza la página, como en cualquier app con controles fijos. Ninguno es permanente. El contenido reserva el espacio inferior de los fijos (`scroll-padding-bottom` de la vista y el hueco del footer): al final del scroll ningún enlace ni botón queda tapado.

## Coste de las esferas del Resonario en móvil

Hallazgo diferido de B: las 16 esferas flotaban al unísono (sin `floatDelay`), con halo desenfocado y aros. Medición con CPU ×4 (gama media) durante 4 s de `requestAnimationFrame` a 390 px:

| Vista                              | fps | peor fotograma |
| ---------------------------------- | --- | -------------- |
| `/academia` (control, sin esferas) | 60  | 33 ms          |
| `/resonario`, arriba               | 59  | 67 ms          |
| `/resonario`, rejilla de esferas   | 58  | 50 ms          |
| `/inicio`                          | 60  | 33 ms          |

Sin pérdida apreciable frente al control: el halo es una capa estática (se rasteriza una vez; sólo `transform` y `opacity` se animan en el compositor). Se añadió `floatPhase(id)`: un retardo negativo determinista que reparte las esferas en seis fases, para que no suban y bajen a la vez (más natural; no cambia el coste). Límite de esta medición: Chromium sin cabeza no mide la GPU de un móvil real; queda recomendada una comprobación en un dispositivo físico antes de publicar.

## Hallazgos que salieron de las capturas y se corrigieron

1. **Fondo gris en las atmósferas claras.** La viñeta de la nebulosa era un navy fijo; con el multiplicador de su perfil ensuciaba el fondo crema a gris (luminosidad 240 → 209 en Academia, Tienda y Sobre Marisol). Ahora lee `--scrim` y `--scrim-deep`: en la noche son el mismo navy (la noche no cambia), en las claras es el velo claro. Tras el arreglo, el fondo de Academia mide (241, 237, 226) en el centro del viewport.
2. **Portada del curso lavada.** El velo oscuro inferior de la portada se volvía blanco sobre la atmósfera `study` y desteñía la mitad de la foto. La portada no lleva texto encima (el pie es aparte): se pinta sin velo.
3. **Puntos de la constelación** (hallazgo 3 de la auditoría de muestras): aro de tinta en esquema claro (`.fm-nav-dot`), guardado por `light-contrast`.

## Capturas

`movil-resonario-dock-390.webp`, `movil-producto-390.webp`, `movil-tienda-768.webp`, `movil-curso-390.webp` en `docs/superpowers/audits/assets/`.
