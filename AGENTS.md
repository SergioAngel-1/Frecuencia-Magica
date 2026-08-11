# Frecuencia Mágica

Portal inmersivo y cinematográfico de bienestar (marca "Marisol"): un universo de 9 realms navegables, bilingüe ES/EN (idioma por defecto `es`). Stack: Next.js 15 App Router · React 19 · TypeScript strict · Tailwind CSS v4 · `motion` · next-intl · Zustand · Vitest. **No hay backend**: los puntos que lo requieren se marcan en código con `// TODO(backend)`.

## Fuentes de verdad

| Qué | Dónde |
|---|---|
| Plan de implementación (manda en arquitectura y funcional) | `docs/superpowers/plans/2026-07-28-frecuencia-magica-frontend.md` |
| Progreso por secciones del plan | `docs/superpowers/plans/sections-plan-completed.md` — actualízalo al completar secciones |
| Diseño visual (manda en lo visual) | `frontend-prototype/project/Frecuencia Magica.dc.html` + `DESIGN_CONTEXT.md` |

`frontend-prototype/` es **sólo lectura**: nunca modificarlo. El código de producción vive en `frontend/`. Si prototipo y plan se contradicen: el prototipo manda en lo visual, el plan en lo arquitectónico y funcional.

## Comandos (siempre desde `frontend/` — la raíz del repo no tiene package.json)

```bash
npm run dev          # dev server con Turbopack en http://localhost:3000
npm run lint         # ESLint 9 (flat config)
npm run typecheck    # tsc --noEmit
npm run test         # Vitest run
npm run test:watch   # Vitest en watch
npm run build        # next build --turbopack
npm run format       # Prettier (format:check para sólo verificar)
```

Gate de terminado — los cuatro deben quedar en verde:

```bash
npm run lint && npm run typecheck && npm run test && npm run build
```

## Arquitectura (tres capas, sin saltárselas)

- `src/components/ui/` — UI Kit **puro**: no importa de `data/`, `stores/` ni `i18n/`; recibe el texto ya traducido por props.
- `src/components/world/` — motor inmersivo (canvas cósmico, cursor, audio, geometría sagrada), montado una sola vez en el layout.
- `src/components/features/<realm>/` — un subdirectorio por realm; compone UI Kit + world + datos.
- `src/app/[locale]/` — rutas por realm; toda página empieza con `const locale = await resolveLocale(params);`.
- `src/data/` — catálogo tipado **sin textos**: sólo claves de traducción. Todo el copy vive en `messages/{es,en}.json`.
- `src/lib/` — utilidades puras y reducers de flujo (quiz, booking, cart, auth-validation).
- `src/stores/` — Zustand para estado transversal (player, cart, ambient, journal, portal).
- `tests/` — espejo de `src/`; **sólo lógica** (stores, reducers, hooks, utilidades). No se testean componentes visuales.

## Convenciones

- TS `strict` + `noUncheckedIndexedAccess`; cero `any` sin comentario que lo justifique. Type-imports (`import type`).
- Copy siempre en ES **y** EN, nunca hardcodeado en un componente; `tests/i18n/messages.test.ts` verifica que ambos catálogos tienen las mismas claves. Voz de marca: íntima, serena, poética, en segunda persona ("vuelve a ti", "respira") — nunca marketing agresivo ni jerga wellness.
- Enlaces internos: `Link` de `@/i18n/navigation`, nunca `next/link` (traduce `/biblioteca` ↔ `/en/library`).
- Server Components por defecto; `"use client"` sólo con estado, efectos, listeners o animación imperativa. Un componente por archivo (~200 líneas máx).
- Reducers puros: las funciones reciben sus dependencias no deterministas (`Math.random`, `Date`) por parámetro para poder testearlas.
- ESLint: `no-console` es error (sólo `warn`/`error`); vars no usadas son error salvo prefijo `_`.
- Paleta exacta, sin colores ni fuentes nuevos: `--void #0F1B2E`, `--void-2 #0a1220`, `--gold #D8B978`, `--teal #96C6BC`, `--lav #B9B0D6`, `--ivory #F7F4EA`, `--color-warn #C98B7A` (sólo errores de formulario); glass `rgba(247,244,234,0.045)` + borde `rgba(216,185,120,0.20)`. Fondo de app: `radial-gradient(140% 100% at 50% -10%, #16273f 0%, var(--void) 45%, var(--void-2) 100%)`. Cormorant Garamond (títulos, cifras, precios, poético) · Jost (kickers, labels, UI); body en peso 300, kickers en MAYÚSCULAS 11px con `letter-spacing` .14em–.4em. Acentos como halos/bordes/glows, nunca rellenos sólidos grandes.
- Sin emojis (única excepción: ✓ de confirmación). Placeholders prohibidos: fotos de stock, Unsplash, cajas grises — todo placeholder es gradiente/geometría/luz. El único bitmap permitido es el logo.
- Movimiento: nada es estático (fondo vivo, elementos que respiran/flotan/orbitan); entradas con fade-up escalonado (`.1s`, `.25s`, `.4s`, `.55s`); nada aparece de golpe.
- Accesibilidad/rendimiento: hit targets ≥ 44px, texto ≥ 15px, foco visible sobre fondo oscuro, `aria-label` en todo control sólo-icono, `aria-hidden` en toda capa decorativa, `prefers-reduced-motion` respetado siempre. 60 FPS en desktop / 30 FPS en móvil de gama media; `devicePixelRatio` capado a 2; animar sólo `transform` y `opacity`.
- Breakpoints obligatorios: 1440 / 1280 / 768 / 390. Toda vista debe existir en móvil.
- Commits: Conventional Commits en inglés, terminando con `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

## Pitfalls

- `frontend-prototype/` es read-only: ni editar ni reescribir; cualquier cambio ahí se descarta.
- La ruta del prototipo lleva espacios (`Frecuencia Magica.dc.html`): entrecomillarla siempre en shell.
- Vitest sólo recoge `tests/**/*.test.{ts,tsx}` (así lo define `vitest.config.ts`): un test dentro de `src/` no se ejecuta.
- Al ejecutar el plan: usa las skills `superpowers:subagent-driven-development` (recomendada) o `superpowers:executing-plans`.

## Alcance

- **Dentro:** los 9 realms (portal, home, acceso, descúbrete, biblioteca, academia, experiencias, tienda, mi santuario), responsive, estados de carga/vacío/error, 404, i18n ES/EN, dos escenas 3D puntuales y perezosas.
- **Aplazado (no construir sin pedirlo):** blog, membresía, about, contacto, búsqueda, perfil, favoritos, pedidos, notificaciones, ajustes, recuperar contraseña, pagos, CMS.
