# Task 11 — Informe de cierre

## Estado

Task 11 queda cerrada desde el working tree parcial recibido. El primer implementador llegó a `max_iterations` sin crear commit ni informe; esta ronda no tomó ese reporte como evidencia: inspeccionó el diff real, comprobó los contratos existentes y corrigió los pendientes antes de verificar y commitear.

## Qué se implementó

- Se recompuso `/tienda` como catálogo editorial image-led: hero `store.hero` full-bleed, archivo bento de productos y banner `store.ritual-banner`.
- Se sustituyeron las bandas de producto por `EditorialImage`, manteniendo el fallback zebra mediante `resolveEditorialMedia` → `EditorialImage` → `MediaSkeleton` y `data-media-slot`. No se añadieron imágenes reales, URLs remotas, Unsplash, stock, CMS, backend ni proveedor de medios.
- Se cablearon los slots canónicos `store.hero`, `store-product-visual`, `store.ritual-banner`, `product.detail`, `product.related`, `cart.empty` y `checkout.confirmation`.
- Los alts se resolvieron desde `messages/es.json` y `messages/en.json`; los productos conservan alts por instancia y el atributo editorial de cada card refleja su slot real, incluido `product.related`.
- Se recompuso el detalle alrededor de un campo dominante `product.detail`, rail de título/precio/CTA y relacionados con `product.related`. Se conservaron `add`, `buyNow`, la frecuencia relacionada y la navegación localizada.
- Se conservaron los accordions con `aria-expanded`, `aria-controls`, paneles `hidden`, layout instantáneo y soporte de reduced motion.
- Se mantuvieron carrito y checkout task-first: estado vacío `cart.empty`, imágenes de líneas, controles de cantidad de 44 px, subtotales/envío/total, checkout simulado, `ErrorState` preparado y confirmación editorial `checkout.confirmation`.
- El loading de tienda replica el hero, ritmo bento y banner con zebra; sus etiquetas también quedaron localizadas (se eliminó copy hardcodeado del loading).
- Se conserva la modificación de mensajes necesaria para los alts ES/EN, dentro del alcance editorial de esta tarea.

## Ajustes realizados en esta ronda

1. Se revisó el diff completo real y se confirmó que los errores de typecheck reportados previamente (`productMedia` y la prop `media` de checkout) ya estaban resueltos.
2. Se reemplazaron las etiquetas hardcodeadas del loading (`Producto destacado`, `Los objetos del ritual`) por claves traducidas.
3. Se hizo dinámico `data-editorial-media` en `ProductCard` para que no declare siempre `store-product-visual` cuando la card representa `product.related`.
4. Se actualizó el test editorial enfocado para cubrir ese contrato dinámico.

## Verificaciones frescas de esta ronda

Ejecutadas desde `frontend/`:

- `npm test -- tests/lib/store-editorial.test.ts` — **9 tests passed**.
- `npm test` — **38 test files passed, 230 tests passed**.
- `npm run lint` — **exit 0**.
- `npm run typecheck` — **exit 0**.
- `npx prettier --check` sobre los 15 archivos de producción/mensajes modificados y `frontend/tests/lib/store-editorial.test.ts` — **todos usan el estilo Prettier**.
- `git diff --check` — **sin errores**.

No se ejecutó `build`: no forma parte de la lista de comandos requeridos para este cierre y no se levantó servidor. Tampoco se hizo smoke visual en `localhost:3000`.

## Archivos incluidos

- `frontend/messages/en.json`
- `frontend/messages/es.json`
- `frontend/src/app/[locale]/tienda/page.tsx`
- `frontend/src/app/[locale]/tienda/[productId]/page.tsx`
- `frontend/src/app/[locale]/tienda/carrito/page.tsx`
- `frontend/src/app/[locale]/tienda/loading.tsx`
- `frontend/src/components/features/store/cart-button.tsx`
- `frontend/src/components/features/store/cart-view.tsx`
- `frontend/src/components/features/store/checkout.tsx`
- `frontend/src/components/features/store/order-confirmation.tsx`
- `frontend/src/components/features/store/order-summary.tsx`
- `frontend/src/components/features/store/product-card.tsx`
- `frontend/src/components/features/store/product-detail.tsx`
- `frontend/src/components/features/store/product-grid.tsx`
- `frontend/src/components/features/store/product-sections.tsx`
- `frontend/tests/lib/store-editorial.test.ts`
- Este informe.

## Concerns

- Todos los slots siguen sin asset por la restricción de esta tarea; el comportamiento verificado es el fallback zebra intencional. Cuando se incorporen assets aprobados, deberán mantenerse los mismos slots, ratios, focal points y alts por instancia.
- La verificación disponible fue estática/lógica y de toolchain; queda fuera de esta ronda la inspección visual en navegador a 390 px y el build solicitado explícitamente como no ejecutar.

---

## Apéndice — cierre efectivo de la ronda de fixes

La evidencia del encabezado anterior no se reutilizó como prueba de cierre: al comenzar esta ronda, el working tree no tenía commit y el focused test real fallaba en 2 de 9 tests por expectativas source-level desalineadas (`media.related[relatedProduct.id]` frente a la aserción non-null real y `cartLines(items, PRODUCTS)` frente al selector inline). Se inspeccionó el código y el diff actuales antes de corregir.

### Hallazgos cerrados

- Medios del catálogo y relacionados tipados como mapas por `product.id`; cada instancia resuelve su `EditorialMedia`, incluyendo el relacionado.
- `ProductCard` consume `media.aspect` y expone `media.slot`; `product.related` queda explícitamente en ratio `16:8`.
- Alts bilingües por instancia: los relacionados usan `media.alt.related` con `{title}` en ambos catálogos; no se añadieron URLs, imágenes reales, stock ni dependencias.
- Loading editorial zebra con `aria-busy="true"` y alturas `clamp` iguales a los campos de producto (`190–260px` y destacado `210–340px`); se eliminaron los `min-h` desalineados del skeleton.
- `sizes` queda contenido para producto, detalle, relacionados, carrito y confirmación; sólo hero y banner ritual full-bleed conservan `100vw`.
- Checkout se modela como `cart | error | success`; el retry sólo vuelve a `cart`, sin limpiar carrito ni confirmar pedido.
- `CartView`, `OrderSummary` y `CartButton` calculan desde `cartLines` válidas, de modo que IDs obsoletos no cuentan ni entran en totales. `CartLineRow` usa la composición de dos filas/columna secundaria necesaria para 390px y mantiene controles de 44px.
- Se restauró únicamente el reflow ajeno de `discover.questions` en ambos JSON; el diff de mensajes queda limitado a los alts de tienda.
- Se eliminó el `aria-hidden` redundante del uso de `OrbitalRings`; el componente mantiene su propia semántica decorativa.
- El test source-level se actualizó para los contratos reales y conforme a las convenciones de `AGENTS.md`.

### Verificación efectiva

Ejecutadas de nuevo después de inspeccionar y corregir:

- `npm test -- tests/lib/store-editorial.test.ts` — **1 test file, 9/9 tests passed**.
- `npm test` — **38/38 test files, 230/230 tests passed**.
- `npm run lint` — **exit 0**.
- `npm run typecheck` — **exit 0**.
- Prettier dirigido sobre los archivos allowlisted de tienda, mensajes y test — **All matched files use Prettier code style**.
- `git diff --check` — **exit 0, sin salida**.
- Auditoría de alcance — **0 archivos fuera de allowlist**; el diff no contiene `unsplash`, URLs remotas, `stock`, cambios de dependencias ni `package*.json`.

El informe está bajo `.superpowers` y debe incluirse con `git add -f`; el resto del staging se hará con rutas allowlisted explícitas. No se modificaron plan ni ledger general.
