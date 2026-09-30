# Frecuencia Mágica

Portal inmersivo y cinematográfico de bienestar (marca "Marisol"): un universo de 9 realms navegables, bilingüe ES/EN (idioma por defecto `es`). Stack: Next.js 15 App Router · React 19 · TypeScript strict · Tailwind CSS v4 · `motion` · next-intl · Zustand · Vitest. **No hay backend**: los puntos que lo requieren se marcan en código con `// TODO(backend)`.

## Fuentes de verdad

| Qué | Dónde |
|---|---|
| Plan de implementación (manda en arquitectura y funcional) | `docs/superpowers/plans/2026-07-28-frecuencia-magica-frontend.md` |
| Progreso por secciones del plan | `docs/superpowers/plans/sections-plan-completed.md` — actualízalo al completar secciones |
| Diseño visual (manda en lo visual) | Sistema ya codificado: tokens (paleta, tipografía, escalas, keyframes, `fm-surface`, zebra) en `frontend/src/app/tokens.css` —`globals.css` lo importa y añade sólo lo propio de la web—, realms en `frontend/src/config/`. Activos de marca fuera del repo: Brand Book y PRDs en `~/Descargas/` |
| Dirección editorial-mágica (contrato) | Tesis, lo que permanece, lo que cambia y anti-goals en `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md`; inventario de slots fotográficos en `frontend/public/editorial/README.md` |
| Lineamientos de diseño (tokens, escalas, eje de página, reglas de uso) | `DESIGN.md` en la raíz — el CSS (`tokens.css`) manda en los valores; si discrepan, se corrige `DESIGN.md` |
| Showcase del sistema de diseño | `Branding/` (Vite + React, autónomo): importa `tokens.css`, `config/`, `data/` y `messages/es.json` de la web y los muestra; ver `Branding/README.md` |
| Brief fotográfico (medidas, contenido y un prompt por imagen) | `docs/brief-fotografico.md`, **generado** desde `Branding/src/data/photography.js` con `npm run export:photo-brief`; el contrato de slots sigue en `frontend/src/config/editorial-media.ts` |
| Auditoría de coherencia visual (hallazgos, método, decisiones abiertas) | `docs/superpowers/audits/2026-09-30-design-coherence-audit.md` |
| Decisiones de accesibilidad | `frontend/docs/accessibility.md` |
| Decisiones de rendimiento y presupuestos | `frontend/docs/performance.md` |
| Lista de fidelidad por vista | `frontend/docs/fidelity-checklist.md` |

**El prototipo original se perdió**: `frontend-prototype/` fue eliminado del repo (commit `7c55bf0`). No reintentar comparar contra él ni contra ningún `.dc.html` de terceros (`~/Descargas/siu-premium-web-design-system/` es de otra marca). El sistema visual ya está codificado en `tokens.css` y `config/`; si un cambio visual necesita una referencia, usar el Brand Book de `~/Descargas/` y el plan. El código de producción vive en `frontend/`.

**Dirección editorial-mágica (2026-08-11)**: la fotografía entra como materia estructural sobre el world engine vivo («fotografía como materia; world engine como energía»). Contrato completo en `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md` e inventario de slots en `frontend/public/editorial/README.md`. Todo slot sin asset usa el skeleton editorial «zebra» (bandas de la paleta + barrido de luz + `data-media-slot`) — nunca cajas grises, stock ni Unsplash.

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

Showcase (desde `Branding/`, tiene su propio `package.json`): `npm run dev` · `npm run build` · `npm run lint` (oxlint) · `npm run export:photo-brief`. Si tocas `tokens.css` o el UI Kit, comprueba que `npm run build` de `Branding/` sigue pasando.

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
- Escalas con nombre (ver `DESIGN.md`): texto sobre fondo oscuro en cinco peldaños de marfil (`text-ivory`, `text-fg-body|soft|muted|meta`, nunca por debajo de 55%); sans en `text-label` (11px, sólo kickers y labels en MAYÚSCULAS), `text-meta` (13px), `text-body` (15px) y `text-lead` (17px); tracking en seis peldaños (`tracking-soft|ui|label|caps|kicker|eyebrow`); titulares con `Display`, eyebrows con `Kicker`, enlaces con flecha con `arrowLinkClasses`. Nada de `text-[Npx]`, `tracking-[…]`, `text-ivory/NN` ni `rgba()` de la paleta sueltos. Las escalas viven en el `@theme` de `frontend/src/app/tokens.css` (no en `globals.css`); al añadir una, registrarla en `src/lib/cn.ts` (`tailwind-merge` no la conoce).
- Eje de página: héroes, bandas y contenido arrancan en el mismo margen (`--page-inset` + `fm-container`); `FullBleedSection` y `EditorialBanner` son siempre a sangre.
- En Server Components, un botón-enlace es `ButtonLink` (`components/layout`): `Button asChild` + `Link` desaparece en silencio fuera de una frontera cliente (lo vigila un test).
- Accesibilidad/rendimiento: hit targets ≥ 44px, texto corrido y UI ≥ 15px (kickers 11px y meta 13px son las únicas excepciones, con los peldaños de arriba), foco visible sobre fondo oscuro, `aria-label` en todo control sólo-icono, `aria-hidden` en toda capa decorativa, `prefers-reduced-motion` respetado siempre. 60 FPS en desktop / 30 FPS en móvil de gama media; `devicePixelRatio` capado a 2; animar sólo `transform` y `opacity`.
- Breakpoints obligatorios: 1440 / 1280 / 768 / 390. Toda vista debe existir en móvil.
- Commits: Conventional Commits en inglés, terminando con `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

## Pitfalls

- `Branding/` fue reescrito el 2026-09-30: ya **no** es el showcase claro/pastel de junio de 2026 (eliminado), sino un espejo del sistema real que importa `tokens.css`. No declarar colores, tamaños ni radios en `Branding/`; un test de la web (`tests/lib/branding-tokens.test.ts`) lo vigila. Sus componentes (`Branding/src/components/ui/`) son puertos en JSX del UI Kit: si cambias una primitiva de `frontend/src/components/ui/`, actualiza su puerto.
- `docs/brief-fotografico.md` no se edita a mano: cambia `Branding/src/data/photography.js` y regenera; `tests/lib/photography-brief.test.ts` falla si el brief se desvía de `editorial-media.ts`, del catálogo o de `messages/`.

- El prototipo original ya no existe en el repo: no hay nada que comparar bajo `frontend-prototype/` (ver «Fuentes de verdad»).
- Vitest sólo recoge `tests/**/*.test.{ts,tsx}` (así lo define `vitest.config.ts`): un test dentro de `src/` no se ejecuta.
- Al ejecutar el plan: usa las skills `superpowers:subagent-driven-development` (recomendada) o `superpowers:executing-plans`.
- `next build` comparte `.next` con el dev server: tras ejecutar el gate completo, reiniciar `npm run dev` si sigue en uso.

## Alcance

- **Dentro:** los 9 realms (portal, home, acceso, descúbrete, biblioteca, academia, experiencias, tienda, mi santuario), responsive, estados de carga/vacío/error, 404, i18n ES/EN, dos escenas 3D puntuales y perezosas.
- **Aplazado (no construir sin pedirlo):** blog, membresía, about, contacto, búsqueda, perfil, favoritos, pedidos, notificaciones, ajustes, recuperar contraseña, pagos, CMS.
