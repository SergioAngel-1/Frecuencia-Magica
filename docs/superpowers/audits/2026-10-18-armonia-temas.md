# Auditoría de armonía entre temas (2026-10-18)

Método: las nueve vistas en los cinco temas (escritorio 1440 y móvil 390), por viewport y a distintas alturas de scroll, con los temas fijados desde `localStorage` (`fm.atmosphere`) y también en «Automático». Los hallazgos de código salen de leer cada vista; los visuales, de las capturas.

## Lo que se encontró y se arregló

| #   | Hallazgo                                                                                                                                                                                  | Arreglo                                                                                                                                                                                                              |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Los ocho estados de «¿Cómo llegas hoy?» sólo llevaban a `dawn` y `dusk` (y las intenciones, a `forest`). `night` y `moon` no eran alcanzables, y ningún lugar sugería `moon` ni `forest`. | `config/arrivals.ts` reparte los cinco temas entre los ocho estados; `config/atmospheres.ts` da a cada tema un lugar (Descúbrete y Santuario `moon`, Academia `forest`). Tests: ningún tema sin estado ni sin lugar. |
| 2   | Nadie veía a qué tema llevaba cada estado hasta elegirlo.                                                                                                                                 | Cada píldora lleva la muestra del tema que propone (`ThemeSwatch`, nuevo en el UI Kit).                                                                                                                              |
| 3   | El header tenía siete controles sueltos en tres formas (píldora, disco, texto), con glifos musicales (♪ 𝄽) como icono y una etiqueta de sección huérfana.                                 | Dos cápsulas de la misma altura (`ControlDock`): preferencias (idioma, sonido, tema) y atajos (tienda, cuenta, menú). Altavoz dibujado en SVG. La etiqueta de sección queda delante, como texto.                     |
| 4   | El selector de tema era una lista larga de cinco filas con muestras de 24 px.                                                                                                             | Panel de tarjetas con vista previa (fondo y tres luces de cada tema) y «Automático» con los cinco fondos en franjas; una línea describe el tema señalado.                                                            |
| 5   | Sólo la mitad de las tarjetas flotaban; la llegada de la Home, la tienda de la Home, el resonario, el santuario, el carrito y los paneles no.                                             | Todo contenedor suelto pasa por `Float`. `tests/lib/float-coverage.test.ts` lista las vistas y prohíbe la clase de animación a mano (los dos isotipos que la llevaban ya usan `Float`).                              |
| 6   | Bajo `dawn`, los fondos nocturnos con texto (tarjetas del santuario, campo del diario, confirmaciones) dejaban tinta oscura sobre foto oscura: «Frecuencia del día» no se leía.           | Primero, un lavado con filtro (`NIGHT_BACKDROP_SLOTS`); el 2026-10-19 se sustituyó por una variante de Amanecer propia para cada uno (ver abajo).                                                                    |

**Excepciones deliberadas a «todo flota»:** las bandas a sangre (no son contenedores), el resumen del pedido (`sticky`) y los formularios (acceso, reserva, pago, diario): se escribe dentro y no deben moverse. `Float` se detiene con el puntero o el foco dentro, pero un campo que se desplaza 7 px justo antes de teclear es mala experiencia.

## ¿Hay que generar más imágenes?

Sí, pero no todas, y no a ciegas. La política vigente (`THEME_VARIANTS`) es: héroes en los cuatro temas, bandas sólo en `dawn` (la noche funde bien con los oscuros). Con los temas ahora **en el camino por defecto**, hay dos huecos reales.

### Prioridad alta: lo que se ve sin que la persona toque nada

Un tema es incómodo con la foto nocturna cuando cambia de **tono** (el azul de la noche bajo el verde del bosque o el ciruela del atardecer). `moon` es azul nocturno: la foto base funde sola y no urge.

| Vista (tema por defecto)  | Slot                                                                                  | Falta                                           |
| ------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Academia (`forest`)       | `academy.featured-course`                                                             | `@forest` (la bandeja azul destaca en el verde) |
| Experiencias (`dusk`)     | `experiences.featured`                                                                | `@dusk`                                         |
| Experiencias (`dusk`)     | `booking.confirmation`                                                                | `@dusk` (hoy sólo noche)                        |
| Academia (`forest`)       | `academy.completion`                                                                  | `@forest`                                       |
| Home (con estado elegido) | `home.realms-banner`, `home.daily-frequency`, `home-membership`, `home.footer-banner` | `@dusk`, `@forest`                              |

### Prioridad media: sólo si la persona cambia de tema

Los otros ocho slots con variante en `dawn` (`about.angels`, `auth.form-atmosphere`, `discover.question-atmosphere`, `resonario.featured`, `resonario.archive-banner`, `store.ritual-banner`, …) en `dusk` y `forest`: 16 imágenes. En `moon`, ninguna es necesaria.

### Fondos que Amanecer lavaba con un filtro (2026-10-19)

El lavado (`opacity` baja y sepia sobre la foto nocturna) dejaba una neblina gris (carrito vacío), una franja oscura (la espera) o texto ilegible. Se reemplaza por una variante de Amanecer propia, la misma escena con luz de día: `states.loading`, `states.empty`, `states.error`, `states.offline`, `sanctuary.continue`, `sanctuary.daily`, `sanctuary.journal`, `sanctuary.empty`, `cart.empty`, `checkout.confirmation`, `discover.tuning`, `discover.result`, `booking.confirmation@dawn` y `academy.completion@dawn`: 14 imágenes, con su prompt en `docs/prompts-chatgpt.md`. Hasta que lleguen, el filtro sigue aplicándose (las variantes declaradas marcan el slot como temable). `not-found.hero` no entra: el 404 raíz está fuera del proveedor de tema y `ThemedPhoto` lo necesita.

### No se generan

Portadas de audio, de curso, visuales de experiencia y productos: son **contenido del ítem** y no cambian con el tema (contrato de `editorial-media.ts`). Sobre `dawn` se leen como piezas oscuras enmarcadas; es una decisión de marca (objetos bañados en la misma luz), no un fallo.

### Prompts listos

Los 26 prompts de las variantes que se piden (las 12 bandas en Atardecer y Bosque, más `booking.confirmation@dusk` y `academy.completion@forest`) ya están en `docs/prompts-chatgpt.md` («Mapa de variantes por tema»), escritos a partir del prompt aprobado de su hermana de Amanecer y de la base nocturna: misma escena, mismo encuadre, paleta de los héroes de su tema. Declaradas en `THEME_VARIANTS` (`BAND_THEMES`) y en `Branding/src/data/photography-themes.js`; hasta que lleguen las imágenes, el sitio muestra la base nocturna (que Amanecer lava). La cuenta de arriba (≈ 8 + 16) era una estimación a ojo: son 26 en total, 12 de prioridad alta según la tabla y 14 medias.

Al llegar cada PNG: `frontend/.editorial-originals/<archivo>-<tema>.png`, `photography-status.js`, `npm run editorial:ingest` y regenerar los tres documentos (`export:photo-brief`, `export:chatgpt-prompts`, `export:pending-materials`).

## Pendiente / decisiones abiertas

- **Estados → temas** son decisión del implementador (poética, no de producto): Marisol debería validarlos. Está en una sola tabla (`ARRIVALS`).
- **Tienda bajo `dawn`:** las fotos de producto son nocturnas por diseño; se ven como ventanas oscuras sobre crema. Si se prefiere fondo de estudio claro, sería una sesión fotográfica nueva.
- **Blanco sobre blanco no detectado** en las demás vistas; no se midió contraste automático de las capturas (lo cubren las guardas `atmosphere-contrast` y `hero-photo-contrast`).
- Sin revisar en dispositivo físico: el flotado de las nuevas tarjetas en móvil de gama media.
