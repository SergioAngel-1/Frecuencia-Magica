# Auditoría de coherencia visual y conceptual — Frecuencia Mágica

| Campo | Valor |
|---|---|
| Fecha | 2026-09-30 |
| Rama | `feat/frontend-foundations` (base: `12e8c30`) |
| Alcance | Las 9 vistas + detalle de curso, lección, reserva, producto, carrito, 404 (15 rutas) en 1440 / 768 / 390 |
| Método | Skill [impeccable](https://github.com/pbakaus/impeccable) v4.4.0: `audit` (5 dimensiones técnicas) + lectura de diseño en un solo contexto. **No** se ejecutó el protocolo aislado de `/impeccable critique` (dos sub-agentes, snapshot, preguntas). |
| Evidencia | Código de `frontend/`, 45 capturas de página completa (15 rutas × 3 anchos) antes y después, medición de contraste sobre píxeles reales, medición de DOM (desborde, hit targets, consola), detector de impeccable, gate `lint + typecheck + test + build` |
| Resultado | Puntuación **12/20 → 15/20**. El concepto es coherente; lo que faltaba era *integración*: ejes, escalas, tokens y una veintena de defectos visibles. Los resueltos están abajo; los que requieren decisión de negocio, no. |

> Documento hermano: [`DESIGN.md`](../../../DESIGN.md) (raíz) fija los lineamientos que esta auditoría encontró implícitos o contradichos.

---

## 1. Veredicto

La dirección «fotografía como materia, world engine como energía» está bien elegida y bien ejecutada en lo que define la marca: paleta cerrada, serif ligera con sans fina, cristal astral, geometría sagrada, movimiento contenido. **El sitio se reconoce como un solo lugar.** El problema no era el concepto sino que las diez entregas editoriales sucesivas (`682212d` … `12e8c30`) añadieron capas sin un marco común, y eso produjo tres clases de incoherencia:

1. **Defectos que rompían vistas**: un CTA principal que no existía (Reservar), un sistema orbital ilegible, una navegación móvil truncada.
2. **Deriva de sistema**: 20 valores de tracking, 19 opacidades de texto, ~32 `clamp()` de titular para 6 escalones de `Display`, 25 anchos máximos, cuatro fórmulas de margen lateral.
3. **Contratos que se contradicen**: «nada gris» frente a un zebra que lee gris; «texto ≥15px» frente a kickers de 11px; «edge-to-edge» frente a bandas inset junto a bandas a sangre; docs que dicen «bento exacto» sobre un bento que no cerraba.

Esta pasada arregla los defectos, introduce los tokens y el eje que faltaban, y deja `DESIGN.md` como fuente única. Quedan cuatro decisiones que no son del código (sección 8).

## 2. La línea esperada y sus fuentes

Fuente de verdad, por orden: `AGENTS.md` → `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md` (contrato aprobado) → `frontend/src/app/globals.css` y `config/` (tokens) → `frontend/docs/{accessibility,performance,fidelity-checklist}.md`. El Brand Book y los PRDs de `~/Descargas/` **no están en el repo ni en este entorno**: lo visual se contrastó contra el sistema codificado, no contra el original.

**Conflicto que hay que resolver (abierta, sección 8):** `Branding/` codifica *otro* sistema —fondo `#FAFAF5`, amarillo `#FFF0B5`, azul `#C5E0F7`, gris `#4A4A55`, Inter y Playfair, «JABONES · ESENCIAS · MENTORÍAS», junio de 2026— y además se contradice a sí mismo: `index.css` define tokens claros pero sus páginas se renderizan sobre `#2A2A2E` con rosa y lila. No lo referencia ninguna doc del proyecto. Esta auditoría lo trata como **legado no autoritativo** (así consta en `DESIGN.md`); usted dijo que el concepto actual está «bastante cerca», y migrar a una paleta clara sería un rediseño, no una armonización.

### Alineamiento con el contrato editorial

| Principio del contrato | Antes | Después |
|---|---|---|
| Paleta exacta, sin colores nuevos | ⚠️ 35 hex fuera de paleta en `data/*`; 60 `rgba()` de paleta escritos a mano en clases | ✅ tintes centralizados en `config/covers.ts`; test de paleta cerrada; 0 `rgba()` de paleta en clases |
| Serif + sans, kickers 11px en mayúsculas | ⚠️ 20 trackings, 39 kickers crudos | ✅ 6 trackings, `Kicker` en 45 usos |
| Fotografía como materia | ⚠️ el zebra era lo más ruidoso de cada vista y dejaba un borde duro | ✅ zebra más quieto, sin borde, ángulo y fase por slot |
| World engine como energía | ✅ | ✅ (sin cambios) |
| Héroes y bandas *edge-to-edge* | ❌ mezcla de bandas inset (1280) y a sangre | ✅ `FullBleedSection` y `EditorialBanner` siempre a sangre |
| Cards como unidad secundaria | ✅ | ✅ |
| Radios del sistema (22/26/14/pill) | ⚠️ paneles de 4px en los realms | ✅ |
| Los nueve realms con slots fotográficos | ❌ Mi Santuario sin ninguno | ⚠️ hero, continuar y diaria cableados; diario y vacío pendientes |
| Alt bilingüe por claves | ⚠️ portal, 404 y carrito en español en `/en` | ✅ + test |
| No convertir los realms en una plantilla | ✅ | ✅ |
| Accesibilidad AA, 44px, reduced motion | ✅ (97% AA medido) | ✅ (98–99%); los restantes son falsos positivos comprobados |
| Rendimiento ≤200 kB First Load | ❌ 246.7 kB gz (home) | ❌ +1–2 kB por ruta (P2, sección 4) |

## 3. Audit Health Score

| # | Dimensión | Antes | Después | Hallazgo clave |
|---|---|---|---|---|
| 1 | Accesibilidad | 3 | 3 | Sólida (landmarks, skip-link, foco, aria, 44px). Corregido: carrito sin `h1`, kickers 11px bajo AA sobre zebra, `<audio>` nativo claro. Pendiente: recorrido real con lector de pantalla |
| 2 | Rendimiento | 3 | 3 | DPR capado, partículas reducidas, `LazyMotion`. Pero First Load JS ≈ 247 kB gz frente a 200 kB y a los 220 kB documentados |
| 3 | Theming (tokens) | 2 | 3 | Faltaban escalas de texto, tracking, opacidades, eje y halos; ahora son tokens y `cn()` los conoce |
| 4 | Responsive | 2 | 3 | Biblioteca rota en ≥768; barra inferior truncada; logo del hero sobre el texto en móvil |
| 5 | Integridad de implementación | 2 | 3 | Sistema propio y coherente, pero con CTAs ausentes, contenido duplicado y contratos en contradicción |
| **Total** | | **12/20** *Acceptable* | **15/20** *Good* | |

**Implementation Integrity Verdict: PASS (condicional).** El sitio expresa un sistema específico del producto —no intercambiable con una plantilla SaaS— y el detector determinista de impeccable no encontró nada ni antes ni después. Esa cifra no debe tranquilizar: **el detector no cubre estas clases de defecto** (layout superpuesto, CTA ausente, eje desalineado). Los hallazgos de abajo salieron de renderizar y medir.

## 4. Hallazgos por severidad

Estado: ✅ resuelto y verificado en render · ⚠️ parcial · ⏳ pendiente.

### P0 — bloquea una tarea

**[P0] Los CTA principales no existen en el DOM** ✅
- *Dónde:* `experience-row.tsx` (Reservar, en todas las experiencias), `membership-section.tsx` (Comenzar mi camino); una tercera instancia habría nacido en `continue-card.tsx`.
- *Causa:* `Button asChild` + `Link` de `@/i18n/navigation` dentro de un Server Component devuelve `null` en silencio (sin error ni warning). Los autores lo documentaron en `not-found-actions.tsx` y lo pospusieron.
- *Impacto:* desde `/experiencias` no había forma de llegar a la reserva salvo por URL directa: el flujo de conversión del realm estaba cortado.
- *Arreglo:* `ButtonLink` (cliente, `components/layout`) + `tests/lib/button-link.test.ts`, que falla si `Button asChild` aparece fuera de una frontera cliente (se comprobó que habría atrapado los dos originales).
- *Comando:* `/impeccable harden`.

### P1 — dificultad significativa

**[P1] Biblioteca: el sistema orbital no se podía leer en ≥768px** ✅ — `library-system.tsx`. Un panel de 720×680 se posicionaba con `absolute` encima de los seis discos (`z-[4]` sobre `z-[3]`), el título del destacado aparecía duplicado y cortado tras el disco. Ahora el destacado es «el sol»: su foto se funde con una máscara radial, los discos orbitan a su alrededor y el título lo pinta sólo el disco. *(`/impeccable layout`)*

**[P1] Barra de realms de móvil/tablet truncada y sin superficie** ✅ — `realm-nav.tsx`. Seis nombres en 390px se cortaban («DESCÚ…», «BIBLIOT…», «TIENDAMI SAN…») y se mezclaban con el contenido. Ahora es una barra de vidrio desplazable con nombres completos y el realm actual centrado. *(`/impeccable adapt`)*

**[P1] Nav lateral de escritorio pisaba el texto** ✅ — etiquetas persistentes (añadidas después del diseño original) de 26 a ~140px chocaban con textos que arrancan en 84–144px (kicker, título y cuerpo de las bandas). Se restituyó el diseño documentado en `accessibility.md`: puntos con badge al acercarse o enfocar.

**[P1] Bento de realms que no tesela** ✅ — `realms-grid.tsx`. Spans 7+5, 5+4+4(+2 filas), 4 sumaban 13 y dejaban huecos de dos y cuatro columnas. Ahora 7+5 / 4+4+4 / 8, con Tienda a dos filas y 2 columnas en tablet. La lista de fidelidad decía «bento exacto».

**[P1] Zebra: borde duro y lectura de «caja gris»** ✅ — `media-skeleton.tsx`, `globals.css`. La capa se desplazaba ±12% sobre un contenedor del 100% y dejaba ver el fondo liso en el borde (el corte vertical en x≈88%). Ahora mide 124% (barrido ±8%), el velo marfil baja de 0.16 a 0.07 y las bandas son un punto más oscuras. El ángulo y la fase salen del id del slot (`lib/editorial/zebra.ts`), de modo que 40 slots dejan de ser la misma textura.

**[P1] Píldora dorada estirada a barra** ✅ — `Badge` dentro de un `flex-col` (curso destacado, experiencia destacada). Contradice «acentos como luz, no rellenos». `w-fit self-start` en el primitivo.

**[P1] Tres ejes de alineación y bandas a medias** ✅ — en una misma vista el texto arrancaba en x=84, 144 y 224 (Biblioteca), y unas bandas eran inset (1280) y otras a sangre. `--page-inset` + `fm-container` (26 usos) fijan un eje único; bandas y héroes son siempre a sangre.

**[P1] Kickers de 11px bajo AA sobre el zebra** ✅ — medido: 3.3–4.3:1 («Dentro del archivo», «El universo de Frecuencia Mágica», «Membresía»…). Tras el ajuste del zebra, 0 fallos reales (ver método).

**[P1] Mensaje de membresía repetido a un scroll de distancia** ✅ — la banda de cierre del footer (`home.footer-banner`, descrita en el inventario como «la despedida») repetía título, descripción y CTA de la sección de membresía. Ahora cierra con copy propio. **Copy nuevo a validar con la voz de marca** (ver sección 8).

### P2 — molestia, hay rodeo

**[P2] Escalas sin tokens** ✅ — ver sección 5.
**[P2] Hex fuera de la paleta** ✅ — 35 literales repetidos en cuatro archivos de datos → `config/covers.ts` (9 tintes con nombre) + `tests/lib/palette.test.ts`.
**[P2] Alt en español en rutas inglesas** ✅ — portal (2 capas), 404 localizado. `tests/lib/editorial-alt.test.ts` impide nuevas llamadas sin alt traducido.
**[P2] `/tienda/carrito` sin `h1`** ✅ — `sr-only h1` en ambos estados.
**[P2] Reproductor de lección con control nativo claro** ✅ — `color-scheme: dark`; sigue siendo el control nativo (el audio real está diferido).
**[P2] Fila de experiencia: «PRESENCIAL» sobre «90 min»** ✅ — el rótulo de la columna era el modo, no la duración (`mode` y `modeLabel` eran la misma clave). Se añadió `experiences.durationLabel` y se quitó el kicker que repetía al badge.
**[P2] Filtros de Biblioteca duplicados** ⚠️ — la lista inerte del hero (palabras con aspecto de filtro que no hacían nada) se eliminó. Sigue pendiente que los filtros reales queden lejos de lo que filtran (separados por un banner): es un contrato de test vigente, decisión de producto.
**[P2] Primario desactivado = píldora gris sólida** ✅ — ahora vidrio con borde y sin halo.
**[P2] Logo flotante del hero sobre el párrafo (móvil) y stats que envolvían** ✅
**[P2] Header fijo sin superficie** ✅ — scrim de vacío, sin borde.
**[P2] Disco `md`: ecualizador tapado por el play** ✅ — sólo asomaba una barra; se retira a esa escala.
**[P2] Mi Santuario sin slots editoriales** ⚠️ — hero, continuar y frecuencia diaria cableados con zebra; **pendientes** `sanctuary.journal` y `sanctuary.empty`.
**[P2] Documentación desfasada** ⚠️ — `accessibility.md`, `performance.md`, `fidelity-checklist.md` y `AGENTS.md` actualizados. El *Estado* del inventario `frontend/public/editorial/README.md` dice «sin cablear» en **todas** las filas aunque 40 de los 42 slots registrados ya están cableados: pendiente (idealmente generado y verificado por test).
**[P2] First Load JS ≈ 247 kB gz** ⏳ — home 246.7 kB (suma del manifest de la ruta), 248–254 kB en `next build`; `performance.md` registraba 213–216 kB, tope 200 kB. Esta pasada suma +1–2 kB por ruta (`ButtonLink`, slots de Mi Santuario); la regresión es anterior. *(`/impeccable optimize`; empezar por `@next/bundle-analyzer` y por sospechosos: `next/image` en todas las rutas, catálogo de mensajes completo en el cliente, `PlayerDock`.)*
**[P2] `Branding/` contradice la paleta del producto** ⏳ — decisión suya.

### P3 — pulido

- Quedan titulares con `clamp()` propio (tarjetas de 26–58px); `Display` ganó `feature` y se convirtieron los tres destacados.
- El reset global de `prefers-reduced-motion` usa `0.001ms !important`: conserva el estado final de las entradas y es aceptable, pero mata cualquier transición útil de estado.
- 14 archivos usan `backdrop-filter`; no hay evidencia de caída de FPS, pero no se perfiló en un dispositivo de gama media.
- «Sobre Marisol» y «Membresía» del footer apuntan a `/inicio` y `/mi-santuario` (marcados con `TODO(backend)`).

## 5. Patrones sistémicos

| Patrón | Antes | Después |
|---|---|---|
| `tracking-[…]` distintos | 20 | 0 arbitrarios → 6 tokens (`soft` … `eyebrow`) |
| `text-ivory/NN` distintos en texto | 19 (incluye `/40`, bajo AA) | 0 → 5 peldaños (`ivory`, `fg-body`, `fg-soft`, `fg-muted`, `fg-meta`) |
| `text-[Npx]` < 16px | 108 usos en 8 tamaños (8–15px) | 0 → `text-label` 11, `text-meta` 13, `text-body` 15, `text-lead` 17 |
| Kickers `<p>` crudos vs `<Kicker>` | 39 vs 33 | 4 vs 45 |
| Titulares serif crudos (fuera del UI Kit) vs `<Display>` | 18 vs 29 | 9 vs 38 |
| `rgba()` de paleta en clases | 60 | 0 (`border-gold/20`, `bg-void/72`…) |
| Hex fuera de paleta en `data/` | 35 | 0 |
| `rounded-[4px]` en contenedores (tarjetas de realms) | 2 | 0 (2–4px sólo en pistas y líneas) |
| Enlaces con flecha reescritos a mano | 5 | 1 primitivo (`arrowLinkClasses` + `ArrowGlyph`) |
| Fórmulas de margen lateral | 4 (`px-6 sm:px-[8vw] lg:px-[10vw]`, `lg:px-[7vw]`, `md:px-[8vw]`, `p-[clamp(24px,6vw,84px)]`) | 1 (`--page-inset`) |

**Trampa que conviene conocer:** `cn()` usa `tailwind-merge`, que desconoce los tokens nuevos y trataría `text-label` (tamaño) y `text-fg-muted` (color) como el mismo grupo, descartando uno. Se registraron en `lib/cn.ts` y hay test (`tests/lib/cn.test.ts`). Toda escala nueva de `@theme` debe registrarse allí.

## 6. Lo que funciona (conservar)

- **Una sola atmósfera.** Paleta, serif/sans y cristal astral son idénticos en las 15 rutas; el cambio de realm se siente como cambiar de lugar (acento, `baseNote`, partículas).
- **Disciplina del UI Kit:** primitivos puros, textos por props, copy sólo en `messages/`, paridad ES/EN con test.
- **Accesibilidad de base:** landmarks, skip-link, foco dorado, `aria-label` en controles sólo-icono, `aria-hidden` en capas decorativas, reduced motion en CSS y JS. Medido: 0 hit targets <44px (salvo el skip-link oculto), 0 desbordes horizontales y 0 errores de consola en 45 combinaciones de ruta y ancho.
- **Contraste:** 606 textos medidos contra los píxeles renderizados (incluido el zebra): 97% ≥ AA antes, 99% después.
- **Rendimiento del motor:** DPR ≤ 2, partículas 54/28, pausa con la pestaña oculta, `motion` granular.
- **Contract tests** que leen el código fuente: molestos de mantener, pero son la razón por la que esta pasada pudo tocar 100+ archivos con seguridad (245 tests en verde).

## 7. Cambios de esta pasada

**Cimientos** — `globals.css`: tokens de texto (`fg-*`), tamaños (`text-label|meta|body|lead`), tracking (6), halos (`shadow-glow-*`), `--color-ink`, `--page-inset`, `--container-max`, utilitario `fm-container`; zebra corregido. `lib/cn.ts` extendido. `config/covers.ts`, `lib/editorial/zebra.ts`.

**Primitivas** — nuevas: `ButtonLink` (layout), `ArrowLink` (`arrowLinkClasses`, `ArrowGlyph`). Corregidas: `Badge`, `Button` (disabled, tonos), `Pill`, `EditorialBanner` (siempre a sangre, `Kicker`/`Display`, rellena bandas altas), `FullBleedSection`, `MediaSkeleton`, `FrequencyDisc`, `Display` (`feature`, `id`), `RealmNav`, `SiteHeader`.

**Vistas** — Home (héroe, frecuencia del día, audios, bento, sobre Marisol, cierre), Biblioteca, Experiencias, Academia, Tienda, Mi Santuario, Portal y 404 (alts); `loading.tsx` de las rutas con esqueleto.

**Tests** — +3 guardas nuevas (paleta cerrada, alt traducido, `Button asChild`), +`cn`, +`zebra`; actualizados los contratos de nav, portal y experiencias que fijaban el comportamiento defectuoso.

**Mensajes nuevos (ES/EN):** `experiences.durationLabel`, `footer.closing.{kicker,title,cta}`, `portal.media.alt.{hero,field}`, `states.media.alt.notFound`, `sanctuary.media.alt.{hero,continue,daily}`.

## 8. Decisiones que no son del código

1. **`Branding/`**: ¿archivar o eliminar como legado, o es la línea que el cliente quiere y entonces esto es un rediseño? Mientras tanto queda marcado como no autoritativo en `DESIGN.md`.
2. **Copy del cierre de la home** («Antes de irte · Tu luz seguirá aquí cuando vuelvas · Volver al umbral» / «Before you go · Your light will be here when you return · Back to the threshold»): escrito en la voz de marca, sin validar con Marisol.
3. **Nav de escritorio**: se restituyó puntos + badge al acercarse (el diseño documentado). Si se prefieren etiquetas permanentes, hay que reservar el margen (`--page-inset` ≥ 152px desde 1024px) y aceptar contenido más estrecho.
4. **Filtros de Biblioteca**: hoy están separados de los discos por un banner (contrato en `tests/lib/library-layout.test.ts`). Acercarlos es un cambio de arquitectura de la información.

## 9. Recomendaciones, por orden

1. `/impeccable optimize` — bajar el First Load JS (P2) con un analizador antes de tocar nada.
2. Cablear `sanctuary.journal` y `sanctuary.empty` y **automatizar el Estado del inventario** (registro vs uso) con un test.
3. Sustituir el `<audio>` nativo por el reproductor propio cuando exista el audio real (hoy `lessonAudioDeferred`).
4. Pasar el recorrido de teclado y lector de pantalla en dispositivo real (sigue manual en `accessibility.md`).
5. Perfilar FPS en un móvil de gama media con las bandas a sangre y 14 superficies con `backdrop-filter`.
6. `/impeccable critique` con sub-agentes aislados sobre Home y Biblioteca cuando entre la primera fotografía real: la zebra enmascara cómo se comportan escala, recorte y scrim con imagen.

## 10. Método y límites

- **Contraste:** por cada nodo de texto visible se toma su color computado (convertido a RGBA vía canvas; Tailwind v4 emite `oklab()`), se captura la página con el texto transparente y se mide el contraste contra el percentil 90 de luminancia de los píxeles bajo su caja (caso más desfavorable para texto claro). Umbral: 4.5:1, o 3:1 en texto ≥24px. Los «fallos» que quedan (`Nombre` en un campo `inert`, `Cerrar` deshabilitado y etiquetas `sr-only` de las zebra) son falsos positivos comprobados.
- **Desborde / targets / consola:** Playwright con Chromium, tras recorrer la página para disparar las animaciones de entrada.
- **Detector de impeccable:** 0 hallazgos en `frontend/src` y en las páginas renderizadas, antes y después.
- **No se midió:** FPS reales, dispositivo físico, lector de pantalla, Safari/Firefox, ni se perfiló memoria.
- El primer intento de contraste dio 54% de fallos por un error de la herramienta (los colores `oklab()` se leían como casi negros); se detectó por implausible y se corrigió antes de extraer conclusiones.
