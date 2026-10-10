# Refactor de armonía de imágenes — diseño

| Campo | Valor |
|---|---|
| Fecha | 2026-10-10 |
| Rama | `feat/state-views` (el refactor parte de aquí) |
| Origen | [`docs/superpowers/audits/2026-10-10-image-harmony-audit.md`](../audits/2026-10-10-image-harmony-audit.md) |
| Criterio | [`DESIGN.md`](../../../DESIGN.md) y el contrato de slots (`frontend/src/config/editorial-media.ts`) |
| Estado | Aprobado (2026-10-10). Secciones 1 y 2 aprobadas una a una; de la 3 a la 5, delegadas al autor; las decisiones abiertas 1–3 entran en el alcance. |

## 1. Objetivo y criterio de éxito

Que la fotografía se lea como **una sola materia continua** sobre el world engine, en todas las vistas y en 1440 / 1280 / 768 / 390. En concreto:

1. **Sin aristas.** Ninguna banda a sangre termina en una línea horizontal dura. Las bandas consecutivas se encuentran en una línea de noche, sin hueco.
2. **Sin blandura evitable.** Con las fuentes actuales (1672 px), ninguna imagen a viewport supera **1,9×** de ampliación a DPR 2 en ningún breakpoint, y ninguna caja anclada supera **1,3×**. La imagen se comprime **una sola vez**, desde el original.
3. **Sin cortes de sujeto.** Cada slot se pinta con el ratio de su contrato, salvo las dos excepciones documentadas (`viewport` y `backdrop`), y el sujeto que fija el brief cae dentro de la ventana visible en los cuatro breakpoints.
4. **Un solo eje.** Ninguna vista tiene dos aristas izquierdas de contenido; ninguna columna pierde el margen de página.

Se verifica re-ejecutando la medición de la auditoría (sección 9).

## 2. Lo que no cambia

- Los ratios, los focos (`position`), las prioridades y los `fallback` de los 47 slots.
- La paleta cerrada, los radios, el scrim único (`EditorialOverlay` sigue siendo el único degradado de legibilidad) y la escala `z-*`.
- Los nueve realms conservan su composición propia: el refactor ajusta cómo se asienta la imagen, no la plantilla de cada vista.
- La identidad de las tarjetas (`rounded-card`, cristal astral). Las tarjetas con foto dentro (`academy.featured-course`, `sanctuary.continue`, marco de reserva) se quedan como están (P2-1 de la auditoría, sin cambio).

## 3. Cambios en el contrato de slots (explícitos)

Dos **adiciones** opcionales a `EditorialMediaDefinition`. Ninguna altera un ratio ni un foco existente.

| Campo | Tipo | Quién lo usa | Por qué |
|---|---|---|---|
| `mobilePosition` | `string` (opcional) | `home.hero` → `75% 40%` | En 390 la figura (62–88 % del ancho) cae fuera de la ventana 0,46–0,72. El foco de escritorio sigue siendo `62% 40%`. |
| `backdrop` | `true` (opcional) | `discover.question-atmosphere` | Atmósfera 3:4 de bajo contraste usada como fondo a pantalla completa. Es la única excepción a «cada slot con su ratio»; el brief ya la pide «nada nítido», así que la ampliación no se percibe. |

Las dos se reflejan en el brief (`Branding/src/data/photography.js` → `docs/brief-fotografico.md`), en el inventario (`frontend/public/editorial/README.md`) y en `tests/lib/photography-brief.test.ts`.

## 4. Bordes y encadenado (aprobado)

**Máscara, no degradado.** Dos utilidades nuevas en `tokens.css`, `fm-fade-top` y `fm-fade-bottom`, aplican `mask-image` (con su prefijo `-webkit-`) a la **capa de materia** de `EditorialImage` (foto, zebra o banda), nunca al contenido. La imagen se disuelve en lo que haya detrás, sin desajuste de tono. La altura del fundido es un token nuevo, `--fade-band: clamp(56px, 8vw, 112px)` (el mismo valor que `section`, para que un fundido ocupe un peldaño de ritmo).

**Toda banda a sangre funde sus dos bordes por defecto.** `FullBleedSection` y `EditorialBanner` ganan `fade?: 'both' | 'top' | 'bottom' | 'none'` (por defecto `'both'`). `RealmHero`, el 404, el portal y los estados usan `'bottom'`: su borde superior está bajo el header.

**`BandChain` (UI Kit, `components/ui/band-chain.tsx`).** Es un contenedor sin hueco interno. Por contexto, cada banda hija sabe si tiene vecina arriba o abajo y funde ese borde hasta encontrarse con ella en la noche, sin solaparse. Fuera de una cadena, el contenedor de la vista sigue separando con `section`.

| Vista | Cadena |
|---|---|
| Inicio | héroe → frecuencia del día → banner de realms |
| Inicio | membresía → banner del footer (`intoFooter`) |
| Resonario | héroe → banner del archivo |
| Experiencias | héroe → destacada |
| Acceso (<1024) | héroe → atmósfera del formulario (elimina la línea de 1 px) |

En Sobre Marisol no hay cadena: el retrato separa el héroe de los ángeles, así que esas bandas no son consecutivas y basta con que fundan sus bordes.

**La única excepción implícita.** El banner del footer vive en `RealmFooter`, dentro del layout. `BandChain intoFooter` escribe `data-band-chain="footer"`, y el footer anula su hueco superior con `main:has([data-band-chain="footer"])`. Es el único `:has()` del proyecto; un test lo vigila.

**Portal.** `portal.portal-field` sustituye su rectángulo `inset-x-[16%]` por una máscara radial (`fm-fade-radial`): sigue siendo un campo de luz alrededor del aro, sin aristas.

**`DESIGN.md`, enmienda en *Layout*:** «Las bandas a sangre consecutivas se encadenan dentro de `BandChain`, sin hueco, y se encuentran en una línea de noche; fuera de una cadena, `section`. Toda banda funde sus bordes con máscara, nunca con un degradado de color».

## 5. Cajas con el ratio del slot (aprobado)

**`mode="anchored"` en `FullBleedSection`.** La imagen se pinta con el ratio de `media.aspect` (`aspect-ratio`), anclada arriba y a todo el ancho de la sección, y funde su borde inferior. El contenido sigue sobre la noche. Lo usan:

| Slot | Hoy (390) | Después (390) |
|---|---|---|
| `discover.result` | 390×2047, ventana 0,45–0,55, 8,8× | 390×219, entera |
| `home.daily-frequency` | 390×1318, 0,42–0,58, 5,7× | 390×195 (16:8) |
| `booking.hero` | 342×1330, 0,43–0,57, 5,7× | 342×192 |

En escritorio una caja anclada 16:9 a 1440 mide 810 px: cubre casi todo el primer viewport y la vista apenas cambia.

**Foco por breakpoint.** `EditorialImage` pasa el foco como variables CSS (`--fm-pos`, y `--fm-pos-mobile` si existe), con `object-position: var(--fm-pos-mobile, var(--fm-pos))` por debajo de 768 px y `var(--fm-pos)` desde 768 px.

**Casos concretos:**
- **`discover.question-atmosphere`:** sigue de fondo completo (`backdrop: true`).
- **`sanctuary.journal` en móvil:** pasa de 2:1 a su 3:4.
- **`sanctuary.daily` en móvil:** su caja deja de estirarse a 340×766 y queda 1:1.
- **Producto destacado:** en escritorio se compone en columnas, imagen 1:1 + texto. La tienda deja de resolverlo con `aspect: '16:8'`.
- **Tarjetas de producto:** `aspect-square` en todos los anchos (hoy van de 0,61 a 2,23).
- **`experiences-visual` en las filas de experiencia:** la columna de imagen fija `aspect-[16/9]` desde 768 px (hoy 2,45:1 en 1440), así `e2…e4` llegan sin recorte.
- **`EmptyState` gana `fill`** (ocupa el alto del padre en lugar de imponer `min-h`). El diario lo usa: corrige la regresión P1-9 (columna de 1102 px).

## 6. Pipeline de imagen

**Una sola compresión, desde el original.** El script `frontend/scripts/editorial-ingest.mjs` (npm script `editorial:ingest`) toma cada PNG de `frontend/.editorial-originals/` y escribe en `public/editorial/`:
- `<archivo>-<ancho>.avif` para cada ancho de `[640, 828, 1200, 1920, 2880]` que **no supere** el ancho de la fuente, más el ancho exacto de la fuente si queda por debajo de 2880 (hoy 1672 o 1774);
- AVIF con `quality: 72` y `effort: 6` (punto de partida; la tarea de verificación lo compara a 1:1 con el original y sólo sube si aparece banding);
- el manifiesto `editorial-assets.generated.ts`: `EDITORIAL_ASSETS` conserva su forma (`slot` → `/editorial/<archivo>.avif`, la variante mayor, para no romper a sus consumidores) y se añade `EDITORIAL_ASSET_WIDTHS` (`src` → anchos disponibles).

El script es idempotente y no toca `.editorial-trials/` ni `_to_delete/`. Los AVIF actuales sin sufijo se sustituyen por la variante mayor.

**Loader propio.** `next.config.ts` declara `images.loaderFile: './src/lib/editorial/image-loader.ts'`. El loader:
- para un `src` del manifiesto, devuelve la variante disponible más pequeña que sea ≥ al ancho pedido (o la mayor, si ninguna llega);
- para cualquier otro `src` (el logo), devuelve el `src` tal cual.

`next/image` sigue generando `srcset` y `sizes`, pero ya no re-codifica. El logo deja de pasar por el optimizador; es un PNG pequeño, y la tarea comprueba su peso.

**`sizes` derivado de la caja.** El helper puro `mediaSizes(mode, aspect)` (`lib/editorial/media-sizes.ts`):
- `viewport` → `(max-aspect-ratio: 16/9) calc(100svh * 16 / 9), 100vw` (para 16:9; en general, el ratio del slot);
- `anchored` y `banner` → `100vw`;
- las tarjetas conservan los `sizes` explícitos de su vista.

`FullBleedSection` lo usa cuando la vista no fija `sizes`. Con la fuente de 1672 px, un héroe a viewport en 390 pasa de 3,6× a ~1,8×.

**`sharp` declarado.** Pasa a `devDependencies` de `frontend/package.json`, con la misma versión que ya resuelve `next`.

**Fuentes de 2880 px (dentro del alcance).** Antes de ingerir, los 50 originales de `.editorial-originals/` se amplían a 2880 px de ancho (las verticales 3:4 y las cuadradas a su equivalente del brief) con super-resolución offline, fuera del repo. Las reglas:
- conservar la paleta;
- no inventar rasgos: ninguna cara, ninguna textura nueva en el cuerpo de luz;
- conservar el grano.

Cada imagen se revisa a 1:1 contra su original. Si una super-resolución altera el contenido, esa imagen se amplía con un reescalado clásico (Lanczos y un enfoque suave) o se queda en su tamaño, y se anota en `photography-status.js`. Los originales sin ampliar se conservan en `.editorial-originals/` (los ampliados, en una subcarpeta) para poder re-ingerir.

**Calidad AVIF calibrada (dentro del alcance).** Se compara q64 / q72 / q80 en tres imágenes representativas (degradado oscuro, grano con cuerpo de luz, objeto con detalle) a 1:1 y en pantalla a DPR 2. Se elige la menor calidad sin banding visible ni pérdida de grano, y se fija en el script con el porqué.

## 7. Eje y responsive

- **Carrito en 768 (P1-7):** la columna de líneas recupera `fm-container` y los nombres de producto dejan de truncarse (dos líneas, `line-clamp-2`).
- **Mi Santuario (P2-4):** el saludo del héroe y las tarjetas arrancan en la misma arista (el eje de página).
- **Acceso (P2-2):** en móvil, el héroe pasa a `anchored` 16:9 y se encadena con la atmósfera del formulario: desaparecen la tira de 230 px y la línea de 1 px.
- **Relacionados de producto (P2-3):** dos columnas desde 768 px y tres desde 1024 px (hoy son tres a 197 px).
- **Huecos fuera de escala (P2-5):** desaparecen con las cadenas de inicio y resonario. Un guardia prohíbe márgenes exteriores propios en las bandas.
- **`EditorialImage fill={false}` (P3-1):** se elimina la rama (nadie la usa).
- **Inventario (P3-3):** la columna «Estado» del README se reescribe a partir del manifiesto: publicado / pendiente y cableado / sin cablear.

## 8. Trabajo previo: `instance` en academia y tienda

Para que `c1…c3` y `p1…p8` se pinten en cuanto lleguen:
- **Academia:** el catálogo (`(catalogo)/page.tsx`) resuelve una portada por curso con `instance: course.id`, como ya hace el resonario con los audios. El detalle (`[courseId]/page.tsx`) pasa `instance: course.id`. `c1`, que es el destacado del catálogo, sigue con `academy.featured-course` en el catálogo y usa su portada en el detalle.
- **Tienda:** el catálogo, el detalle, los relacionados y el carrito pasan `instance: product.id` a `store-product-visual`.
- Los guardias `academy-editorial` y `store-editorial` exigen el `instance`.
- `PENDING_NOTES` de `photography-status.js` se vacía de esas notas: el trabajo que pedían ya estará hecho.

## 9. Pruebas y verificación

**Tests (sólo lógica y guardias de código fuente, en `frontend/tests/`):**
- `lib/editorial-image-loader.test.ts`: elección de variante (exacta, superior, techo, `src` ajeno).
- `lib/media-sizes.test.ts`: `sizes` por modo y ratio.
- `lib/band-chain.test.ts` (guardia): las cadenas de la tabla de la sección 4 existen en sus vistas; un solo `:has()` en el CSS; `FullBleedSection` y `EditorialBanner` no llevan márgenes exteriores.
- `lib/editorial-fade.test.ts` (guardia): `fm-fade-*` vive en `tokens.css`, con prefijo `-webkit-`, y ningún componente escribe su propio `mask-image`.
- `photography-brief`, `editorial-media`, `editorial-inventory` y `photography-status`: se actualizan a `mobilePosition`/`backdrop`, a las variantes y al nuevo estado, sin debilitarse.
- `academy-editorial` y `store-editorial`: exigen `instance`.

**Verificación visual:** se re-ejecuta la medición Playwright de la auditoría (fuera del repo) en los cuatro breakpoints, y el plan fija los umbrales de la sección 1 como criterio de aceptación:
- ampliación ≤ 1,9× a viewport y ≤ 1,3× anclada (con las fuentes ampliadas a 2880 px, el objetivo baja a ≤ 1,2× en escritorio);
- ventana de `home.hero` en 390 que contiene 0,62–0,88;
- cero costuras con hueco fuera de una cadena;
- aristas izquierdas en el eje.

Además, un recorte 1:1 del original frente a lo servido, en tres imágenes.

**Gate:** los cinco comandos de `AGENTS.md`, con el dev server parado, más `npm run build` de `Branding/`.

## 10. Decisiones abiertas

1. **Los 15 slots pendientes** (`e2…e4`, `p1…p8`, `c1…c3`, `academy.completion`) se verificarán al llegar. El refactor deja sus cajas con el ratio del contrato, pero `academy.completion` no se ha podido medir, porque hoy no pinta nada. Cuando lleguen, pasan por la misma ampliación e ingesta.

## 11. Fuera de alcance

- Generar o regenerar imágenes con IA (la ampliación de la sección 6 no es regenerar), y el service worker / PWA para el modo sin conexión.
- Rediseñar las tarjetas con foto (P2-1), el presupuesto de First Load JS y el contraste del texto sobre foto (sin medir en la auditoría; se recomienda una pasada aparte).
