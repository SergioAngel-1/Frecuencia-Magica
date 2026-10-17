# Muestras de ambiente (Fase 1, T1.5) — verificación

Fecha: 2026-10-17. Rama `feat/ambientes-v2`. Build de producción (`next build` + `next start -p 3101`), Playwright (Chromium) con movimiento reducido, sin ingestar imágenes nuevas.

## Qué se verificó

- Resonario bajo `dusk` (Descanso) y `dawn` (Calma de día), con la noche como control.
- Tienda (`/tienda`) y detalle de producto (`/tienda/p1`), bajo `store`.
- Bloque de Tienda en la Home (`/inicio`), entre el bento y la membresía.
- Anchos 1440, 1280, 768 y 390 px. Capturas de página completa en `docs/superpowers/audits/assets/ambientes-muestras/` (`<escena>-<ancho>.png`) y medición en `medicion.json` (mismo directorio).

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
