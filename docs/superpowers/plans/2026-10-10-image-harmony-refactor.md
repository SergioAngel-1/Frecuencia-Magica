# Refactor de armonía de imágenes — plan de implementación

> **Para agentes:** sub-skill obligatoria: `superpowers:subagent-driven-development` (recomendada) o `superpowers:executing-plans`. Los pasos usan casillas (`- [ ]`). **Este plan no trae código literal a propósito** (preferencia del cliente). Cada tarea fija objetivo, límites, interfaces y criterios de aceptación; el cómo es criterio técnico del agente, siempre dentro del spec, `AGENTS.md`, `CLAUDE.md` y `DESIGN.md`. Si una tarea obliga a salirse de ellos, **para y pregunta**: no lo resuelvas por tu cuenta.

**Objetivo:** que la fotografía se lea como una sola materia continua sobre el world engine: sin aristas entre bandas, sin blandura evitable y sin cortes de sujeto, con un solo eje de página.

**Arquitectura:**
- Las bandas a sangre funden sus bordes con una máscara (`fm-fade-*`) y se encadenan sin hueco dentro de `BandChain`.
- Las cajas con contenido variable pintan la imagen con el ratio del slot (`mode="anchored"`).
- Las imágenes se comprimen una sola vez, desde originales ampliados a 2880 px, en variantes por ancho que sirve un `loaderFile` de `next/image`, con `sizes` derivado del modo de la caja.

**Stack:** Next.js 15 App Router · React 19 · TypeScript strict · Tailwind CSS v4 · next-intl · Vitest · `sharp` (devDependency) · Playwright fuera del repo para la verificación.

**Spec:** [`docs/superpowers/specs/2026-10-10-image-harmony-refactor-design.md`](../specs/2026-10-10-image-harmony-refactor-design.md). Origen: [`docs/superpowers/audits/2026-10-10-image-harmony-audit.md`](../audits/2026-10-10-image-harmony-audit.md). Lee los dos antes de empezar cualquier tarea.

## Restricciones globales

- Rama: `feat/state-views`. Un commit por tarea (o por cada cambio que se pueda revisar por separado), con Conventional Commits en inglés y terminando en `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`. No empujar.
- Comandos desde `frontend/` (la raíz no tiene `package.json`). Shell `fish`: las rutas con `[locale]` van entre comillas y, en git, con `:(literal)`.
- `next build` comparte `.next` con el dev server del puerto 3000: nunca lanzar el build mientras se mide; para el gate, parar el dev server antes y reiniciarlo después.
- Contrato de slots: **ningún** ratio, foco (`position`), prioridad ni `fallback` cambia. Sólo se añaden `mobilePosition` (`home.hero` → `75% 40%`) y `backdrop: true` (`discover.question-atmosphere`).
- `DESIGN.md`: un solo eje (`--page-inset` + `fm-container`); bandas a sangre o dentro del eje, nunca a medias; ritmo `section`/`block`, con la excepción de `BandChain` que añade la Tarea 4; scrim único en `EditorialOverlay`; paleta cerrada; escala `z-*` con nombre; nada de `text-[Npx]` por debajo de 16 px ni `tracking-[…]`; `prefers-reduced-motion`; «nada sale de golpe».
- Tres capas sin saltárselas: `components/ui` es puro (no importa de `data/`, `stores/` ni `i18n/`); Server Components por defecto; copy en ES y EN; `Link` de `@/i18n/navigation`; `ButtonLink` en servidor; un componente por archivo.
- Tests sólo de lógica y guardias de código fuente, en `frontend/tests/`. Los guardias existentes se actualizan al nuevo contrato **sin debilitarlos**.
- No tocar `_to_delete/` ni `.editorial-trials/`. `.editorial-originals/` sólo se toca en las Tareas 11 y 12, y nunca se borra un original.
- Si cambia una primitiva de `components/ui`, se actualiza su puerto en `Branding/src/components/ui/` y se comprueba `npm run build` de `Branding/`.
- Gate de cada tarea que toque código: `npm run format:check && npm run lint && npm run typecheck && npm run test`. El `build` completo, en la Tarea 15.

## Mapa de archivos

| Archivo | Responsabilidad | Tareas |
|---|---|---|
| `frontend/src/config/editorial-media.ts` | Contrato: `mobilePosition`, `backdrop` | 2 |
| `frontend/src/app/tokens.css` | `fm-fade-top`, `fm-fade-bottom`, `fm-fade-radial`, `--fade-band` | 3 |
| `frontend/src/components/ui/editorial-image.tsx` | Máscara de la materia, foco por variables, sin la rama `fill={false}` | 3 |
| `frontend/src/lib/editorial/media-sizes.ts` (nuevo) | `mediaSizes(mode, aspect)` | 3 |
| `frontend/src/components/ui/full-bleed-section.tsx`, `editorial-banner.tsx` | `fade`, `mode="anchored"`, `sizes` derivado | 3 |
| `frontend/src/components/ui/band-chain.tsx` (nuevo) | Cadena de bandas sin hueco | 4 |
| `frontend/src/components/layout/realm-footer.tsx` | Hueco anulado tras `intoFooter` | 4 |
| Vistas de inicio, resonario, experiencias, acceso, portal, descúbrete y reserva | Cadenas, anclajes, panel del portal | 5, 6 |
| `frontend/src/components/ui/empty-state.tsx`, vistas de santuario, tienda y experiencias | Ratios de slot, `fill` | 7, 8 |
| Carrito, santuario, relacionados | Eje y responsive | 9 |
| `frontend/scripts/editorial-ingest.mjs` (nuevo), `frontend/package.json` | Ingesta de variantes, `sharp` | 12 |
| `frontend/src/config/editorial-assets.generated.ts` | `EDITORIAL_ASSETS` + `EDITORIAL_ASSET_WIDTHS` | 12 |
| `frontend/src/lib/editorial/image-loader.ts` (nuevo), `frontend/next.config.ts` | Loader de variantes | 13 |
| `Branding/src/data/photography*.js`, `docs/brief-fotografico.md`, `frontend/public/editorial/README.md` | Brief, estado e inventario | 2, 11, 14 |
| `DESIGN.md`, `frontend/docs/performance.md` | Enmiendas y presupuesto de imagen | 4, 13, 15 |

---

### Tarea 1: Trabajo previo — `instance` en academia y tienda

**Archivos:** las páginas del catálogo y del detalle de academia (`app/[locale]/academia/(catalogo)/page.tsx`, `academia/[courseId]/page.tsx`), las de tienda (`tienda/(catalogo)/page.tsx`, `tienda/[productId]/page.tsx`), `components/features/store/cart-view.tsx`, el componente de relacionados de tienda, `tests/lib/academy-editorial.test.ts`, `tests/lib/store-editorial.test.ts` y `Branding/src/data/photography-status.js`.

**Interfaces:**
- Consume: `resolveEditorialMedia(slot, { instance })` (ya existe; el resonario es el patrón a imitar).
- Produce: una media resuelta por curso y por producto, sin cambiar la forma de los props que reciben los componentes de cliente.

- [x] Ampliar los guardias de academia y tienda para exigir `instance` en cada resolución de `academy-course-cover` y `store-product-visual`. Ejecutarlos y comprobar que **fallan**.
- [x] Academia: el catálogo resuelve una portada por curso (`instance: course.id`); `c1` sigue usando `academy.featured-course` como destacado. El detalle pasa `instance: course.id`.
- [x] Tienda: el catálogo, el detalle, los relacionados y el carrito resuelven `store-product-visual` con `instance: product.id`.
- [x] Vaciar en `PENDING_NOTES` las notas sobre `instance`, porque el trabajo que pedían ya está hecho. Regenerar el brief (`npm run export:photo-brief` desde `Branding/`).
- [x] Verificar: guardias en verde y gate de la tarea. Hoy nada cambia en pantalla, porque esos slots siguen sin imagen y pintan su banda: compruébalo en `/academia` y `/tienda`.
- [x] Commit: `refactor(editorial): resolve course and product media per instance`.

**Aceptación:** al publicar en el manifiesto una clave `academy-course-cover:c2` o `store-product-visual:p3`, la imagen aparece sin tocar ninguna vista. Pruébalo temporalmente con una imagen existente y **revierte** la prueba.

### Tarea 2: Contrato — `mobilePosition` y `backdrop`

**Archivos:** `src/config/editorial-media.ts`, `src/types/editorial-media.ts`, `src/lib/editorial/asset-registry.ts`, `Branding/src/data/photography.js`, `Branding/src/data/photography-brief.js`, `docs/brief-fotografico.md` (generado), `frontend/public/editorial/README.md`, `tests/lib/photography-brief.test.ts` y `tests/lib/editorial-media.test.ts`.

**Interfaces:**
- Produce: `EditorialMediaDefinition.mobilePosition?: string`, `EditorialMediaDefinition.backdrop?: true`, y `EditorialMedia.mobilePosition?: string` (lo propaga `resolveEditorialMedia`; la vista puede sobrescribirlo como el resto de campos).

- [x] Tests primero:
  - el brief declara el mismo `mobilePosition` y `backdrop` que el contrato;
  - sólo `home.hero` lleva `mobilePosition`;
  - sólo `discover.question-atmosphere` lleva `backdrop`;
  - `resolveEditorialMedia` propaga `mobilePosition`.
- [x] Añadir los campos al contrato y a los tipos, y propagarlos en el resolvedor.
- [x] Reflejarlos en el brief (dato y render del Markdown) y en el inventario. Regenerar el brief y los prompts.
- [x] Gate de la tarea y commit: `feat(editorial): add mobile focal point and backdrop to the slot contract`.

**Aceptación:** ningún otro campo del contrato cambia (compruébalo con `git diff`), y el brief generado muestra los dos campos.

### Tarea 3: Primitivas de imagen — máscara, foco por breakpoint, `anchored` y `sizes`

**Archivos:** `src/app/tokens.css`, `src/lib/cn.ts` (si el token nuevo es una escala), `src/components/ui/editorial-image.tsx`, `full-bleed-section.tsx`, `editorial-banner.tsx`, `src/lib/editorial/media-layout.ts` (si hace falta), el nuevo `src/lib/editorial/media-sizes.ts`, los tests `tests/lib/media-sizes.test.ts` y `tests/lib/editorial-fade.test.ts`, y los puertos de `Branding/`.

**Interfaces:**
- Consume: `EditorialMedia.mobilePosition` (Tarea 2).
- Produce:
  - las utilidades `fm-fade-top`, `fm-fade-bottom` y `fm-fade-radial`, y el token `--fade-band`;
  - `type EditorialFade = 'both' | 'top' | 'bottom' | 'none'`;
  - `EditorialImage` con `fade?: EditorialFade` (máscara sólo sobre la capa de materia; nunca sobre el scrim ni el contenido);
  - `FullBleedSection` con `fade?: EditorialFade` (por defecto `'both'`) y `mode: … | 'anchored'`;
  - `EditorialBanner` con `fade?: EditorialFade`;
  - `mediaSizes(mode: EditorialMediaMode, aspect: EditorialMediaAspect): string`.

- [x] Tests primero:
  - `mediaSizes`: para `viewport` 16:9 incluye el término por alto (`100svh` × ratio) con `max-aspect-ratio`; para `anchored` y `banner` devuelve `100vw`;
  - guardia de máscaras: las utilidades viven en `tokens.css` con prefijo `-webkit-`, y ningún componente escribe su propio `mask-image`;
  - guardia de que la rama `fill={false}` ya no existe.
- [x] Implementar las utilidades y el token en `tokens.css` (no en `globals.css`). Valor del spec: `--fade-band` igual a `section`.
- [x] `EditorialImage`:
  - aplicar `fade` a la materia;
  - pasar el foco como `--fm-pos` / `--fm-pos-mobile`, con el móvil sólo por debajo de 768 px;
  - eliminar la rama `fill={false}` y su prop.
- [x] `FullBleedSection`:
  - `fade` por defecto `'both'`;
  - `mode="anchored"`: la imagen con `aspect-ratio` del slot, anclada arriba y a todo el ancho, con fundido inferior siempre;
  - si la vista no fija `sizes`, usar `mediaSizes`.
- [x] `EditorialBanner`: `fade` por defecto `'both'`.
- [x] Todas las bandas que rozan el header (`RealmHero`, 404, portal, estados, el velo sin conexión) pasan a `fade="bottom"`.
- [x] Puertos de `Branding/`: `EditorialBanner` con `fade`; si hay showcase de bandas, mostrar el fundido. Comprobar el `build` de `Branding/`.
- [x] Verificar a ojo en el dev server (1440 y 390): el inicio y el resonario ya no tienen arista inferior en los héroes; el hueco `section` sigue existiendo (se elimina en la Tarea 5).
- [x] Gate de la tarea y commit (uno o dos, a criterio): `feat(ui): fade full-bleed media edges with a mask and size boxes by slot`.

**Aceptación:**
- con `prefers-reduced-motion` nada cambia, porque la máscara es estática;
- ningún texto pierde contraste, porque el scrim sigue igual;
- `EditorialImage` sigue sin importar de `data/`, `stores/` ni `i18n/`.

### Tarea 4: `BandChain` y la excepción del footer

**Archivos:** el nuevo `src/components/ui/band-chain.tsx`, `src/components/ui/index.ts`, `full-bleed-section.tsx` y `editorial-banner.tsx` (para leer su posición en la cadena), `src/components/layout/realm-footer.tsx`, `src/app/globals.css` o `tokens.css` (el `:has()`, donde encaje con las reglas del proyecto), `tests/lib/band-chain.test.ts`, `DESIGN.md` y, si se muestra, el puerto en `Branding/`.

**Interfaces:**
- Consume: `fade` de la Tarea 3.
- Produce: `BandChain` con `children` e `intoFooter?: boolean`. Las bandas hijas funden el borde que comparten con su vecina, sin solaparse, y se encuentran en una línea de noche. Con `intoFooter`, la cadena escribe `data-band-chain="footer"` y el footer anula su hueco superior. El mecanismo de contexto (contexto de React, atributos de datos o CSS) es decisión del agente, siempre que **siga siendo compatible con Server Components** (`BandChain` no debe obligar a convertir las bandas en cliente).

- [x] Guardia primero:
  - existe un solo `:has(` en el CSS del proyecto;
  - `FullBleedSection` y `EditorialBanner` no llevan márgenes exteriores propios;
  - `BandChain` no importa de `data/`, `stores/` ni `i18n/`.

  Las cadenas por vista se exigen en la Tarea 5.
- [x] Implementar `BandChain` y la lectura de posición en las bandas.
- [x] `RealmFooter`: anular el hueco superior del banner del footer sólo bajo `data-band-chain="footer"`.
- [x] `DESIGN.md`, *Layout*: la enmienda literal del spec, sección 4 («Las bandas a sangre consecutivas se encadenan…»). En *Editorial media*: el fundido por máscara y `BandChain`.
- [x] Gate de la tarea y commit: `feat(ui): chain consecutive full-bleed bands without a gap`.

**Aceptación:** una cadena de prueba (en `/kit`, que está cerrado en producción) muestra dos bandas que se tocan sin arista ni hueco, en 1440 y en 390.

### Tarea 5: Cadenas en las vistas

**Archivos:** las vistas de inicio (héroe, frecuencia del día, banner de realms, membresía), resonario (héroe y banner del archivo), experiencias (héroe y destacada), acceso (héroe y atmósfera del formulario, por debajo de 1024 px) y `tests/lib/band-chain.test.ts`.

**Interfaces:**
- Consume: `BandChain` (Tarea 4) y `mode="anchored"` (Tarea 3).

- [x] Ampliar el guardia: cada cadena de la tabla del spec (sección 4) existe en su vista; la de membresía lleva `intoFooter`. Comprobar que falla.
- [x] Envolver cada cadena. La frecuencia del día pasa a `mode="anchored"` (16:8), dentro de su cadena. Respetar el orden y la semántica (landmarks, encabezados) de cada sección.
- [x] Acceso: por debajo de 1024 px, el héroe pasa a `anchored` 16:9 y se encadena con la atmósfera; desaparece la línea de 1 px. Desde 1024 px no cambia la composición partida.
- [x] Sobre Marisol: sin cadena; sólo comprobar que sus bandas funden ambos bordes.
- [x] Verificar a ojo en 1440, 768 y 390: ninguna arista ni franja de fondo entre bandas encadenadas, y el hueco de membresía→footer igual a cero.
- [x] Gate de la tarea y commit: `feat(editorial): chain the full-bleed bands of home, resonario, experiences and access`.

**Aceptación:** la medición de costuras de la auditoría da hueco 0 en todas las cadenas, y ningún otro hueco entre bandas fuera de `section`.

### Tarea 6: Cajas ancladas y panel del portal

**Archivos:** la vista de resultado de Descúbrete (dueña de `discover.result`), la de reserva (`booking.hero`), `components/features/portal/portal-scene.tsx` y el guardia de la vista correspondiente (`discover-editorial`, `experiences-editorial`, `portal-editorial`).

- [x] Guardias primero: `discover.result` y `booking.hero` se pintan en modo anclado; el panel del portal no usa `inset-x-` y lleva la máscara radial.
- [x] `discover.result` y `booking.hero` pasan a `anchored`: la imagen arriba con su ratio, y el contenido sobre la noche. En la reserva, decide si el anclaje va en la tarjeta o en la sección, sin tarjetas anidadas (*Cards*).
- [x] `portal.portal-field` sustituye el rectángulo por `fm-fade-radial` y conserva la intención: campo de luz alrededor del aro, `aria-hidden`, baja opacidad.
- [x] `discover.question-atmosphere` no se toca (`backdrop`). Comprobar que el guardia lo reconoce como excepción.
- [x] Verificar en 1440 y 390, con el quiz completo: intro → preguntas → sintonía → resultado. La sintonía se ve **sin** movimiento reducido (con él, el quiz la salta).
- [x] Gate de la tarea y commit: `feat(editorial): anchor tall media at its slot ratio and soften the portal field`.

**Aceptación:**
- `discover.result` en 390: caja ≈ 390×219 con la imagen entera (antes 390×2047);
- `booking.hero` en 390: ≈ 342×192;
- el portal no muestra aristas verticales.

### Tarea 7: Ratios de slot en santuario y vacíos

**Archivos:** `src/components/ui/empty-state.tsx` (+ el puerto de `Branding/`), `components/features/sanctuary/journal-empty.tsx`, `journal-panel.tsx`, `daily-card.tsx` y `tests/lib/sanctuary-editorial.test.ts`.

**Interfaces:**
- Produce: `EmptyState` con `fill?: boolean`. Con `media` y `fill`, el marco ocupa el alto de su padre y no impone `min-h`.

- [x] Guardias primero:
  - el diario usa `fill`;
  - en móvil, `sanctuary.journal` se pinta a 3:4 (no a `16/8`);
  - en móvil, `sanctuary.daily` no se estira por encima de su 1:1.
- [x] `EmptyState fill` y su uso en el diario. Así se corrige la regresión P1-9 de la Parte 1.
- [x] En móvil, el diario a su 3:4 y la tarjeta diaria a su 1:1, conservando el orden de lectura de la vista.
- [x] Verificar en 1440 (diario vacío y con datos; se siembra `fm.journal` en `localStorage`) y en 390.
- [x] Gate de la tarea y commit: `fix(sanctuary): keep the journal and daily media at their slot ratio`.

**Aceptación:**
- en 1440, la columna de `sanctuary.journal` vacía mide lo mismo (±10 %) que con datos (≈574 px);
- en 390, el diario a 3:4 sin cortar el cuaderno.

### Tarea 8: Ratios de slot en tienda y experiencias

**Archivos:** `components/features/store/product-card.tsx`, la página del catálogo de tienda (quitar el `aspect: '16:8'` del destacado), el componente de relacionados, `components/features/experiences/experience-row.tsx`, y los guardias `store-editorial` y `experiences-editorial`.

- [x] Guardias primero:
  - ninguna resolución de `store-product-visual` lleva `aspect` distinto de `1:1`;
  - las tarjetas de producto usan `aspect-square`;
  - la columna de imagen de la fila de experiencia fija 16:9 desde `md`.
- [x] Destacado de tienda: en escritorio, imagen 1:1 + texto en columnas; en móvil, apilado. Conserva el badge «Destacado», la acción de añadir separada del enlace y los hit targets de 44 px.
- [x] Tarjetas de producto a 1:1 en todos los anchos.
- [x] Fila de experiencia: imagen 16:9 desde 768 px, sin perder la composición de fila del realm.
- [x] Verificar en los cuatro breakpoints. Hoy pintan banda, porque faltan `p1…p8` y `e2…e4`: verifica la caja, no la foto.
- [x] Gate de la tarea y commit: `feat(store): paint product and experience media at their slot ratio`.

**Aceptación:** la proporción medida de todas las cajas de `store-product-visual` es 1,00 ± 0,02, y la de `experiences-visual` desde 768 px es 1,78 ± 0,03.

### Tarea 9: Eje y responsive

**Archivos:** `components/features/store/cart-view.tsx` (o su contenedor), la cabecera y las tarjetas de mi-santuario, el componente de relacionados de producto y, si los hay, los guardias afectados.

- [x] Carrito en 768: la columna recupera el eje (`fm-container` o el `PageShell` correcto) y los nombres de producto pasan a dos líneas con `line-clamp-2`, sin truncar a una palabra.
- [x] Mi Santuario: el saludo del héroe y las tarjetas comparten la arista izquierda del eje.
- [x] Relacionados: dos columnas desde 768 px y tres desde 1024 px.
- [x] Verificar con la medición de aristas de la auditoría: ninguna arista de contenido fuera del eje dentro de una misma vista (los títulos dentro de tarjetas son la excepción esperada).
- [x] Gate de la tarea y commit: `fix(layout): restore the page axis in cart and sanctuary`.

### Tarea 10: `sharp` como devDependency

**Archivos:** `frontend/package.json` y `frontend/package-lock.json`.

- [x] Declarar `sharp` en `devDependencies`, con la versión que ya resuelve `next` (`npm ls sharp`), para no duplicarlo.
- [x] Verificar que `npm ci` sigue limpio y que el gate pasa.
- [x] Commit: `build(frontend): declare sharp for the editorial ingest`.

### Tarea 11: Ampliar los originales a 2880 px — fuera del repo, con revisión

> **Descartada por el cliente (2026-10-10).** Se probó Real-ESRGAN x4plus con transferencia del grano del original, pero el cliente la descartó tras validar el frontend en pantalla grande: con los fundidos y el aura de la página, las fuentes actuales se ven bien. La ingesta usa los originales a su tamaño (1672, 1774, 1086 y 1254 px). Si más adelante se quiere la nitidez del máster, la vía preferida es regenerar la imagen a su medida desde el brief, no ampliarla. Ninguna casilla de esta tarea se ejecuta.

**Archivos:** `frontend/.editorial-originals/` (ignorada por git) y `Branding/src/data/photography-status.js` (notas). Herramientas y scripts **fuera del repo**, en el scratchpad de la sesión.

- [ ] Elegir y probar una herramienta de super-resolución offline (por ejemplo, Real-ESRGAN ncnn), instalada fuera del repo.
- [ ] Ampliar los 50 originales al tamaño «generar a» del brief: 2880 de ancho en 16:9 y 16:8, y su equivalente en 1:1 y 3:4 según el preset. Guardar los ampliados en una subcarpeta de `.editorial-originals/`; **nunca** sobrescribir un original.
- [ ] Revisar cada imagen a 1:1 contra su original:
  - paleta conservada;
  - ningún rasgo inventado: ninguna cara (salvo el retrato real de Marisol, que **no** se amplía con modelos generativos) y ninguna textura nueva en el cuerpo de luz;
  - grano conservado.
- [ ] Lo que falle se amplía con Lanczos y un enfoque suave, o se queda en su tamaño. Anotar cada caso en `photography-status.js` (sin cambiar su estado) y regenerar el brief.
- [ ] **Punto de control con el cliente:** antes de seguir, presentar una hoja de contacto con las 50 (original | ampliada) y la lista de excepciones.
- [ ] Commit (sólo las notas): `docs(brief): record how each source was upscaled`.

**Aceptación:** 50 originales a 2880 px (o su excepción anotada) y el visto bueno del cliente a la hoja de contacto.

### Tarea 12: Ingesta de variantes y calibración AVIF

> **Hecha sin la Tarea 11:** ingiere los originales a su tamaño; calidad elegida q80 (el porqué, en el script).

**Archivos:** el nuevo `frontend/scripts/editorial-ingest.mjs`, `frontend/package.json` (script `editorial:ingest`), `frontend/public/editorial/*.avif`, `src/config/editorial-assets.generated.ts` y los tests `photography-status` y `editorial-media`.

**Interfaces:**
- Consume: los ampliados de la Tarea 11.
- Produce:
  - las variantes `public/editorial/<archivo>-<ancho>.avif`, de `[640, 828, 1200, 1920, 2880]`, acotadas al ancho de la fuente;
  - `<archivo>.avif` = la variante mayor;
  - el manifiesto: `EDITORIAL_ASSETS` con la misma forma y `EDITORIAL_ASSET_WIDTHS: Readonly<Record<string, readonly number[]>>`, indexado por el `src` de `EDITORIAL_ASSETS`.

- [x] **Calibración:** generar q64, q72 y q80 de tres imágenes (degradado oscuro: `home-footer-banner`; grano con cuerpo de luz: `home-hero`; objeto con detalle: `product-detail`) y compararlas a 1:1 y en pantalla a DPR 2. Elegir la menor calidad sin banding ni pérdida de grano, y dejar el porqué en un comentario del script.
- [x] Tests primero:
  - cada `src` de `EDITORIAL_ASSETS` tiene sus anchos en `EDITORIAL_ASSET_WIDTHS`, en orden creciente y sin superar la fuente;
  - cada variante declarada existe en disco.
- [x] Script idempotente: lee los ampliados, escribe las variantes y regenera el manifiesto en orden estable. No toca `.editorial-trials/` ni `_to_delete/`.
- [x] Ejecutarlo y revisar el peso total de `public/editorial/`, que se anota en `frontend/docs/performance.md`.
- [x] Actualizar `frontend/public/editorial/README.md` (cómo ingerir y columna «Estado» derivada del manifiesto, P3-3 de la auditoría) y `CLAUDE.md` / `AGENTS.md` si el flujo de ingesta lo exige.
- [x] Gate de la tarea y commit (scripts y manifiesto por un lado; imágenes por otro, si conviene revisarlos por separado): `feat(editorial): ingest width variants from upscaled originals`.

### Tarea 13: Loader de variantes

**Archivos:** el nuevo `src/lib/editorial/image-loader.ts`, `frontend/next.config.ts`, `tests/lib/editorial-image-loader.test.ts` y `frontend/docs/performance.md`.

**Interfaces:**
- Consume: `EDITORIAL_ASSET_WIDTHS` (Tarea 12).
- Produce: el loader por defecto que exige `images.loaderFile`. Para un `src` del manifiesto, devuelve la variante disponible más pequeña ≥ al ancho pedido (o la mayor, si ninguna llega). Para cualquier otro `src`, lo devuelve tal cual.

- [x] Tests primero: ancho exacto, ancho intermedio (redondea hacia arriba), ancho por encima del techo (la mayor), `src` ajeno (el logo) y `src` con query.
- [x] Implementar el loader y declararlo en `next.config.ts`.
- [x] Comprobar el logo: se sirve tal cual. Mide su peso; si supera lo razonable para el header (~30 KB), anótalo en `performance.md` como deuda en lugar de resolverlo aquí.
- [x] Verificar en el dev server que el `srcset` apunta a `/editorial/<archivo>-<ancho>.avif` y que ninguna petición va a `/_next/image`.
- [x] Gate de la tarea y commit: `feat(editorial): serve pre-built AVIF variants through a next/image loader`.

### Tarea 14: Brief, estado e inventario al día

**Archivos:** `Branding/src/data/photography.js`, `photography-status.js`, `docs/brief-fotografico.md`, `docs/prompts-chatgpt.md` (generados) y `frontend/public/editorial/README.md`.

- [x] Reflejar en el brief el flujo nuevo: ampliación, variantes, calidad elegida y que el brief ya no pide «convertir a AVIF a mano».
- [x] Regenerar `export:photo-brief` y `export:chatgpt-prompts`.
- [x] Gate de la tarea (incluidos `photography-brief`, `photography-status` y `editorial-inventory`) y `build` de `Branding/`.
- [x] Commit: `docs(brief): describe the upscale and variant ingest pipeline`.

### Tarea 15: Verificación final contra la auditoría

**Archivos:** ninguno de producción. Medición fuera del repo. Si hace falta, `docs/superpowers/audits/2026-10-10-image-harmony-audit.md` (sección «Estado tras el refactor») y `docs/superpowers/plans/sections-plan-completed.md`.

- [x] Re-ejecutar la medición Playwright de la auditoría (método en su sección 10: fuera del repo, `channel: 'chrome'`, DPR 2, `reducedMotion: 'reduce'`, recorrido de scroll y tope de espera de imágenes) en 1440, 1280, 768 y 390, sobre las mismas 27 vistas. Las vistas de carga y error necesitan rutas temporales bajo `/kit`, que se borran al terminar.
- [x] Comprobar los umbrales del spec (sección 9):
  - ampliación ≤ 1,2× en escritorio y ≤ 1,9× a viewport en móvil;
  - ≤ 1,3× en cajas ancladas;
  - ventana de `home.hero` en 390 que contiene 0,62–0,88;
  - hueco 0 dentro de las cadenas y ninguna costura fuera de ellas;
  - aristas en el eje;
  - sin desborde.
- [x] Recorte 1:1 de original frente a servido en tres imágenes: una sola compresión.
- [x] Gate completo, con el dev server parado: `npm run format:check && npm run lint && npm run typecheck && npm run test && npm run build`, y `npm run build` de `Branding/`. Reiniciar el dev server después.
- [x] Comprobar el 404 real con `next build` + `next start` en una ruta inexistente y en un id de curso o producto inválido.
- [x] Añadir a la auditoría una sección «Estado tras el refactor», con cada hallazgo en ✅ / ⚠️ / ⏳ y su medida nueva. Anotar lo que no se pudo verificar.
- [x] Commit: `docs(audit): record image harmony after the refactor`.

**Aceptación:** todos los P1 de la auditoría en ✅, o ⚠️ con causa explicada y decisión del cliente.

---

## Orden y dependencias

1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 forman la línea de layout. 10 → 11 → 12 → 13 → 14 forman la línea de pipeline: la 11 requiere el punto de control del cliente y puede ir en paralelo a la línea de layout desde la Tarea 2. La Tarea 15 cierra las dos.

## Fuera de este plan

- Generar con IA los 15 slots pendientes y regenerar imágenes.
- El service worker / PWA para el modo sin conexión.
- Rediseñar las tarjetas con foto (P2-1).
- El presupuesto de First Load JS.
- El contraste del texto sobre foto, que conviene medir en una pasada propia.
