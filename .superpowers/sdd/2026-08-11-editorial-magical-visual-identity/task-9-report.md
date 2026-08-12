# Task 9 — reporte

## Estado

COMPLETO sobre `bd1f8b0`.

## Qué se implementó

- Academia indexada con hero editorial full-width localizado en `academy.hero`, fallback zebra y scrim; el contenido conserva el tono y la navegación localizada.
- Curso destacado con `academy.featured-course` y archivo editorial de cursos con `academy-course-cover`, alts por instancia y `sizes` específicos para viewport/card/detalle.
- Detalle de curso convertido en spread media-led: portada editorial 16:8, caption localizado y rail de lecciones sticky/readable.
- Rail de lecciones con navegación semántica, `aria-current`, estados de progreso y targets mínimos de 44px.
- Lesson player cableado a `academy-lesson-visual` mediante `EditorialImage`; fallback zebra, `<audio controls>` nativo y explicación accesible mientras no exista un asset de audio.
- Prev/next/finish y rutas localizadas preservados.
- Completion editorial con `academy.completion`, copy localizado y CTA a Academia/Biblioteca.
- Loading actualizado para reflejar hero, destacado y archivo editorial con `MediaSkeleton`; animaciones nuevas con `motion-safe` y fallback global de reduced motion.
- Mensajes ES/EN añadidos para archivo, alts, label del audio y explicación deferred.

## Archivos modificados/creados

- `frontend/messages/es.json`
- `frontend/messages/en.json`
- `frontend/src/app/[locale]/academia/page.tsx`
- `frontend/src/app/[locale]/academia/[courseId]/page.tsx`
- `frontend/src/app/[locale]/academia/[courseId]/[lessonId]/page.tsx`
- `frontend/src/app/[locale]/academia/loading.tsx`
- `frontend/src/components/features/academy/course-list.tsx`
- `frontend/src/components/features/academy/course-card.tsx`
- `frontend/src/components/features/academy/course-detail.tsx`
- `frontend/src/components/features/academy/lesson-list.tsx`
- `frontend/src/components/features/academy/lesson-player.tsx`
- `frontend/tests/lib/academy-editorial.test.ts`
- Este reporte.

## TDD y verificación

- RED: `npm run test -- --run tests/lib/academy-editorial.test.ts` falló de forma esperada antes de la implementación: 1 fichero, 8 tests; 7 fallos por contratos editoriales ausentes.
- GREEN enfocado: 1 fichero, 8 tests pasan.
- Suite completa: `npm run test` — 36 ficheros, 214 tests pasan.
- Lint: `npm run lint` — exit 0.
- Typecheck: `npm run typecheck` — exit 0.
- Prettier dirigido sobre los 9 componentes/páginas de Academia y el test — todos pasan.
- `git diff --check` — limpio.
- No se ejecutó build, ni se inició ni se detuvo ningún dev server, conforme al brief.

## Concerns

- No se hizo verificación visual/browser ni SSR porque el brief prohíbe iniciar el dev server; queda para la revisión visual posterior.
- Los assets reales continúan fuera de alcance: todos los slots nuevos quedan preparados para `EditorialImage` y renderizan zebra sin URL remota.
- El reproductor nativo queda visible y explicado, pero sin fuente de audio hasta que exista el asset/backend correspondiente.

## Commit

`feat(academy): reshape courses as editorial learning spreads`

Trailer requerido:

`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`
