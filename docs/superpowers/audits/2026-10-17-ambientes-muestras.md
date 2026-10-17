# Muestras de ambiente (Fase 1, T1.5) — verificación

Fecha: 2026-10-17. Rama `feat/ambientes-v2`. Build de producción (`next build` + `next start -p 3101`), Playwright (Chromium) con movimiento reducido, sin ingestar imágenes nuevas.

## Qué se verificó

- Resonario bajo `dusk` (Descanso) y `dawn` (Calma de día), con la noche como control.
- Tienda (`/tienda`) y detalle de producto (`/tienda/p1`), bajo `store`.
- Bloque de Tienda en la Home (`/inicio`), entre el bento y la membresía.
- Anchos 1440, 1280, 768 y 390 px. Capturas de página completa en `docs/superpowers/audits/assets/ambientes-muestras/` (`<escena>-<ancho>.webp`, WebP q80) y medición en `medicion.json` (mismo directorio).

Elección de atmósfera: `sessionStorage` `fm.atmosphere` (`{state:{manual}, version:0}`) antes de cargar. El atributo `data-atmosphere` de `<html>` confirma la atmósfera en cada captura.

## Resultados

| Comprobación | Resultado |
|---|---|
| Desborde horizontal (`scrollWidth > clientWidth`) | 0 px en las 24 capturas |
| Error de consola al cargar | ninguno |
| Atmósfera aplicada (`data-atmosphere`) | coincide con la elegida en todas |
| Degradado `atmosphere` sin foto | pinta `--atmo-backdrop` del scope; no hay zebra ni caja gris |
| Contraste automatizado (`atmosphere-contrast`) | en verde (guarda de tests) |

Los elementos que `medicion.json` marca como «fuera de viewport» son decorativos (puntos y halos de `position:absolute` con `overflow` contenido); no producen scroll horizontal.

## Hallazgos (no corregidos en esta pasada)

1. **Resonario, `dawn`, kicker del banner «Dentro del archivo»**: marfil-acento sobre la foto clara del archivo. Casi ilegible a 1440. Causa probable: el velo del banner (`EditorialBanner`) es oscuro o neutro y no cambia con el esquema claro. Pendiente: velo `light` en el banner cuando la atmósfera es clara.
2. **Resonario, `dawn`, franja oscura en el borde superior del banner** (la foto del archivo se funde sobre el degradado claro del héroe). Es el fundido `fm-fade-top` con velo oscuro. Mismo arreglo que (1).
3. **Resonario, `dawn`, puntos de navegación lateral** (`realm-nav`): contraste bajo sobre el fondo claro. No se ha medido; pendiente de revisar con la guarda de contraste.
4. **Tienda, banda `atmosphere.store` (sin foto)**: el degradado claro termina en una franja gris con borde visible a media altura del héroe. Pendiente de revisar el tramo inferior del degradado.
5. **Tienda, banda de ritual (`store.ritual-banner`, con foto)**: el kicker «Acompañado con una frecuencia» es ilegible sobre la foto clara. Mismo caso que (1): velo oscuro sobre esquema claro.
6. **Descúbrete (resultado)**: no se ha capturado. El flujo del quiz exige recorrer las preguntas; la banda `AtmosphereBand` está cableada, pero no verificada visualmente.
7. **Móvil (390 px)**: las capturas existen, pero no se han revisado a fondo en esta pasada. Pendiente de revisión, sobre todo el solapamiento del reproductor y de «Hablar ahora».
8. **Home, banda de Tienda**: legible en 1440. Su kicker y su texto pequeño se pueden subir de escala; no bloquea.

## Pendiente de la fase (no hecho aquí)

- **Recalibrar los hex provisionales** (`themeColor` de `gathering`, `forest`, `store` accent-2 y similares) contra las imágenes reales. Depende de las fotografías; no se hizo.
- **Ingesta de `atmosphere-dusk|dawn|store`** (`editorial:ingest`) y su estado en `photography-status.js`: dependencia de Sergio. Hasta entonces, se ve el degradado.
- **Velos `void-2` crudos** de la deuda (`auth-form`, `journal-panel`, `modal`, `video-player`, badge del carrito): no los toca el brief de T1.4 y no se revisaron.
- **Paso «PARAR»**: lo ejecuta el controlador con Sergio; no se hace aquí.


## Ronda de arreglo (2026-10-17)

Capturas re-hechas con `prefers-reduced-motion` (por eso la deriva del paisaje no se ve) y sin foto de atmósfera ingerida (los paisajes `atmosphere.*` se ven como degradado). Las capas `fixed` se fijan como `absolute` sólo durante la captura de página completa: sin eso, aparecía una franja gris en y=900 que no existe en el viewport real (verificado con capturas de viewport).

Arreglos aplicados (un commit por punto):

1. Velo claro en las atmósferas claras: `--scrim-deep` por atmósfera (commit d6356f2). La franja casi negra arriba y abajo del banner desaparece en `dawn`.
2. Franja gris bajo «Todos los productos» en Tienda: no era de la página. Medido: no hay borde en el viewport (commit de esta ronda: ninguno, sólo corrección del script de captura).
3. Números de las esferas: `--color-on-media` (marfil en todas las atmósferas) en la cara del disco (commit bb8cc5b).
4. `natural`: el héroe de Tienda ya no lleva el velo teal (`tintForPhotoTreatment`, commit b2a277a).
5. Guarda de cableado del inventario exige `atmospherePainting` en el hook (commit a9ef89b).

Estado tras los arreglos (revisado en las capturas nuevas de `shots2`):

- `dawn`, Resonario 1440: la franja oscura superior se reduce a la propia foto (columnas oscuras de la escena). Abierto: el kicker «Dentro del archivo» sigue casi ilegible sobre la foto clara; las unidades «HZ» de las esferas claras (`528`, `396`, `174`) se pierden en los tramos pálidos de la portada. Ambos son contraste insuficiente, no bug de tokens: requieren velo local más denso o foto propia.
- `store`, Tienda 1440: sin franja gris. Banda de ritual con la foto oscura arriba y degradado claro abajo; el kicker «Acompañado con una frecuencia» es legible pero débil.
- Descúbrete con resultado a 390 px: no capturado (el flujo del quiz no se recorrió en la ronda).
- Móvil 768 y 390: capturas hechas, no revisadas a fondo en esta ronda.

Capturas: `docs/superpowers/audits/assets/ambientes-muestras/` (las de `dusk`/`night`/`inicio` incluidas); `medicion.json` con desborde 0 px en todas.


## Ronda 2 (2026-10-17)

- Banners con foto en esquema claro: velo claro que funde a los bordes (`.fm-banner-veil`, sólo bajo `data-scheme='light'`). Resonario `dawn`: el kicker «Dentro del archivo» se lee y la franja oscura de los bordes desaparece. Banda de ritual de Tienda: sin franja, el enlace se lee; el kicker «Materia para tu práctica» sigue débil (dorado sobre velo claro): **abierto**.
- Cifras de las esferas en claro: halo de tinta bajo marfil (`.fm-disc-num`, `.fm-disc-unit`). Las cifras se leen; las unidades «HZ» sobre las portadas más pálidas siguen débiles: **abierto**.
- Noche sin cambios: la diferencia entre la captura anterior y la nueva de `/resonario` (noche) tiene la misma magnitud que la diferencia entre dos capturas del mismo build (media 0,047/255; máx. 72 por el campo de estrellas). Verificado.
- Capturas re-hechas: `resonario` `dawn` y `night` a 1440 y 390; Tienda a 1440 y 390. Las demás escenas son de la ronda anterior.
- Peso: capturas convertidas a WebP (q80, ancho original). Total 3,3 MB; los PNG se han retirado del árbol. Las capturas nuevas no deben ser PNG.
- Descúbrete con resultado a 390 px: sigue sin capturar.
