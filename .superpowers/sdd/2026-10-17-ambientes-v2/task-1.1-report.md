# Task 1.1 — Selector manual de ambiente

**Estado:** DONE_WITH_CONCERNS
**Commit:** fae5243 `feat(atmosphere): add manual atmosphere picker on listening places` (rama feat/ambientes-v2, sin push)

## Qué se hizo
- `frontend/src/config/atmospheres.ts`: nueva constante `PICKER_ATMOSPHERES = ['dusk', 'dawn', 'moon']` junto a `LISTENING_PLACES` (lista y orden desde config).
- `frontend/src/lib/atmosphere/picker.ts`: funciones puras `eligibleAtmospheres()` y `showsPicker(place)`.
- `frontend/src/components/features/atmosphere/atmosphere-picker.tsx`: `AtmospherePicker` (feature, usa store e i18n). Botón «Ambiente del sitio» (`clear()`) más una opción por atmósfera elegible (`setManual(id)`); activa = `aria-pressed`; devuelve `null` fuera de los places de escucha. Descripción de la atmósfera que se ve, debajo del grupo.
- `messages/{es,en}.json`: `atmospheres.<id>.description` y `.pickerLabel` para las nueve; `atmospheres.picker.{label,site}`.
- `resonario-system.tsx` (cabecera, antes de los filtros) y `descubrete/result-step.tsx` (entre el texto y los CTA).
- `frontend/tests/lib/atmosphere-picker.test.ts`: 8 tests (lista y orden desde config, ids válidos sin repetir, sin `night`, copy ES/EN completo, `showsPicker` dentro/fuera de escucha, `setManual`/`clear` en el store).

## Verificación
- `npm run format:check` → OK
- `npm run lint` → OK (exit 0)
- `npm run typecheck` → OK (exit 0)
- `npx vitest run tests/lib/atmosphere-picker.test.ts` → 8 passed (antes, con el módulo ausente, fallaba: TDD)
- `npm run test` (suite completa) → 85 files, 665 tests passed
- `npm run build` → Compiled successfully, 115 páginas estáticas generadas (exit 0)

## Decisiones y preocupaciones
1. **No se usa `SegmentedControl`.** Es un `tablist` con `aria-selected` y roving tabindex; el brief pide `aria-pressed`. Se hizo un grupo de botones con `aria-pressed` (mismo patrón que `daily-frequency.tsx`). Si se quiere el control compartido, hay que decidir entre el ARIA del tablist y el de toggle.
2. **`forest` no es elegible todavía.** Existe en `ATMOSPHERES`, pero el plan (Task 2.1) la hace elegible al calibrarla. Se deja fuera de `PICKER_ATMOSPHERES`; añadirla es una línea.
3. **Hidratación:** la elección viene de `sessionStorage`; hasta `useMounted()` ninguna opción está pulsada y la descripción usa el sitio, para no desajustar el SSR.
4. **Copy:** las descripciones y etiquetas son propuestas mías (ES y EN), sin revisar por la marca. Voz sin claims médicos.

## Sin ver visualmente (no verificable en este entorno)
- Disposición del grupo en móvil (wrap), contraste de `text-fg-soft` / `bg-accent/16` sobre cada atmósfera (la guarda de contraste sólo cubre tokens, no este componente), y cómo queda el selector en Resonario y en el resultado de Descúbrete.
- Que el anuncio aria-live al pulsar salga correctamente (depende de la región del provider, no se añadió otra).

## Ronda de arreglo 1 (revisor: borde de control)
- Hallazgo: los botones sin pulsar usaban `border-line` (decorativo); la norma es `border-line-strong` para bordes de control.
- Arreglo: `OPTION_BASE` lleva `border-line-strong` en ambos estados y en ambos botones; `OPTION_ACTIVE` (`bg-accent/16 text-fg`) y `OPTION_IDLE` (`bg-surface text-fg-soft hover:text-fg`) eliminan los ternarios duplicados; `siteActive` calcula el estado del botón «Ambiente del sitio».
- Sin guarda nueva (sólo el arreglo).

Comandos y salida:
- `npx prettier --write src/components/features/atmosphere/atmosphere-picker.tsx` → reformateado.
- `npm run format:check` → exit 0 («All matched files use Prettier code style!»).
- `npm run lint` → exit 0. `npm run typecheck` → exit 0.
- `npx vitest run tests/lib/atmosphere-picker.test.ts tests/lib/semantic-color-usage.test.ts` → 2 files, 13 tests passed.
- `npx vitest run` (suite completa) → 85 files, 665 tests passed.
