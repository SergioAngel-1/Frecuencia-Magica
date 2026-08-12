# Task 10 — reporte de cierre

## Estado

`DONE_WITH_CONCERNS` — Task 10 queda implementada y verificada en el working tree. Todos los checks solicitados pasan. La limitación restante es deliberada: no se arrancó servidor de desarrollo ni se hizo smoke visual/browser, y no se ejecutó `build` porque el brief pidió focused test, suite, lint, typecheck, Prettier dirigido y `git diff --check`, además de prohibir el servidor.

## Alcance implementado

- Hero de Experiencias recompuesto como escena editorial full-bleed con `experiences.hero`, `FullBleedSection`, scrim y copy localizado.
- Encuentro destacado recompuesto como banner full-width image-led con `experiences.featured`, CTA fuerte de reserva, precio y duración.
- Archivo secundario recompuesto como filas editoriales image-led con rail de metadatos, `experiences-visual`, modo, duración, precio y enlaces localizados.
- Flujo de reserva recompuesto sobre `booking.hero`; la confirmación es un cierre full-width silencioso con `booking.confirmation`, `aria-live="polite"`, `role="status"` y CTA de retorno.
- Los cinco slots existentes resuelven mediante `resolveEditorialMedia` sin `src` ni URL real en este task. `EditorialImage` cae en `MediaSkeleton` zebra y conserva `data-media-slot`.
- Alts de media añadidos para ES/EN y resueltos desde el locale activo en las rutas. No se añadió fotografía, stock ni asset remoto.
- Se alineó el focal point de `experiences.featured` con el inventario editorial (`50% 45%`).
- Booking conserva `useBooking`/reducer, selección con `aria-pressed`, fechas locale-aware mediante `toLocaleDateString`, validación `canContinue`/`canConfirm`, navegación hacia atrás y `TODO(backend)`.
- Loading actualizado a silueta editorial zebra para hero, destacado y filas, con `aria-busy` y animación `motion-safe`.

## Archivos modificados

- `frontend/messages/es.json`
- `frontend/messages/en.json`
- `frontend/src/config/editorial-media.ts`
- `frontend/src/app/[locale]/experiencias/page.tsx`
- `frontend/src/app/[locale]/experiencias/loading.tsx`
- `frontend/src/app/[locale]/experiencias/[experienceId]/reservar/page.tsx`
- `frontend/src/components/features/experiences/booking-flow.tsx`
- `frontend/src/components/features/experiences/experience-list.tsx`
- `frontend/src/components/features/experiences/experience-row.tsx`
- `frontend/tests/lib/experiences-editorial.test.ts`
- `.superpowers/sdd/2026-08-11-editorial-magical-visual-identity/task-10-report.md`

No se modificaron el plan ni el registro general.

## Decisiones y contratos verificados

- Slots canónicos usados: `experiences.hero`, `experiences.featured`, `experiences-visual`, `booking.hero`, `booking.confirmation`.
- Resolver sin media: `kind: 'fallback'`, `src` ausente, ratio de registry conservado y zebra con `data-media-slot`.
- Enlaces internos: `Link` de `@/i18n/navigation`; no se introdujo `next/link`.
- La lista mantiene el split `featured = EXPERIENCES[0]` y `others = EXPERIENCES.slice(1)`.
- El test de contrato se mantiene dentro de `frontend/tests/`, que sí recoge Vitest.
- El escaneo de líneas añadidas encontró cero URL remota y cero rutas de imagen en producción; las únicas coincidencias de URL son las expresiones negativas del propio test que las prohíbe.

## TDD RED/GREEN

- **RED reproducible:** se creó un worktree temporal limpio en `HEAD` (`981a41a`), se copió únicamente `experiences-editorial.test.ts` y se ejecutó:
  `npm run test -- --run tests/lib/experiences-editorial.test.ts`
  Resultado real: `1` fichero fallido, `5 failed | 1 passed` de 6 tests, exit `1`. Falló por la ausencia de copy/media wiring en la base; el worktree temporal se eliminó después.
- **GREEN enfocado final:**
  `npm run test -- --run tests/lib/experiences-editorial.test.ts`
  Resultado real: `1` fichero, `6 passed`, exit `0`.

## Verificación final

Todos los comandos se ejecutaron desde `frontend/` salvo `git diff --check`:

- `npm run test -- --run tests/lib/experiences-editorial.test.ts` — **PASS**, 1 fichero / 6 tests.
- `npm run test` — **PASS**, 37 ficheros / 221 tests.
- `npm run lint` — **PASS**, exit `0`.
- `npm run typecheck` — **PASS**, exit `0`.
- `npx prettier --check src/config/editorial-media.ts 'src/app/[locale]/experiencias/page.tsx' 'src/app/[locale]/experiencias/loading.tsx' 'src/app/[locale]/experiencias/[experienceId]/reservar/page.tsx' src/components/features/experiences/booking-flow.tsx src/components/features/experiences/experience-list.tsx src/components/features/experiences/experience-row.tsx tests/lib/experiences-editorial.test.ts` — **PASS**, todos los archivos usan el estilo Prettier.
- Parseo de `messages/es.json` y `messages/en.json` con Node `JSON.parse` — **PASS**.
- `git diff --check` — **PASS**, sin whitespace errors.

Se evitó reformatear arrays preexistentes ajenos a Task 10 en los catálogos de mensajes; por eso el Prettier fue dirigido a código/test y los JSON se validaron sintácticamente.

## Concerns

- No se hizo verificación visual, SSR ni browser smoke: el usuario indicó no arrancar `dev server`. Los tests de TSX son contratos de wiring, no prueban crop, stacking, contraste ni render DOM.
- Los cinco slots quedan intencionadamente sin asset real y renderizan zebra hasta que exista contenido editorial/backend. No es un fallo del task.
- No se ejecutó `npm run build`; no formaba parte de los comandos solicitados y se mantuvo el alcance acotado al cierre de Task 10.

## Commit

El cierre queda contenido en un único commit atómico con este subject:

`feat(experiences): compose gatherings as full-bleed editorial scenes`

Trailer requerido:

`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`

## Apéndice — corrección P1 T10-P1-01

La revisión confirmó que el listado no exponía ninguna fecha escaneable. La corrección mínima conserva el catálogo y el flujo existente: `ExperienceList` obtiene una fecha localizada por experiencia mediante `upcomingDates(new Date(), EXPERIENCES.length, locale)` y `ExperienceRow` la renderiza como `<time dateTime={date.iso}>` junto a modalidad y precio. La fecha se muestra tanto en la experiencia destacada como en cada fila, con `dateLabel` localizado en ES/EN; no se hardcodeó ninguna fecha en un componente.

Se actualizó el contrato editorial para exigir el uso de `upcomingDates`, el paso de fechas a las dos ramas de fila y el renderizado `time` con día, mes y día de la semana. No se modificaron reducer, booking, navegación `@/i18n/navigation`, slots de media ni assets.

Verificación de esta corrección:

- `npm run test -- --run tests/lib/experiences-editorial.test.ts` — **PASS**, 1 fichero / 6 tests.
- `npm run test` — **PASS**, 37 ficheros / 221 tests.
- `npm run lint` — **PASS**, exit `0`.
- `npm run typecheck` — **PASS**, exit `0`.
- `npx prettier --check 'src/components/features/experiences/experience-row.tsx' 'src/components/features/experiences/experience-list.tsx' 'tests/lib/experiences-editorial.test.ts'` — **PASS**.
- `node -e "JSON.parse(...)"` para ambos catálogos — **PASS**.
- `git diff --check` — **PASS**.

`npx prettier --check` sobre los dos JSON completos continúa detectando formato preexistente fuera de este cambio; no se reformatearon para evitar ruido ajeno. No se arrancó servidor ni se hizo build/browser smoke, conforme al alcance indicado.

Commit atómico de la corrección:

`fix(experiences): keep session dates scannable`

Trailer:

`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`
