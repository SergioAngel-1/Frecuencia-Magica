# Contrato de dirección visual editorial-mágica — Frecuencia Mágica

| Campo | Valor |
|---|---|
| Fecha | 2026-08-11 |
| Estado | Contrato vigente y normativo para las tareas de implementación visual |
| Alcance | Capa visual de las nueve vistas; este documento no introduce código ni assets |
| Autoridad | Dirección aprobada por el usuario: «fotografía como materia estructural; world engine como energía viva» |
| Base factual | `AGENTS.md`, `frontend/src/app/globals.css`, `frontend/src/config/realms.ts`, `frontend/docs/{accessibility,performance,fidelity-checklist}.md`, `frontend/README.md` |

Este contrato codifica la dirección **editorial-mágica** sobre el sistema ya implementado. No sustituye ninguna fuente de verdad existente: `globals.css` y `config/` siguen mandando en tokens, tipografía, keyframes y realms; `accessibility.md` y `performance.md` siguen siendo de obligado cumplimiento. Este documento añade la capa fotográfica y sus reglas.

---

## 1. Tesis visual

> **La fotografía es la materia estructural del portal; el world engine es su energía viva.**

- **Materia.** La fotografía aporta peso, textura, escala y ritmo editorial: héroes a sangre, banners, crops cinematográficos y retículas asimétricas. Es lo que el ojo encuentra primero: ancla la jerarquía de cada vista.
- **Energía.** El canvas cósmico, las nebulosas, las partículas, los halos, los aros, la geometría sagrada, el cursor luminoso, el audio ambiental y las transiciones de portal permanecen como la capa viva que respira detrás y alrededor de la materia. El portal no se vuelve estático porque entre fotografía: la fotografía se asienta **sobre** energía.
- **Relación entre ambas.** No es figura sobre fondo plano: la energía atraviesa, ilumina y recorta la materia. Las imágenes reciben luz de la paleta (halos dorados, glows), las partículas pueden cruzar por delante en las zonas permitidas y los scrims se construyen con el gradiente de la app.
- **Editorial-mágica no es una galería.** Cada fotografía tiene un trabajo narrativo (contar, mostrar, invitar, acompañar). Ninguna vista se convierte en un grid de fotos convencional; la composición editorial (asimetría, escala, blancos) es parte de la magia, no un marco neutro.

## 2. Lo que permanece

Nada de esto cambia con la dirección editorial-mágica:

- **Paleta exacta, sin colores ni fuentes nuevos:** `--void #0F1B2E`, `--void-2 #0a1220`, `--gold #D8B978`, `--teal #96C6BC`, `--lav #B9B0D6`, `--ivory #F7F4EA`, `--color-warn #C98B7A` (sólo errores de formulario); glass `rgba(247,244,234,0.045)` + borde `rgba(216,185,120,0.20)`. Fondo de app: `radial-gradient(140% 100% at 50% -10%, #16273f 0%, var(--void) 45%, var(--void-2) 100%)`. Acentos como halos/bordes/glows, nunca rellenos sólidos grandes.
- **Tipografía:** Cormorant Garamond (títulos, cifras, precios, poético) · Jost (kickers, labels, UI); body en peso 300; kickers en MAYÚSCULAS 11px con `letter-spacing` .14em–.4em.
- **Copy:** todo el copy visible vive en `messages/es.json` y `messages/en.json`; voz íntima, serena, poética, en segunda persona. Los alt de las fotografías siguen la misma regla (claves de traducción, nunca cadenas en componentes).
- **World engine completo:** canvas cósmico con partículas y nebulosas recoloreadas por realm, halos, aros, geometría sagrada, cursor luminoso, audio ambiental con `baseNote` por realm (110/110/110/98/130.8/146.8/123.4/116.5/103.8) y coreografía de cruce de portal.
- **Identidad viva del movimiento:** nada es estático; entradas con fade-up escalonado (`.1s`, `.25s`, `.4s`, `.55s`); keyframes de `globals.css` portados del prototipo, sin «redondear» valores.
- **Accesibilidad:** contraste AA sobre el punto más claro del gradiente (`#16273f`), marfil ≥ 55 % en texto, foco visible dorado, hit targets ≥ 44px, `aria-label` en controles sólo-icono, `aria-hidden` en capas decorativas, `prefers-reduced-motion` respetado siempre (CSS + `useReducedMotionSafe`).
- **Rendimiento:** 60 FPS desktop / 30 FPS móvil de gama media, `devicePixelRatio` capado a 2, animar sólo `transform` y `opacity`, pausas fuera de pantalla, First Load JS ≤ 200 kB (deuda documentada en `performance.md`).
- **i18n y arquitectura:** rutas localizadas con `@/i18n/navigation`, tres capas (UI Kit puro / world / features), `src/data/` sin textos, Server Components por defecto.
- **Estados y marcos:** estados de carga/vacío/error, `Skeleton` (variantes `disc`/`card`/`line`), `LoadingOrb` sólo en navegación, 404 y error boundary con copy de marca.
- **Fotografía en las nueve vistas.** Todas las vistas reciben fotografía según sus slots del inventario (§5): portal (`/`), home (`/inicio`), acceso (`/acceso`), descúbrete (`/descubrete`), biblioteca (`/biblioteca`), academia (`/academia`), experiencias (`/experiencias`), tienda (`/tienda`) y mi santuario (`/mi-santuario`) — además de los estados y el 404. Ninguna vista queda excluida del contrato fotográfico. El world engine permanece en todas como energía viva: canvas, partículas, halos, aros, geometría, cursor y audio siguen respirando detrás y alrededor de la materia. La columna derecha del hero de la home (aros orbitales + logo) se conserva como capa de energía; su materia entra por el slot `home.hero`.

## 3. Lo que cambia

- **Cards como unidad secundaria.** En las nueve vistas la jerarquía la marca la fotografía (cada una según sus slots del inventario); las cards dejan de ser el único vehículo de presentación y pasan a contener/complementar la imagen.
- **Layouts edge-to-edge.** Los héroes fotográficos llegan a sangre de sección o de viewport; el contenido se monta sobre la imagen con scrims de la paleta.
- **Héroes fotográficos.** La fotografía puede ocupar el papel de columna protagonista del hero (materia estructural), con kicker, título y CTA sobre scrim.
- **Banners.** Franjas fotográficas entre secciones o como cabeceras de sección, con ritmo alternado respecto a las cards.
- **Crops.** Cuatro ratios canónicos: `3:4` vertical (retrato), `1:1` (producto), `16:8` (curso/lección) y `16:9` (experiencias/atmósfera). Cada slot declara su ratio y su crop en el inventario; los crops alternativos de un mismo asset se declaran por slot, nunca improvisados.
- **Scrims.** Gradientes de `--void` al 70–85 % para legibilidad, con dirección según composición (inferior para pie de imagen, izquierdo para texto alineado a la izquierda). El texto sobre imagen nunca baja del contraste AA documentado en `accessibility.md`.
- **Máscaras y composición editorial.** Retícula asimétrica, jerarquía por escala, ritmo alternado y máscaras propias de marca (el retrato de Marisol mantiene el arco de nicho `200px 200px 22px 22px`).
- **Skeleton zebra como fallback de slot.** Todo slot sin imagen usa el skeleton editorial «zebra»: bandas de la paleta (`--gold`/`--teal`/`--lav`/`--void` a baja opacidad) + barrido de luz (reutiliza el keyframe `fm-shimmer` de `globals.css`) + atributo `data-media-slot` en el contenedor. Nunca cajas grises, Unsplash ni placeholders genéricos. Los gradientes actuales del código cumplen la regla de placeholders y son el fallback intermedio hasta que cada slot se cablee con su zebra.

## 4. Anti-goals (lo que no se hará)

- **No se producen imágenes en esta fase:** ni fotografías reales ni generadas. Esta fase sólo formaliza el contrato; los assets entran más adelante, únicamente por los slots del inventario.
- **No se usa stock ni Unsplash**, ni placeholders genéricos de ningún proveedor.
- **No se sustituye la magia por una galería fotográfica convencional:** el world engine permanece como identidad viva en todas las vistas; la fotografía nunca desplaza a la energía, se asienta sobre ella.
- **No se convierte a todos los realms en la misma plantilla:** cada vista conserva su identidad (quiz, sistema solar, bento, filas de reserva, diario…); la fotografía se adapta al trabajo de cada realm, no al revés. Las nueve vistas —incluidos portal, acceso, descúbrete, biblioteca y mi santuario— reciben fotografía según sus slots del inventario, pero ninguna pierde su identidad.
- **No se introducen colores ni fuentes arbitrarios:** la paleta y la tipografía de la sección 2 son cerradas. La fotografía debe armonizar: luz dorada sobre fondo oscuro, tonos de la paleta, retratos íntimos y materia natural.
- **No se añade backend, pagos reales, CMS ni rutas aplazadas.** Los assets se versionan en `frontend/public/editorial/`; no hay servidor de medios ni CMS.
- **No se toca el prototipo perdido ni los `.dc.html` de otras marcas** (`~/Descargas/siu-premium-web-design-system/` es de otra marca). La referencia visual sigue siendo el Brand Book de `~/Descargas/` y el sistema codificado.

## 5. Inventario de slots fotográficos

El inventario completo (por slot: `id`, vista, propósito, orientación, ratio, focal point, prioridad, alt requerido, fallback actual y estado) vive en **`frontend/public/editorial/README.md`**, bilingüe ES/EN para la producción futura de assets. Resumen normativo:

| Slot | Vista | Ratio | Prioridad |
|---|---|---|---|
| `portal.hero` | Portal `/` · hero de entrada | 16:9 | P0 |
| `portal.portal-field` | Portal `/` · campo del portal | 16:8 | P1 |
| `not-found.hero` | 404 · hero | 16:9 | P2 |
| `home.hero` | Home `/inicio` · hero (`hero-section.tsx`) | 16:9 | P0 |
| `home.daily-frequency` | Home · frecuencia diaria (`daily-frequency.tsx`) | 16:8 | P1 |
| `home.audio-banner` | Home · banner de audio (`audio-grid.tsx`) | 16:9 | P2 |
| `home.realms-banner` | Home · banner de realms (`realms-grid.tsx`) | 16:8 | P1 |
| `home-marisol-portrait` | Home · Sobre Marisol (`about-section.tsx`) | 3:4 vertical, máscara de arco | P0 |
| `home-membership` | Home · Membresía (`membership-section.tsx`) | 16:9 | P2 |
| `home.footer-banner` | Home · banner final | 16:9 | P2 |
| `auth.hero` | Acceso `/acceso` · hero (`auth-aside.tsx`) | 16:9 | P1 |
| `auth.form-atmosphere` | Acceso · atmósfera del formulario (`auth-form.tsx`) | 3:4 | P2 |
| `discover.hero` | Descúbrete `/descubrete` · intro (`intro-step.tsx`) | 16:9 | P1 |
| `discover.question-atmosphere` | Descúbrete · pregunta (`quiz-step.tsx`) | 3:4 | P2 |
| `discover.tuning` | Descúbrete · sintonización (`tuning-step.tsx`) | 16:8 | P1 |
| `discover.result` | Descúbrete · resultado (`result-step.tsx`) | 16:9 | P1 |
| `library.hero` | Biblioteca `/biblioteca` · cabecera (`library-system.tsx`) | 16:9 | P1 |
| `library.featured` | Biblioteca · audio destacado | 16:8 | P1 |
| `library.archive-banner` | Biblioteca · banner del archivo | 16:9 | P2 |
| `library.audio-cover.*` | Biblioteca · portada por audio (por instancia) | 1:1 | P1 |
| `academy.hero` | Academia `/academia` · cabecera (`course-list.tsx`) | 16:9 | P1 |
| `academy.featured-course` | Academia · curso destacado | 16:8 | P1 |
| `academy-course-cover` | Academia · cards y detalle de curso (`course-card.tsx`, `course-detail.tsx`) | 16:8 (crop 1:1 en card) | P1 |
| `academy-lesson-visual` | Academia · reproductor de lección (`lesson-player.tsx`) | 16:8 | P1 |
| `academy.completion` | Academia · finalización del curso | 16:8 | P1 |
| `experiences.hero` | Experiencias `/experiencias` · cabecera (`experience-list.tsx`) | 16:9 | P1 |
| `experiences.featured` | Experiencias · experiencia destacada | 16:8 | P1 |
| `experiences-visual` | Experiencias · fila de experiencia (`experience-row.tsx`) | 16:9 | P1 |
| `booking.hero` | Experiencias · reserva (`booking-flow.tsx`) | 16:9 | P1 |
| `booking.confirmation` | Experiencias · confirmación de reserva | 16:8 | P1 |
| `store.hero` | Tienda `/tienda` · cabecera (`product-grid.tsx`) | 16:9 | P1 |
| `store-product-visual` | Tienda · card y detalle de producto (`product-card.tsx`, `product-detail.tsx`) | 1:1 (16:8 en destacado) | P1 |
| `store.ritual-banner` | Tienda · banner ritual | 16:9 | P2 |
| `product.detail` | Tienda · detalle de producto (`product-detail.tsx`) | 16:8 | P1 |
| `product.related` | Tienda · productos relacionados | 16:8 | P2 |
| `cart.empty` | Tienda · carrito vacío (`cart-view.tsx`) | 16:9 | P2 |
| `checkout.confirmation` | Tienda · confirmación de compra (`order-confirmation.tsx`) | 16:8 | P1 |
| `sanctuary.hero` | Mi Santuario `/mi-santuario` · hero | 16:9 | P1 |
| `sanctuary.continue` | Mi Santuario · continuar (`continue-card.tsx`) | 16:8 | P1 |
| `sanctuary.daily` | Mi Santuario · frecuencia diaria (`daily-card.tsx`) | 1:1 | P1 |
| `sanctuary.journal` | Mi Santuario · diario (`journal-panel.tsx`) | 3:4 | P2 |
| `sanctuary.empty` | Mi Santuario · estado vacío | 16:9 | P2 |
| `states.loading` | Estados · carga | 16:9 | P2 |
| `states.empty` | Estados · vacío | 16:9 | P2 |
| `states.error` | Estados · error | 16:9 | P2 |
| `states.offline` | Estados · sin conexión | 16:9 | P2 |

Los slots de contenido (curso, experiencia, producto, portada de audio) se aplican por instancia: cada ítem del catálogo tiene su propio asset del mismo slot. Los slots aún sin componente cableado (portal, acceso, descúbrete, biblioteca, mi santuario, estados) registran su vista y propósito según el plan; este inventario es la lista normativa completa de lugares fotográficos del portal.

## 6. Reglas que todas las vistas deberán seguir

1. **Assets sólo por slot:** ninguna vista introduce una imagen que no esté registrada en `frontend/public/editorial/README.md`.
2. **Sin asset → zebra:** cualquier slot sin imagen renderiza el skeleton zebra (bandas de la paleta + barrido de luz + `data-media-slot`). Nunca cajas grises, stock ni Unsplash.
3. **`next/image`** con `sizes` correcto; `priority` sólo en el primer viewport; lazy loading en el resto; formatos AVIF/WebP; dimensiones máximas por slot (2× del ancho de render; DPR cap 2).
4. **Alt bilingüe obligatorio** vía claves de `messages/{es,en}.json` (el test de integridad de mensajes cubre también los alt). Una imagen con `alt=""` sólo si el componente la declara decorativa y la marca con `aria-hidden`.
5. **Máscaras y scrims en CSS, nunca en el asset:** el archivo se entrega sin recortes de máscara; el arco de Marisol y los scrims son responsabilidad del componente.
6. **Contraste:** texto sobre fotografía con scrim ≥ AA (marfil ≥ 55 % sobre el scrim, ver `accessibility.md`).
7. **Sin emojis ni ornamentos ajenos a la paleta** sobre las imágenes; los halos y glows de acento usan `--gold`/`--teal`/`--lav` según el `accent` del realm (`realms.ts`).
8. **Rendimiento:** las imágenes no degradan los presupuestos de `performance.md`; pausas, DPR y animaciones (sólo `transform`/`opacity`) se mantienen intactos.
9. **Reduced motion:** los efectos sobre imágenes (barridos, zooms sutiles) respetan `prefers-reduced-motion`.
10. **Sin backend:** no hay CMS ni servidor de medios; los assets versionados en `frontend/public/editorial/` son la única vía de entrada.

## 7. Verificación del contrato

Revisado el diff completo: sin marcadores de trabajo incompleto, sin referencias ambiguas a placeholders (todo fallback remite al skeleton zebra o a los gradientes vigentes) y sin instrucciones contradictorias con `AGENTS.md`, `accessibility.md`, `performance.md` ni `fidelity-checklist.md`. El inventario de slots refleja los componentes reales del código allí donde el slot está cableado (verificado por inspección el 2026-08-11) y registra la vista y el propósito según el plan para el resto; las marcas `// TODO(backend)` del producto son excepciones intencionales y no forman parte de este documento.
