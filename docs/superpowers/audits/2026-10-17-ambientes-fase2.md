# Fase 2 de Ambientes v2 — verificación visual y cierre

Fecha: 2026-10-17. Rama `feat/ambientes-v2-fase2`. Build de producción (`next build` + `next start -p 3102`), Playwright (Chromium) con capturas de **viewport** (las capas `fixed` sólo pintan en el primer viewport) a 1440, 1280, 768 y 390 px, con y sin `prefers-reduced-motion`. Las nueve atmósferas del catálogo: `night`, `dusk`, `dawn`, `moon`, `forest`, `study`, `store`, `gathering` y `marisol`.

## Matriz de capturas (T2.15)

72 capturas WebP (q58, 1,9 MB) en `docs/superpowers/audits/assets/ambientes-matriz/<atmósfera>-<ancho>[-reducido].webp`. Cada atmósfera en el sitio donde vive o desde donde se elige:

| Atmósfera | Ruta | Cómo se activa |
|---|---|---|
| `night` | `/resonario` | sin elección manual (la predeterminada) |
| `dusk`, `dawn`, `moon`, `forest` | `/resonario` | elección manual (`sessionStorage` `fm.atmosphere`) |
| `study` | `/academia` | la de su lugar |
| `store` | `/tienda` | la de su lugar |
| `gathering` | `/experiencias` | la de su lugar |
| `marisol` | `/sobre-marisol` | la de su lugar |

Comprobado por captura (72 de 72): `data-atmosphere` de `<html>` coincide con la esperada, **0 px de desborde horizontal**, ningún error de consola al cargar. Revisadas a ojo en hojas de contacto por atmósfera (4 anchos × con/sin movimiento reducido). Lo visto:

- **Noche, atardecer, luna y bosque** (oscuras): paisaje de fondo a sangre en el héroe, tinta marfil, constelación sin aro. Legibles en los cuatro anchos.
- **Amanecer, estudio, tienda y Marisol** (claras): tinta oscura sobre crema o azul cielo; la constelación lleva su aro de tinta (`.fm-nav-dot`) y se distingue. Con movimiento reducido el paisaje queda quieto; sin él, deriva despacio (sólo `transform`).
- **Encuentro** (cálida, texto marfil): el héroe lee bien sobre la foto oscura; las tarjetas de experiencia a 768 y 390 conservan contraste.
- A 390 px el título de Academia («Procesos reales de transformación») pasa sobre las hojas de la foto; la tinta oscura sigue leyéndose (≥ 7:1 por inspección; la guarda mide la zona del texto a la izquierda).

## La noche sigue idéntica

Sin elección manual, mismas dimensiones y movimiento reducido, contra el servidor de master del usuario (`localhost:3002`, sólo lectura). Diferencia media absoluta por píxel (0–255), con el ruido base de dos capturas del mismo servidor entre paréntesis:

| Vista | 1440 | 390 |
|---|---|---|
| `/inicio` (primer viewport, héroe) | 0,025 (0,006) | 0,084 (0,083) |
| `/acceso` | 0,001 (0,001) | 0,023 (0,022) |
| `/resonario`, zona del héroe (y < 570 px a 1440) | **0,000**, máximo 0 | — |

`/inicio` y `/acceso` son idénticos salvo el ruido del campo de estrellas. `/resonario` difiere por diseño bajo el héroe (la sección por tipo de escucha y su banner son nuevos, Fase 2 bloque B): en la zona del héroe la diferencia es exactamente cero, píxel a píxel. El indicador de `next dev` del servidor de master (esquina inferior izquierda) se enmascaró en la comparación.

## Contraste del texto del héroe sobre la foto

Medición con PIL (peor píxel de la zona x 8–40 %, y 20–55 % del héroe, texto oculto, contra la tinta del título), con y sin movimiento reducido (idéntico: el movimiento no cambia el contraste) a 1440, 1280, 768 y 390:

| Héroe (atmósfera) | Mínimo | Percentil 5 | Mediana |
|---|---|---|---|
| Academia (`study`) | 13,3 | 14,0 | 14,9 |
| Sobre Marisol (`marisol`) | 13,2 | 13,9 | 14,7 |
| Tienda (`store`) | 10,2 | 10,6 | 12,3 |
| Experiencias (`gathering`) | 10,2 | 11,3 | 14,2 |

El caso queda como guarda en `tests/lib/hero-photo-contrast.test.ts` (reproduce el velo `left` sobre la foto publicada; con foto) y, sin foto, en `atmosphere-contrast` (el degradado de respaldo).

## Hallazgos de esta fase

1. **El fondo de las atmósferas claras era gris, no crema.** La viñeta de la nebulosa era un navy fijo; a la opacidad de su perfil bajaba la luminosidad del fondo de 240 a 209. Ahora lee `--scrim` y `--scrim-deep` (la noche es el mismo navy, idéntica). Corregido; ver `docs/superpowers/audits/2026-10-17-ambientes-movil.md`.
2. Puntos de la constelación sobre claro (~1,7:1): aro de tinta. Corregido.
3. Velos `void-2` del menú y del diario sobre claro: ahora `--scrim-deep`. Quedan, con motivo, `video-player`, `auth-form`, `band` y `realm-card`.
4. Portada de curso lavada por el velo inferior en `study`: sin velo. Corregido.
5. Fotos de producto, audio y video reales, catálogo y cursos reales: **pendientes de Marisol** (`docs/materiales-pendientes.md`).
