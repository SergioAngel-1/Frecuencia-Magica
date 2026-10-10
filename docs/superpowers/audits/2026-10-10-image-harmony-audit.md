# Auditoría de armonía de imágenes — Frecuencia Mágica

| Campo | Valor |
|---|---|
| Fecha | 2026-10-10 |
| Rama | `feat/state-views` (sobre `feat/editorial-image-intake`; base de la medición: `2b7c1a6`) |
| Alcance | 27 vistas y estados (portal, inicio, sobre-marisol, acceso, descúbrete ×4 fases, resonario, academia ×4, experiencias ×3, tienda ×5, mi-santuario ×2, 404 y los cuatro estados) en 1440 / 1280 / 768 / 390, DPR 2; ES en todas y EN en inicio, sobre-marisol, descúbrete, academia y tienda (1440 y 390) |
| Método | Skill impeccable: `audit` (dimensiones técnicas) + lectura crítica en un solo contexto. **No** se ejecutó el protocolo aislado de `/impeccable critique` (sub-agentes, snapshot, preguntas). `impeccable context` avisó de que falta `PRODUCT.md`; el criterio fue `DESIGN.md` y el contrato de slots. |
| Evidencia | 118 capturas de página completa con Playwright 1.49 (Chrome del sistema, `reducedMotion: 'reduce'`, entrada por URL directa, recorrido de scroll para cargar las perezosas) + 27 capturas de viewport centradas en cada costura. Medición por DOM de cada `[data-media-slot]`: caja, `data-media-visual`, `currentSrc`, variante servida, `object-fit/position`, ventana visible de la fuente, ampliación y deformación. Tamaño real de las 50 fuentes leído con `sharp`. Capturas y datos fuera del repo (scratchpad de la sesión). |
| Resultado | **Las imágenes no se deforman en ningún sitio** (todo es `cover`) y los focos del contrato se respetan. Los tres síntomas que se ven son reales y tienen causa medible: **costuras** (las bandas a sangre terminan en una arista dura y las separa una franja de fondo), **blandura** (ampliación de hasta 8,8× por `sizes` y por fuentes de 1672 px, más doble compresión AVIF→WebP) y **cortes** (cajas mucho más altas que la proporción de su slot, sobre todo en móvil). |

> Documentos hermanos: [`DESIGN.md`](../../../DESIGN.md) (criterio), [`2026-09-30-design-coherence-audit.md`](2026-09-30-design-coherence-audit.md) (auditoría anterior), contrato de slots en `frontend/src/config/editorial-media.ts`, brief en `docs/brief-fotografico.md`.

---

## 1. Veredicto

La fotografía ya entró como materia (46 imágenes, más las cuatro de estado de esta rama), pero **entró en un layout pensado para su ausencia**. Tres herencias explican casi todo:

1. **Las bandas se diseñaron como bloques, no como materia continua.** Cada `FullBleedSection` y cada `EditorialBanner` es un rectángulo que termina en seco: el scrim inferior llega a `rgba(10,18,32,0.88)`, no al vacío; el borde superior no tiene fundido, y `RealmHero` (`overlay="left"`) no tiene ninguno abajo. Entre dos bandas, el ritmo `section` deja 56–112 px de fondo. El resultado es la franja que «no se integra».
2. **Los slots `none` pintaban nada y ahora pintan foto.** Sus cajas siguen el contenido, no la proporción del slot: `discover.result` mide 1440×1556 (y 390×**2047**), `home.daily-frequency` 390×1318 y `booking.hero` 342×1330. Una 16:9 dentro de una caja vertical se queda en el 10–16 % de su ancho y se amplía hasta 8,8×. `portal.portal-field` era un rectángulo invisible y ahora es un panel con aristas.
3. **El pipeline de imagen degrada dos veces.** Las fuentes son de 1672 px (el brief pide 2880), se publican como AVIF q70 (19 KB el héroe del inicio) y `next/image` las vuelve a codificar como WebP q75 (16 KB), porque `next.config` no declara `images.formats`. `sizes="100vw"` además elige la variante por el ancho, mientras que `cover` escala por el alto: en 390 se sirve la variante de 828 px para una imagen que se pinta a 1500 px CSS.

Ninguno de los tres exige tocar ratios ni focos del contrato. Dos decisiones sí lo rozan (sección 8).

## 2. La línea esperada y sus fuentes

Por orden: `DESIGN.md` (*Layout*: «un solo eje de página», «a sangre o dentro del eje, nunca a medias», ritmo `section`/`block`; *Elevation*: «La Regla del Scrim Único»; *Imagery*: «cielo arriba, materia abajo», ratios y focos que no cambian) → `frontend/src/config/editorial-media.ts` (ratio, foco, `sizes`, `fallback`) → `docs/brief-fotografico.md` (encuadre de cada sujeto) → `frontend/src/app/tokens.css` (valores).

**Cómo se leen las medidas.** *Ventana visible* `x0–x1 · y0–y1`: el tramo de la fuente que queda en pantalla, en fracciones (0–1 es la imagen entera). *Ampliación*: píxeles de dispositivo por píxel de fuente realmente servido; por encima de ~1,5 la imagen se ve blanda en DPR 2 y por encima de 3, borrosa. Todas las fuentes publicadas miden 1672×940/941 (16:9), 1774×887 (16:8), 1254×1254 (1:1) o 1086×1448 (3:4).

## 3. Audit Health Score (alcance: imagen)

| # | Dimensión | Nota | Hallazgo clave |
|---|---|---|---|
| 1 | Accesibilidad | 3 | Alts traducidos en todos los slots medidos; el velo sin conexión mueve el foco y anuncia en `aria-live`. Sin pase de contraste del texto sobre las fotos nuevas (sección 10) |
| 2 | Rendimiento | 2 | Doble compresión AVIF→WebP; `sizes` que sirve la variante pequeña en móvil; héroes de 1672 px ampliados ≥1,7× en todos los anchos de escritorio |
| 3 | Responsive | 2 | Cajas verticales de 1300–2050 px de alto para fotos 16:9 en 390; carrito sin margen de página en 768 |
| 4 | Theming / sistema | 3 | Paleta, radios y scrim único respetados; la arista dura de las bandas no la dibuja ningún token, la deja la ausencia de uno |
| 5 | Integridad de implementación | 2 | Slots `none` que heredaron un layout para el vacío; panel del portal con aristas; contrato 1:1 de producto forzado a 16:8 |
| **Total** | | **12/20** *Acceptable* | |

**Implementation Integrity Verdict: PASS condicional.** El sistema sigue siendo propio y coherente: ninguna imagen está estirada, ninguna caja gris, ningún stock. Lo que falla es la integración de la materia nueva con el ritmo y las cajas de antes. Esto no lo detecta un detector estático; salió de medir el render.

## 4. Hallazgos por severidad

Cada hallazgo indica la vista, el breakpoint, el slot, la medida y la regla de `DESIGN.md` que incumple. Estado: ⏳ pendiente (esta auditoría no corrige nada).

### P1 — se ve y estorba

**[P1-1] Costuras duras entre bandas a sangre** ⏳
- *Dónde:* inicio (cinco costuras), sobre-marisol (cuatro), resonario (héroe→archivo), experiencias (héroe→destacada), santuario (borde inferior del héroe). En todos los anchos.
- *Medida:* el hueco entre bandas consecutivas es de **112 px en 1440, 102 en 1280, 61 en 768 y 56 en 390** (el peldaño `section`). Hay excepciones fuera de escala: membresía→banner del footer **185/167/101/85 px**, resonario héroe→archivo **154/146/120/164 px**, experiencias héroe→destacada **72/64/38/28 px** (`block`). En las capturas de viewport (`seams/*`) cada banda termina en una línea horizontal dura: el scrim `bottom` acaba en `rgba(10,18,32,0.88)` y el fondo que sigue es otro tono de vacío; el borde superior de la banda siguiente no tiene ningún fundido.
- *Regla:* «A sangre o dentro del eje, nunca a medias… Una banda inset deja un borde duro junto a las que sí llegan al borde» (*Layout*); «la imagen se asienta sobre la energía» (*Overview*). La arista no viene de una banda inset, pero produce el mismo borde duro que la regla quiere evitar.
- *Comando:* `/impeccable layout`.

**[P1-2] Ampliación por `sizes="100vw"` en cajas más altas que su ratio** ⏳
- *Medida (390, DPR 2; servida la variante de 828 px salvo donde se indica):* `portal.hero`, `home.hero`, `discover.hero`, `not-found.hero` y `states.*` (390×844) → **3,6×**; `portal.portal-field` → **4,1×**; `home.daily-frequency` (390×1318) → **5,7×**; `booking.hero` (342×1330) → **5,7×**; `discover.result` (390×2047) → **8,8×**. En 768 los héroes a viewport (768×1024, variante de 1920) → **2,2×**; `discover.result` (768×1401) → **3,0×**.
- *Causa:* el navegador elige la variante por el ancho (`100vw` → 780 px de dispositivo), pero `cover` escala la imagen por el alto de la caja.
- *Regla:* contrato de `sizes` del slot (`editorial-media.ts`); `frontend/docs/performance.md`.
- *Comando:* `/impeccable optimize`.

**[P1-3] Fuentes por debajo del máster y doble compresión** ⏳
- *Medida:* las 46 fuentes 16:9/16:8 miden 1672 o 1774 px de ancho, frente a los 2880 que pide el brief. En 1440, cualquier banda a sangre se pinta a **1,72–1,91×** y `home.daily-frequency` (1440×984) a **2,09×**. El héroe del inicio pesa 19 KB en AVIF q70; `next/image` lo sirve como **WebP q75 de 16 KB** (`next.config.ts` no declara `images.formats`). En la comparación a 1:1 de `home-hero` (PNG original · AVIF · WebP servido) se pierde el grano y la espiral del agua, y los degradados del WebP muestran bloques.
- *Regla:* *Imagery* («paisaje luminoso»); brief, «generar a 2880».
- *Comando:* `/impeccable optimize`.

**[P1-4] `home.hero`: la figura se corta en móvil y tableta** ⏳
- *Medida:* el cuerpo de luz ocupa el 62–88 % del ancho (brief). Ventana visible: **0,46–0,72 en 390** (se ve un 38 % de la figura: el filo de la cabeza y el hombro, con el titular encima) y **0,36–0,78 en 768** (se pierden los pies). En 1440 y 1280 se ve entera (0,06–0,96).
- *Regla:* *Imagery*, cuerpo de luz en `home.hero`; «la fotografía se adapta al trabajo de cada realm».
- *Comando:* `/impeccable adapt`.

**[P1-5] Los slots `none` heredaron cajas pensadas para el vacío** ⏳
- *Medida:* `discover.result` cubre toda la sección de resultado: **1440×1556** (ventana 0,24–0,76, 3,3×) y **390×2047** (ventana **0,45–0,55**, 8,8×). `home.daily-frequency` mide 390×1318 (ventana 0,42–0,58). `booking.hero` mide 342×1330 en 390 (ventana 0,43–0,57) y 1152×957 en 1440. `discover.question-atmosphere`, que es **3:4**, cubre un viewport 16:9 en escritorio (ventana vertical 0,27–0,73, 2,65×). En móvil, `sanctuary.journal` (3:4) se pinta en una caja 2:1 (ventana vertical 0,31–0,69: el cuaderno, que está en los dos tercios inferiores, queda cortado), y `sanctuary.daily` (1:1) en 340×766 (0,28–0,72).
- *Regla:* «Do: dar a cada slot fotográfico su ratio (3:4, 1:1, 16:8, 16:9)» (*Do's*); contrato de ratio del slot.
- *Comando:* `/impeccable layout`.

**[P1-6] `portal.portal-field` es un panel con aristas dentro de un héroe a sangre** ⏳
- *Dónde:* `portal-scene.tsx`, todas las anchuras.
- *Medida:* caja de **979×900 en 1440** (`inset-x-[16%]`, `h-[72%]`) y **335×844 en 390**, con `opacity-35` y `mix-blend-screen`, sin máscara de bordes: se ven sus dos aristas verticales sobre `portal.hero`. Cuando el slot pintaba `none` el rectángulo no existía.
- *Regla:* «A sangre o dentro del eje, nunca a medias» (*Layout*).
- *Comando:* `/impeccable layout`.

**[P1-7] Carrito en 768: la columna pierde el margen de página** ⏳
- *Medida:* el kicker «Tu carrito» y las filas arrancan en **x = 0** (el eje está en 61 px); los nombres de producto se truncan («Ace…», «Cua…»). En 1440 el mismo kicker está en 309 px y el eje en 144.
- *Regla:* «Un solo eje de página» (*Layout*); «toda vista existe en móvil».
- *Comando:* `/impeccable adapt`.

**[P1-8] Producto destacado: un slot 1:1 forzado a 16:8** ⏳ *(se verá cuando llegue `p1`)*
- *Medida:* `store-product-visual` es 1:1 en el contrato, pero la tienda lo resuelve con `aspect: '16:8'` para el destacado, y las cajas medidas van de **0,61 a 2,23** de proporción (757×340 en 1440; 194×316 en 768). El brief pide el objeto al 55 % del alto con un 15 % de aire por cada lado; un recorte 2,23:1 conserva el **45 %** del alto, así que el objeto se cortará.
- *Regla:* contrato de ratio del slot; *Do's*. Es una **decisión de contrato** (sección 8).

**[P1-9] Regresión de la Parte 1: el diario vacío estira su columna** ⏳
- *Dónde:* mi-santuario, ≥1024 px, diario sin entradas.
- *Medida:* `sanctuary.journal` pasa de **340×574** (con datos) a **340×1102** (vacío), con una ventana visible de 0,29–0,71. La causa es la altura mínima `clamp(380px,48vw,600px)` que la Parte 1 dio al marco de `EmptyState`, que el diario hereda.
- *Regla:* contrato de ratio (3:4) del slot vecino; ritmo de la vista.

### P2 — molestia, hay rodeo

**[P2-1] Bordes de tarjeta sobre bandas que ya tienen foto.** `academy.featured-course`, `booking.hero` (marco de reserva) y `sanctuary.continue` meten la imagen en tarjetas de 22–26 px junto a bandas a sangre de la misma vista. Es correcto según *Shapes*, pero con foto en ambos niveles la vista mezcla dos materias con bordes distintos. Revisar con `/impeccable critique`.

**[P2-2] Acceso: una línea de 1 px entre `auth.hero` y `auth.form-atmosphere`** en 390 y 768 (gap medido de 1 px). En 390, además, `auth.hero` se queda en una tira de **390×230**.

**[P2-3] Relacionados de producto diminutos en 768:** `product.related` a **197×99** px, tres por fila.

**[P2-4] Dos aristas izquierdas dentro de una misma vista.** Mi-santuario: el saludo arranca en **238 px** y las tarjetas en **173** (1440; eje 144). Los contenedores centrados estrechos (carrito 309, final de curso 228, reserva confirmada 228, acceso 166) no rompen la vista, porque no tienen héroe con otro eje, pero no comparten el eje del resto del sitio.

**[P2-5] Huecos fuera de escala entre bandas:** membresía→banner del footer (185 px en 1440) y resonario héroe→archivo (154 px) no son `section` (112) ni `block` (72). Vienen de sumar el margen de un bloque al ritmo del contenedor.

**[P2-6] `experiences-visual` (16:9) en una caja 2,45:1 en 1440** (1152×470): cuando lleguen `e2…e4` se verá el 73 % de su alto. El sujeto está centrado al 45 % en vertical, así que debería caber, pero queda justo.

### P3 — pulido

- **[P3-1] La rama `fill={false}` de `EditorialImage` es código muerto.** Nadie la usa (`grep fill={false}` = 0). No deforma: con `h-auto` el navegador toma la proporción natural tras cargar. Pero ignora el ratio del slot (fija un intrínseco 1600×900) y su `object-cover` no tiene efecto. Quitarla o derivarla del ratio.
- **[P3-2] Las capturas de página completa salen más anchas que el viewport** en sobre-marisol (1514 px en 1440), inicio y resonario (390). La causa son capas decorativas `aria-hidden` recortadas por `overflow-x: clip` en `html`/`body`. `scrollWidth − clientWidth = 0` en todas las vistas y el usuario no puede desplazarse en horizontal: no hay desborde real.
- **[P3-3] La columna «Estado» del inventario** (`frontend/public/editorial/README.md`) sigue diciendo «Pendiente de asset» en 43 slots ya publicados.
- **[P3-4] `states.offline`:** la ventana está al 74 % del ancho, no «un poco a la derecha del centro» como pide el brief. El foco se fijó en `70% 45%` y se ve entera en todos los anchos (0,52–0,78 en 390).

## 5. Patrones sistémicos

1. **La banda es un rectángulo, no una materia.** Ningún componente funde los bordes superior e inferior de una imagen a sangre con el vacío. El ritmo `section` se aplica igual entre dos bandas que entre dos bloques de texto. *Una sola corrección en `FullBleedSection`/`EditorialBanner` cubre ~15 costuras.*
2. **El alto de la caja lo decide el contenido, y el ratio, nadie.** Los héroes a viewport, las secciones con fondo (`discover.result`, `home.daily-frequency`, `booking.hero`) y los paneles de tarjeta crecen con su texto, y la foto se adapta a cualquier proporción entre 0,46 y 2,45. El contrato fija el ratio, pero el layout no lo usa para dimensionar.
3. **`sizes` se escribe por ancho, pero `cover` escala por alto.** El fallo se repite en todos los slots a viewport y en todas las cajas verticales.
4. **El pipeline no sabe que la imagen ya viene optimizada.** AVIF → `next/image` → WebP.

## 6. Lo que funciona (conservar)

- **Ninguna deformación:** todas las imágenes medidas usan `object-fit: cover` con el `object-position` del contrato.
- **Retrato de Marisol:** el arco de nicho conserva la cara en todos los anchos (ventana 0–1, 0,63–0,82×: se pinta por debajo de la resolución de su fuente).
- **Portadas de audio dentro del disco:** 1254 px servidas a 384 (0,56–0,68×), nítidas; el destacado 2:1 enseña su centro en calma, como pide el brief.
- **Focos bien elegidos donde el sujeto está centrado:** `portal.hero`, `not-found.hero`, `discover.hero`, `states.*` y `cart.empty` mantienen el sujeto dentro de la ventana incluso en 390.
- **Los cuatro estados nuevos:** sin solapes en 1440, 1280, 768 y 390; la imagen del velo sin conexión se pinta sin red.
- **Sin desborde horizontal real en ninguna vista.**

## 7. Cambios de esta pasada

Ninguno: es una auditoría. La Parte 1 de esta rama (estados) se cerró antes de medir, y su regresión está registrada como P1-9.

## 8. Decisiones abiertas (no son del código)

1. **Regenerar o ampliar las fuentes a 2880 px.** Sin eso, ninguna banda a sangre baja de 1,7× en escritorio DPR 2. Opciones: regenerar con el brief, o ampliar con un modelo de super-resolución. **No toca el contrato.**
2. **Servir los AVIF tal cual o dejar que `next/image` los re-codifique.** Con `images.formats: ['image/avif', 'image/webp']` la pérdida es menor; con variantes pregeneradas y `unoptimized`, desaparece, a cambio de un paso de build.
3. **Producto destacado 16:8 frente al contrato 1:1** (P1-8). O se pinta el destacado a 1:1 (cambia el layout de la tienda), o el contrato admite una variante 16:8 de `p1` (**cambia el contrato**: un slot o una instancia nueva).
4. **Slots 3:4 usados como fondo de viewport** (`discover.question-atmosphere`, y `sanctuary.journal` en móvil). O el layout respeta la proporción vertical, o se pide una variante horizontal (**cambia el contrato**).
5. **¿Las bandas a sangre consecutivas se tocan o respiran?** Hoy respiran con `section` y aristas. Las dos opciones válidas dentro de `DESIGN.md` son fundir ambos bordes hasta el vacío conservando el hueco, o encadenarlas sin hueco con un fundido compartido. Es una decisión de dirección de arte.
6. **Los 15 slots pendientes cambiarán el layout al llegar:** `e2…e4` (cajas medidas de 0,88 a 2,45:1), `p1…p8` (de 0,61 a 2,23:1), `c1…c3` (2:1 en catálogo y detalle, el ratio de su contrato) y `academy.completion` (hoy no pinta nada, así que no se pudo medir).

## 9. Recomendaciones, por orden

1. **[P1] `/impeccable layout`:** fundido de bordes en las bandas a sangre (P1-1, P2-5), panel del portal con máscara o a sangre (P1-6) y cajas dimensionadas por el ratio del slot (P1-5, P1-9).
2. **[P1] `/impeccable optimize`:** `sizes` derivado del modo de la caja (P1-2) y el pipeline de formato (P1-3, decisiones 1–2).
3. **[P1] `/impeccable adapt`:** foco por breakpoint en `home.hero` sin tocar el foco del contrato (P1-4) y margen del carrito en 768 (P1-7).
4. **Trabajo previo:** pasar `instance` en la academia y la tienda, para que `c1…c3` y `p1…p8` se pinten en cuanto lleguen.
5. **[P2/P3]** relacionados de producto, ejes de mi-santuario, línea de acceso, rama `fill={false}` e inventario.

## 10. Método y límites

- **Herramienta:** Playwright 1.49.1, instalado fuera del repo, con el Chrome del sistema (`channel: 'chrome'`). Dev server en `localhost:3000` (`next dev --turbopack`), sin `next build` durante la medición. Las vistas de carga y error se midieron con dos rutas temporales bajo `/kit` que no se commitean.
- **Estados con datos:** el carrito y el diario se sembraron en `localStorage` (`fm.cart`, `fm.journal`). La compra confirmada se forzó fijando `Math.random` para que el pago simulado no fallara.
- **No verificado:**
  - la fase de **sintonía** de Descúbrete: con movimiento reducido el quiz salta directamente al resultado, y la captura «sintonía» muestra el resultado;
  - `descubrete-intro` en EN a 1440, por un fallo del navegador en esa captura (la versión ES sí está);
  - el **contraste** del texto sobre las fotos nuevas (sólo a ojo);
  - **Safari/Firefox** y los móviles reales;
  - el 404 con estado real, que exige `next build` + `next start`.
- **Ampliación** calculada sobre la variante que sirve `next/image` (parámetro `w` del `currentSrc`, acotado a la fuente). Las capturas a DPR 2 la hacen visible, pero la nota es numérica.
- **Ejes:** se midió la arista izquierda de `h1–h3` y kickers. Los títulos dentro de tarjetas aparecen como desviaciones esperadas y no se cuentan como defecto.
