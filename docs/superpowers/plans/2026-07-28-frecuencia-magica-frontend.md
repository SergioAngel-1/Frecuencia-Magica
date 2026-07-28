# Frecuencia Mágica — Frontend Real · Plan de Implementación

> **Para agentes:** SUB-SKILL REQUERIDA: usa `superpowers:subagent-driven-development` (recomendado) o `superpowers:executing-plans` para ejecutar este plan tarea por tarea. Los pasos usan sintaxis de checkbox (`- [ ]`) para seguimiento.

**Goal:** Construir en `frontend/` el frontend de producción de Frecuencia Mágica — un portal inmersivo bilingüe ES/EN con 9 realms — reconstruyendo 1:1 la dirección visual del prototipo `frontend-prototype/` sobre una arquitectura limpia, modular y con componentes reutilizables.

**Architecture:** Next.js 15 App Router con rutas reales localizadas por realm (`/[locale]/...`). Tres capas separadas: (1) **World engine** — canvas cósmico, cursor luminoso, audio ambiental, transición de portal y geometría sagrada, montados una sola vez en el layout raíz y recoloreados por contexto de realm; (2) **UI Kit** — primitivas puras y sin estado (botones, glass, inputs, discos, estados); (3) **Features** — un módulo por realm que compone UI Kit + world engine + datos. El estado transversal (reproductor, carrito, audio ambiental, diario) vive en stores de Zustand; el estado de flujo (quiz, reserva, checkout) vive en reducers puros y testeados.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 (CSS-first `@theme`) · `motion` (Framer Motion) · `next-intl` · `zustand` · `lenis` · `@react-three/fiber` + `@react-three/drei` (lazy, sólo 2 escenas) · Vitest + happy-dom + Testing Library (sólo lógica).

---

## Global Constraints

Estas reglas aplican a **todas** las tareas. No repetirlas en cada una, pero cumplirlas siempre.

### Producto y marca

- **Directorio de trabajo:** todo el código nuevo vive bajo `frontend/`. Nunca modificar `frontend-prototype/` (es fuente de verdad de sólo lectura).
- **Fuente de verdad visual:** `frontend-prototype/project/Frecuencia Magica.dc.html` (ojo: el nombre lleva espacios, entrecomillar siempre en shell). El documento de contexto es `frontend-prototype/project/DESIGN_CONTEXT.md`. Los 4 PRD están en `frontend-prototype/project/uploads/PRD - FRECUENCIA MÁGICA {1,2,3,4}`.
- **Bilingüe siempre:** cada string visible se define en ES y EN. Nunca hardcodear texto en un componente. Idioma por defecto: `es`.
- **Voz de marca:** íntima, serena, poética, en segunda persona ("vuelve a ti", "respira"). Nunca marketing agresivo ni jerga wellness genérica. El copy del prototipo ya está en esta voz y se porta **verbatim**.
- **Sin slop:** cero emojis (salvo el ✓ de confirmación ya existente), sin gradientes chillones, sin relleno vacío. Minimalismo cálido.
- **Placeholders:** prohibidas las fotos de stock, Unsplash, Lorem Picsum y las cajas grises. Todo placeholder es una composición de gradiente/geometría/luz que ya parece arte final. El único bitmap permitido es el logo.

### Sistema visual (valores exactos, no aproximar)

| Token | Valor |
|---|---|
| `--void` | `#0F1B2E` |
| `--void-2` | `#0a1220` |
| `--gold` | `#D8B978` |
| `--teal` | `#96C6BC` |
| `--lav` | `#B9B0D6` |
| `--ivory` | `#F7F4EA` |
| `--glass` | `rgba(247,244,234,0.045)` |
| `--glass-brd` | `rgba(216,185,120,0.20)` |
| Fondo app | `radial-gradient(140% 100% at 50% -10%, #16273f 0%, var(--void) 45%, var(--void-2) 100%)` |
| Texto secundario | `--ivory` a opacidad `0.55`–`0.78` |
| Botón primario | fondo `rgba(247,244,234,0.95)`, texto `#12213a` |
| Radios | cards `18–26px`, pills/botones `999px`, discos `50%` |
| Glass | `background: var(--glass)` + `border: 1px solid var(--glass-brd)` + `backdrop-filter: blur(10–14px)` |

- **No introducir colores ni fuentes nuevas.** Los acentos entran como halos, bordes y glows — nunca como rellenos sólidos grandes. Máximo 1–2 colores de fondo por vista.
- **Tipografía:** `Cormorant Garamond` (serif) para títulos, números de frecuencia, precios y texto poético — pesos 300/400/500/600 + itálicas 300/400. `Jost` (sans) para kickers, labels, meta y UI — pesos 300/400/500. Body en peso 300. Kickers en MAYÚSCULAS, 11px, `letter-spacing` entre `.14em` y `.4em`.

### Movimiento

- **Nada es estático.** Toda vista tiene fondo vivo, elementos que respiran/flotan/orbitan y entradas con fade-up escalonado (delays `.1s`, `.25s`, `.4s`, `.55s`).
- **`prefers-reduced-motion: reduce` se respeta siempre.** Modo simplificado: se congelan animaciones decorativas, se mantiene la estructura narrativa y las transiciones de estado quedan en fundido instantáneo. Nunca eliminar contenido.
- **Nada aparece de golpe.** Todo emerge: fade, float, materializar, disolver.

### Accesibilidad y rendimiento

- Hit targets ≥ **44px**. Texto base ≥ **15px**.
- Foco visible en todo elemento interactivo, navegación completa por teclado, landmarks semánticos (`header`/`nav`/`main`/`footer`), `aria-label` en todo control sólo-icono.
- Objetivo **60 FPS** en desktop moderno, mínimo **30 FPS** en móvil de gama media. `devicePixelRatio` capado a 2. Pausar animaciones fuera de pantalla. Lazy-load de las escenas 3D.
- Breakpoints de diseño obligatorios: **1440** (desktop), **1280** (laptop), **768** (tablet), **390** (móvil). Toda vista debe existir en móvil, no sólo en desktop.

### Código

- TypeScript `strict`. Cero `any` sin comentario justificando.
- Un componente por archivo. Ficheros enfocados; si un archivo supera ~200 líneas, dividir por responsabilidad.
- Server Components por defecto; `"use client"` sólo donde hay estado, efectos, listeners o animación imperativa.
- Los componentes de UI Kit son **puros**: no leen stores ni datos, sólo reciben props.
- Commits frecuentes y atómicos, uno por tarea como mínimo, en español o inglés pero consistente (usar Conventional Commits en inglés).
- Cada commit debe terminar con:
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`

### Alcance acordado

- **Dentro:** los 9 realms del prototipo (portal, home, auth, descúbrete, biblioteca, academia, experiencias, tienda, mi santuario), responsive completo, estados de carga/vacío/error, 404, i18n ES/EN, dos escenas 3D puntuales y perezosas.
- **Fuera (fase futura, documentar pero no construir):** blog, membresía como página propia, about, contacto, búsqueda global, perfil, favoritos, pedidos, reservas listadas, notificaciones, ajustes, recuperar contraseña, magic link, backend real, pagos reales, CMS.
- **Testing:** sólo lógica — stores, reducers, hooks y utilidades puras con Vitest. No se testean componentes visuales ni se monta Playwright.

---

## Estructura de ficheros

```
frontend/
├── messages/
│   ├── es.json                      # todo el copy ES
│   └── en.json                      # todo el copy EN
├── public/
│   └── logo.png                     # copiado del prototipo
├── src/
│   ├── app/
│   │   ├── layout.tsx               # <html>, fuentes, metadata base
│   │   ├── globals.css              # @theme, keyframes, reset
│   │   └── [locale]/
│   │       ├── layout.tsx           # providers + world engine + shell
│   │       ├── page.tsx             # Portal
│   │       ├── not-found.tsx        # 404
│   │       ├── error.tsx            # error boundary
│   │       ├── inicio/page.tsx      # Home
│   │       ├── acceso/page.tsx      # Auth
│   │       ├── descubrete/page.tsx
│   │       ├── biblioteca/page.tsx
│   │       ├── academia/page.tsx
│   │       ├── academia/[courseId]/page.tsx
│   │       ├── academia/[courseId]/[lessonId]/page.tsx
│   │       ├── experiencias/page.tsx
│   │       ├── experiencias/[experienceId]/reservar/page.tsx
│   │       ├── tienda/page.tsx
│   │       ├── tienda/[productId]/page.tsx
│   │       ├── tienda/carrito/page.tsx
│   │       └── mi-santuario/page.tsx
│   ├── components/
│   │   ├── ui/                      # UI Kit puro y sin estado
│   │   ├── world/                   # motor inmersivo
│   │   ├── layout/                  # header, nav, footer, shells
│   │   └── features/                # un subdirectorio por realm
│   ├── config/
│   │   ├── realms.ts                # ids, acentos, emociones, notas de audio
│   │   ├── bands.ts                 # gradientes placeholder
│   │   └── motion.ts                # duraciones, easings, delays
│   ├── data/                        # datos mock tipados
│   ├── hooks/
│   ├── i18n/                        # routing, request, navigation
│   ├── lib/                         # utilidades puras
│   ├── stores/                      # zustand
│   └── types/
└── tests/                           # espejo de src/ para lógica
```

---

# FASE 0 — Fundaciones del proyecto

Objetivo: dejar `frontend/` arrancando, con calidad y tests configurados. Al terminar la fase, `npm run dev`, `npm run lint`, `npm run typecheck` y `npm run test` funcionan.

---

### Task 0.1: Scaffold de Next.js 15 + TypeScript + Tailwind v4

**Files:**
- Create: `frontend/` (todo el scaffold generado)
- Modify: `frontend/package.json`, `frontend/tsconfig.json`, `frontend/next.config.ts`

**Interfaces:**
- Consumes: nada.
- Produces: alias de import `@/*` → `frontend/src/*`; scripts npm `dev`, `build`, `start`, `lint`.

- [ ] **Paso 1: Verificar el entorno**

Comprobar que Node es ≥ 20 y npm está disponible.

```bash
node -v && npm -v
```

Esperado: Node v26.x (o cualquier ≥20) y npm ≥10. Si Node fuese <20, detenerse y avisar al usuario: Next.js 15 no arranca por debajo de 20.

- [ ] **Paso 2: Generar el proyecto dentro de la carpeta `frontend` ya existente**

La carpeta `frontend/` existe y está vacía. Ejecutar el generador desde la raíz del proyecto, apuntando a esa carpeta, con estas respuestas: TypeScript **sí**, ESLint **sí**, Tailwind CSS **sí**, directorio `src/` **sí**, App Router **sí**, Turbopack **sí**, alias de import personalizado **sí** con valor `@/*`.

```bash
cd "/home/sergi/Documentos/Proyectos/Frecuencia Mágica" && npx create-next-app@latest frontend --ts --eslint --tailwind --src-dir --app --turbopack --import-alias "@/*" --use-npm --no-git
```

- [ ] **Paso 3: Confirmar versiones instaladas**

Verificar que `next` es 15.x, `react` y `react-dom` son 19.x y `tailwindcss` es 4.x.

```bash
cd frontend && npm ls next react react-dom tailwindcss --depth=0
```

Si Tailwind hubiese quedado en v3, actualizarlo a v4 y migrar la configuración a CSS-first (borrar `tailwind.config.*`, dejar sólo el `@import "tailwindcss"` en el CSS global).

- [ ] **Paso 4: Endurecer TypeScript**

En `frontend/tsconfig.json`, dentro de `compilerOptions`, asegurar: `strict: true`, `noUncheckedIndexedAccess: true`, `noUnusedLocals: true`, `noUnusedParameters: true`, `forceConsistentCasingInFileNames: true`. Mantener el `paths` con `"@/*": ["./src/*"]`.

- [ ] **Paso 5: Añadir el script de typecheck**

En `frontend/package.json`, añadir a `scripts` una entrada `typecheck` que ejecute el compilador de TypeScript sin emitir (`tsc --noEmit`).

- [ ] **Paso 6: Verificar que el proyecto arranca y compila**

```bash
cd frontend && npm run typecheck && npm run build
```

Esperado: typecheck sin errores y build exitoso con la ruta `/` generada.

- [ ] **Paso 7: Commit**

```bash
cd "/home/sergi/Documentos/Proyectos/Frecuencia Mágica" && git add frontend && git commit -m "chore: scaffold Next.js 15 + React 19 + Tailwind v4 frontend"
```

Nota: la raíz del proyecto **no es un repo git** todavía. Si `git status` falla, inicializar primero con `git init` en la raíz y crear un `.gitignore` que excluya `node_modules/`, `.next/`, `dist/`, `.env*` y `**/node_modules/`.

---

### Task 0.2: Calidad de código — ESLint, Prettier y convenciones

**Files:**
- Create: `frontend/.prettierrc`, `frontend/.prettierignore`
- Modify: `frontend/eslint.config.mjs`, `frontend/package.json`

**Interfaces:**
- Consumes: scaffold de Task 0.1.
- Produces: scripts `lint`, `lint:fix`, `format`, `format:check`.

- [ ] **Paso 1: Instalar Prettier y el puente con ESLint**

```bash
cd frontend && npm i -D prettier eslint-config-prettier prettier-plugin-tailwindcss
```

- [ ] **Paso 2: Configurar Prettier**

Crear `frontend/.prettierrc` con: sin punto y coma final desactivado (es decir, `semi: true`), comillas simples `singleQuote: true`, ancho de línea `printWidth: 100`, `trailingComma: "all"`, y el plugin `prettier-plugin-tailwindcss` activado para ordenar clases utilitarias.

Crear `frontend/.prettierignore` con: `.next`, `node_modules`, `dist`, `*.md` no — los `.md` sí se formatean; excluir sólo build outputs.

- [ ] **Paso 3: Encadenar Prettier en ESLint**

En `frontend/eslint.config.mjs`, añadir `eslint-config-prettier` como **último** elemento del array de configuración para que desactive las reglas de formato que chocan con Prettier.

- [ ] **Paso 4: Añadir reglas de proyecto en ESLint**

Añadir un bloque de reglas que: prohíba `console.log` (permitiendo `console.warn` y `console.error`), exija `import type` para imports sólo-de-tipo, y marque como error las variables no usadas con prefijo distinto de `_`.

- [ ] **Paso 5: Añadir scripts**

En `frontend/package.json` añadir: `lint:fix` (lint con `--fix`), `format` (Prettier escribiendo sobre `.`), `format:check` (Prettier en modo comprobación).

- [ ] **Paso 6: Verificar**

```bash
cd frontend && npm run format && npm run lint
```

Esperado: sin errores.

- [ ] **Paso 7: Commit**

```bash
git add frontend && git commit -m "chore: add prettier and project lint rules"
```

---

### Task 0.3: Infraestructura de tests de lógica (Vitest)

**Files:**
- Create: `frontend/vitest.config.ts`, `frontend/tests/setup.ts`, `frontend/tests/lib/smoke.test.ts`
- Modify: `frontend/package.json`

**Interfaces:**
- Consumes: alias `@/*` de Task 0.1.
- Produces: comando `npm run test` y `npm run test:watch`; alias `@/*` disponible dentro de los tests; entorno `happy-dom` para hooks.

- [ ] **Paso 1: Instalar dependencias de test**

```bash
cd frontend && npm i -D vitest @vitejs/plugin-react happy-dom @testing-library/react @testing-library/dom vite-tsconfig-paths
```

- [ ] **Paso 2: Configurar Vitest**

Crear `frontend/vitest.config.ts` con: plugins `react()` y `tsconfigPaths()`; `test.environment` a `"happy-dom"`; `test.globals` en `true`; `test.setupFiles` apuntando a `./tests/setup.ts`; `test.include` limitado a `tests/**/*.test.ts` y `tests/**/*.test.tsx`.

Razón del `include` restringido: sólo testeamos lógica, y esto evita que Vitest intente recoger ficheros de `src/`.

- [ ] **Paso 3: Crear el setup de tests**

`frontend/tests/setup.ts` debe: importar los matchers de Testing Library si se usan, y registrar un `afterEach` que llame a `cleanup()` de `@testing-library/react`. Además debe definir un stub global de `matchMedia` (devolviendo `matches: false` y métodos `addEventListener`/`removeEventListener` vacíos) porque varios hooks lo consultan y happy-dom no lo implementa completamente.

- [ ] **Paso 4: Escribir un test de humo que falle**

Crear `frontend/tests/lib/smoke.test.ts` con un único test llamado `"el entorno de test resuelve el alias @/"` que importe algo desde `@/config/motion` y compruebe que está definido. Como ese módulo aún no existe, el test debe fallar.

- [ ] **Paso 5: Añadir scripts y ejecutar el test para verlo fallar**

Añadir a `package.json`: `test` (`vitest run`) y `test:watch` (`vitest`).

```bash
cd frontend && npm run test
```

Esperado: FALLA con un error de módulo no encontrado para `@/config/motion`.

- [ ] **Paso 6: Crear el módulo mínimo para que pase**

Crear `frontend/src/config/motion.ts` exportando un objeto `DURATION` con las claves y valores en segundos: `instant: 0`, `fast: 0.3`, `base: 0.7`, `slow: 1`, `entrance: 0.8`, `portal: 1`. Exportar también `STAGGER` con `[0.1, 0.25, 0.4, 0.55]` y `EASE` con `soft: [0.2, 0.85, 0.25, 1]` y `portal: [0.7, 0, 0.3, 1]`.

- [ ] **Paso 7: Ejecutar el test y verificar que pasa**

```bash
cd frontend && npm run test
```

Esperado: 1 test PASA.

- [ ] **Paso 8: Commit**

```bash
git add frontend && git commit -m "test: set up vitest with happy-dom for logic tests"
```

---

### Task 0.4: Esqueleto de directorios y copia de assets

**Files:**
- Create: los directorios de `src/` listados en la sección "Estructura de ficheros", cada uno con un `.gitkeep` si queda vacío
- Create: `frontend/public/logo.png`
- Create: `frontend/README.md`

**Interfaces:**
- Consumes: nada.
- Produces: rutas de import estables para todas las fases siguientes; `/logo.png` servible.

- [ ] **Paso 1: Crear el árbol de carpetas**

Crear bajo `frontend/src/`: `components/ui`, `components/world`, `components/layout`, `components/features`, `config`, `data`, `hooks`, `i18n`, `lib`, `stores`, `types`. Crear también `frontend/messages` y `frontend/tests`.

- [ ] **Paso 2: Copiar el logo oficial**

```bash
cd "/home/sergi/Documentos/Proyectos/Frecuencia Mágica" && cp "frontend-prototype/project/assets/logo.png" frontend/public/logo.png
```

- [ ] **Paso 3: Verificar el asset**

```bash
cd frontend && ls -la public/logo.png
```

Esperado: fichero de ~80KB presente.

- [ ] **Paso 4: Escribir el README del frontend**

`frontend/README.md` debe documentar, en español: qué es el proyecto (una frase), el stack, los comandos disponibles (`dev`, `build`, `lint`, `typecheck`, `test`), un mapa de las carpetas de `src/` con una línea por carpeta explicando su responsabilidad, y un enlace a este plan y a `frontend-prototype/project/DESIGN_CONTEXT.md` como fuentes de verdad.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "chore: create source tree and copy brand logo"
```

---

# FASE 1 — Sistema de diseño

Objetivo: que cualquier componente posterior pueda escribirse con tokens y variantes de movimiento ya definidos, sin volver a mirar valores hexadecimales.

---

### Task 1.1: Tokens de diseño y hoja global

**Files:**
- Modify: `frontend/src/app/globals.css` (reescritura completa)

**Interfaces:**
- Consumes: nada.
- Produces: utilidades Tailwind `bg-void`, `bg-void-2`, `text-gold`, `text-teal`, `text-lav`, `text-ivory`, `border-glass-brd`, `bg-glass`, `font-serif`, `font-sans`; clases de animación `animate-fm-fade-up`, `animate-fm-fade-in`, `animate-fm-breathe`, `animate-fm-float`, `animate-fm-float-s`, `animate-fm-spin-slow`, `animate-fm-spin-r`, `animate-fm-twinkle`, `animate-fm-ring`, `animate-fm-shimmer`, `animate-fm-glow`, `animate-fm-drift`, `animate-fm-wave-flow`, `animate-fm-wave-pulse`, `animate-fm-sparkle`, `animate-fm-ring-pulse`; clase de utilidad `.fm-surface` para glassmorphism.

- [ ] **Paso 1: Declarar el tema con `@theme`**

Reescribir `globals.css` empezando por `@import "tailwindcss";` y después un bloque `@theme` que declare, con la nomenclatura de Tailwind v4:

- Colores: `--color-void: #0F1B2E`, `--color-void-2: #0a1220`, `--color-gold: #D8B978`, `--color-teal: #96C6BC`, `--color-lav: #B9B0D6`, `--color-ivory: #F7F4EA`, `--color-glass: rgba(247,244,234,0.045)`, `--color-glass-brd: rgba(216,185,120,0.20)`.
- Un único color añadido al sistema del prototipo: `--color-warn: #C98B7A`, un terracota que armoniza con el oro. Es exclusivamente para errores de formulario y estados de fallo; el prototipo no los tenía y la paleta original no ofrece ningún tono utilizable para señalarlos. Ningún otro color nuevo está permitido.
- Fuentes: `--font-serif` y `--font-sans` apuntando a las variables CSS que expondrá `next/font` en la Task 1.2 (`var(--font-cormorant)` y `var(--font-jost)`), cada una con su fallback (`serif` y `system-ui, sans-serif`).
- Radios: `--radius-card: 22px`, `--radius-card-lg: 26px`, `--radius-field: 14px`, `--radius-pill: 999px`.

- [ ] **Paso 2: Portar los keyframes del prototipo**

Copiar **exactamente** los 16 `@keyframes` de `frontend-prototype/project/Frecuencia Magica.dc.html` líneas 31–46 y 52–56, conservando nombres y valores. Renombrar sólo el prefijo a kebab-case para las utilidades (`fmFadeUp` → keyframe `fm-fade-up`), manteniendo idénticos los porcentajes y transformaciones:

| Keyframe | Comportamiento exacto |
|---|---|
| `fm-fade-up` | `opacity 0 → 1`, `translateY(26px) → none` |
| `fm-fade-in` | `opacity 0 → 1` |
| `fm-breathe` | `0%,100%: scale(1) opacity .85` · `50%: scale(1.05) opacity 1` |
| `fm-float` | `0%,100%: translateY(0)` · `50%: translateY(-14px)` |
| `fm-float-s` | `0%,100%: translateY(0)` · `50%: translateY(-7px)` |
| `fm-spin` | `rotate(0) → rotate(360deg)` |
| `fm-spin-r` | `rotate(360deg) → rotate(0)` |
| `fm-twinkle` | `0%,100%: opacity .35` · `50%: opacity 1` |
| `fm-ring` | `0%: scale(.6) opacity .7` · `100%: scale(2.2) opacity 0` |
| `fm-shimmer` | `background-position -200% 0 → 200% 0` |
| `fm-glow` | `0%,100%: opacity .5` · `50%: opacity 1` |
| `fm-drift` | `0%: translate(0,0)` · `50%: translate(30px,-20px)` · `100%: translate(0,0)` |
| `fm-wave-flow` | `stroke-dashoffset 0 → -40` |
| `fm-wave-pulse` | `0%,100%: scaleY(1) opacity .85` · `50%: scaleY(1.35) opacity 1` |
| `fm-sparkle` | `0%,100%: opacity .25 scale(.8)` · `50%: opacity 1 scale(1.1)` |
| `fm-ring-pulse` | `0%: scale(1) opacity .5` · `50%: scale(1.04) opacity .8` · `100%: scale(1) opacity .5` |

Y los cinco del portal (líneas 52–56), que se usarán en la Fase 3: `fm-portal-expand`, `fm-portal-fade`, `fm-portal-ring`, `fm-portal-core`, `fm-portal-spin`. Todos ellos combinan `translate(-50%,-50%)` con `scale`/`rotate` — copiar los valores tal cual, sin "limpiarlos".

- [ ] **Paso 3: Registrar las animaciones como utilidades**

Dentro del mismo `@theme`, declarar una variable `--animate-*` por cada keyframe, con la duración y el easing por defecto que usa el prototipo. Ejemplos exactos a respetar: `fm-drift` a `34s ease-in-out infinite`, `fm-spin` a `120s linear infinite`, `fm-breathe` a `7s ease-in-out infinite`, `fm-float` a `8s ease-in-out infinite`, `fm-wave-pulse` a `1.6s ease-in-out infinite`, `fm-ring` a `4.5s ease-out infinite`, `fm-glow` a `4s ease-in-out infinite`, `fm-sparkle` a `6s ease-in-out infinite`, `fm-ring-pulse` a `16s ease-in-out infinite`, `fm-fade-up` a `0.8s ease both`, `fm-fade-in` a `1s ease both`.

Las duraciones que en el prototipo varían por instancia (60s/70s/90s/95s/100s/110s/130s/200s en las geometrías) se aplicarán con estilo inline en cada componente, no como utilidad.

- [ ] **Paso 4: Escribir la capa base**

En una regla `@layer base`, definir: `*` con `box-sizing: border-box`; `html, body` sin margen ni padding; `body` con el gradiente de fondo de la tabla de constraints, color `--ivory`, `font-family` sans, `font-weight: 300`, `-webkit-font-smoothing: antialiased`, y `overflow-x: hidden`. Definir `::selection` con `background: rgba(216,185,120,0.30)` y `color: #fff`. Definir la barra de scroll: ancho `9px`, track transparente, thumb `rgba(216,185,120,0.18)` con radio `9px` y `rgba(216,185,120,0.34)` en hover. Definir `a` con color `--gold` sin subrayado, y `--ivory` en hover.

Definir también un estilo de foco global visible: en `:focus-visible`, un `outline` de 2px en `--gold` con `outline-offset: 3px`. Esto es obligatorio por accesibilidad y el prototipo no lo tenía.

- [ ] **Paso 5: Escribir el bloque de movimiento reducido**

Añadir una media query `@media (prefers-reduced-motion: reduce)` que ponga `animation-duration: .001ms !important`, `animation-iteration-count: 1 !important`, `transition-duration: .001ms !important` y `scroll-behavior: auto !important` en `*`, `*::before` y `*::after`.

- [ ] **Paso 6: Definir las utilidades de superficie**

Con `@utility` (Tailwind v4), crear `fm-surface`: `background: var(--color-glass)`, `border: 1px solid var(--color-glass-brd)`, `backdrop-filter: blur(12px)`. Y `fm-surface-strong`: igual pero con `background: rgba(15,27,46,0.72)` y `blur(22px)` — es la superficie del dock del reproductor y del badge de navegación.

- [ ] **Paso 7: Ocultar el cursor nativo en desktop**

Añadir una media query `@media (hover: hover) and (pointer: fine)` que ponga `cursor: none` en `body`, `a`, `button` y `[data-magnetic]`. Y otra `@media (hover: none)` que ponga `display: none !important` en `.fm-cursor`.

- [ ] **Paso 8: Verificar que compila**

```bash
cd frontend && npm run build
```

Esperado: build exitoso, sin advertencias de CSS.

- [ ] **Paso 9: Commit**

```bash
git add frontend && git commit -m "feat: port design tokens, keyframes and base layer to tailwind v4"
```

---

### Task 1.2: Fuentes con `next/font`

**Files:**
- Modify: `frontend/src/app/layout.tsx`
- Create: `frontend/src/config/fonts.ts`

**Interfaces:**
- Consumes: variables `--font-serif` / `--font-sans` declaradas en Task 1.1.
- Produces: exports `cormorant` y `jost` (objetos de `next/font/google` con `variable` definida); las clases `.font-serif` y `.font-sans` de Tailwind quedan operativas.

- [ ] **Paso 1: Declarar las fuentes**

Crear `frontend/src/config/fonts.ts` que cargue desde `next/font/google`:
- `Cormorant_Garamond` con `subsets: ['latin']`, `weight: ['300','400','500','600']`, `style: ['normal','italic']`, `display: 'swap'`, `variable: '--font-cormorant'`.
- `Jost` con `subsets: ['latin']`, `weight: ['300','400','500']`, `display: 'swap'`, `variable: '--font-jost'`.

- [ ] **Paso 2: Aplicar las variables al documento**

En `frontend/src/app/layout.tsx`, poner en el `<html>` el `lang` correspondiente y las clases `variable` de ambas fuentes, además de `antialiased`. Retirar cualquier fuente que haya dejado el scaffold (Geist).

- [ ] **Paso 3: Definir el metadata base**

En el mismo layout, exportar `metadata` con `title` por defecto `"Frecuencia Mágica"`, plantilla `"%s · Frecuencia Mágica"`, y `description` con la frase de marca en español: "Un santuario para volver a ti." Añadir `themeColor` `#0F1B2E`.

- [ ] **Paso 4: Verificar visualmente el render tipográfico**

Arrancar el dev server y comprobar en el navegador que un `<h1 class="font-serif">` renderiza en Cormorant Garamond y un `<p class="font-sans">` en Jost.

```bash
cd frontend && npm run dev
```

Si se prefiere no abrir navegador, basta con verificar en el HTML generado que existen los `<link rel="preload">` a los ficheros de fuente y que `<html>` tiene ambas clases `__variable_*`.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat: load Cormorant Garamond and Jost via next/font"
```

---

### Task 1.3: Utilidades puras y variantes de movimiento

**Files:**
- Create: `frontend/src/lib/cn.ts`, `frontend/src/lib/motion-variants.ts`, `frontend/src/lib/format.ts`, `frontend/src/hooks/use-reduced-motion-safe.ts`
- Create: `frontend/tests/lib/format.test.ts`, `frontend/tests/lib/motion-variants.test.ts`
- Modify: `frontend/src/config/motion.ts`

**Interfaces:**
- Consumes: `DURATION`, `STAGGER`, `EASE` de `@/config/motion` (Task 0.3).
- Produces:
  - `cn(...inputs)` → `string` — combina clases con `clsx` + `tailwind-merge`.
  - `formatPrice(cents: number)` → `string` — devuelve `"$28"` (sin decimales, prefijo `$`).
  - `formatDuration(seconds: number)` → `string` — devuelve `"18:00"` con minutos sin padding y segundos con padding a 2.
  - `parseDuration(label: string)` → `number` — inverso de lo anterior; `"18:00"` → `1080`.
  - `fadeUp`, `fadeIn`, `staggerContainer`, `staggerItem`, `scaleIn` — objetos `Variants` de `motion`.
  - `useReducedMotionSafe()` → `boolean` — `true` si el usuario pide movimiento reducido; seguro en SSR (devuelve `false` en el primer render del servidor).

- [ ] **Paso 1: Instalar dependencias**

```bash
cd frontend && npm i clsx tailwind-merge motion
```

- [ ] **Paso 2: Escribir los tests que fallan para `format`**

Crear `frontend/tests/lib/format.test.ts` con estos casos, por nombre y aserción:
- `"formatea un precio entero con prefijo de dólar"` → `formatPrice(28)` es `"$28"`.
- `"no añade decimales a precios redondos"` → `formatPrice(0)` es `"$0"`.
- `"formatea segundos como mm:ss"` → `formatDuration(1080)` es `"18:00"`.
- `"rellena los segundos a dos dígitos"` → `formatDuration(670)` es `"11:10"`.
- `"formatea duraciones de más de una hora en minutos totales"` → `formatDuration(3720)` es `"62:00"`.
- `"parsea una etiqueta mm:ss a segundos"` → `parseDuration("42:00")` es `2520`.
- `"parsea y formatea son inversos"` → para las siete duraciones reales del catálogo (`"18:00"`, `"11:20"`, `"24:40"`, `"42:00"`, `"09:10"`, `"07:30"`, `"15:40"`), `formatDuration(parseDuration(x))` devuelve `x`. Ojo: `"09:10"` y `"07:30"` llevan cero a la izquierda en los minutos, así que `formatDuration` debe rellenar **también los minutos** a dos dígitos para que la ida y vuelta sea exacta.

- [ ] **Paso 3: Escribir los tests que fallan para las variantes**

Crear `frontend/tests/lib/motion-variants.test.ts` con:
- `"fadeUp desplaza 26px en el estado oculto"` → `fadeUp.hidden` tiene `opacity: 0` e `y: 26`.
- `"fadeUp termina sin desplazamiento"` → `fadeUp.visible` tiene `opacity: 1` e `y: 0`.
- `"staggerContainer escalona los hijos con el primer delay del sistema"` → el `staggerChildren` de `staggerContainer.visible.transition` es `0.15` y el `delayChildren` es `STAGGER[0]`.
- `"todas las variantes usan un easing del sistema"` → para `fadeUp`, `fadeIn` y `scaleIn`, el `ease` de su transición `visible` es idéntico a `EASE.soft`.

- [ ] **Paso 4: Ejecutar los tests para verlos fallar**

```bash
cd frontend && npm run test
```

Esperado: FALLA — módulos `@/lib/format` y `@/lib/motion-variants` no encontrados.

- [ ] **Paso 5: Implementar `cn`**

`frontend/src/lib/cn.ts` exporta `cn` que pasa sus argumentos por `clsx` y el resultado por `twMerge`. Es la única forma permitida de concatenar clases en todo el proyecto.

- [ ] **Paso 6: Implementar `format`**

`frontend/src/lib/format.ts` con las cuatro funciones descritas en Interfaces. Sin dependencias externas. `formatDuration` rellena minutos y segundos a dos dígitos.

- [ ] **Paso 7: Implementar las variantes de movimiento**

`frontend/src/lib/motion-variants.ts` exporta los cinco objetos `Variants`:
- `fadeUp`: oculto `{opacity: 0, y: 26}`, visible `{opacity: 1, y: 0, transition: {duration: DURATION.entrance, ease: EASE.soft}}`.
- `fadeIn`: oculto `{opacity: 0}`, visible `{opacity: 1, transition: {duration: DURATION.slow, ease: EASE.soft}}`.
- `scaleIn`: oculto `{opacity: 0, scale: 0.96}`, visible `{opacity: 1, scale: 1, transition: {duration: DURATION.base, ease: EASE.soft}}`.
- `staggerContainer`: visible con `transition: {staggerChildren: 0.15, delayChildren: STAGGER[0]}`.
- `staggerItem`: idéntico a `fadeUp` pero sin `delayChildren` propio.

- [ ] **Paso 8: Implementar el hook de movimiento reducido**

`frontend/src/hooks/use-reduced-motion-safe.ts` marcado con `"use client"`. Debe usar `useSyncExternalStore` suscribiéndose a `window.matchMedia('(prefers-reduced-motion: reduce)')`, con snapshot de servidor fijo en `false`. Esto evita el parpadeo de hidratación que daría un `useEffect` + `useState`.

- [ ] **Paso 9: Ejecutar los tests y verificar que pasan**

```bash
cd frontend && npm run test
```

Esperado: todos los tests PASAN (11 casos nuevos).

- [ ] **Paso 10: Commit**

```bash
git add frontend && git commit -m "feat: add cn, format helpers, motion variants and reduced-motion hook"
```

---

### Task 1.4: Configuración de realms y bandas placeholder

**Files:**
- Create: `frontend/src/config/realms.ts`, `frontend/src/config/bands.ts`, `frontend/src/types/realm.ts`
- Create: `frontend/tests/config/realms.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - Tipo `RealmId` = unión literal de `'portal' | 'home' | 'auth' | 'descubrete' | 'biblioteca' | 'academia' | 'experiencias' | 'tienda' | 'sanctuario'`.
  - Tipo `Realm` con campos: `id: RealmId`, `accent: string` (hex), `dotVar: string` (nombre de variable CSS), `baseNote: number` (Hz del drone), `inNav: boolean`.
  - `REALMS: readonly Realm[]` — los 9 realms.
  - `NAV_REALMS: readonly Realm[]` — los 6 con `inNav: true`, en orden: descubrete, biblioteca, academia, experiencias, tienda, sanctuario.
  - `getRealm(id: RealmId)` → `Realm`.
  - `BANDS` — objeto con `gold`, `teal`, `lav`, `mix` (gradientes de realm) y `AUDIO_BANDS`/`PRODUCT_BANDS` no aquí, sino en `data/` junto a cada entidad.

- [ ] **Paso 1: Escribir el test que falla**

Crear `frontend/tests/config/realms.test.ts` con:
- `"expone los nueve realms"` → `REALMS` tiene longitud 9.
- `"la navegación de constelación muestra seis realms"` → `NAV_REALMS` tiene longitud 6 y sus ids en orden son exactamente `['descubrete','biblioteca','academia','experiencias','tienda','sanctuario']`.
- `"portal y auth quedan fuera de la navegación"` → ni `portal` ni `auth` ni `home` aparecen en `NAV_REALMS`.
- `"cada realm tiene un acento de la paleta"` → todo `accent` pertenece al conjunto `{'#D8B978', '#96C6BC', '#B9B0D6'}`.
- `"los acentos coinciden con el prototipo"` → comprobar uno a uno: portal `#D8B978`, home `#D8B978`, descubrete `#B9B0D6`, biblioteca `#D8B978`, academia `#96C6BC`, experiencias `#B9B0D6`, tienda `#D8B978`, sanctuario `#D8B978`, auth `#D8B978`.
- `"cada realm tiene una nota base distinta para el drone"` → comprobar el mapa completo: portal 110, home 110, descubrete 98, biblioteca 130.8, academia 146.8, experiencias 123.4, tienda 116.5, sanctuario 103.8, auth 110.
- `"getRealm devuelve el realm pedido"` → `getRealm('academia').accent` es `'#96C6BC'`.

- [ ] **Paso 2: Ejecutar el test para verlo fallar**

```bash
cd frontend && npm run test -- realms
```

Esperado: FALLA — `@/config/realms` no existe.

- [ ] **Paso 3: Implementar los tipos**

`frontend/src/types/realm.ts` con `RealmId` y `Realm` según Interfaces. Marcar el array como `as const` para que `RealmId` se derive sin duplicación.

- [ ] **Paso 4: Implementar la configuración**

`frontend/src/config/realms.ts` con los 9 realms y los valores exactos verificados en el test. `dotVar` toma `'--color-gold'`, `'--color-teal'` o `'--color-lav'` según el acento.

- [ ] **Paso 5: Implementar las bandas de realm**

`frontend/src/config/bands.ts` exportando `BANDS` con los cuatro gradientes copiados literalmente de las líneas 1092–1097 del prototipo:
- `gold`: `linear-gradient(150deg, rgba(216,185,120,0.42), rgba(15,27,46,0.5) 70%)`
- `teal`: `linear-gradient(150deg, rgba(150,198,188,0.40), rgba(15,27,46,0.5) 70%)`
- `lav`: `linear-gradient(150deg, rgba(185,176,214,0.42), rgba(15,27,46,0.5) 70%)`
- `mix`: `linear-gradient(150deg, rgba(150,198,188,0.34), rgba(185,176,214,0.30) 60%, rgba(15,27,46,0.5))`

- [ ] **Paso 6: Ejecutar los tests y verificar que pasan**

```bash
cd frontend && npm run test
```

Esperado: todos PASAN.

- [ ] **Paso 7: Commit**

```bash
git add frontend && git commit -m "feat: define realm configuration and placeholder bands"
```

---

# FASE 2 — Internacionalización, rutas y datos

Objetivo: que exista el árbol de rutas localizado, vacío pero navegable, y que todo el copy y los datos del prototipo estén portados y tipados.

---

### Task 2.1: Routing localizado con next-intl

**Files:**
- Create: `frontend/src/i18n/routing.ts`, `frontend/src/i18n/navigation.ts`, `frontend/src/i18n/request.ts`, `frontend/src/middleware.ts`
- Create: `frontend/src/app/[locale]/layout.tsx`
- Move: `frontend/src/app/page.tsx` → `frontend/src/app/[locale]/page.tsx`
- Modify: `frontend/next.config.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `routing` — objeto de `defineRouting` con `locales: ['es','en']`, `defaultLocale: 'es'`, `localePrefix: 'as-needed'` y el mapa `pathnames`.
  - `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` re-exportados desde `createNavigation(routing)`. **Todo enlace interno del proyecto usa este `Link`, nunca el de `next/link`.**
  - Tipo `Locale` = `'es' | 'en'`.

- [ ] **Paso 1: Instalar next-intl**

```bash
cd frontend && npm i next-intl
```

- [ ] **Paso 2: Definir el routing y los pathnames localizados**

Crear `frontend/src/i18n/routing.ts` con `defineRouting`. El mapa `pathnames` debe contener exactamente estas equivalencias (clave = ruta interna, valor = `{es, en}`):

| Ruta interna | es | en |
|---|---|---|
| `/` | `/` | `/` |
| `/inicio` | `/inicio` | `/home` |
| `/acceso` | `/acceso` | `/auth` |
| `/descubrete` | `/descubrete` | `/discover` |
| `/biblioteca` | `/biblioteca` | `/library` |
| `/academia` | `/academia` | `/academy` |
| `/academia/[courseId]` | `/academia/[courseId]` | `/academy/[courseId]` |
| `/academia/[courseId]/[lessonId]` | `/academia/[courseId]/[lessonId]` | `/academy/[courseId]/[lessonId]` |
| `/experiencias` | `/experiencias` | `/experiences` |
| `/experiencias/[experienceId]/reservar` | `/experiencias/[experienceId]/reservar` | `/experiences/[experienceId]/book` |
| `/tienda` | `/tienda` | `/store` |
| `/tienda/carrito` | `/tienda/carrito` | `/store/cart` |
| `/tienda/[productId]` | `/tienda/[productId]` | `/store/[productId]` |
| `/mi-santuario` | `/mi-santuario` | `/my-sanctuary` |

Ojo al orden: `/tienda/carrito` debe declararse **antes** que `/tienda/[productId]` para que no lo capture el segmento dinámico.

- [ ] **Paso 3: Crear las APIs de navegación**

`frontend/src/i18n/navigation.ts` llama a `createNavigation(routing)` y re-exporta `Link`, `redirect`, `usePathname`, `useRouter` y `getPathname`.

- [ ] **Paso 4: Configurar la carga de mensajes**

`frontend/src/i18n/request.ts` con `getRequestConfig`: valida que el locale solicitado esté en `routing.locales` (si no, cae al `defaultLocale`), y carga dinámicamente `../../messages/{locale}.json`.

- [ ] **Paso 5: Registrar el plugin y el middleware**

En `frontend/next.config.ts`, envolver la config con `createNextIntlPlugin('./src/i18n/request.ts')`.

Crear `frontend/src/middleware.ts` que exporte el middleware de `createMiddleware(routing)` y un `config.matcher` que excluya `/api`, `/_next`, `/_vercel` y cualquier ruta con extensión de fichero.

- [ ] **Paso 6: Crear el layout de locale**

`frontend/src/app/[locale]/layout.tsx` debe: recibir `params` como promesa y hacer `await` (API asíncrona de Next 15); validar el locale con `hasLocale` y llamar a `notFound()` si no es válido; llamar a `setRequestLocale(locale)` para habilitar el renderizado estático; y envolver `{children}` en `NextIntlClientProvider`. Exportar también `generateStaticParams` devolviendo los dos locales.

- [ ] **Paso 7: Mover la home de ejemplo y crear mensajes mínimos**

Mover `src/app/page.tsx` a `src/app/[locale]/page.tsx` y dejar en ella, de momento, un `<h1>` con una clave traducida (`portal.title`). Crear `messages/es.json` y `messages/en.json` con sólo ese namespace para que arranque.

- [ ] **Paso 8: Verificar las tres rutas**

```bash
cd frontend && npm run build
```

Esperado: el build lista `/[locale]` y genera params para `es` y `en`. Arrancando el dev server, `/` debe servir español, `/en` inglés, y `/fr` devolver 404.

- [ ] **Paso 9: Commit**

```bash
git add frontend && git commit -m "feat: set up next-intl routing with localized pathnames"
```

---

### Task 2.2: Diccionarios de copy ES/EN

**Files:**
- Modify: `frontend/messages/es.json`, `frontend/messages/en.json`
- Create: `frontend/src/types/messages.d.ts`

**Interfaces:**
- Consumes: `routing` de Task 2.1.
- Produces: namespaces de traducción consumibles con `useTranslations('<namespace>')`, con autocompletado tipado.

**Contexto para quien ejecute:** todo el copy ya existe, escrito y aprobado, dentro del prototipo. **No inventar texto nuevo.** Se extrae literalmente de `frontend-prototype/project/Frecuencia Magica.dc.html`, donde cada string aparece como una expresión ternaria `L==='es'?'…':'…'` o como un objeto `{es:'…', en:'…'}`.

- [ ] **Paso 1: Definir la estructura de namespaces**

Ambos ficheros comparten exactamente estas claves de primer nivel: `common`, `header`, `nav`, `footer`, `portal`, `home`, `auth`, `discover`, `library`, `player`, `academy`, `experiences`, `booking`, `store`, `cart`, `sanctuary`, `journal`, `states`.

- [ ] **Paso 2: Extraer el copy del header, nav y footer**

Del prototipo: `authNavTitle` (línea 1394), los nombres de realm (líneas 1081–1086, campo `name`), las columnas de footer (línea 1473 en adelante), `footerTag`, `newsletterPh` y `footerRights`. Colocar bajo `header`, `nav` y `footer`.

- [ ] **Paso 3: Extraer el copy del portal y la home**

Portal: `portalKicker`, `portalTitle`, `portalSub`, `portalCta`, `portalHint`. Home: bloque completo de las líneas 1437–1496 — `heroKicker`, `heroTitlePre`, `heroTitleEm`, `heroSub`, `heroCta1`, `heroCta2`, los tres `heroStats` (líneas 1441–1448), `dailyKicker`/`dailyTitle`/`dailyDesc`/`dailyMeta`/`dailyCta`, `audioKicker`/`audioTitle`/`seeAll`, `realmsKicker`/`realmsTitle`, las descripciones de realm (líneas 1337–1343), `realmFeaturedDesc` y `realmTiendaDesc` (líneas 1373–1375), `realmFeaturedCta`, `aboutKicker`/`aboutTitle`/`aboutP1`/`aboutP2`, `memberKicker`/`memberTitle`/`memberDesc`/`memberCta`.

- [ ] **Paso 4: Extraer el copy de auth y descúbrete**

Auth: líneas 1394–1430 — `authKicker`, `authTitle` (dos variantes: login y register), `authSub` (dos variantes), `loginTab`, `regTab`, `nameLabel`/`namePh`, `emailLabel`/`emailPh`, `passLabel`/`passPh`, `forgot`, `authCta`, `orLabel`, `ssoLabel`, `authQuote`, `authQuoteBy`, `authBackHome`.

Descúbrete: líneas 1498–1529 — `descKicker`, `descTitle`, `descIntro`, `descBegin`, `dCount` (patrón "Pregunta {n} de {total}"), `dBackLabel`, `dLoadingText`, `resultKicker`, `resultTitle`, `resultHz`, `resultCta`, `resultRestart`, y el mapa `RDESC` de descripciones por frecuencia (línea ~1523) con las claves 432, 528, 396, 174, 639, 417.

- [ ] **Paso 5: Extraer el copy de biblioteca, academia y experiencias**

Biblioteca: líneas 1530–1555 — `libKicker`, `libTitle`, `libDesc`, los cinco filtros (`all`, `Meditación`, `Frecuencia`, `Descanso`, `Ritual`), `libFeaturedBadge`.

Academia: líneas 1556–1588 — `acKicker`, `acTitle`, `acDesc`, `acFeaturedBadge`, `acFeaturedDesc`, `acFeaturedCta`, `acBackLabel`, `courseContentLabel`, `courseDesc`, `lessonKicker`, `lessonBackLabel`, `lessonPrevLabel`, `lessonNextLabel`, y los títulos de lección generados.

Experiencias y reserva: líneas 1589–1631 — `expKicker`, `expTitle`, `expDesc`, `expFeaturedBadge`, `expFeaturedDesc`, `expReserve`, `expBackLabel`, los tres `bookSteps`, `bookTitle`, `bookSubtitle`, `bookDateLabel`, `bookTimeLabel`, `bookContinueLabel`, `bookNamePh`, `bookEmailPh`, `bookNotePh`, `bookConfirmLabel`, `bookDoneTitle`, `bookDoneDesc`, `bookDoneCta`.

- [ ] **Paso 6: Extraer el copy de tienda, carrito y santuario**

Tienda y carrito: líneas 1632–1682 — `stKicker`, `stTitle`, `stDesc`, `cartLabel`, `addLabel`, `buyNowLabel`, `stFeaturedBadge`, `stFeaturedDesc`, `stBackLabel` (dos variantes), `prodDesc`, las tres `prodNotes`, `checkoutTitle` (dos variantes), `cartEmptyText`, `cartEmptyCta`, `summaryLabel`, `subtotalLabel`, `shipLabel`, `shipFree`, `totalLabel`, `placeOrderLabel`, `orderDoneTitle`, `orderDoneDesc`, `orderDoneCta`, y el patrón de cantidad (`"Cantidad {n}"` / `"Qty {n}"`).

Santuario y diario: líneas 1683–1712 — `sanctKicker`, `sanctTitle`, las cuatro etiquetas de `sanctStats`, `continueKicker`/`continueSub`/`continueCta`, `sanctDailyKicker`/`sanctDailySub`, `journalKicker`, `journalTitle`, `journalMoodLabel`, los cinco nombres de estado de ánimo (Calma, Alegría, Nostalgia, Cansancio, Gratitud), `journalPh`, `journalSave`.

- [ ] **Paso 7: Escribir el copy nuevo de estados**

El namespace `states` es el único con texto nuevo, porque el prototipo no tiene estos estados. Escribirlo en la voz de marca (íntima, poética, segunda persona), con estas claves y una versión ES y EN cada una: `loading`, `emptyFavorites`, `emptyJournal`, `emptyCart` (reutilizar `cartEmptyText`), `emptySearch`, `notFoundTitle`, `notFoundBody`, `notFoundCta`, `errorTitle`, `errorBody`, `errorCta`, `offline`. Ejemplo del tono esperado para el 404 en ES: título "Este lugar aún no existe", cuerpo "El camino que buscabas se desvaneció. Vuelve al portal y elige otra puerta." — mismo registro para el resto.

- [ ] **Paso 8: Tipar los mensajes**

Crear `frontend/src/types/messages.d.ts` que declare el módulo de next-intl aumentando la interfaz `AppConfig` con `Messages` derivado de `typeof import('../../messages/es.json')`. Esto da autocompletado y error de compilación si una clave no existe.

- [ ] **Paso 9: Verificar la paridad de claves**

Crear un test en `frontend/tests/i18n/messages.test.ts` con:
- `"ambos diccionarios tienen exactamente las mismas claves"` → recorrer recursivamente ambos JSON, aplanar las rutas de clave a strings tipo `home.heroKicker`, ordenar, y comprobar que los arrays son idénticos.
- `"ningún valor está vacío"` → ningún string hoja es cadena vacía ni contiene `TODO`.
- `"no queda texto sin traducir"` → para cada clave, el valor de `en` es distinto del de `es`, salvo una lista blanca explícita de excepciones legítimas (nombres propios y unidades: `Hz`, `Frecuencia Mágica`, `Marisol`, `Ritual`, `Grounding`, `Total`, `Subtotal`).

```bash
cd frontend && npm run test -- messages
```

Esperado: los tres casos PASAN.

- [ ] **Paso 10: Commit**

```bash
git add frontend && git commit -m "feat: port full ES/EN copy from prototype into message catalogs"
```

---

### Task 2.3: Capa de datos tipada

**Files:**
- Create: `frontend/src/types/content.ts`
- Create: `frontend/src/data/audios.ts`, `frontend/src/data/courses.ts`, `frontend/src/data/experiences.ts`, `frontend/src/data/products.ts`, `frontend/src/data/questions.ts`, `frontend/src/data/index.ts`
- Create: `frontend/tests/data/content.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `Audio` — `{ id: string; titleKey: string; tagKey: string; tagId: AudioTag; duration: string; hz: number; band: string }`.
  - `AudioTag` — unión literal `'meditation' | 'frequency' | 'grounding' | 'rest' | 'ritual' | 'breath'`. Es el identificador estable e **independiente del idioma** por el que filtra la Biblioteca. El prototipo filtraba comparando contra el texto español (`a.tag.es`), lo que rompería el filtro en inglés; esta es la corrección. Asignación por audio: `a1` meditation, `a2` frequency, `a3` grounding, `a4` rest, `a5` ritual, `a6` breath, `a7` meditation.
  - `Course` — `{ id: string; titleKey: string; levelKey: string; lessons: number; hours: string; band: string }`.
  - `Experience` — `{ id: string; titleKey: string; modeKey: string; mode: 'online' | 'in-person'; dur: string; price: number; band: string }`. El campo `mode` es el identificador estable, por el mismo motivo que `tagId`: `e1` online, `e2` in-person, `e3` in-person, `e4` online.
  - `Product` — `{ id: string; titleKey: string; catKey: string; price: number; band: string; relatedAudioId: string }`. `relatedAudioId` alimenta el enlace "Frecuencia asociada" del detalle de producto (Task 12.3). Asignación: `p1`→`a5`, `p2`→`a2`, `p3`→`a1`, `p4`→`a3`, `p5`→`a5`, `p6`→`a4`, `p7`→`a1`, `p8`→`a6`.
  - `Question` — `{ id: string; promptKey: string; optionKeys: string[] }`.
  - `AUDIOS`, `COURSES`, `EXPERIENCES`, `PRODUCTS`, `QUESTIONS` — arrays readonly.
  - `getAudio(id)`, `getCourse(id)`, `getExperience(id)`, `getProduct(id)` → entidad o `undefined`.

**Decisión de diseño a respetar:** los textos **no** viven en `data/`. Cada entidad guarda una *clave* de traducción (`titleKey`) y el texto real está en `messages/*.json`. Esto evita duplicar el mecanismo de i18n y permite que los componentes de servidor rendericen sin lógica de idioma.

- [ ] **Paso 1: Escribir el test que falla**

`frontend/tests/data/content.test.ts` con:
- `"hay siete frecuencias"` → `AUDIOS.length` es 7.
- `"las frecuencias conservan los Hz del prototipo"` → los `hz` en orden son `[432, 528, 396, 174, 639, 417, 528]`.
- `"hay tres cursos, cuatro experiencias, ocho productos y cinco preguntas"` → longitudes 3, 4, 8 y 5.
- `"todos los ids son únicos"` → para cada colección, el `Set` de ids tiene la misma longitud que el array.
- `"cada pregunta ofrece cuatro opciones"` → todo `optionKeys` tiene longitud 4.
- `"los precios de producto son los del prototipo"` → en orden `[28, 34, 22, 26, 18, 24, 20, 30]`.
- `"los precios de experiencia son los del prototipo"` → en orden `[45, 60, 55, 35]`.
- `"toda banda es un gradiente lineal"` → todo `band` de toda colección empieza por `linear-gradient(150deg,`.
- `"getProduct devuelve la entidad por id"` → `getProduct('p1')?.price` es 28, y `getProduct('inexistente')` es `undefined`.
- `"cada audio tiene una etiqueta estable e independiente del idioma"` → los `tagId` en orden son `['meditation','frequency','grounding','rest','ritual','breath','meditation']`.
- `"cada producto apunta a una frecuencia existente"` → todo `relatedAudioId` corresponde a un id presente en `AUDIOS`.
- `"cada experiencia declara su modalidad"` → los `mode` en orden son `['online','in-person','in-person','online']`.

- [ ] **Paso 2: Ejecutar el test para verlo fallar**

```bash
cd frontend && npm run test -- content
```

Esperado: FALLA — `@/data` no existe.

- [ ] **Paso 3: Definir los tipos**

`frontend/src/types/content.ts` con las cinco interfaces de arriba.

- [ ] **Paso 4: Portar las frecuencias**

`frontend/src/data/audios.ts` con los 7 registros de las líneas 1098–1106 del prototipo. Conservar ids `a1`–`a7`, los `hz`, las `duration` como string, y las `band` literales. Las claves de traducción siguen el patrón `library.audios.a1.title` y `library.audios.a1.tag`.

- [ ] **Paso 5: Portar cursos, experiencias, productos y preguntas**

- `courses.ts`: 3 registros de las líneas 1107–1111 (`c1`–`c3`, con `lessons` 8/12/6 y `hours` `'3.5h'`/`'5h'`/`'2.5h'`).
- `experiences.ts`: 4 registros de las líneas 1112–1117 (`e1`–`e4`). El campo `price` pasa de `'$45'` a número `45`; el símbolo lo pone `formatPrice`.
- `products.ts`: 8 registros de las líneas 1118–1127 (`p1`–`p8`), `price` ya numérico.
- `questions.ts`: 5 registros de las líneas 1128–1134, con ids `q1`–`q5` y cuatro `optionKeys` cada uno.

- [ ] **Paso 6: Crear el barrel y los selectores**

`frontend/src/data/index.ts` re-exporta las cinco colecciones y define las cuatro funciones `get*` por id.

- [ ] **Paso 7: Ejecutar los tests y verificar que pasan**

```bash
cd frontend && npm run test
```

Esperado: todos PASAN.

- [ ] **Paso 8: Añadir al diccionario los textos de las entidades**

Volver a `messages/es.json` y `messages/en.json` y añadir, bajo los namespaces correspondientes, los títulos/tags/niveles/modos/categorías y los enunciados y opciones de las 5 preguntas, tomados de los mismos rangos de líneas. Re-ejecutar el test de paridad de claves de la Task 2.2 para confirmar que sigue en verde.

```bash
cd frontend && npm run test
```

- [ ] **Paso 9: Commit**

```bash
git add frontend && git commit -m "feat: port typed content data with i18n key references"
```

---

# FASE 3 — Motor del mundo (world engine)

Objetivo: la capa que hace que esto no parezca una web. Se monta **una sola vez** en el layout de locale y sobrevive a los cambios de ruta. Al terminar la fase, cualquier página vacía ya se ve como Frecuencia Mágica.

---

### Task 3.1: Contexto de realm

**Files:**
- Create: `frontend/src/components/world/realm-provider.tsx`, `frontend/src/hooks/use-realm.ts`, `frontend/src/lib/realm-from-pathname.ts`
- Create: `frontend/tests/lib/realm-from-pathname.test.ts`

**Interfaces:**
- Consumes: `REALMS`, `getRealm`, `RealmId` de `@/config/realms`; `usePathname` de `@/i18n/navigation`.
- Produces:
  - `realmFromPathname(pathname: string)` → `RealmId` — función pura, sin React.
  - `<RealmProvider>{children}</RealmProvider>` — client component que deriva el realm de la ruta.
  - `useRealm()` → `{ realmId: RealmId; accent: string; baseNote: number }`.

- [ ] **Paso 1: Escribir el test que falla**

`frontend/tests/lib/realm-from-pathname.test.ts` con:
- `"la raíz es el portal"` → `realmFromPathname('/')` es `'portal'`.
- `"la raíz de un locale también es el portal"` → `realmFromPathname('/en')` es `'portal'`.
- `"reconoce cada realm por su segmento en español"` → `/inicio`→`home`, `/acceso`→`auth`, `/descubrete`→`descubrete`, `/biblioteca`→`biblioteca`, `/academia`→`academia`, `/experiencias`→`experiencias`, `/tienda`→`tienda`, `/mi-santuario`→`sanctuario`.
- `"reconoce cada realm por su segmento en inglés"` → `/home`→`home`, `/auth`→`auth`, `/discover`→`descubrete`, `/library`→`biblioteca`, `/academy`→`academia`, `/experiences`→`experiencias`, `/store`→`tienda`, `/my-sanctuary`→`sanctuario`.
- `"las rutas anidadas heredan el realm del padre"` → `/academia/c1/3` es `'academia'`, `/tienda/carrito` es `'tienda'`, `/experiencias/e2/reservar` es `'experiencias'`.
- `"una ruta desconocida cae en el portal"` → `/inexistente` es `'portal'`.

- [ ] **Paso 2: Ejecutar el test para verlo fallar**

```bash
cd frontend && npm run test -- realm-from-pathname
```

Esperado: FALLA — módulo no encontrado.

- [ ] **Paso 3: Implementar la función pura**

`frontend/src/lib/realm-from-pathname.ts` con un mapa de segmento → `RealmId` que cubra ambos idiomas. La función descarta un primer segmento si coincide con un locale conocido, toma el siguiente y lo busca en el mapa; si no hay segmento o no está en el mapa, devuelve `'portal'`.

- [ ] **Paso 4: Ejecutar el test y verificar que pasa**

```bash
cd frontend && npm run test -- realm-from-pathname
```

Esperado: los 6 casos PASAN.

- [ ] **Paso 5: Implementar el provider**

`realm-provider.tsx` marcado `"use client"`: llama a `usePathname`, deriva el realm con la función pura, memoiza el objeto de contexto por `realmId` y lo expone. Además, en un efecto, escribe el acento activo en el elemento raíz como propiedad CSS `--realm-accent`, para que cualquier componente pueda usarlo desde CSS sin pasar por React.

- [ ] **Paso 6: Implementar el hook**

`use-realm.ts` lee el contexto y lanza un error explícito si se usa fuera del provider ("useRealm debe usarse dentro de RealmProvider").

- [ ] **Paso 7: Commit**

```bash
git add frontend && git commit -m "feat: derive active realm from pathname and expose via context"
```

---

### Task 3.2: Fondo cósmico en canvas

**Files:**
- Create: `frontend/src/components/world/cosmic-canvas.tsx`, `frontend/src/lib/cosmic/particles.ts`, `frontend/src/lib/cosmic/colors.ts`
- Create: `frontend/tests/lib/cosmic.test.ts`

**Interfaces:**
- Consumes: `useRealm()` (Task 3.1), `useReducedMotionSafe()` (Task 1.3).
- Produces:
  - `hexToRgb(hex: string)` → `[number, number, number]`.
  - `createStars(count: number, random: () => number)` → `Star[]` con `{ x, y, r, tw, sp }`.
  - `createParticles(count: number, random: () => number)` → `Particle[]` con `{ x, y, r, vy, vx, a }`.
  - `advanceParticle(p: Particle)` → `Particle` — mueve y reenvuelve por arriba.
  - `<CosmicCanvas />` — canvas fijo a pantalla completa.

**Contexto:** es el port literal de `setupCanvas` / `resizeCanvas` / `drawFrame` (líneas 1163–1223 del prototipo). Los valores mágicos son intencionales; no "redondearlos".

- [ ] **Paso 1: Escribir el test que falla**

`frontend/tests/lib/cosmic.test.ts` con:
- `"convierte hex a rgb"` → `hexToRgb('#D8B978')` es `[216, 185, 120]`; `hexToRgb('96C6BC')` (sin almohadilla) es `[150, 198, 188]`.
- `"crea la cantidad pedida de estrellas"` → `createStars(220, random).length` es 220.
- `"las estrellas caen dentro del rango de radio del prototipo"` → todo `r` está entre 0.3 y 1.4 inclusive.
- `"las estrellas usan coordenadas normalizadas"` → todo `x` e `y` está entre 0 y 1.
- `"las partículas ascienden"` → todo `vy` está entre 0.02 y 0.10, y `advanceParticle` reduce la `y`.
- `"la partícula reaparece por abajo al salir por arriba"` → dada una partícula con `y = -0.03`, `advanceParticle` devuelve `y = 1.02`.
- `"la generación es determinista con un random inyectado"` → llamando dos veces a `createStars(5, ...)` con la misma secuencia sembrada, los resultados son iguales.

Nota para quien implemente: los generadores reciben la función de aleatoriedad por parámetro precisamente para poder testearlos; en producción se les pasa `Math.random`.

- [ ] **Paso 2: Ejecutar el test para verlo fallar**

```bash
cd frontend && npm run test -- cosmic
```

Esperado: FALLA.

- [ ] **Paso 3: Implementar los helpers puros**

`lib/cosmic/colors.ts` con `hexToRgb`. `lib/cosmic/particles.ts` con `createStars`, `createParticles` y `advanceParticle`, usando exactamente los rangos del prototipo: estrella `r` en `[0.3, 1.4]`, `tw` en `[0, 6.28]`, `sp` en `[0.4, 1.4]`; partícula `r` en `[0.6, 2.2]`, `vy` en `[0.02, 0.10]`, `vx` en `[-0.02, 0.02]`, `a` en `[0.15, 0.6]`. El avance por frame es `y -= vy * 0.004` y `x += vx * 0.004`; si `y < -0.02`, se reinicia a `y = 1.02` con `x` aleatoria.

- [ ] **Paso 4: Ejecutar el test y verificar que pasa**

```bash
cd frontend && npm run test -- cosmic
```

Esperado: los 7 casos PASAN.

- [ ] **Paso 5: Implementar el componente de canvas**

`cosmic-canvas.tsx` marcado `"use client"`. Requisitos exactos:

- El `<canvas>` es `position: fixed`, `inset: 0`, `width/height: 100%`, `z-index: 0`, `pointer-events: none`, y lleva `aria-hidden="true"`.
- Al montar: obtener contexto 2D, dimensionar, y generar **220 estrellas** y **54 partículas**.
- Dimensionado: `dpr = min(devicePixelRatio || 1, 2)`; `canvas.width = innerWidth * dpr`, `canvas.height = innerHeight * dpr`; aplicar `setTransform(dpr, 0, 0, dpr, 0, 0)`. Re-dimensionar en `resize` (con debounce de 150 ms).
- Bucle de dibujo con `requestAnimationFrame`, y `time = timestamp * 0.0001`.
- Orden de dibujo por frame: (1) `clearRect`; (2) tres nebulosas radiales; (3) estrellas; (4) partículas.
- Nebulosas: posiciones y radios normalizados `{x:0.22, y:0.30, r:0.42, color:[150,198,188]}`, `{x:0.78, y:0.70, r:0.40, color:[185,176,214]}`, `{x:0.55, y:0.45, r:0.34, color: acentoDelRealm}`. Cada una se desplaza con `dx = sin(time*(0.6+i*0.3))*0.03` y `dy = cos(time*(0.5+i*0.25))*0.03`. Gradiente radial de `rgba(c, 0.11)` en el centro a `rgba(c, 0)` en el borde, radio `r * max(W,H)`.
- Estrellas: parpadeo `tw = 0.5 + 0.5 * sin(time*6*sp + tw0)`, color `rgba(247,244,234, 0.25 + 0.6*tw)`.
- Partículas: gradiente radial del color de acento con alfa `a` al centro y 0 al borde, radio `r * 4`.
- **Movimiento reducido:** si el hook devuelve `true`, dibujar **un solo frame** y no encadenar más `requestAnimationFrame`; el parpadeo se fija en `0.7` y las partículas no avanzan.
- **Pausa fuera de pantalla:** escuchar `document.visibilitychange` y cancelar el rAF cuando la pestaña está oculta, reanudándolo al volver.
- Al desmontar: cancelar el rAF y quitar todos los listeners.
- Cuando cambia el acento del realm, **no** regenerar partículas — sólo cambia el color leído en el siguiente frame, de modo que la transición sea continua.

- [ ] **Paso 6: Verificar en el navegador**

Montar temporalmente el componente en la página de portal y comprobar: estrellas visibles, polen dorado ascendiendo, nebulosas a la deriva. Con `prefers-reduced-motion` activado en el navegador, el fondo debe verse pero quieto.

- [ ] **Paso 7: Commit**

```bash
git add frontend && git commit -m "feat: port cosmic canvas background with realm recoloring"
```

---

### Task 3.3: Capa de nebulosas DOM y figuras de marca

**Files:**
- Create: `frontend/src/components/world/nebula-layer.tsx`, `frontend/src/components/world/brand-figures.tsx`

**Interfaces:**
- Consumes: utilidades de animación de Task 1.1.
- Produces: `<NebulaLayer />` y `<BrandFigures />`, ambos decorativos, fijos y sin interacción.

- [ ] **Paso 1: Implementar la capa de nebulosas**

Port literal de las líneas 64–69 del prototipo. Contenedor `fixed inset-0 z-[1] pointer-events-none overflow-hidden`, con tres blobs circulares de `filter: blur(30px)` (el tercero `blur(26px)`) y una viñeta radial encima:

| Blob | Posición | Tamaño | Gradiente | Animación |
|---|---|---|---|---|
| 1 | `top:-18% left:-10%` | `60vw` | radial teal a `0.10` → transparente al 62% | `fm-drift 34s ease-in-out infinite` |
| 2 | `bottom:-22% right:-8%` | `55vw` | radial lavanda a `0.10` → transparente al 62% | `fm-drift 42s ease-in-out infinite reverse` |
| 3 | `top:30% left:55%` | `40vw` | radial oro a `0.08` → transparente al 60% | `fm-drift 50s ease-in-out infinite` |

Viñeta final: `radial-gradient(120% 90% at 50% 120%, rgba(15,27,46,0) 40%, rgba(10,18,32,0.85) 100%)`.

- [ ] **Paso 2: Implementar las figuras de marca**

Port literal de las líneas 72–86: dos SVG de aros concéntricos y cuatro estrellas de cuatro puntas.

- Aro superior derecho: `top:-16vw right:-14vw`, `46vw`, animación `fm-ring-pulse 16s ease-in-out infinite`, tres círculos de radios 96/74/52 con trazos oro `0.10`, teal `0.09` punteado `1 6`, y lavanda `0.08`.
- Aro inferior izquierdo: `bottom:-20vw left:-16vw`, `52vw`, animación `fm-spin 200s linear infinite`, dos círculos de radios 96 y 66 (este punteado `1 8`).
- Cuatro destellos con el path de estrella `M12 0 L13.4 10.6 L24 12 L13.4 13.4 L12 24 L10.6 13.4 L0 12 L10.6 10.6 Z`, en `top:14% left:11%` (26px, oro, 6s), `top:26% right:16%` (18px, lavanda, 7.5s, delay .8s), `bottom:20% right:24%` (22px, teal, 8s, delay .4s), `bottom:30% left:20%` (15px, oro, 6.8s, delay 1.2s). Todos con `fm-sparkle`.

Ambos componentes llevan `aria-hidden="true"`.

- [ ] **Paso 3: Verificar en el navegador**

Comprobar que las figuras se ven detrás del contenido y no capturan clics (probar seleccionando texto encima).

- [ ] **Paso 4: Commit**

```bash
git add frontend && git commit -m "feat: add drifting nebula layer and brand ring figures"
```

---

### Task 3.4: Cursor luminoso

**Files:**
- Create: `frontend/src/components/world/luminous-cursor.tsx`

**Interfaces:**
- Consumes: nada más que el DOM.
- Produces: `<LuminousCursor />`. Contrato con el resto del proyecto: **todo elemento que deba agrandar el cursor lleva el atributo `data-magnetic`**; los `a` y `button` ya lo hacen por defecto.

- [ ] **Paso 1: Implementar el componente**

Port de `setupCursor` (líneas 1226–1245). Marcado `"use client"`. Dos divs fijos con clase `fm-cursor`:

- **Punto:** `z-index: 9999`, `9px`, margen `-4.5px 0 0 -4.5px`, `border-radius: 50%`, fondo `var(--color-gold)`, `box-shadow: 0 0 14px 3px rgba(216,185,120,0.75), 0 0 30px 8px rgba(216,185,120,0.35)`, transiciones de `.25s` en tamaño y margen, `will-change: transform`.
- **Anillo:** `z-index: 9998`, `34px`, margen `-17px 0 0 -17px`, borde `1px solid rgba(216,185,120,0.45)`, transiciones de `.3s`.

Comportamiento:
- Un listener de `mousemove` mueve el **punto instantáneamente** vía `element.style.transform = translate(x, y)`. No usar estado de React: son escrituras directas al DOM en cada movimiento.
- En el mismo listener, detectar si el `event.target` tiene un ancestro que case `[data-magnetic], a, button`. Si lo tiene: punto a `16px` (margen `-8px`), anillo a `54px` (margen `-27px`) y color de borde a `rgba(216,185,120,0.8)`. Si no: valores base.
- El anillo sigue al puntero en su **propio** bucle de `requestAnimationFrame` con interpolación lineal de factor **0.14** por frame.
- No montar nada si `matchMedia('(hover: none)').matches` es verdadero.
- Si el usuario pide movimiento reducido, mantener el cursor pero sin la estela: el anillo se posiciona directamente sin interpolación.
- Limpiar listener y rAF al desmontar.
- Ambos elementos con `aria-hidden="true"` y `pointer-events: none`.

- [ ] **Paso 2: Verificar el comportamiento**

En el navegador: el punto sigue al ratón sin retraso, el anillo lo persigue con suavidad, y al pasar sobre un botón ambos crecen. En un dispositivo táctil (o emulando touch en DevTools), el cursor no aparece y el cursor nativo sigue disponible.

- [ ] **Paso 3: Commit**

```bash
git add frontend && git commit -m "feat: add luminous cursor with magnetic hover response"
```

---

### Task 3.5: Motor de audio ambiental

**Files:**
- Create: `frontend/src/hooks/use-ambient-audio.ts`, `frontend/src/lib/audio/drone.ts`, `frontend/src/stores/ambient-store.ts`
- Create: `frontend/tests/lib/drone.test.ts`, `frontend/tests/stores/ambient-store.test.ts`

**Interfaces:**
- Consumes: `useRealm()` (Task 3.1).
- Produces:
  - `baseNoteForRealm(realmId: RealmId)` → `number`.
  - `voiceFrequencies(baseNote: number)` → `[number, number, number]` — devuelve `[base, base*1.005, base*1.5]`.
  - `createDrone(ctx: AudioContext)` → `DroneHandle` con métodos `setEnabled(on: boolean)`, `retune(baseNote: number)`, `dispose()`.
  - `useAmbientStore` — zustand con `{ enabled: boolean; toggle(): void }`, persistido en `localStorage` bajo la clave `fm.ambient`.
  - `useAmbientAudio()` — hook que conecta store + realm + motor.

**Contexto:** port de `ensureAudio` / `retuneAudio` / `toggleAudio` (líneas 1248–1280). No hay ficheros de audio: el drone se sintetiza.

- [ ] **Paso 1: Escribir los tests que fallan**

`frontend/tests/lib/drone.test.ts`:
- `"cada realm tiene su nota base"` → comprobar los 9 valores: portal 110, home 110, descubrete 98, biblioteca 130.8, academia 146.8, experiencias 123.4, tienda 116.5, sanctuario 103.8, auth 110.
- `"las tres voces forman el acorde del prototipo"` → `voiceFrequencies(110)` es `[110, 110.55, 165]`, comprobando con tolerancia de 0.001. La segunda voz es la base por 1.005 (batido lento) y la tercera es la quinta (base × 1.5).
- `"la afinación por defecto es 110 Hz"` → un realm desconocido devuelve 110.

`frontend/tests/stores/ambient-store.test.ts`:
- `"el audio arranca apagado"` → el estado inicial de `enabled` es `false`. Esto es obligatorio: los navegadores bloquean audio sin gesto del usuario.
- `"toggle alterna el estado"` → dos llamadas devuelven al estado inicial.

- [ ] **Paso 2: Ejecutar los tests para verlos fallar**

```bash
cd frontend && npm run test -- drone ambient
```

Esperado: FALLA.

- [ ] **Paso 3: Implementar los helpers puros**

`lib/audio/drone.ts` con `baseNoteForRealm` y `voiceFrequencies`. El mapa de notas se lee de `REALMS` (campo `baseNote` definido en Task 1.4) para no duplicar la verdad.

- [ ] **Paso 4: Implementar el store**

`stores/ambient-store.ts` con zustand y el middleware `persist`. Instalar zustand si no está:

```bash
cd frontend && npm i zustand
```

- [ ] **Paso 5: Ejecutar los tests y verificar que pasan**

```bash
cd frontend && npm run test -- drone ambient
```

Esperado: los 5 casos PASAN.

- [ ] **Paso 6: Implementar el grafo de audio**

En el mismo `lib/audio/drone.ts`, añadir `createDrone(ctx)` que construya exactamente este grafo:

- Un `GainNode` maestro con ganancia inicial **0**, conectado a `destination`.
- Un `BiquadFilterNode` tipo `lowpass` a **700 Hz**, conectado al maestro.
- Tres osciladores conectados al filtro a través de sus propias ganancias: voz 0 `sine` a 110 Hz con ganancia 0.5; voz 1 `sine` a 110.5 Hz con ganancia 0.5; voz 2 `triangle` a 164.8 Hz con ganancia 0.18. Los tres arrancan inmediatamente.
- Un LFO: oscilador a **0.06 Hz** a través de una ganancia de **0.012**, conectado al parámetro de ganancia del maestro. Produce la respiración.

Métodos:
- `setEnabled(on)`: si el contexto está `suspended`, reanudarlo; después `master.gain.setTargetAtTime(on ? 0.09 : 0, ctx.currentTime, 0.6)`.
- `retune(baseNote)`: aplicar `setTargetAtTime` con constante de tiempo **2** a las tres voces, con las frecuencias de `voiceFrequencies`. El valor 2 es lo que produce el deslizamiento lento entre realms — no bajarlo.
- `dispose()`: parar osciladores y cerrar el contexto.

- [ ] **Paso 7: Implementar el hook**

`use-ambient-audio.ts` marcado `"use client"`:
- Crea el `AudioContext` **perezosamente**, sólo la primera vez que `enabled` pasa a `true` (nunca en el montaje, para no disparar el aviso de autoplay).
- Cuando cambia `enabled`, llama a `setEnabled`.
- Cuando cambia el realm, llama a `retune` con la nota del realm.
- Limpia con `dispose` al desmontar.
- Si `AudioContext` no existe en el navegador, degrada en silencio sin lanzar error.

- [ ] **Paso 8: Verificar manualmente**

Con el toggle del header (Task 5.1) aún sin construir, probar el hook desde la página de portal: activar el audio debe producir un drone grave y continuo; navegar a Academia debe deslizar la afinación hacia arriba a lo largo de ~4 segundos; desactivar debe desvanecer en ~1.8 s sin cortes.

- [ ] **Paso 9: Commit**

```bash
git add frontend && git commit -m "feat: synthesize per-realm ambient drone with web audio"
```

---

### Task 3.6: Transición de portal

**Files:**
- Create: `frontend/src/components/world/portal-transition.tsx`, `frontend/src/stores/portal-store.ts`
- Create: `frontend/tests/stores/portal-store.test.ts`

**Interfaces:**
- Consumes: keyframes `fm-portal-*` de Task 1.1.
- Produces:
  - `usePortalStore` — `{ phase: 'idle' | 'in' | 'out'; cross(): void; setPhase(p): void }`.
  - `<PortalTransition />` — overlay que reacciona a `phase`.
  - Contrato de temporización: `cross()` pone `phase: 'in'`; a los **1000 ms** el consumidor navega y la fase pasa a `'out'`; a los **1900 ms** vuelve a `'idle'`.

- [ ] **Paso 1: Escribir el test que falla**

`frontend/tests/stores/portal-store.test.ts` con temporizadores falsos de Vitest:
- `"empieza en reposo"` → `phase` inicial es `'idle'`.
- `"cruzar pone la fase de entrada"` → tras `cross()`, `phase` es `'in'`.
- `"a los mil milisegundos pasa a salida"` → avanzando 1000 ms, `phase` es `'out'`.
- `"a los mil novecientos vuelve a reposo"` → avanzando hasta 1900 ms, `phase` es `'idle'`.
- `"cruzar dos veces seguidas no reinicia la secuencia"` → llamar `cross()` con `phase` distinta de `'idle'` no tiene efecto.

- [ ] **Paso 2: Ejecutar el test para verlo fallar**

```bash
cd frontend && npm run test -- portal-store
```

Esperado: FALLA.

- [ ] **Paso 3: Implementar el store**

`stores/portal-store.ts`. `cross()` sale inmediatamente si `phase !== 'idle'`; si no, fija `'in'` y programa los dos cambios con `setTimeout` a 1000 y 1900 ms. Guardar los ids de timeout para poder limpiarlos.

- [ ] **Paso 4: Ejecutar el test y verificar que pasa**

```bash
cd frontend && npm run test -- portal-store
```

Esperado: los 5 casos PASAN.

- [ ] **Paso 5: Implementar el overlay**

`portal-transition.tsx`, port de las líneas 91–105. Se renderiza sólo si `phase !== 'idle'`. Contenedor `fixed inset-0 z-[9000] pointer-events-none overflow-hidden`.

- **Círculo gigante:** centrado con `left:50% top:50%`, `300vmax` de lado, redondo, con `radial-gradient(circle, #f7f4ea 0%, #e8d199 22%, #96C6BC 46%, #16273f 70%, #0F1B2E 100%)`. Su animación depende de la fase: en `'in'`, `fm-portal-expand 1s cubic-bezier(.7,0,.3,1) forwards`; en `'out'`, `fm-portal-fade .9s ease forwards`.
- **Sólo en fase `'in'`**, además: un núcleo blanco de 120px con `fm-portal-core 1.1s ease-in forwards` y `box-shadow: 0 0 120px 60px rgba(247,244,234,0.7)`; dos anillos de 280px con `fm-portal-ring 1.1s ease-out forwards`, el segundo con `.18s` de retardo; y un SVG de 620px de geometría sagrada (círculo r=150 blanco, círculo r=110 oro punteado `3 10`, y el triángulo `200,60 320,300 80,300`) con `fm-portal-spin 1.1s ease-out forwards` y opacidad `.55`.
- **Movimiento reducido:** sustituir toda la secuencia por un fundido a negro-azulado de 200 ms de entrada y 200 ms de salida, conservando los mismos tiempos de navegación para que la lógica no cambie.
- El overlay lleva `aria-hidden="true"`; adicionalmente, anunciar el cambio de página mediante una región `aria-live="polite"` que diga el nombre del destino.

- [ ] **Paso 6: Commit**

```bash
git add frontend && git commit -m "feat: add portal crossing transition overlay"
```

---

### Task 3.7: Componentes de mundo reutilizables

**Files:**
- Create: `frontend/src/components/world/orbital-rings.tsx`, `frontend/src/components/world/wave-separator.tsx`, `frontend/src/components/world/realm-glyph.tsx`, `frontend/src/components/world/halo.tsx`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `<OrbitalRings size, rings, spin, direction, className />` donde `rings` es una lista de `{ r: number; stroke: string; width?: number; dash?: string }`, `spin` son segundos y `direction` es `'cw' | 'ccw'`. Renderiza un SVG con `viewBox="0 0 200 200"`.
  - `<OrbitalRings.Node angle, color, size />` — punto orbital sobre un aro.
  - `<WaveSeparator />` — el separador de frecuencia full-width.
  - `<RealmGlyph color, size />` — el glifo circular de realm.
  - `<Halo color, blur, className />` — el resplandor radial difuminado que envuelve discos y orbes.

**Contexto:** estas cuatro piezas se repiten literalmente decenas de veces en el prototipo con parámetros distintos. Factorizarlas es el corazón del refactor: si al terminar la Fase 12 alguien ha vuelto a escribir un `<svg>` de círculos concéntricos a mano, la tarea está mal hecha.

- [ ] **Paso 1: Implementar `OrbitalRings`**

Debe cubrir todos los usos del prototipo. Casos de referencia que deben ser expresables sólo con props: los aros del portal (radios 300/240/180 sobre `viewBox` 640, con líneas diagonales), los del hero (192/150/108, `fm-spin 130s`), los del disco destacado de biblioteca (98/86, `fm-spin 110s`), los de los discos pequeños (97 punteado `1 8`, `fm-spin 70s`), y los decorativos de las cards (130/96/62, `fm-spin 100s`).

La rotación se aplica con la animación `fm-spin` o `fm-spin-r` según `direction`, con la duración pasada en `spin`. Marcar `aria-hidden`.

- [ ] **Paso 2: Implementar `WaveSeparator`**

Port literal de las líneas 418–425. SVG `viewBox="0 0 1000 60"`, ancho 100%, alto 46, `preserveAspectRatio="xMidYMid meet"`, `overflow: visible`. Contiene, en este orden:
1. Línea punteada lavanda `rgba(185,176,214,0.35)` de x=0 a x=372, `stroke-dasharray="1 7"`, con `fm-wave-flow 3.2s linear infinite`.
2. La forma de onda en teal con el path `M372 30 L394 30 L408 13 L423 47 L438 7 L453 45 L468 30 L500 30`, grosor 1.7.
3. Un círculo dorado de r=3.2 en (500, 30).
4. Un segmento teal de x=500 a x=566, grosor 1.4.
5. Un rombo teal con el path `M604 11 L623 30 L604 49 L585 30 Z`, relleno `rgba(150,198,188,0.08)`.
6. Línea punteada dorada `rgba(216,185,120,0.35)` de x=628 a x=1000, con la misma animación en `reverse`.

- [ ] **Paso 3: Implementar `RealmGlyph` y `Halo`**

`RealmGlyph`: SVG de 40×40 (o el `size` dado) con un círculo r=15 de trazo `color` grosor 0.9, un círculo r=7 grosor 0.7, y un punto relleno de r=1.6 en la parte superior. Opacidad `.8`. Es el glifo de las líneas 1333–1334; la variante grande (`bigGlyph`) se obtiene pasando `size={72}`.

`Halo`: un div absoluto con `inset` negativo configurable, `border-radius: 50%`, `background: radial-gradient(circle, <color>, transparent 66%)`, `filter: blur(12px)` y animación `fm-breathe`.

- [ ] **Paso 4: Verificar visualmente**

Crear temporalmente una página de sandbox en `src/app/[locale]/_sandbox/page.tsx` que renderice las cuatro piezas con varias combinaciones de props. Comprobar que el separador de onda es idéntico al del prototipo comparando lado a lado. **Borrar la página de sandbox antes del commit final de la fase** (o dejarla, pero excluida del build de producción).

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat: extract orbital rings, wave separator, glyph and halo world components"
```

---

### Task 3.8: Scroll suave con Lenis

**Files:**
- Create: `frontend/src/components/world/smooth-scroll.tsx`

**Interfaces:**
- Consumes: `useReducedMotionSafe()`.
- Produces: `<SmoothScroll>{children}</SmoothScroll>`.

- [ ] **Paso 1: Instalar Lenis**

```bash
cd frontend && npm i lenis
```

- [ ] **Paso 2: Implementar el proveedor**

`"use client"`. Instancia Lenis con una configuración cinematográfica: `duration` alrededor de **1.2**, `easing` exponencial suave, `smoothWheel` activado y `touchMultiplier` moderado. Encadena `lenis.raf(time)` dentro de un `requestAnimationFrame` propio. Destruye la instancia al desmontar.

Condiciones obligatorias:
- Si el usuario pide movimiento reducido, **no** instanciar Lenis en absoluto: el scroll nativo se respeta.
- Al cambiar de ruta, hacer scroll al inicio de forma inmediata (`lenis.scrollTo(0, { immediate: true })`), replicando el `scrollTo(0,0)` del prototipo en `componentDidUpdate`.
- El scroll suave **no debe aplicarse** en el realm portal ni en auth, que son pantallas de altura fija.

- [ ] **Paso 3: Verificar**

Comprobar en la home que el scroll tiene inercia y que la navegación por teclado (`Tab` hacia un elemento fuera de pantalla) sigue llevando el foco a la vista. Si el foco se pierde, ajustar para que Lenis no bloquee el scroll de foco nativo.

- [ ] **Paso 4: Commit**

```bash
git add frontend && git commit -m "feat: add cinematic smooth scrolling with lenis"
```

---

### Task 3.9: Ensamblar el motor del mundo en el layout

**Files:**
- Modify: `frontend/src/app/[locale]/layout.tsx`
- Create: `frontend/src/components/world/world-engine.tsx`

**Interfaces:**
- Consumes: todos los componentes de la Fase 3.
- Produces: `<WorldEngine />` — un único componente que monta el motor completo, para que el layout quede legible.

- [ ] **Paso 1: Componer el motor**

`world-engine.tsx` renderiza, en este orden de z-index: `<CosmicCanvas />` (z 0), `<NebulaLayer />` y `<BrandFigures />` (z 1), `<LuminousCursor />` (z 9998–9999), `<PortalTransition />` (z 9000). Activa `useAmbientAudio()`.

- [ ] **Paso 2: Integrar en el layout de locale**

En `[locale]/layout.tsx`, envolver el contenido con `NextIntlClientProvider` → `RealmProvider` → `SmoothScroll`, y renderizar `<WorldEngine />` como hermano de `{children}`. El `{children}` va dentro de un `<main>` con `position: relative` y `z-index: 100`.

- [ ] **Paso 3: Verificar el conjunto**

```bash
cd frontend && npm run build && npm run lint && npm run typecheck
```

Esperado: los tres en verde. En el navegador, cualquier ruta debe mostrar ya el universo vivo aunque su contenido esté vacío.

- [ ] **Paso 4: Commit**

```bash
git add frontend && git commit -m "feat: mount world engine once in the locale layout"
```

---

# FASE 4 — UI Kit

Objetivo: un catálogo de primitivas puras que cubra el 100 % de los patrones del prototipo. **Regla de oro de la fase:** ningún componente de `ui/` importa de `data/`, `stores/` ni `i18n/`. Reciben texto ya traducido por props.

Todos los componentes de esta fase se exportan también desde `frontend/src/components/ui/index.ts`.

---

### Task 4.1: Primitivas tipográficas

**Files:**
- Create: `frontend/src/components/ui/kicker.tsx`, `frontend/src/components/ui/display.tsx`, `frontend/src/components/ui/section-heading.tsx`, `frontend/src/components/ui/prose.tsx`

**Interfaces:**
- Consumes: `cn` de `@/lib/cn`.
- Produces:
  - `<Kicker tone?, spacing?, as?, className>` — `tone` es `'gold' | 'teal' | 'lav' | 'muted'`; `spacing` es `'tight' | 'wide' | 'widest'` mapeando a `.14em`, `.28em`/`.3em` y `.36em`/`.4em`.
  - `<Display level?, size?, italic?, className>` — títulos en Cormorant peso 300.
  - `<SectionHeading kicker, title, action?, align?>` — la cabecera de sección con kicker + h2 + acción a la derecha.
  - `<Prose size?, muted?, maxWidth?>` — párrafos de cuerpo.

- [ ] **Paso 1: Implementar `Kicker`**

Siempre: fuente sans, `font-size: 11px`, `text-transform: uppercase`. El `letter-spacing` según `spacing`. Colores: `gold` → `--color-gold`, `teal` → `--color-teal`, `lav` → `--color-lav`, `muted` → `rgba(247,244,234,0.55)`. Por defecto `as="p"`, pero debe poder renderizarse como `span`.

- [ ] **Paso 2: Implementar `Display`**

Fuente serif, `font-weight: 300`, `line-height` entre `.98` y `1.05` según tamaño. Escala de `size` con los `clamp` reales del prototipo:

| size | clamp |
|---|---|
| `hero` | `clamp(46px, 8vw, 104px)` — portal |
| `xl` | `clamp(46px, 6.2vw, 86px)` — hero home |
| `lg` | `clamp(36px, 5.5vw, 72px)` — títulos de realm |
| `md` | `clamp(30px, 4.4vw, 56px)` |
| `sm` | `clamp(28px, 3.6vw, 46px)` |
| `xs` | `clamp(28px, 4vw, 44px)` |

`italic` activa la variante cursiva. Debe soportar contenido mixto (un fragmento en cursiva con gradiente de texto oro→teal→lavanda, como el `heroTitleEm` de la línea 261).

- [ ] **Paso 3: Implementar `SectionHeading`**

Reproduce el patrón de las líneas 299–305: contenedor flex con `align-items: flex-end`, `justify-content: space-between`, hueco de 20px, margen inferior 36px; a la izquierda `Kicker` + `Display size="sm"`, a la derecha un slot `action` opcional (típicamente el enlace "Ver todo →" en color oro). Con `align="center"` apila y centra, como en la sección de realms.

- [ ] **Paso 4: Implementar `Prose`**

`line-height` entre 1.7 y 1.9, color `rgba(247,244,234,0.74)` por defecto, `text-wrap: pretty`, y `max-width` en unidades `ch` (valores usados: 40, 42, 44, 46, 48, 50, 52, 54). Tamaños: `sm` 14px, `base` 15–16px, `lg` `clamp(15px,1.6vw,19px)`.

- [ ] **Paso 5: Verificar**

```bash
cd frontend && npm run typecheck && npm run lint
```

- [ ] **Paso 6: Commit**

```bash
git add frontend && git commit -m "feat(ui): add typographic primitives"
```

---

### Task 4.2: Botones y magnetismo

**Files:**
- Create: `frontend/src/components/ui/button.tsx`, `frontend/src/components/ui/icon-button.tsx`, `frontend/src/components/ui/magnetic.tsx`
- Create: `frontend/tests/lib/magnetic.test.ts`
- Create: `frontend/src/lib/magnetic-offset.ts`

**Interfaces:**
- Consumes: `cn`, `useReducedMotionSafe`.
- Produces:
  - `magneticOffset(pointer: {x,y}, rect: {x,y,width,height}, max: number)` → `{x: number, y: number}` — función pura.
  - `<Magnetic strength?, disabled?>{children}</Magnetic>` — envoltorio que aplica el desplazamiento.
  - `<Button variant, size, iconRight?, iconLeft?, loading?, disabled?, asChild?>` — variantes `'primary' | 'outline' | 'ghost' | 'glass' | 'accent'`.
  - `<IconButton label, size?>` — botón cuadrado sólo-icono; `label` es obligatorio y se usa como `aria-label`.

**Estados obligatorios en ambos botones (requisito del PRD Parte 2):** default, hover, focus, pressed, loading, disabled.

- [ ] **Paso 1: Escribir el test que falla**

`frontend/tests/lib/magnetic.test.ts`:
- `"en el centro del elemento no hay desplazamiento"` → puntero en el centro devuelve `{x: 0, y: 0}`.
- `"nunca supera el máximo permitido"` → con el puntero en una esquina lejana, la magnitud del vector resultante es ≤ 8. El PRD Parte 3 fija el máximo en **8px**.
- `"el desplazamiento apunta hacia el puntero"` → puntero a la derecha del centro produce `x > 0`.
- `"el desplazamiento es proporcional a la distancia"` → un puntero al 25 % del borde produce menos desplazamiento que uno al 75 %.

- [ ] **Paso 2: Ejecutar el test para verlo fallar**

```bash
cd frontend && npm run test -- magnetic
```

Esperado: FALLA.

- [ ] **Paso 3: Implementar la función pura**

`lib/magnetic-offset.ts`. Calcula el vector desde el centro del rectángulo hasta el puntero, lo normaliza contra la mitad del tamaño del elemento, lo multiplica por `max` y lo limita a `max` de magnitud. El movimiento debe sentirse orgánico, **no elástico**: sin rebote ni sobreimpulso.

- [ ] **Paso 4: Ejecutar el test y verificar que pasa**

```bash
cd frontend && npm run test -- magnetic
```

Esperado: los 4 casos PASAN.

- [ ] **Paso 5: Implementar `Magnetic`**

`"use client"`. Escucha `pointermove` sobre el propio elemento, calcula el desplazamiento con la función pura y lo aplica con un `motion.div` animado (transición tipo muelle suave, sin rebote perceptible). En `pointerleave`, vuelve a `{0,0}`. Añade `data-magnetic` al hijo para que el cursor luminoso reaccione. Se desactiva por completo si hay movimiento reducido o si el dispositivo no tiene puntero fino.

- [ ] **Paso 6: Implementar `Button`**

Base común: `border-radius: 999px`, fuente serif, `letter-spacing: .04em`–`.06em`, altura mínima **44px**, transición de `.3s`, y foco visible.

| variant | Estilo exacto |
|---|---|
| `primary` | fondo `rgba(247,244,234,0.95)`, texto `#12213a`, peso 500, sombra `0 10px 40px rgba(216,185,120,0.22)` |
| `outline` | fondo transparente, borde `1px solid rgba(247,244,234,0.22)`, texto marfil |
| `glass` | fondo `var(--glass)`, borde `1px solid rgba(247,244,234,0.22)`, `backdrop-filter: blur(8px)` |
| `accent` | fondo `rgba(216,185,120,0.12)`, borde `1px solid rgba(216,185,120,0.55)`, texto marfil. Con prop `tone` puede virar a teal (`rgba(150,198,188,0.14)` / `0.5`) o lavanda (`rgba(185,176,214,0.14)` / `0.5`) |
| `ghost` | sin fondo ni borde, texto `rgba(247,244,234,0.6)`, fuente sans 13px con `letter-spacing: .12em` — es el patrón de los "← Volver" |

Tamaños: `sm` (padding 8–11px×18–26px, 17px), `md` (12–15px×26–34px, 18–19px), `lg` (16–18px×32–46px, 19–22px).

Estados: hover eleva la opacidad del fondo y añade glow; pressed reduce la escala a `0.98`; `loading` muestra un pulso de luz en lugar de spinner (prohibidos los spinners como mecanismo principal) y pone `aria-busy`; `disabled` baja la opacidad a `0.45` y quita eventos de puntero.

Además, envolver siempre el contenido en `<Magnetic>` salvo que `disabled` sea verdadero.

- [ ] **Paso 7: Implementar `IconButton`**

Cuadrado de **44px** mínimo (visualmente 40px con área táctil ampliada por padding), redondo, superficie glass, borde `--glass-brd`. Prop `active` que cambia fondo a `rgba(216,185,120,0.18)` y borde a `rgba(216,185,120,0.6)` — es el estado del icono de sesión cuando estás en `/acceso`.

- [ ] **Paso 8: Verificar**

```bash
cd frontend && npm run typecheck && npm run test
```

- [ ] **Paso 9: Commit**

```bash
git add frontend && git commit -m "feat(ui): add button, icon button and magnetic wrapper"
```

---

### Task 4.3: Superficies de vidrio

**Files:**
- Create: `frontend/src/components/ui/glass-panel.tsx`, `frontend/src/components/ui/badge.tsx`, `frontend/src/components/ui/pill.tsx`, `frontend/src/components/ui/band.tsx`

**Interfaces:**
- Consumes: `cn`, `BANDS` de `@/config/bands`.
- Produces:
  - `<GlassPanel radius?, blur?, glow?, bordered?, as?>` — la superficie base de todas las cards.
  - `<Badge tone?, solid?>` — la píldora de "Destacado" (`solid` con fondo oro `rgba(216,185,120,0.92)` y texto `#12213a`) y la variante translúcida (`rgba(15,27,46,0.35)` con borde marfil).
  - `<Pill active?, onClick?>` — la píldora de filtro/toggle.
  - `<Band gradient, aspect?, overlay?, className>` — el placeholder de gradiente con su barrido de luz.

- [ ] **Paso 1: Implementar `GlassPanel`**

Aplica `fm-surface` con radio configurable (`22px` por defecto, `26px` para destacados, `16px`/`18px`/`20px` para paneles menores). `glow` opcional añade una `box-shadow` de acento a baja opacidad y blur alto. `bordered={false}` quita el borde para los casos en que la card lleva un borde de acento propio.

- [ ] **Paso 2: Implementar `Band`**

Es la pieza que sustituye a todas las imágenes. Renderiza un div con el `gradient` como fondo y **siempre** una capa superpuesta de luz: `radial-gradient(70% 100% at 30% 10%, rgba(247,244,234,0.18), transparent 60%)`. Prop `overlay="bottom"` añade además el degradado inferior `linear-gradient(180deg, transparent 30%, rgba(10,18,32,0.72))` que usan las cards con texto encima. Acepta `aspect` (`'square' | '4/5' | '16/8' | 'auto'`) y admite hijos posicionados encima.

- [ ] **Paso 3: Implementar `Badge` y `Pill`**

`Badge`: fuente sans, 10–11px, `letter-spacing` `.16em`–`.24em`, mayúsculas, radio 999px, padding `5–7px × 13–16px`.

`Pill`: la usa el filtro de biblioteca y el selector de idioma. Inactiva: fondo `rgba(247,244,234,0.04)`, borde `rgba(247,244,234,0.14)`, texto `rgba(247,244,234,0.7)`. Activa: fondo `rgba(216,185,120,0.16)`, borde `rgba(216,185,120,0.55)`, texto marfil. Altura mínima 44px, transición `.3s`, y `aria-pressed` reflejando el estado.

- [ ] **Paso 4: Verificar y commit**

```bash
cd frontend && npm run typecheck && npm run lint
git add frontend && git commit -m "feat(ui): add glass panel, badge, pill and gradient band"
```

---

### Task 4.4: Campos de formulario

**Files:**
- Create: `frontend/src/components/ui/field.tsx`, `frontend/src/components/ui/input.tsx`, `frontend/src/components/ui/textarea.tsx`, `frontend/src/components/ui/segmented-control.tsx`

**Interfaces:**
- Consumes: `cn`.
- Produces:
  - `<Field label, htmlFor, error?, hint?>{children}</Field>` — etiqueta + control + mensaje.
  - `<Input>` y `<Textarea>` — envuelven los elementos nativos con `forwardRef`.
  - `<SegmentedControl options, value, onChange, ariaLabel>` — el conmutador login/registro.

- [ ] **Paso 1: Implementar `Field`**

Etiqueta con estilo de kicker (sans, 11px, mayúsculas, `letter-spacing: .14em`, color `rgba(247,244,234,0.55)`), margen inferior 7px. Si hay `error`, la etiqueta y el borde del control viran a un rojo derivado de la paleta — **no introducir un rojo nuevo**: usar `#C98B7A`, un terracota que armoniza con el oro, y documentarlo como token `--color-warn` en `globals.css`. El mensaje de error se asocia con `aria-describedby`.

- [ ] **Paso 2: Implementar `Input` y `Textarea`**

Fondo `var(--glass)`, borde `1px solid var(--glass-brd)`, radio `13–14px`, padding `14–16px × 16–20px`, texto marfil, fuente sans 15px, sin `outline` nativo pero **con** anillo de foco propio: al enfocar, el borde pasa a `rgba(216,185,120,0.55)` y se añade una sombra `0 0 0 3px rgba(216,185,120,0.12)`. El `Textarea` además lleva `resize: none` y, en el diario, fuente serif de 17px — exponer eso como prop `variant="journal"`.

Altura mínima 44px en `Input`.

- [ ] **Paso 3: Implementar `SegmentedControl`**

Contenedor pill con padding 5px, borde `--glass-brd`, fondo glass y `backdrop-filter: blur(10px)`, `max-width: 340px`. Cada opción es un botón flexible con radio 999px, fuente serif 18px; el activo lleva fondo `rgba(216,185,120,0.16)` y texto marfil, el inactivo fondo transparente y texto `rgba(247,244,234,0.55)`.

Accesibilidad: implementarlo con `role="tablist"` / `role="tab"` y navegación con flechas izquierda/derecha.

- [ ] **Paso 4: Verificar y commit**

```bash
cd frontend && npm run typecheck && npm run lint
git add frontend && git commit -m "feat(ui): add form field primitives and segmented control"
```

---

### Task 4.5: Indicadores de progreso y estadística

**Files:**
- Create: `frontend/src/components/ui/progress-bar.tsx`, `frontend/src/components/ui/step-progress.tsx`, `frontend/src/components/ui/stat.tsx`

**Interfaces:**
- Consumes: `cn`.
- Produces:
  - `<ProgressBar value, height?, ariaLabel>` — `value` de 0 a 100.
  - `<StepProgress steps, current, variant>` — `variant` es `'dashes'` (los 5 guiones del quiz) o `'labeled'` (los 3 pasos de reserva con etiqueta).
  - `<Stat value, label, tone>` — el número grande en Cormorant con su etiqueta.

- [ ] **Paso 1: Implementar `ProgressBar`**

Pista de `4px` (o `5px`) de alto, radio 3px, fondo `rgba(247,244,234,0.14)`. Relleno con `linear-gradient(90deg, var(--color-teal), var(--color-gold))` y el mismo radio, animado con transición de anchura. Debe llevar `role="progressbar"` con `aria-valuenow`, `aria-valuemin` y `aria-valuemax`.

- [ ] **Paso 2: Implementar `StepProgress`**

Variante `dashes`: fila centrada de segmentos de `44px × 3px`, radio 2px, hueco 8px, transición `.5s`. El color del segmento es lavanda cuando ya se ha completado o es el actual, y `rgba(247,244,234,0.14)` cuando no.

Variante `labeled`: fila de columnas flexibles, cada una con una barra de 3px arriba y una etiqueta en kicker debajo; la barra activa y las anteriores en lavanda, las siguientes atenuadas; la etiqueta activa en marfil, las demás al 50 %.

Añadir `aria-label` describiendo el progreso ("Paso 2 de 3").

- [ ] **Paso 3: Implementar `Stat`**

Número en Cormorant a 34px (hero) o 40px (santuario), `line-height: 1`, color según `tone` (`gold`, `teal`, `lav`, `ivory`). Etiqueta debajo en sans 11–12px con `letter-spacing: .1em`–`.14em`, mayúsculas y color `rgba(247,244,234,0.55)`.

- [ ] **Paso 4: Verificar y commit**

```bash
cd frontend && npm run typecheck
git add frontend && git commit -m "feat(ui): add progress bar, step progress and stat"
```

---

### Task 4.6: Disco de frecuencia y ecualizador

**Files:**
- Create: `frontend/src/components/ui/frequency-disc.tsx`, `frontend/src/components/ui/equalizer.tsx`

**Interfaces:**
- Consumes: `OrbitalRings`, `Halo` de `@/components/world`; `cn`.
- Produces:
  - `<Equalizer bars?, size?, playing?>` — las barras animadas con `fm-wave-pulse`.
  - `<FrequencyDisc size, hz, title?, tag?, duration?, band, active?, showPlay?, showEqualizer?, onClick, floatDuration?, floatDelay?>` — el disco orbital completo.

**Contexto:** este es el componente identitario del producto. Aparece en tres escalas: pequeño flotante en biblioteca (128–150px), mediano en la home (190px), y grande destacado en biblioteca (380px). Debe cubrir las tres con una sola implementación.

- [ ] **Paso 1: Implementar `Equalizer`**

Fila de barras alineadas abajo, con hueco de 3px (pequeño) o 5px (grande). Alturas y retardos exactos del prototipo, en este orden: alturas `[16, 30, 22, 38, 24, 14]` px en escala pequeña y `[24, 48, 34, 62, 40, 22]` en grande; retardos `[0, .2s, .4s, .1s, .5s, .3s]`. Cada barra de 3px (o 4px) de ancho, radio 2px, fondo `rgba(247,244,234,0.75)` (o `0.85`), animación `fm-wave-pulse 1.6s ease-in-out infinite`. Opacidad global `.7`–`.75`.

Si `playing` es falso, congelar la animación en su estado base en lugar de ocultarla.

- [ ] **Paso 2: Implementar `FrequencyDisc`**

Estructura por capas, de fuera hacia dentro:
1. `Halo` (sólo en tamaños medio y grande) con `inset: -10%`/`-12%`.
2. `OrbitalRings` exteriores rotando lentamente. En pequeño: un aro r=97 punteado `1 8` con un nodo dorado, `fm-spin 70s`. En medio: aro r=97 punteado `1 7`, `fm-spin 60s`. En grande: dos capas — r=98 sólido oro `0.55` y r=86 punteado lavanda con nodos oro/teal/lavanda a `fm-spin 110s`, más un aro interior r=90 punteado teal a `fm-spin-r 80s`.
3. El disco: `inset` de 9px (pequeño), 12px (medio) o 22px (grande), `border-radius: 50%`, `overflow: hidden`, fondo = `band`, borde de acento y `box-shadow` de glow.
4. Dentro del disco: capa de luz `radial-gradient(70% 80% at 32% 22%, rgba(247,244,234,0.24), transparent 62%)`; el `Equalizer` si `showEqualizer`; el número de Hz en Cormorant (26px pequeño, 34px medio, 70px grande) con la unidad "Hz" debajo en sans con `letter-spacing` `.26em`–`.36em`; y el botón de play circular si `showPlay` (46px medio, 62px grande, borde marfil o dorado, fondo semitransparente con `backdrop-filter: blur(4px)`).
5. Debajo del disco: título en Cormorant (16/22/32px) y meta en sans (10/12/13px) con `tag · duration`.

Estado `active`: bordes y aros pasan a oro `0.6`, el glow sube a `0 0 40–80px rgba(216,185,120,0.4)` y la opacidad de los aros a 1.

`floatDuration` y `floatDelay` aplican `fm-float` con los valores dados — así los discos pequeños flotan desincronizados.

Accesibilidad: el disco entero es un `<button>` con `aria-label` que incluya título, frecuencia y duración.

- [ ] **Paso 3: Verificar en el sandbox**

Renderizar las tres escalas una junto a otra y comparar con las capturas mentales del prototipo (líneas 336–358 para el medio, 556–571 para el pequeño, 574–596 para el grande).

- [ ] **Paso 4: Commit**

```bash
git add frontend && git commit -m "feat(ui): add frequency disc and equalizer"
```

---

### Task 4.7: Estados — carga, vacío y error

**Files:**
- Create: `frontend/src/components/ui/skeleton.tsx`, `frontend/src/components/ui/loading-orb.tsx`, `frontend/src/components/ui/empty-state.tsx`, `frontend/src/components/ui/error-state.tsx`

**Interfaces:**
- Consumes: `Display`, `Prose`, `Button`, `OrbitalRings`.
- Produces:
  - `<Skeleton variant, className>` — `variant` es `'text' | 'disc' | 'card' | 'band'`.
  - `<LoadingOrb size?, label?>` — el orbe respirando con constelación.
  - `<EmptyState illustration?, title, body, action?>`.
  - `<ErrorState title, body, action?, tone?>`.

**Requisito del PRD:** nunca usar spinners como mecanismo principal de carga. Se usan skeletons, carga progresiva y el orbe.

- [ ] **Paso 1: Implementar `Skeleton`**

Fondo con degradado de barrido: `linear-gradient(90deg, rgba(247,244,234,0.04), rgba(247,244,234,0.10), rgba(247,244,234,0.04))` con `background-size: 200% 100%` y animación `fm-shimmer 2.4s linear infinite`. La variante `disc` es circular, `band` respeta la relación de aspecto de las bandas, `text` tiene altura de línea y radio 4px, `card` usa el radio 22px.

Llevar `aria-hidden="true"` y, en el contenedor de la vista, un `aria-busy="true"`.

- [ ] **Paso 2: Implementar `LoadingOrb`**

Port de las líneas 517–523: esfera de 130px con `radial-gradient(circle at 42% 38%, rgba(247,244,234,0.9), rgba(185,176,214,0.55) 44%, transparent 72%)` y `box-shadow: 0 0 80px 22px rgba(185,176,214,0.3)`, animada con `fm-breathe 3s`. Encima, un aro punteado `3 7` girando con `fm-spin 8s`. Debajo, el `label` en Cormorant cursiva 24px al 80 % de opacidad.

Prop `tone` para poder virar el orbe a oro (confirmación de pedido) o teal.

- [ ] **Paso 3: Implementar `EmptyState`**

Composición centrada: una ilustración por defecto formada por `OrbitalRings` tenues con un nodo apagado (nunca una caja gris ni un icono genérico), el título en Cormorant cursiva 24px al 60 % de opacidad, un cuerpo opcional, y un `Button variant="accent"` con la acción de salida. Padding vertical generoso (50px).

- [ ] **Paso 4: Implementar `ErrorState`**

Misma estructura que `EmptyState` pero con el aro roto (un arco incompleto) y un botón de reintento. `tone="warn"` tiñe el aro con `--color-warn`.

- [ ] **Paso 5: Verificar y commit**

```bash
cd frontend && npm run typecheck && npm run lint
git add frontend && git commit -m "feat(ui): add skeleton, loading orb, empty and error states"
```

---

### Task 4.8: Barrel del UI Kit y documentación viva

**Files:**
- Create: `frontend/src/components/ui/index.ts`, `frontend/src/components/world/index.ts`
- Create: `frontend/src/app/[locale]/_kit/page.tsx`
- Modify: `frontend/src/middleware.ts`

**Interfaces:**
- Produces: import único `@/components/ui` y `@/components/world`; página interna de catálogo en `/es/_kit`.

- [ ] **Paso 1: Escribir los barrels**

Re-exportar todos los componentes de las tasks 4.1–4.7 y de la Fase 3.

- [ ] **Paso 2: Construir la página de catálogo**

`_kit/page.tsx` renderiza una sección por familia de componentes, mostrando cada variante y cada estado (default, hover documentado, focus, pressed, loading, disabled, active). Sirve como referencia visual para las fases siguientes y como comprobación de consistencia.

Excluirla del sitemap y marcarla con `robots: { index: false }` en su metadata. En desarrollo es accesible; en producción, devolver `notFound()` si `process.env.NODE_ENV === 'production'`.

- [ ] **Paso 3: Verificar**

```bash
cd frontend && npm run build && npm run lint && npm run typecheck && npm run test
```

Esperado: los cuatro en verde.

- [ ] **Paso 4: Commit**

```bash
git add frontend && git commit -m "feat(ui): add barrels and internal component catalog page"
```

---

# FASE 5 — Layout y navegación

Objetivo: el marco persistente. Al terminar, se puede navegar entre los 9 realms con las transiciones correctas, cambiar de idioma y silenciar el audio.

---

### Task 5.1: Header

**Files:**
- Create: `frontend/src/components/layout/site-header.tsx`, `frontend/src/components/layout/language-toggle.tsx`, `frontend/src/components/layout/audio-toggle.tsx`, `frontend/src/components/layout/brand-mark.tsx`

**Interfaces:**
- Consumes: `useAmbientStore`, `useRealm`, `Link`/`usePathname`/`useRouter` de `@/i18n/navigation`, `IconButton`, `Pill`.
- Produces: `<SiteHeader />`.

- [ ] **Paso 1: Implementar `BrandMark`**

Enlace a la home (`/inicio`) con el logo de 46×46 usando `next/image` (con `priority`) y `filter: drop-shadow(0 0 10px rgba(216,185,120,0.35))`, seguido del wordmark "Frecuencia Mágica" en Cormorant 19px, peso 500, `letter-spacing: .14em`, mayúsculas. Hueco de 13px. En móvil (<768px), ocultar el wordmark y dejar sólo el logo.

- [ ] **Paso 2: Implementar `LanguageToggle`**

`Pill` que muestra el idioma alternativo ("EN" cuando estás en español, "ES" cuando en inglés). Al pulsar, navega a la **misma ruta** en el otro locale usando `router.replace` con la opción `locale`, conservando parámetros dinámicos. Debe llevar `aria-label` explicativo ("Cambiar a inglés") y no perder el scroll.

- [ ] **Paso 3: Implementar `AudioToggle`**

`IconButton` que refleja `useAmbientStore`. Icono: cuando el sonido está activo, el glifo `♪`; cuando está silenciado, `𝄽`. Ambos en Jost 11px con `letter-spacing: .1em`. `aria-label` traducido y `aria-pressed` reflejando el estado.

- [ ] **Paso 4: Implementar `SiteHeader`**

`position: fixed`, `top/left/right: 0`, `z-index: 200`, `display: flex`, `justify-content: space-between`, padding `22px 34px`. El contenedor tiene `pointer-events: none` y **sólo** los controles lo reactivan — así el header no bloquea el contenido de debajo. A la derecha, en este orden: `LanguageToggle`, `AudioToggle`, y un `IconButton` de sesión con el icono de persona (círculo r=3.4 en (12,8) y el arco `M5.5 20a6.5 6.5 0 0 1 13 0`) que enlaza a `/acceso` y se muestra `active` cuando el realm es `auth`.

En móvil, reducir el padding a `16px 20px` y el hueco entre controles a 8px.

Semántica: elemento `<header>` con `role="banner"`.

- [ ] **Paso 5: Verificar**

Comprobar que el cambio de idioma en `/biblioteca` lleva a `/en/library` y no a `/en/biblioteca`, y que el toggle de audio persiste tras recargar.

- [ ] **Paso 6: Commit**

```bash
git add frontend && git commit -m "feat(layout): add fixed header with language and audio toggles"
```

---

### Task 5.2: Navegación de constelación

**Files:**
- Create: `frontend/src/components/layout/realm-nav.tsx`

**Interfaces:**
- Consumes: `NAV_REALMS`, `useRealm`, `Link`.
- Produces: `<RealmNav />`.

- [ ] **Paso 1: Implementar la navegación lateral**

Port de las líneas 123–135. Elemento `<nav>` fijo en `left: 26px`, centrado verticalmente, `z-index: 190`, columna con hueco de 4px, entrada con `fm-fade-in 1.2s`.

Cada ítem es un enlace con padding `11px 6px` (garantizando 44px de alto total), opacidad base `.6` que sube a 1 en hover/focus, y contiene:
- Un punto de 9px con el color del realm; en hover escala a 1.35; si es el realm activo, lleva `box-shadow: 0 0 12px 2px <color>`.
- Un badge que se despliega a la derecha: posicionado en `left: 30px`, centrado verticalmente, con `transform-origin: left center`, oculto en `opacity: 0` y `translateX(-10px) scaleX(.8)`, y visible en hover/focus con `opacity: 1` y `translateX(0) scaleX(1)`. Transición: opacidad `.3s ease` y transformación `.34s cubic-bezier(.2,.85,.25,1)`. El badge es una píldora `rgba(15,27,46,0.82)` con borde `--glass-brd`, `backdrop-filter: blur(14px)`, sombra `0 10px 30px rgba(0,0,0,0.4)`, y dentro un punto de 6px con glow más el nombre del realm en Cormorant 16px.

- [ ] **Paso 2: Aplicar las reglas de visibilidad**

Ocultar por completo la navegación cuando el realm es `portal` o `auth`.

En pantallas menores de 1024px, la columna lateral no cabe: convertirla en una **barra inferior** fija con los 6 puntos en fila, centrada, con el badge apareciendo encima del punto activo en lugar de a la derecha. Mantener los 44px de área táctil.

- [ ] **Paso 3: Accesibilidad**

`<nav aria-label="Realms">`. El badge no puede ser la única forma de conocer el destino: cada enlace lleva además el nombre en un elemento visualmente oculto pero legible por lectores de pantalla. El realm activo lleva `aria-current="page"`. El badge debe aparecer también con `:focus-visible`, no sólo con `:hover`.

- [ ] **Paso 4: Commit**

```bash
git add frontend && git commit -m "feat(layout): add constellation realm navigation"
```

---

### Task 5.3: Footer y newsletter

**Files:**
- Create: `frontend/src/components/layout/site-footer.tsx`, `frontend/src/components/layout/newsletter-form.tsx`

**Interfaces:**
- Consumes: `Input`, `Button`, `Link`, mensajes del namespace `footer`.
- Produces: `<SiteFooter />`.

- [ ] **Paso 1: Implementar el footer**

Port de las líneas 460–482. Borde superior `1px solid rgba(247,244,234,0.10)`, padding `60px 8vw 46px`, ancho máximo 1280px. Fila superior con `flex-wrap`, `justify-content: space-between`:
- Izquierda: wordmark en Cormorant 26px con `letter-spacing: .1em`, la frase de marca en 14px al 60 %, y el formulario de newsletter.
- Derecha: las columnas de enlaces (hueco de 52px), cada una con un título en kicker y enlaces en Cormorant 17px al 78 %.

Línea inferior: `© 2026 Frecuencia Mágica · <derechos>` en sans 11px al 40 %.

- [ ] **Paso 2: Implementar el formulario de newsletter**

Fila de `Input` pill (radio 999px, padding `12px 18px`) y un `Button` dorado cuadrado con la flecha `→`. Estado de envío simulado: al enviar, mostrar durante 3 segundos un mensaje de confirmación en la voz de marca en lugar del formulario. No hay backend; documentarlo con un comentario `// TODO(backend)`.

Accesibilidad: el input lleva `type="email"`, `required`, una etiqueta visualmente oculta y `aria-describedby` apuntando al mensaje de estado, que va en una región `aria-live="polite"`.

- [ ] **Paso 3: Definir dónde aparece el footer**

El footer se renderiza **sólo** en home, biblioteca, academia, experiencias y tienda. No aparece en portal, auth, descúbrete ni santuario, que son experiencias a pantalla completa.

- [ ] **Paso 4: Commit**

```bash
git add frontend && git commit -m "feat(layout): add site footer with newsletter form"
```

---

### Task 5.4: Shell de página y transiciones de ruta

**Files:**
- Create: `frontend/src/components/layout/page-shell.tsx`, `frontend/src/components/layout/route-transition.tsx`
- Modify: `frontend/src/app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `motion`, `usePathname`, `useReducedMotionSafe`.
- Produces:
  - `<PageShell width?, padded?, footer?>` — contenedor de contenido con los anchos del prototipo.
  - `<RouteTransition>{children}</RouteTransition>` — fundido entre rutas.

- [ ] **Paso 1: Implementar `PageShell`**

Anchos máximos reales por vista: 1280px (home, biblioteca), 1240px (tienda), 1200px (academia, experiencias, santuario), 1080px (about, membresía), 820px (checkout), 720px (reserva), 680px (resultado de descúbrete). Exponerlos como `width` con nombres semánticos (`'wide' | 'default' | 'narrow' | 'form' | 'focus'`).

Padding estándar: `130px 8vw 90px` en las vistas de realm (los 130px superiores dejan sitio al header fijo), `120px 24px 80px` en las centradas. En móvil, el padding lateral baja a `24px` y el superior a `100px`.

- [ ] **Paso 2: Implementar `RouteTransition`**

Envuelve `{children}` en un `AnimatePresence mode="wait"` con clave igual al pathname. Variante de salida: opacidad a 0 en 0.3 s. Variante de entrada: opacidad de 0 a 1 en 0.7 s con el easing suave del sistema, replicando el `fm-fade-in` del prototipo.

Importante: **no** desplazar verticalmente en la transición de ruta — el prototipo sólo hace fundido entre realms, y añadir desplazamiento rompería la sensación de continuidad espacial. El desplazamiento se reserva para las entradas escalonadas de contenido dentro de cada vista.

Con movimiento reducido, sustituir por un corte limpio sin animación.

- [ ] **Paso 3: Componer el layout definitivo**

En `[locale]/layout.tsx`, el árbol final debe ser: `NextIntlClientProvider` → `RealmProvider` → (`WorldEngine`, `SmoothScroll` → `SiteHeader` + `RealmNav` + `<main>` con `RouteTransition` → `{children}`).

- [ ] **Paso 4: Verificar la navegación completa**

Crear páginas mínimas para las 9 rutas (un `<h1>` con el nombre del realm) y comprobar: la navegación por la constelación funciona, el fondo cambia de acento suavemente, el drone se re-afina, el scroll vuelve arriba y el header se mantiene.

```bash
cd frontend && npm run build
```

Esperado: build exitoso con todas las rutas listadas para ambos locales.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat(layout): add page shell and route transitions"
```

---

# FASE 6 — Portal

Objetivo: la primera pantalla. Es el umbral y define si el usuario dice "no he visto nunca una web así".

---

### Task 6.1: Pantalla del portal

**Files:**
- Create: `frontend/src/components/features/portal/portal-scene.tsx`, `frontend/src/components/features/portal/enter-button.tsx`
- Modify: `frontend/src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `OrbitalRings`, `Display`, `Kicker`, `Prose`, `Button`, `usePortalStore`, `useAmbientStore`.
- Produces: la ruta `/` renderizada.

- [ ] **Paso 1: Construir la geometría de fondo del portal**

Port de las líneas 214–228. Contenedor absoluto centrado de `min(78vh, 640px)` de lado, sin eventos de puntero, con dos SVG superpuestos de `viewBox="0 0 640 640"`:

- Capa 1, `fm-spin 120s linear infinite`, opacidad `.9`: círculos de radio 300 (oro `0.18`), 240 (teal `0.16`, punteado `2 10`) y 180 (lavanda `0.16`); más un grupo de cuatro líneas de trazo oro `0.22` grosor 0.7 — vertical (320,20)→(320,620), horizontal (20,320)→(620,320), y las dos diagonales (108,108)→(532,532) y (532,108)→(108,532).
- Capa 2, `fm-spin-r 90s linear infinite`: dos triángulos invertidos entre sí, `200,60`… en realidad `320,90 520,440 120,440` con trazo oro `0.14`, y `320,550 120,200 520,200` con trazo teal `0.12`.

- [ ] **Paso 2: Construir el bloque central**

Entrada con `fm-fade-in 2s`. De arriba abajo:
1. El logo de 210×210 flotando con `fm-float 8s`, con un halo detrás (`inset: -8%`, gradiente radial oro `0.22` → teal `0.10` al 55 % → transparente al 72 %, `blur(12px)`, `fm-breathe 7s`) y `drop-shadow(0 0 26px rgba(216,185,120,0.4))`. Encima, un aro de `inset: -18px` con borde marfil `0.30` animado con `fm-ring 4.5s ease-out infinite` — es la onda expansiva que se repite.
2. `Kicker` teal con `letter-spacing: .5em` y opacidad `.85`.
3. `Display size="hero"` con el título.
4. `Prose` de máximo 520px, `clamp(15px,1.6vw,19px)`, `line-height: 1.75`, al 72 %.
5. El botón de entrada.

Al pie, absoluto a 34px del fondo y centrado, la pista en sans 11px con `letter-spacing: .32em` al 40 %.

La sección ocupa `min-height: 100vh` con contenido centrado y `text-align: center`.

- [ ] **Paso 3: Implementar `EnterButton`**

Es un botón especial, no una variante del `Button` genérico. Estructura de tres capas superpuestas: (1) una capa con `border-radius: 999px`, borde `1px solid rgba(216,185,120,0.5)`, fondo `rgba(216,185,120,0.06)` y `backdrop-filter: blur(6px)`; (2) una capa de glow con `box-shadow: 0 0 40px rgba(216,185,120,0.3)` animada con `fm-glow 4s ease-in-out infinite`; (3) el texto en Cormorant 22px, mayúsculas, `letter-spacing: .14em`, padding `18px 46px`.

En hover, el glow se intensifica y el anillo se expande ligeramente. Envuelto en `<Magnetic>`.

- [ ] **Paso 4: Ajustar el responsive**

En móvil: logo a 140px, `Display` baja al mínimo del clamp, y el bloque de texto ocupa el 90 % del ancho. La geometría de fondo se reduce a `min(70vh, 380px)` para que no se corte.

- [ ] **Paso 5: Metadata**

La página exporta `generateMetadata` con el título "Frecuencia Mágica" (sin plantilla, es la raíz) y la descripción de marca traducida.

- [ ] **Paso 6: Commit**

```bash
git add frontend && git commit -m "feat(portal): build threshold screen with sacred geometry"
```

---

### Task 6.2: Cruzar el portal

**Files:**
- Modify: `frontend/src/components/features/portal/enter-button.tsx`
- Create: `frontend/src/hooks/use-cross-portal.ts`

**Interfaces:**
- Consumes: `usePortalStore`, `useAmbientStore`, `useRouter` de `@/i18n/navigation`.
- Produces: `useCrossPortal()` → `() => void` — dispara la secuencia completa.

- [ ] **Paso 1: Implementar el hook**

Al invocarse:
1. Si el audio ambiental está apagado, **activarlo** — es el gesto de usuario que desbloquea el `AudioContext`, exactamente como hace el prototipo en la línea 1287.
2. Llamar a `cross()` del store del portal.
3. Programar la navegación a `/inicio` a los **1000 ms**, coincidiendo con el momento en que el círculo del overlay ha cubierto la pantalla.
4. No hacer nada si ya hay una transición en curso.
5. Limpiar los temporizadores si el componente se desmonta antes.

- [ ] **Paso 2: Conectar el botón**

`EnterButton` invoca el hook en su `onClick`. Mientras la fase no es `'idle'`, el botón queda `disabled` y con `aria-busy`.

- [ ] **Paso 3: Verificar la coreografía**

Con el navegador abierto, pulsar el botón y comprobar la secuencia completa: el núcleo blanco estalla, los dos anillos se expanden, la geometría gira 240°, el círculo cubre la pantalla, la home aparece ya montada debajo, y el overlay se desvanece. Sin parpadeos ni saltos de scroll.

Con `prefers-reduced-motion`, la navegación ocurre en los mismos tiempos pero con un fundido simple.

- [ ] **Paso 4: Commit**

```bash
git add frontend && git commit -m "feat(portal): wire portal crossing to home navigation"
```

---

# FASE 7 — Home

Objetivo: la vista más larga y con más jerarquía. Se divide en una tarea por sección para que cada una sea revisable por separado.

Todas las secciones de esta fase viven en `frontend/src/components/features/home/` y se componen en `frontend/src/app/[locale]/inicio/page.tsx`.

---

### Task 7.1: Hero de la home

**Files:**
- Create: `frontend/src/components/features/home/hero-section.tsx`
- Create: `frontend/src/app/[locale]/inicio/page.tsx`

**Interfaces:**
- Consumes: `Display`, `Kicker`, `Prose`, `Button`, `Stat`, `OrbitalRings`, `Halo`, `Link`.
- Produces: `<HeroSection />`.

- [ ] **Paso 1: Construir la rejilla**

Port de las líneas 253–295. `min-height: 100vh`, rejilla de dos columnas `1.05fr 0.95fr` con hueco de 40px, centrado vertical, padding `120px 8vw 70px`, ancho máximo 1440px.

- [ ] **Paso 2: Construir la columna izquierda**

Con entradas escalonadas usando `staggerContainer`/`staggerItem`, en este orden y con estos retardos: la píldora de kicker (0s), el título (.1s), el subtítulo (.25s), los botones (.4s), las estadísticas (.55s).

- La píldora: `display: inline-flex`, padding `8px 16px 8px 10px`, borde `--glass-brd`, fondo glass, `blur(10px)`, radio 999px; dentro un punto teal de 6px con `box-shadow: 0 0 8px 1px` y `fm-glow 3s`, y el texto en kicker al 75 %.
- El título: `Display size="xl"` con `max-width: 15ch`; la segunda parte va en cursiva con relleno de gradiente `linear-gradient(100deg, var(--gold), var(--teal) 55%, var(--lav))` recortado al texto.
- Los botones: primario "Descúbrete" con flecha, y secundario glass con icono de play.
- Las estadísticas: fila con hueco de 40px, tres `Stat` con los valores y tonos de las líneas 1441–1448.

- [ ] **Paso 3: Construir la columna derecha**

`min-height: 420px`, contenido centrado, entrada con `fm-fade-in 1.4s`. Capas: un halo circular de `min(80%,440px)` con gradiente oro `0.16`, `blur(18px)` y `fm-breathe 8s`; `OrbitalRings` de radios 192/150/108 con nodos oro/teal/lavanda a `fm-spin 130s` y opacidad `.75`; un triángulo `200,40 340,320 60,320` a `fm-spin-r 95s` y opacidad `.5`; y el logo al 60 % del ancho (máx. 300px) flotando con `fm-float 8s` y `drop-shadow(0 0 30px rgba(216,185,120,0.42))`.

- [ ] **Paso 4: Responsive**

Por debajo de 1024px, la rejilla pasa a una columna con el bloque orbital **arriba** y el texto debajo, y el orbital reduce su tamaño al 70 %. Por debajo de 768px, el `min-height` pasa a `auto` con padding vertical de 100px, y los dos botones ocupan el ancho completo apilados.

- [ ] **Paso 5: Crear la página**

`inicio/page.tsx` como Server Component: llama a `setRequestLocale`, exporta `generateMetadata` con el título traducido, y renderiza `<HeroSection />` dentro del `PageShell`.

- [ ] **Paso 6: Commit**

```bash
git add frontend && git commit -m "feat(home): build hero section"
```

---

### Task 7.2: Frecuencia del día y rejilla de audios

**Files:**
- Create: `frontend/src/components/features/home/daily-frequency.tsx`, `frontend/src/components/features/home/audio-grid.tsx`

**Interfaces:**
- Consumes: `FrequencyDisc`, `Equalizer`, `SectionHeading`, `Halo`, `OrbitalRings`, `usePlayerStore` (Fase 9), `AUDIOS`.
- Produces: `<DailyFrequency audio />` y `<AudioGrid audios />`.

Nota de dependencias: esta tarea necesita `usePlayerStore`, que se define en la Task 9.1. **Ejecutar la Task 9.1 antes que esta**, o dejar los `onClick` apuntando a una función vacía y conectarlos en la Fase 9. Se recomienda lo primero.

- [ ] **Paso 1: Construir la card de frecuencia del día**

Port de las líneas 308–333. Es un botón de ancho completo con rejilla de tres columnas `auto 1fr auto` y hueco `clamp(24px,4vw,52px)`, borde `1px solid rgba(216,185,120,0.34)`, radio 26px, padding `clamp(26px,3.4vw,44px)`, fondo `linear-gradient(120deg, rgba(216,185,120,0.14), rgba(15,27,46,0.35) 60%, rgba(150,198,188,0.12))` con `blur(14px)`, y una capa de luz `radial-gradient(50% 120% at 88% 0%, rgba(216,185,120,0.2), transparent 60%)`.

- Columna 1: un disco de `clamp(130px,15vw,180px)` con halo, aros r=98/82 a `fm-spin 90s`, y dentro el número de Hz en `clamp(30px,3.4vw,44px)` sobre la banda del audio, con borde oro `0.55` y `box-shadow: 0 0 50px rgba(216,185,120,0.35)`.
- Columna 2: kicker oro, título `clamp(28px,3.4vw,44px)`, descripción de máximo 46ch al 74 %, y una línea de meta al 55 %.
- Columna 3: un círculo de 74px con borde oro `0.6`, fondo `rgba(216,185,120,0.14)`, icono de play y `fm-breathe 6s`; debajo, el label de acción en kicker.

En móvil, la rejilla pasa a una columna con el disco centrado arriba y el botón de play al final.

- [ ] **Paso 2: Construir la rejilla de audios**

Port de las líneas 334–360. `grid-template-columns: repeat(auto-fill, minmax(210px, 1fr))` con hueco `36px 22px`. Cada celda es un `FrequencyDisc` en tamaño medio (190px) con ecualizador y botón de play, mostrando los **cuatro primeros** audios del catálogo.

- [ ] **Paso 3: Componer la sección**

Precede a ambos un `SectionHeading` con kicker teal, título y la acción "Ver todo →" enlazando a `/biblioteca`. Ancho máximo 1280px, padding `20px 8vw 40px`.

- [ ] **Paso 4: Commit**

```bash
git add frontend && git commit -m "feat(home): build daily frequency card and audio grid"
```

---

### Task 7.3: Rejilla bento de realms

**Files:**
- Create: `frontend/src/components/features/home/realms-grid.tsx`, `frontend/src/components/features/home/realm-card.tsx`

**Interfaces:**
- Consumes: `NAV_REALMS`, `BANDS`, `RealmGlyph`, `OrbitalRings`, `Badge`, `Display`, `Link`.
- Produces: `<RealmsGrid />` y `<RealmCard realm, featured?, size />`.

**Jerarquía exacta a respetar** (líneas 364–415 y 1359–1377): Academia va **arriba, a ancho completo**, con rejilla interna `1.25fr 1fr`; debajo, una rejilla de **3 columnas** con los otros cinco realms en este orden — descúbrete, biblioteca, tienda, experiencias, santuario — donde **tienda ocupa dos filas** (`grid-row: span 2`) y es la única con tratamiento de destacado.

- [ ] **Paso 1: Construir la card destacada de Academia**

Rejilla de dos columnas, `min-height: 340px`, borde `1px solid rgba(150,198,188,0.34)`, radio 26px, fondo = banda teal. Columna izquierda con padding `clamp(30px,4vw,52px)`: kicker de emoción en teal, título `clamp(38px,4.6vw,62px)`, descripción de máximo 42ch al 82 %, y una píldora primaria con flecha. Columna derecha: un degradado lateral `linear-gradient(90deg, rgba(15,27,46,0.9) 0%, transparent 40%)`, una luz radial, `OrbitalRings` de 300px a `fm-spin 100s` desbordando por la derecha (`right: -30px`), y el glifo grande flotando con `fm-float-s 6s`.

- [ ] **Paso 2: Construir las cards secundarias**

Cada una: `min-height: 210px`, borde `--glass-brd` (o `rgba(216,185,120,0.32)` si es destacada), radio 22px, padding 28px, fondo = banda del realm, contenido alineado abajo, y una capa `linear-gradient(180deg, transparent 30%, rgba(10,18,32,0.72))`. Glifo pequeño en la esquina superior derecha. Texto: kicker de emoción al 70 %, título en Cormorant peso 400 a 29px, descripción de 13.5px con máximo 34ch.

La card de **tienda**, al ser destacada, añade: `grid-row: span 2`, título `clamp(30px,3vw,42px)`, descripción de 15px, glifo grande, una luz radial `radial-gradient(70% 45% at 75% 20%, rgba(216,185,120,0.22), transparent 60%)`, `OrbitalRings` de 300px en la esquina superior derecha a `fm-spin 100s`, un `Badge solid` de "Destacado" en la esquina superior izquierda, y una píldora primaria "Ver productos" con flecha bajo el texto.

- [ ] **Paso 3: Añadir el encabezado y el separador**

Encima de la rejilla: kicker lavanda centrado y `Display size="sm"` centrado, con margen inferior de 44px. Debajo de toda la sección: un `<WaveSeparator />` con ancho máximo 1000px y padding lateral `8vw`.

- [ ] **Paso 4: Responsive**

A 1024px: la rejilla pasa a 2 columnas y tienda deja de ocupar dos filas. A 768px: una sola columna, todas las cards con `min-height: 200px`, y la card de Academia apila su rejilla interna con el bloque orbital reducido detrás del texto.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat(home): build realms bento grid with academy and store hierarchy"
```

---

### Task 7.4: Sobre Marisol, membresía y footer

**Files:**
- Create: `frontend/src/components/features/home/about-section.tsx`, `frontend/src/components/features/home/membership-section.tsx`
- Modify: `frontend/src/app/[locale]/inicio/page.tsx`

**Interfaces:**
- Consumes: `Display`, `Kicker`, `Prose`, `Button`, `OrbitalRings`, `SiteFooter`.
- Produces: `<AboutSection />` y `<MembershipSection />`.

- [ ] **Paso 1: Construir "Sobre Marisol"**

Port de las líneas 429–444. Ancho máximo 1080px, padding `90px 8vw`. Fila flexible con hueco de 56px:
- Izquierda (`flex: 1`, mínimo 240px): un retrato placeholder con relación de aspecto 3/4, `border-radius: 200px 200px 22px 22px` — la forma de arco es intencional y evoca un nicho de templo. Fondo `linear-gradient(160deg, rgba(216,185,120,0.22), rgba(185,176,214,0.16) 55%, rgba(150,198,188,0.14))`, con una luz radial superior y dos aros concéntricos de 140px girando a `fm-spin 90s` en la parte alta.
- Derecha (`flex: 1.3`, mínimo 280px): kicker oro, `Display size="sm"` con `line-height: 1.15`, un primer párrafo de 16px con `line-height: 1.9` al 78 %, y un segundo párrafo en Cormorant cursiva 15px al 66 %.

Documentar con un comentario que este retrato debe sustituirse por la fotografía real de Marisol cuando el cliente la entregue, manteniendo la máscara de arco.

- [ ] **Paso 2: Construir la sección de membresía**

Port de las líneas 447–457. Panel centrado de ancho máximo 1080px, radio 26px, borde `1px solid rgba(216,185,120,0.32)`, fondo `linear-gradient(135deg, rgba(216,185,120,0.14), rgba(15,27,46,0.4))` con `blur(14px)`, padding `clamp(34px,5vw,64px)`, más una luz radial superior `radial-gradient(70% 120% at 50% 0%, rgba(216,185,120,0.22), transparent 60%)`. Dentro: kicker oro, `Display size="md"`, un párrafo centrado de máximo 52ch, y un `Button variant="primary" size="lg"`.

- [ ] **Paso 3: Ensamblar la página completa**

El orden final de `inicio/page.tsx` es: `HeroSection`, `DailyFrequency` + `AudioGrid`, `RealmsGrid`, `WaveSeparator`, `AboutSection`, `MembershipSection`, `SiteFooter`.

- [ ] **Paso 4: Añadir revelado al hacer scroll**

Envolver cada sección en un contenedor animado que use `whileInView` con `viewport={{ once: true, amount: 0.2 }}` y la variante `fadeUp`. Esto sustituye a los `animation-delay` fijos del prototipo por un revelado ligado al scroll, que es mejor experiencia en una página larga. Respetar movimiento reducido.

- [ ] **Paso 5: Verificar la home completa**

Comparar lado a lado con el prototipo a 1440px, 1280px, 768px y 390px. Repasar la lista de fidelidad de la sección 10 del `DESIGN_CONTEXT.md`.

```bash
cd frontend && npm run build && npm run lint
```

- [ ] **Paso 6: Commit**

```bash
git add frontend && git commit -m "feat(home): add about, membership sections and assemble page"
```

---

# FASE 8 — Descúbrete

Objetivo: el cuestionario conversacional de 5 pasos con su pantalla de sintonización y su resultado. Toda la lógica va en un reducer puro y testeado.

---

### Task 8.1: Reducer del cuestionario

**Files:**
- Create: `frontend/src/lib/quiz/quiz-reducer.ts`, `frontend/src/hooks/use-quiz.ts`
- Create: `frontend/tests/lib/quiz-reducer.test.ts`

**Interfaces:**
- Consumes: `QUESTIONS`, `AUDIOS`.
- Produces:
  - Tipo `QuizState` = `{ phase: 'intro' | 'question' | 'tuning' | 'result'; step: number; answers: number[] }`.
  - Tipo `QuizAction` = `{type:'begin'} | {type:'answer', option: number} | {type:'back'} | {type:'finishTuning'} | {type:'restart'}`.
  - `quizReducer(state, action)` → `QuizState` — función pura.
  - `initialQuizState` → `QuizState`.
  - `resultIndex(answers: number[], catalogSize: number)` → `number`.
  - `useQuiz()` → `{ state, begin, answer, back, restart }` con el temporizador de sintonización encapsulado.

- [ ] **Paso 1: Escribir los tests que fallan**

`frontend/tests/lib/quiz-reducer.test.ts`:
- `"empieza en la introducción"` → `initialQuizState.phase` es `'intro'`, `step` es 0, `answers` está vacío.
- `"comenzar lleva a la primera pregunta"` → tras `begin`, `phase` es `'question'` y `step` es 0.
- `"responder avanza a la siguiente pregunta"` → desde el paso 0, `answer` con opción 2 deja `step` en 1 y `answers` en `[2]`.
- `"responder la última pregunta abre la sintonización"` → tras responder las 5, `phase` es `'tuning'` y `answers` tiene longitud 5.
- `"terminar la sintonización muestra el resultado"` → `finishTuning` desde `'tuning'` deja `phase` en `'result'`.
- `"volver retrocede una pregunta"` → desde el paso 2, `back` deja `step` en 1 conservando las respuestas.
- `"volver desde la primera pregunta regresa a la introducción"` → desde `step` 0, `back` deja `phase` en `'intro'`.
- `"cambiar una respuesta anterior la sobrescribe"` → retroceder y responder distinto reemplaza el valor en su índice sin borrar los posteriores.
- `"reiniciar limpia el estado"` → `restart` devuelve exactamente `initialQuizState`.
- `"el índice de resultado es la suma de respuestas módulo el catálogo"` → `resultIndex([0,1,2,3,0], 7)` es 6; `resultIndex([3,3,3,3,3], 7)` es 1; `resultIndex([], 7)` es 0.
- `"el índice de resultado siempre cae dentro del catálogo"` → para todas las combinaciones de respuestas entre 0 y 3 en 5 preguntas, el resultado está entre 0 y 6.

- [ ] **Paso 2: Ejecutar los tests para verlos fallar**

```bash
cd frontend && npm run test -- quiz
```

Esperado: FALLA.

- [ ] **Paso 3: Implementar el reducer**

`lib/quiz/quiz-reducer.ts`. Sin efectos, sin temporizadores, sin acceso a `Date` ni `Math.random`. La fórmula del resultado es la del prototipo (línea 1307): suma de los índices de respuesta, módulo el tamaño del catálogo de audios.

- [ ] **Paso 4: Ejecutar los tests y verificar que pasan**

```bash
cd frontend && npm run test -- quiz
```

Esperado: los 11 casos PASAN.

- [ ] **Paso 5: Implementar el hook**

`use-quiz.ts` con `useReducer`. Encapsula el único efecto: cuando `phase` pasa a `'tuning'`, programa `finishTuning` a los **2600 ms** (línea 1303 del prototipo). Limpia el temporizador al desmontar o si el usuario reinicia antes.

- [ ] **Paso 6: Commit**

```bash
git add frontend && git commit -m "feat(discover): add pure quiz reducer and hook"
```

---

### Task 8.2: Pantallas del cuestionario

**Files:**
- Create: `frontend/src/components/features/discover/discover-intro.tsx`, `frontend/src/components/features/discover/quiz-step.tsx`, `frontend/src/components/features/discover/tuning-screen.tsx`, `frontend/src/components/features/discover/quiz-result.tsx`, `frontend/src/components/features/discover/discover-experience.tsx`
- Create: `frontend/src/app/[locale]/descubrete/page.tsx`

**Interfaces:**
- Consumes: `useQuiz`, `StepProgress`, `LoadingOrb`, `Display`, `Kicker`, `Prose`, `Button`, `usePlayerStore`, `QUESTIONS`, `AUDIOS`.
- Produces: la ruta `/descubrete`.

- [ ] **Paso 1: Construir la introducción**

Port de las líneas 489–496. Bloque centrado de máximo 600px: kicker lavanda con `letter-spacing: .4em`, `Display size="lg"`, un párrafo de máximo 46ch a 17px con `line-height: 1.85` al 70 %, y un botón con fondo `rgba(185,176,214,0.10)`, borde `1px solid rgba(185,176,214,0.5)`, radio 999px, padding `16px 42px`, Cormorant 20px.

- [ ] **Paso 2: Construir el paso de pregunta**

Port de las líneas 497–515. Contenedor de máximo 640px:
- Arriba, `StepProgress variant="dashes"` con 5 segmentos, centrado, margen inferior 44px.
- Contador en kicker lavanda centrado ("Pregunta 3 de 5").
- Enunciado en `Display size="sm"` centrado con `line-height: 1.1` y margen inferior 40px.
- Las cuatro opciones en una rejilla de una columna con hueco de 14px. Cada opción: texto alineado a la izquierda, radio 16px, padding `20px 26px`, Cormorant 21px, `backdrop-filter: blur(8px)`, transición `.3s`. Estado normal: fondo `rgba(247,244,234,0.04)`, borde `rgba(247,244,234,0.14)`. Estado hover/focus: fondo `rgba(185,176,214,0.14)`, borde `rgba(185,176,214,0.6)`. Estado seleccionado (al volver atrás): mismo tratamiento que hover, más un punto lavanda a la izquierda.
- Abajo, centrado, el enlace "Volver" en `Button variant="ghost"`.

Accesibilidad: el grupo de opciones lleva `role="radiogroup"` con `aria-labelledby` apuntando al enunciado; cada opción es un `role="radio"` navegable con flechas. Al cambiar de pregunta, mover el foco al nuevo enunciado y anunciarlo con una región `aria-live`.

Animación: al pasar de una pregunta a otra, la saliente se desvanece hacia arriba y la entrante emerge desde abajo con `fadeUp`, en 0.4 s. Usar `AnimatePresence mode="wait"` con clave igual al índice de pregunta.

- [ ] **Paso 3: Construir la pantalla de sintonización**

Port de las líneas 516–524. Centrada: `LoadingOrb` de 130px con el aro punteado girando, y debajo el texto de sintonización en Cormorant cursiva 24px al 80 %. Añadir `role="status"` para que un lector de pantalla anuncie que se está calculando.

- [ ] **Paso 4: Construir el resultado**

Port de las líneas 525–539. Bloque centrado de máximo 680px con entrada `fadeUp`:
- Kicker lavanda.
- Un orbe de 150px con `fm-breathe 6s`, cuyo gradiente y glow toman el color asociado a la frecuencia resultante.
- `Display size="md"` con el título del audio.
- Una línea en kicker oro con la frecuencia en Hz.
- La descripción poética de esa frecuencia, tomada del mapa `RDESC` portado en la Task 2.2, de máximo 48ch a 17px con `line-height: 1.9`.
- Dos botones: uno de acento oro que abre el reproductor con ese audio y navega a `/biblioteca`, y otro de contorno que reinicia el cuestionario.

- [ ] **Paso 5: Componer la experiencia**

`discover-experience.tsx` (client component) consume `useQuiz` y renderiza la fase activa, envolviendo todo en `AnimatePresence`. La sección tiene `min-height: 100vh`, contenido centrado y padding `120px 24px 80px`.

`descubrete/page.tsx` es el Server Component que aporta metadata y monta la experiencia.

- [ ] **Paso 6: Verificar el flujo completo**

Recorrer las 5 preguntas, comprobar que retroceder conserva las respuestas, que la sintonización dura 2,6 s, que el resultado es coherente y que "Escuchar" abre el reproductor con el audio correcto.

- [ ] **Paso 7: Commit**

```bash
git add frontend && git commit -m "feat(discover): build quiz intro, steps, tuning and result screens"
```

---

# FASE 9 — Biblioteca y reproductor

Objetivo: el "sistema solar" de discos y el dock del reproductor, que persiste al navegar entre realms.

---

### Task 9.1: Store del reproductor

**Files:**
- Create: `frontend/src/stores/player-store.ts`, `frontend/src/lib/player/progress.ts`
- Create: `frontend/tests/stores/player-store.test.ts`, `frontend/tests/lib/progress.test.ts`

**Interfaces:**
- Consumes: `AUDIOS`, `parseDuration` de `@/lib/format`.
- Produces:
  - `usePlayerStore` — `{ audioId: string | null; isPlaying: boolean; elapsed: number; open(id: string): void; toggle(): void; close(): void; setElapsed(s: number): void; next(): void; previous(): void }`.
  - `progressPercent(elapsed: number, total: number)` → `number` entre 0 y 100.
  - `nextAudioId(currentId: string, catalog: readonly {id: string}[])` → `string` — envuelve al principio al llegar al final.

- [ ] **Paso 1: Escribir los tests que fallan**

`frontend/tests/lib/progress.test.ts`:
- `"calcula el porcentaje transcurrido"` → `progressPercent(540, 1080)` es 50.
- `"nunca supera el cien por cien"` → `progressPercent(2000, 1080)` es 100.
- `"nunca baja de cero"` → `progressPercent(-5, 1080)` es 0.
- `"con duración cero devuelve cero"` → `progressPercent(10, 0)` es 0 y no lanza.
- `"el siguiente audio envuelve al principio"` → con el catálogo real, `nextAudioId('a7', AUDIOS)` es `'a1'`.
- `"el siguiente audio avanza uno"` → `nextAudioId('a3', AUDIOS)` es `'a4'`.

`frontend/tests/stores/player-store.test.ts`:
- `"arranca sin audio y en pausa"` → `audioId` es `null` e `isPlaying` es `false`.
- `"abrir un audio lo reproduce desde el principio"` → tras `open('a2')`, `audioId` es `'a2'`, `isPlaying` es `true` y `elapsed` es 0.
- `"abrir otro audio reinicia el tiempo"` → tras `open('a2')`, avanzar `elapsed` y luego `open('a5')`, `elapsed` vuelve a 0.
- `"reabrir el mismo audio no reinicia el tiempo"` → `open('a2')`, avanzar a 30, `open('a2')` de nuevo deja `elapsed` en 30 — para que pulsar el mismo disco no corte la escucha.
- `"alternar cambia el estado de reproducción"` → dos llamadas a `toggle` vuelven al estado inicial.
- `"cerrar limpia el reproductor"` → tras `close()`, `audioId` es `null`, `isPlaying` es `false` y `elapsed` es 0.
- `"siguiente cambia al audio siguiente y sigue reproduciendo"` → tras `open('a1')` y `next()`, `audioId` es `'a2'` e `isPlaying` sigue `true`.

- [ ] **Paso 2: Ejecutar los tests para verlos fallar**

```bash
cd frontend && npm run test -- progress player-store
```

Esperado: FALLA.

- [ ] **Paso 3: Implementar los helpers y el store**

`lib/player/progress.ts` con las dos funciones puras. `stores/player-store.ts` con zustand, **sin** persistencia (el reproductor no debe resucitar solo al recargar).

- [ ] **Paso 4: Ejecutar los tests y verificar que pasan**

```bash
cd frontend && npm run test -- progress player-store
```

Esperado: los 13 casos PASAN.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat(library): add player store and progress helpers"
```

---

### Task 9.2: Dock del reproductor

**Files:**
- Create: `frontend/src/components/features/player/player-dock.tsx`
- Modify: `frontend/src/app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `usePlayerStore`, `getAudio`, `formatDuration`, `progressPercent`, `ProgressBar`, `IconButton`, `Band`.
- Produces: `<PlayerDock />` montado en el layout, visible en cualquier realm.

**Decisión de arquitectura:** en el prototipo el dock sólo existía dentro de biblioteca. En el frontend real se monta en el layout, porque el PRD Parte 2 pide "mini player" y "floating player" persistentes y porque el resultado de Descúbrete abre audio desde otro realm.

- [ ] **Paso 1: Construir el dock**

Port de las líneas 601–624. Contenedor fijo abajo, ancho completo, `z-index: 180`, padding `16px 22px`, contenido centrado, con entrada `fadeUp` de 0.5 s. Dentro, un panel de `min(920px, 100%)`:

- Fondo `rgba(15,27,46,0.72)` con `backdrop-filter: blur(22px)`, borde `--glass-brd`, radio 20px, sombra `0 20px 60px rgba(0,0,0,0.4)`, padding `14px 20px`, hueco de 20px.
- Miniatura de 56×56 con radio 14px, fondo = banda del audio, con la luz radial y `fm-breathe 5s`.
- Bloque de texto flexible: título en Cormorant 19px con truncado por elipsis, y meta en sans 11px al 55 % con `tag · hz Hz`.
- Botón de play/pausa de 52px, redondo, borde `rgba(216,185,120,0.55)`, fondo `rgba(216,185,120,0.12)`.
- Bloque de progreso (`flex: 1.4`, mínimo 120px): tiempo transcurrido, `ProgressBar`, y duración total.
- Botón de cierre `×` al 50 % de opacidad.

- [ ] **Paso 2: Implementar el avance del tiempo**

Un efecto que, mientras `isPlaying` sea verdadero, incremente `elapsed` una vez por segundo mediante `setInterval`, deteniéndose al pausar, al cerrar y al desmontar. Al llegar al final de la pista, pasar automáticamente al siguiente audio con `next()`.

Nota: no hay ficheros de audio reales todavía; esto simula la reproducción. Marcarlo con un comentario `// TODO(backend): sustituir por HTMLAudioElement cuando existan los ficheros` y estructurar el efecto para que cambiar a audio real sólo requiera reemplazar la fuente de tiempo.

- [ ] **Paso 3: Hacer la barra interactiva**

La barra de progreso debe permitir buscar: click o arrastre fija `elapsed` proporcionalmente. Implementarla como un `input[type=range]` visualmente oculto superpuesto, para obtener accesibilidad de teclado gratis (flechas mueven 5 s, Inicio/Fin van a los extremos).

- [ ] **Paso 4: Responsive**

Por debajo de 768px: ocultar el bloque de tiempo y duración numéricos, dejar sólo la barra bajo el título, y reducir la miniatura a 44px. El dock nunca debe tapar la barra de navegación inferior móvil: añadir `bottom` suficiente y `padding-bottom: env(safe-area-inset-bottom)`.

- [ ] **Paso 5: Montar en el layout**

Añadir `<PlayerDock />` como hermano de `{children}` en `[locale]/layout.tsx`. Cuando el dock está visible, añadir `padding-bottom` extra al `<main>` para que no tape contenido.

- [ ] **Paso 6: Commit**

```bash
git add frontend && git commit -m "feat(player): add persistent glass player dock"
```

---

### Task 9.3: Sistema solar de la biblioteca

**Files:**
- Create: `frontend/src/components/features/library/library-system.tsx`, `frontend/src/components/features/library/library-filters.tsx`, `frontend/src/lib/library/layout-slots.ts`
- Create: `frontend/src/app/[locale]/biblioteca/page.tsx`
- Create: `frontend/tests/lib/layout-slots.test.ts`

**Interfaces:**
- Consumes: `FrequencyDisc`, `Pill`, `usePlayerStore`, `AUDIOS`.
- Produces:
  - `discSlot(index: number)` → `{ top: string; left: string; size: string; duration: string; delay: string }`.
  - `filterAudios(audios, filterKey)` → `Audio[]`.
  - `<LibrarySystem />` y `<LibraryFilters />`.

**Regla visual innegociable:** aquí **no** se usa una rejilla de tarjetas. Es un disco central grande rodeado de discos pequeños en posiciones absolutas flotando.

- [ ] **Paso 1: Escribir el test que falla**

`frontend/tests/lib/layout-slots.test.ts`:
- `"hay seis posiciones orbitales"` → los slots se repiten con periodo 6: `discSlot(0)` y `discSlot(6)` son idénticos.
- `"las posiciones coinciden con el prototipo"` → comprobar las seis: índice 0 `top:3% left:9%`, 1 `top:3% left:73%`, 2 `top:40% left:-2%`, 3 `top:40% left:83%`, 4 `top:75% left:13%`, 5 `top:75% left:69%`.
- `"los tamaños coinciden con el prototipo"` → `['150px','138px','128px','150px','140px','130px']`.
- `"las duraciones y retardos de flotación desincronizan los discos"` → duraciones `['7s','8.5s','6.5s','9s','7.5s','8s']` y retardos `['0s','.6s','1.1s','.3s','.9s','1.4s']`.
- `"el filtro 'todo' devuelve el catálogo completo"` → longitud 7.
- `"el filtro por etiqueta devuelve sólo esa etiqueta"` → filtrar por meditación devuelve exactamente los audios `a1` y `a7`.
- `"un filtro sin resultados devuelve una lista vacía"` → un filtro inexistente devuelve longitud 0, sin lanzar.

Nota sobre el filtrado: el filtro compara contra el campo `tagId` definido en la Task 2.3, **nunca** contra el texto traducido. El prototipo comparaba contra `a.tag.es` y eso habría roto el filtrado en inglés. Los cinco filtros de la interfaz mapean así: Todo → sin filtro, Meditación → `meditation`, Frecuencia → `frequency`, Descanso → `rest`, Ritual → `ritual`. Los audios con `tagId` `grounding` y `breath` sólo aparecen bajo "Todo", igual que en el prototipo.

- [ ] **Paso 2: Ejecutar el test para verlo fallar**

```bash
cd frontend && npm run test -- layout-slots
```

Esperado: FALLA.

- [ ] **Paso 3: Implementar los helpers**

`lib/library/layout-slots.ts` con `discSlot` y `filterAudios`, usando los arrays exactos de la línea 194–197 del bloque de lógica del prototipo.

- [ ] **Paso 4: Ejecutar el test y verificar que pasa**

```bash
cd frontend && npm run test -- layout-slots
```

Esperado: los 7 casos PASAN.

- [ ] **Paso 5: Construir los filtros**

Fila de `Pill` con `flex-wrap`, hueco 10px, margen inferior 38px. Cinco filtros: Todo, Meditación, Frecuencia, Descanso, Ritual. El estado del filtro vive en el componente (no en un store): es efímero y local. Grupo con `role="group"` y `aria-label` traducido.

- [ ] **Paso 6: Construir el sistema solar**

Contenedor relativo de máximo 1040px, `min-height: 720px`, margen superior 30px.

- **Disco central:** absolutamente posicionado en el centro (`left:50% top:50%` con `translate(-50%,-50%)`), 400px de ancho (máximo 82 %), `z-index: 4`. Es un `FrequencyDisc` en tamaño grande con `showEqualizer` y `showPlay`, precedido de un `Badge solid` con el texto de destacado y `box-shadow: 0 0 24px rgba(216,185,120,0.5)`, y flotando con `fm-float-s 7s`.
- **Discos pequeños:** el resto de audios filtrados, cada uno absolutamente posicionado según `discSlot(i)`, con su tamaño, duración y retardo de flotación propios, `z-index: 3`.
- El destacado es el audio actualmente en el reproductor si está en la lista filtrada; si no, el primero de la lista.

- [ ] **Paso 7: Construir la cabecera y la página**

Cabecera con kicker oro (`letter-spacing: .4em`), `Display size="lg"`, y una descripción de máximo 54ch. Padding de sección `130px 8vw 220px` (los 220px inferiores dejan aire para el dock del reproductor), ancho máximo 1280px.

- [ ] **Paso 8: Responsive del sistema solar**

Por debajo de 900px el posicionamiento absoluto no funciona. Cambiar a: el disco destacado arriba, centrado y reducido a 280px, y los pequeños debajo en una rejilla `repeat(auto-fill, minmax(140px, 1fr))` conservando la flotación desincronizada. La sensación orbital se mantiene con los aros y el flotado; no intentar forzar posiciones absolutas en móvil.

- [ ] **Paso 9: Estado vacío**

Si el filtro no devuelve resultados, renderizar `<EmptyState>` con el copy del namespace `states` y un botón que restablezca el filtro a "Todo".

- [ ] **Paso 10: Commit**

```bash
git add frontend && git commit -m "feat(library): build orbital disc system with filters"
```

---

# FASE 10 — Academia

Objetivo: listado de cursos con destacado, detalle con temario, y reproductor de lección. Tres rutas anidadas.

---

### Task 10.1: Listado de cursos

**Files:**
- Create: `frontend/src/components/features/academy/course-list.tsx`, `frontend/src/components/features/academy/course-card.tsx`
- Create: `frontend/src/app/[locale]/academia/page.tsx`

**Interfaces:**
- Consumes: `COURSES`, `Band`, `Badge`, `Display`, `Kicker`, `Button`, `OrbitalRings`, `Link`.
- Produces: `<CourseList />` y `<CourseCard course, featured? />`; la ruta `/academia`.

- [ ] **Paso 1: Construir la card destacada**

Port de las líneas 636–653. Rejilla `1.15fr 1fr`, borde `1px solid rgba(216,185,120,0.32)`, radio 26px, fondo `linear-gradient(120deg, rgba(216,185,120,0.12), rgba(15,27,46,0.4))` con `blur(12px)`, margen inferior 24px.

- Izquierda: `min-height: 300px` con la banda del curso, luz radial, dos aros de 150px girando a `fm-spin 90s` en la esquina inferior derecha, y un `Badge solid` arriba a la izquierda.
- Derecha: padding `44px 44px 40px`, contenido centrado verticalmente: nivel en kicker teal, título `clamp(30px,3.4vw,46px)`, descripción de máximo 40ch en sans 14px al 70 %, y una fila con una píldora primaria con icono de play y la meta `N lecciones · X h`.

- [ ] **Paso 2: Construir las cards secundarias**

Port de las líneas 655–666. Rejilla de 2 columnas con hueco 24px. Cada card: `GlassPanel` con radio 22px; arriba una banda de 180px con degradado inferior y una píldora de nivel translúcida; debajo, padding `22px 24px 26px` con el título en Cormorant peso 400 a 27px y la meta en sans 12.5px al 60 %.

- [ ] **Paso 3: Añadir hover y foco**

Al pasar por encima o enfocar una card: elevación sutil (`translateY(-4px)`), el borde vira a `rgba(216,185,120,0.4)` y aparece un glow suave. Transición 0.4 s. Con movimiento reducido, sólo cambia el borde.

- [ ] **Paso 4: Construir la página**

Cabecera con kicker teal, `Display size="lg"` y descripción de máximo 54ch. `PageShell width="default"` (1200px). Cada card enlaza a `/academia/[courseId]`.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat(academy): build course listing with featured hierarchy"
```

---

### Task 10.2: Detalle de curso y temario

**Files:**
- Create: `frontend/src/components/features/academy/course-detail.tsx`, `frontend/src/components/features/academy/lesson-list.tsx`, `frontend/src/lib/academy/lessons.ts`
- Create: `frontend/src/app/[locale]/academia/[courseId]/page.tsx`
- Create: `frontend/tests/lib/lessons.test.ts`

**Interfaces:**
- Consumes: `getCourse`, `Band`, `Display`, `GlassPanel`, `Link`.
- Produces:
  - `buildLessons(course: Course)` → `Lesson[]` con `{ index: number; number: string; titleKey: string; duration: string }`.
  - `<CourseDetail course />` y `<LessonList lessons, currentIndex?, courseId />`.

- [ ] **Paso 1: Escribir el test que falla**

`frontend/tests/lib/lessons.test.ts`:
- `"genera tantas lecciones como declara el curso"` → para el curso `c2`, `buildLessons` devuelve 12 elementos.
- `"numera las lecciones desde uno con dos dígitos"` → los tres primeros `number` son `'01'`, `'02'`, `'03'`.
- `"reparte las horas del curso entre las lecciones"` → la suma de duraciones de `c1` (8 lecciones, 3.5 h) equivale a 210 minutos con una tolerancia de 1 minuto.
- `"toda lección tiene una duración positiva"` → ninguna duración es cero o negativa.

- [ ] **Paso 2: Ejecutar el test para verlo fallar**

```bash
cd frontend && npm run test -- lessons
```

Esperado: FALLA.

- [ ] **Paso 3: Implementar el generador**

`lib/academy/lessons.ts`. El prototipo genera títulos de lección sintéticos; aquí se hace lo mismo pero con claves de traducción: el título de cada lección se toma de un array de títulos poéticos definidos en `messages` bajo `academy.lessonTitles` (escribir 12 títulos en la voz de marca en ambos idiomas, ya que el curso más largo tiene 12 lecciones) y se cicla por índice. La duración se reparte uniformemente redondeando a minutos.

- [ ] **Paso 4: Ejecutar el test y verificar que pasa**

```bash
cd frontend && npm run test -- lessons
```

Esperado: los 4 casos PASAN.

- [ ] **Paso 5: Construir el detalle**

Port de las líneas 671–699. Enlace "← Volver" arriba. Rejilla `1.5fr 1fr` con hueco 44px, alineada arriba.

- Izquierda: nivel en kicker teal, `Display size="md"`, descripción de máximo 52ch, y un reproductor de vídeo placeholder con relación 16/8, radio 20px, fondo = banda del curso, luz radial, y un botón de play de 74px centrado con `fm-breathe 5s`.
- Derecha: `GlassPanel` con radio 20px y padding `22px 22px 12px`, con el título "Contenido" en kicker oro y la lista de lecciones.

- [ ] **Paso 6: Construir la lista de lecciones**

Cada lección es un enlace de ancho completo con fondo `rgba(247,244,234,0.04)` (o de acento si es la actual), radio 12px, padding `13px 14px`, margen inferior 8px, y una fila de: un círculo de 30px con el número dentro y borde de acento, el título en Cormorant 18px, y la duración en sans 11px al 50 %.

Estado completado: el círculo se rellena de oro tenue y muestra un ✓ en lugar del número — es el único uso permitido de ese glifo. Como no hay backend de progreso, marcar las lecciones completadas con datos simulados y comentar `// TODO(backend)`.

- [ ] **Paso 7: Implementar la ruta**

`academia/[courseId]/page.tsx` recibe `params` como promesa, hace `await`, busca el curso y llama a `notFound()` si no existe. Exporta `generateStaticParams` con los tres ids de curso por locale.

- [ ] **Paso 8: Commit**

```bash
git add frontend && git commit -m "feat(academy): build course detail with generated lesson list"
```

---

### Task 10.3: Reproductor de lección

**Files:**
- Create: `frontend/src/components/features/academy/lesson-player.tsx`
- Create: `frontend/src/app/[locale]/academia/[courseId]/[lessonId]/page.tsx`

**Interfaces:**
- Consumes: `buildLessons`, `getCourse`, `ProgressBar`, `Button`, `Display`, `Kicker`.
- Produces: la ruta de lección.

- [ ] **Paso 1: Construir el reproductor**

Port de las líneas 701–718. Enlace "← Volver al curso" arriba, kicker teal con el nombre del curso, `Display size="md"` con el título de la lección.

El bloque de reproducción: relación 16/8, radio 22px, fondo = banda del curso, una luz radial superior, y una barra de controles anclada abajo sobre `linear-gradient(0deg, rgba(10,18,32,0.7), transparent)` con padding `18px 22px`: botón de play/pausa de 48px redondo con borde marfil, y la `ProgressBar`.

Abajo, una fila con `justify-content: space-between`: botón de contorno "← Lección anterior" y botón de acento teal "Siguiente lección →".

- [ ] **Paso 2: Implementar la navegación entre lecciones**

Los botones enlazan a la lección adyacente dentro del mismo curso. En la primera lección, el botón anterior queda deshabilitado; en la última, el siguiente enlaza a una pantalla de finalización.

- [ ] **Paso 3: Construir la pantalla de finalización**

Cuando se completa la última lección, mostrar en su lugar un bloque centrado con `LoadingOrb tone="gold"` en estado estático (un orbe dorado, no cargando), un título de felicitación en la voz de marca, un texto breve, y dos botones: volver a la Academia y explorar la Biblioteca. Añadir el copy correspondiente a `messages` bajo `academy.completion`.

- [ ] **Paso 4: Verificar el flujo**

Navegar curso → lección 1 → siguiente hasta el final → pantalla de finalización, comprobando que las URLs son correctas en ambos idiomas.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat(academy): build lesson player with navigation and completion"
```

---

# FASE 11 — Experiencias y reserva

Objetivo: el listado con destacado a doble ancho y el flujo de reserva de tres pasos.

---

### Task 11.1: Listado de experiencias

**Files:**
- Create: `frontend/src/components/features/experiences/experience-list.tsx`, `frontend/src/components/features/experiences/experience-row.tsx`
- Create: `frontend/src/app/[locale]/experiencias/page.tsx`

**Interfaces:**
- Consumes: `EXPERIENCES`, `Band`, `Badge`, `OrbitalRings`, `RealmGlyph`, `Button`, `formatPrice`, `Link`.
- Produces: `<ExperienceList />`; la ruta `/experiencias`.

- [ ] **Paso 1: Construir la card destacada**

Port de las líneas 730–750. Rejilla `1.1fr 1fr`, `min-height: 340px`, borde `1px solid rgba(185,176,214,0.34)`, radio 26px, fondo = banda de la experiencia.

- Izquierda, padding `clamp(30px,4vw,50px)`: un `Badge` lavanda sólido, el modo en kicker teal, el título `clamp(32px,3.6vw,50px)`, la descripción de máximo 42ch, y una fila con la píldora primaria "Reservar" con flecha, la meta `duración · próxima fecha`, y el precio en Cormorant 30px dorado.
- Derecha: degradado lateral `linear-gradient(90deg, rgba(15,27,46,0.85) 0%, transparent 42%)`, luz radial, `OrbitalRings` de 300px desbordando por la derecha a `fm-spin 100s`, y el glifo grande.

- [ ] **Paso 2: Construir las filas del resto**

Port de las líneas 752–767. Cada una es una rejilla `220px 1fr auto` con hueco 26px, `GlassPanel` con radio 22px:
- Columna 1: la banda a altura completa (`min-height: 150px`) con luz radial y una píldora translúcida de modo arriba a la izquierda.
- Columna 2: título en Cormorant peso 400 a 26px y meta en sans 12.5px al 60 %.
- Columna 3: alineada a la derecha, el precio en Cormorant 26px dorado y el botón de acento lavanda "Reservar".

- [ ] **Paso 3: Responsive**

Por debajo de 768px, las filas se apilan: banda arriba a altura 160px, texto y precio debajo, y el botón a ancho completo.

- [ ] **Paso 4: Construir la página**

Cabecera con kicker lavanda, `Display size="lg"` y descripción de máximo 54ch. `PageShell width="default"`. El botón de reservar enlaza a `/experiencias/[experienceId]/reservar`.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat(experiences): build listing with featured experience"
```

---

### Task 11.2: Reducer del flujo de reserva

**Files:**
- Create: `frontend/src/lib/booking/booking-reducer.ts`, `frontend/src/lib/booking/dates.ts`, `frontend/src/hooks/use-booking.ts`
- Create: `frontend/tests/lib/booking-reducer.test.ts`, `frontend/tests/lib/dates.test.ts`

**Interfaces:**
- Produces:
  - Tipo `BookingState` = `{ step: 0 | 1 | 2; date: string | null; time: string | null; name: string; email: string; note: string }`.
  - `bookingReducer(state, action)` donde `action` es `{type:'pickDate', date} | {type:'pickTime', time} | {type:'continue'} | {type:'back'} | {type:'setField', field, value} | {type:'confirm'} | {type:'reset'}`.
  - `canContinue(state)` → `boolean`.
  - `canConfirm(state)` → `boolean`.
  - `upcomingDates(from: Date, count: number)` → `{ iso: string; dow: string; day: string; month: string }[]`.
  - `AVAILABLE_TIMES` → lista de horas.

- [ ] **Paso 1: Escribir los tests que fallan**

`frontend/tests/lib/booking-reducer.test.ts`:
- `"empieza en el paso de fecha sin selección"` → `step` 0, `date` y `time` nulos.
- `"no se puede continuar sin fecha y hora"` → `canContinue` es falso con sólo fecha, con sólo hora, y sin nada.
- `"se puede continuar con fecha y hora"` → `canContinue` es verdadero con ambas.
- `"continuar avanza al paso de datos"` → con ambas seleccionadas, `continue` deja `step` en 1.
- `"continuar sin selección no avanza"` → `step` sigue en 0.
- `"cambiar la fecha conserva la hora"` → seleccionar otra fecha no borra la hora.
- `"no se puede confirmar sin nombre y correo"` → `canConfirm` es falso si falta cualquiera.
- `"el correo debe tener forma de correo"` → `canConfirm` es falso con `"hola"` y verdadero con `"hola@ejemplo.com"`.
- `"confirmar avanza al paso final"` → con datos válidos, `confirm` deja `step` en 2.
- `"volver desde datos regresa a fecha conservando la selección"` → `step` vuelve a 0 con fecha y hora intactas.
- `"reiniciar limpia todo"` → devuelve el estado inicial.

`frontend/tests/lib/dates.test.ts`:
- `"genera la cantidad de fechas pedida"` → `upcomingDates(fecha, 6)` devuelve 6.
- `"las fechas son consecutivas desde el día siguiente"` → la primera es el día siguiente a la fecha dada.
- `"cada fecha trae día de la semana, número y mes"` → todos los campos son cadenas no vacías.
- `"cruza correctamente el cambio de mes"` → partiendo del 28 de febrero de un año bisiesto, la secuencia incluye el 29 de febrero y el 1 de marzo.

- [ ] **Paso 2: Ejecutar los tests para verlos fallar**

```bash
cd frontend && npm run test -- booking dates
```

Esperado: FALLA.

- [ ] **Paso 3: Implementar el reducer y las fechas**

`booking-reducer.ts` puro y sin efectos. `dates.ts` recibe la fecha base por parámetro (nunca llama a `new Date()` internamente) para poder testearlo; el formato de día de semana y mes se localiza con `Intl.DateTimeFormat` usando el locale activo, que se pasa como argumento. `AVAILABLE_TIMES` son cuatro franjas: 09:00, 12:00, 17:00 y 20:00.

- [ ] **Paso 4: Ejecutar los tests y verificar que pasan**

```bash
cd frontend && npm run test -- booking dates
```

Esperado: los 15 casos PASAN.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat(experiences): add booking reducer and date helpers"
```

---

### Task 11.3: Pantallas de reserva

**Files:**
- Create: `frontend/src/components/features/experiences/booking-flow.tsx`, `frontend/src/components/features/experiences/date-picker.tsx`, `frontend/src/components/features/experiences/booking-details.tsx`, `frontend/src/components/features/experiences/booking-confirmation.tsx`
- Create: `frontend/src/app/[locale]/experiencias/[experienceId]/reservar/page.tsx`

**Interfaces:**
- Consumes: `useBooking`, `StepProgress`, `Field`, `Input`, `Textarea`, `Button`, `LoadingOrb`.
- Produces: la ruta de reserva.

- [ ] **Paso 1: Construir el marco del flujo**

Port de las líneas 771–784. Contenedor de máximo 720px centrado. Arriba, enlace "← Volver". Después, `StepProgress variant="labeled"` con tres pasos (Fecha, Datos, Confirmación) y margen inferior 38px. Luego el título `Display size="xs"` y un subtítulo en sans 13px al 60 % con el nombre de la experiencia.

- [ ] **Paso 2: Construir el selector de fecha y hora**

Port de las líneas 785–804.
- Etiqueta "Elige tu día" en kicker lavanda.
- Rejilla `repeat(auto-fill, minmax(96px, 1fr))` con hueco 12px y margen inferior 30px. Cada día es un botón centrado con radio 14px, padding `14px 8px`, `backdrop-filter: blur(6px)`, transición `.3s`, mostrando el día de la semana en sans 11px al 60 %, el número en Cormorant 26px y el mes en sans 10px al 50 %. Seleccionado: fondo `rgba(185,176,214,0.16)` y borde `rgba(185,176,214,0.55)`.
- Etiqueta "Elige tu hora" y una fila de botones de hora con radio 12px, padding `12px 24px`, mismo tratamiento de selección.
- Botón "Continuar" a ancho completo, radio 16px, padding 17px, Cormorant 20px; deshabilitado con opacidad `0.45` hasta que haya fecha y hora.

Accesibilidad: los días forman un `radiogroup` navegable con flechas; el botón deshabilitado lleva `aria-disabled` y un texto de ayuda explicando qué falta.

- [ ] **Paso 3: Construir el paso de datos**

Port de las líneas 807–816. Tres campos apilados con hueco 16px: nombre, correo y una nota opcional en `Textarea` de 3 filas. Validación en vivo pero **no agresiva**: el error sólo aparece al desenfocar un campo tocado, nunca mientras se escribe. Botón "Confirmar reserva" de acento lavanda a ancho completo.

- [ ] **Paso 4: Construir la confirmación**

Port de las líneas 818–827. Bloque centrado: un orbe lavanda de 120px con `fm-breathe 5s`, `Display size="xs"` con el título, un párrafo de máximo 40ch al 72 %, y un botón de contorno "Ver más experiencias". Añadir debajo un resumen discreto de la reserva (experiencia, fecha, hora) en sans 13px al 60 %, porque el usuario necesita poder verificar lo que acaba de reservar.

Marcar con `// TODO(backend)` que aquí iría el envío real y la integración de calendario.

- [ ] **Paso 5: Verificar el flujo**

Recorrerlo entero comprobando: no se puede avanzar sin selección, el correo inválido bloquea la confirmación, volver conserva los datos, y la confirmación muestra la reserva correcta.

- [ ] **Paso 6: Commit**

```bash
git add frontend && git commit -m "feat(experiences): build three-step booking flow"
```

---

# FASE 12 — Tienda, carrito y checkout

Objetivo: la rejilla bento de 8 productos, el detalle y el flujo de compra.

---

### Task 12.1: Store del carrito

**Files:**
- Create: `frontend/src/stores/cart-store.ts`, `frontend/src/lib/cart/totals.ts`
- Create: `frontend/tests/stores/cart-store.test.ts`, `frontend/tests/lib/totals.test.ts`

**Interfaces:**
- Consumes: `PRODUCTS`.
- Produces:
  - `useCartStore` — `{ items: Record<string, number>; add(id): void; remove(id): void; setQuantity(id, n): void; clear(): void }`, persistido en `localStorage` bajo `fm.cart`.
  - `cartLines(items, products)` → `{ product, quantity, lineTotal }[]`.
  - `cartSubtotal(items, products)` → `number`.
  - `shippingCost(subtotal)` → `number`.
  - `cartTotal(subtotal)` → `number`.
  - `cartCount(items)` → `number`.

**Regla de negocio a portar exactamente** (líneas 1676–1679 del prototipo): envío gratis si el subtotal supera 50; envío de 6 si el subtotal está entre 1 y 50; envío 0 si el carrito está vacío.

- [ ] **Paso 1: Escribir los tests que fallan**

`frontend/tests/lib/totals.test.ts`:
- `"el subtotal suma precio por cantidad"` → dos unidades de `p1` (28) y una de `p3` (22) suman 78.
- `"el carrito vacío tiene subtotal cero"` → 0.
- `"el envío es gratis por encima de cincuenta"` → `shippingCost(78)` es 0.
- `"el envío cuesta seis por debajo de cincuenta"` → `shippingCost(28)` es 6.
- `"el envío es exactamente seis en el límite de cincuenta"` → `shippingCost(50)` es 6, porque la condición del prototipo es estrictamente mayor que 50.
- `"el carrito vacío no paga envío"` → `shippingCost(0)` es 0.
- `"el total suma subtotal y envío"` → `cartTotal(28)` es 34 y `cartTotal(78)` es 78.
- `"las líneas agrupan por producto con su cantidad"` → tres unidades de `p2` producen una sola línea con cantidad 3 y `lineTotal` 102.
- `"el contador suma todas las unidades"` → `cartCount` de dos productos con cantidades 2 y 3 es 5.
- `"ignora ids de producto desconocidos"` → un id inexistente no rompe el cálculo ni suma al subtotal.

`frontend/tests/stores/cart-store.test.ts`:
- `"el carrito arranca vacío"`.
- `"añadir el mismo producto incrementa su cantidad"` → dos `add('p1')` dejan cantidad 2 y **una sola** entrada.
- `"quitar decrementa la cantidad"` → tras tres `add` y un `remove`, la cantidad es 2.
- `"quitar la última unidad elimina la entrada"` → la clave desaparece del objeto, no queda en 0.
- `"fijar cantidad a cero elimina la entrada"`.
- `"vaciar deja el carrito vacío"`.

- [ ] **Paso 2: Ejecutar los tests para verlos fallar**

```bash
cd frontend && npm run test -- totals cart-store
```

Esperado: FALLA.

- [ ] **Paso 3: Implementar los helpers y el store**

Nota de diseño: el prototipo guarda el carrito como un array con repeticiones (`cart: ['p1','p1','p3']`). Aquí se usa un mapa de id a cantidad, que es correcto y evita recorridos innecesarios. La regla de envío se conserva idéntica.

- [ ] **Paso 4: Ejecutar los tests y verificar que pasan**

```bash
cd frontend && npm run test -- totals cart-store
```

Esperado: los 16 casos PASAN.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat(store): add cart store with totals and shipping rules"
```

---

### Task 12.2: Rejilla bento de la tienda

**Files:**
- Create: `frontend/src/components/features/store/product-grid.tsx`, `frontend/src/components/features/store/product-card.tsx`, `frontend/src/components/features/store/cart-button.tsx`
- Create: `frontend/src/app/[locale]/tienda/page.tsx`

**Interfaces:**
- Consumes: `PRODUCTS`, `useCartStore`, `Band`, `Badge`, `GlassPanel`, `OrbitalRings`, `formatPrice`, `Link`.
- Produces: `<ProductGrid />`; la ruta `/tienda`.

**Composición exacta a respetar** (líneas 846–918 y 1656–1659): tres filas.
1. Fila superior: 3 columnas con los productos de índice **1, 2, 3** (`p2`, `p3`, `p4`).
2. Fila central: rejilla `2fr 1fr` — a la izquierda el **destacado** `p1` ocupando dos columnas y dos filas de alto (`min-height: 440px`), a la derecha el lateral `p5` en columna alta.
3. Fila inferior: 3 columnas con los productos de índice **5, 6, 7** (`p6`, `p7`, `p8`).

- [ ] **Paso 1: Construir la card estándar**

`GlassPanel` con radio 22px. Arriba, una `Band` de 210px con la luz radial, envuelta en un enlace al detalle. Debajo, padding `18px 20px 22px`: categoría en kicker teal 10.5px, título en Cormorant peso 400 a 21px, y una fila con el precio en Cormorant 24px dorado y un botón "Añadir" de acento oro pequeño.

Importante: el botón "Añadir" **no** debe estar dentro del enlace al detalle — son dos acciones distintas. Estructurar la card con el enlace cubriendo sólo la banda y el título.

- [ ] **Paso 2: Construir la card destacada**

Borde `1px solid rgba(216,185,120,0.32)`, radio 26px, `min-height: 440px`, fondo = banda del producto, contenido alineado abajo. Capas: luz radial `radial-gradient(80% 70% at 70% 15%, rgba(247,244,234,0.24), transparent 60%)`, degradado inferior `linear-gradient(180deg, transparent 30%, rgba(10,18,32,0.78))`, `OrbitalRings` de 200px arriba a la derecha a `fm-spin 90s`, y un `Badge solid` arriba a la izquierda.

Contenido, con padding `36px 40px 38px`: categoría en kicker teal, título `clamp(30px,3.2vw,44px)` con máximo 16ch, descripción de máximo 44ch en sans 14px al 78 %, y una fila con el precio en Cormorant 34px dorado y una píldora primaria "Añadir".

- [ ] **Paso 3: Construir el botón de carrito**

En la cabecera de la tienda, a la derecha: una píldora glass con el texto "Carrito · N" que enlaza a `/tienda/carrito`. El contador se lee de `useCartStore`. Cuando se añade un producto, animar el contador con un pulso de luz (escala a 1.15 y vuelta, 0.4 s) — es el "pulso dorado" que pide el PRD para las acciones completadas.

Cuidado con la hidratación: el carrito viene de `localStorage`, así que el contador debe renderizar `0` en el servidor y actualizarse tras la hidratación. Usar un patrón de montaje diferido para evitar el desajuste.

- [ ] **Paso 4: Construir la cabecera y la página**

Fila con `justify-content: space-between` y `align-items: flex-end`: a la izquierda kicker oro, `Display size="lg"` y descripción de máximo 52ch; a la derecha el botón de carrito. Margen inferior 44px. `PageShell` de 1240px.

- [ ] **Paso 5: Responsive**

A 1024px: las filas de 3 pasan a 2 columnas y la fila central se apila (destacado arriba, lateral debajo). A 768px: todo a una columna, el destacado con `min-height: 340px`.

- [ ] **Paso 6: Commit**

```bash
git add frontend && git commit -m "feat(store): build bento product grid with featured hierarchy"
```

---

### Task 12.3: Detalle de producto

**Files:**
- Create: `frontend/src/components/features/store/product-detail.tsx`
- Create: `frontend/src/app/[locale]/tienda/[productId]/page.tsx`

**Interfaces:**
- Consumes: `getProduct`, `useCartStore`, `Band`, `OrbitalRings`, `Button`, `Display`, `formatPrice`.
- Produces: la ruta `/tienda/[productId]`.

- [ ] **Paso 1: Construir el detalle**

Port de las líneas 921–948. Enlace "← Toda la tienda" arriba. Rejilla de dos columnas con hueco 56px, centradas verticalmente.

- Izquierda: la galería placeholder — relación 4/5, radio 24px, fondo = banda del producto, luz radial superior, y un aro de 150px girando a `fm-spin 90s` en la esquina inferior derecha con opacidad `.35`.
- Derecha: categoría en kicker teal, `Display size="md"`, precio en Cormorant 34px dorado, descripción de máximo 46ch con `line-height: 1.9`, dos botones ("Añadir" de acento oro y "Comprar ya" primario), y una lista de tres notas separada por un borde superior, cada una con un punto teal de 6px y el texto en sans 14px al 72 %.

- [ ] **Paso 2: Añadir las secciones que pide el PRD**

Bajo las notas, tres bloques colapsables (patrón "pergamino que se abre", no acordeón genérico): Beneficios, Modo de uso y Ritual asociado. Cada uno se despliega con una animación de altura de 0.4 s y un ligero desvanecido del contenido. El copy va en `messages` bajo `store.productSections` y se escribe en la voz de marca.

Añadir también un enlace "Frecuencia asociada" que abre en el reproductor un audio relacionado — mapear cada producto a un audio en `data/products.ts` mediante un campo `relatedAudioId`.

- [ ] **Paso 3: Añadir productos relacionados**

Bajo el detalle, una fila de tres cards estándar con otros productos de la misma categoría (o, si no hay suficientes, los siguientes del catálogo), precedida de un `SectionHeading`.

- [ ] **Paso 4: Implementar la ruta**

`params` asíncronos, `notFound()` si el producto no existe, `generateStaticParams` con los ocho ids, y `generateMetadata` con el nombre del producto traducido.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat(store): build product detail with sections and related items"
```

---

### Task 12.4: Carrito y checkout

**Files:**
- Create: `frontend/src/components/features/store/cart-view.tsx`, `frontend/src/components/features/store/order-summary.tsx`, `frontend/src/components/features/store/order-confirmation.tsx`
- Create: `frontend/src/app/[locale]/tienda/carrito/page.tsx`

**Interfaces:**
- Consumes: `useCartStore`, `cartLines`, `cartSubtotal`, `shippingCost`, `cartTotal`, `EmptyState`, `LoadingOrb`, `Button`.
- Produces: la ruta `/tienda/carrito`.

- [ ] **Paso 1: Construir la vista del carrito**

Port de las líneas 950–982. Contenedor de máximo 820px. Enlace "← Seguir explorando" arriba y `Display size="md"` con el título.

Rejilla `1.3fr 1fr` con hueco 36px alineada arriba:
- Izquierda: una fila por línea de carrito — `GlassPanel` con radio 16px y padding 14px, con una miniatura de 64px con radio 12px y la banda del producto, el título en Cormorant 19px, la cantidad en sans 12px al 55 %, y el importe de línea en Cormorant 20px dorado. Añadir controles de cantidad (menos, número, más) con área táctil de 44px y `aria-label` claros, que el prototipo no tenía pero el flujo necesita.
- Derecha: el resumen.

- [ ] **Paso 2: Construir el resumen**

`GlassPanel` con radio 20px y padding 26px: título "Resumen" en kicker oro, filas de Subtotal y Envío en sans 14px al 70 %, y una fila de Total separada por un borde superior con la etiqueta en Cormorant 22px y el importe en Cormorant 24px dorado. Debajo, el botón primario "Realizar pedido" a ancho completo.

Cuando el envío es gratuito, mostrar la palabra traducida en lugar del importe, en color teal.

- [ ] **Paso 3: Construir el estado vacío**

Si no hay líneas y no se ha completado un pedido, renderizar `<EmptyState>` con el texto poético del prototipo ("Tu carrito espera en silencio.") y un botón que lleve a la tienda.

- [ ] **Paso 4: Construir la confirmación**

Port de las líneas 983–992. Al pulsar "Realizar pedido": vaciar el carrito y mostrar un bloque centrado con un orbe dorado de 120px con `fm-breathe 5s`, `Display size="xs"` con el agradecimiento, un párrafo de máximo 42ch, y un botón de contorno para seguir explorando.

La transición entre carrito y confirmación se hace con `AnimatePresence`: el carrito se desvanece y la confirmación emerge, nunca un corte seco.

Marcar con `// TODO(backend)` que aquí irían el pago real y la creación del pedido. Añadir además, como estado de error previsto, `<ErrorState>` con el copy de "pago fallido" del namespace `states`, aunque no pueda dispararse todavía.

- [ ] **Paso 5: Verificar el flujo**

Añadir productos desde la rejilla, el detalle y el destacado; comprobar que el contador se actualiza, que las cantidades se agrupan, que el envío cambia al superar 50, que vaciar funciona y que la confirmación limpia el carrito.

- [ ] **Paso 6: Commit**

```bash
git add frontend && git commit -m "feat(store): build cart, order summary and confirmation"
```

---

# FASE 13 — Acceso

Objetivo: la pantalla partida de login y registro.

---

### Task 13.1: Pantalla de acceso

**Files:**
- Create: `frontend/src/components/features/auth/auth-form.tsx`, `frontend/src/components/features/auth/auth-aside.tsx`
- Create: `frontend/src/app/[locale]/acceso/page.tsx`

**Interfaces:**
- Consumes: `SegmentedControl`, `Field`, `Input`, `Button`, `Display`, `Kicker`, `Prose`, `OrbitalRings`, `Halo`, `Link`.
- Produces: la ruta `/acceso`.

- [ ] **Paso 1: Construir el formulario**

Port de las líneas 141–185. Mitad izquierda: `min-height: 100vh`, columna centrada verticalmente, padding `120px 7vw 70px`, ancho máximo 620px.

De arriba abajo: enlace "← Volver al inicio" en `Button variant="ghost"`; kicker teal con `letter-spacing: .4em`; `Display` con `clamp(34px,4.4vw,54px)`; subtítulo de máximo 44ch a 15px al 66 %; el `SegmentedControl` de Entrar/Crear cuenta; y el bloque de campos con hueco 15px y ancho máximo 400px.

Campos: nombre (sólo en registro, apareciendo con una animación de altura de 0.35 s), correo y contraseña. En login, un enlace "¿Olvidaste tu contraseña?" alineado a la derecha. Después el botón primario de envío con radio 14px y padding 16px.

Debajo: un separador con la palabra "o" entre dos líneas de `rgba(247,244,234,0.14)`, y un botón glass de acceso alternativo con un punto dorado con glow a la izquierda.

- [ ] **Paso 2: Implementar la validación**

Validación en cliente sin librería externa: correo con forma válida, contraseña de al menos 8 caracteres, nombre no vacío en registro. Los errores aparecen al desenfocar y se anuncian con `aria-live`. El botón de envío no se deshabilita por errores — se deshabilita sólo mientras envía; deshabilitar por validación esconde al usuario qué le falta.

Al enviar correctamente, navegar a `/mi-santuario`. Marcar con `// TODO(backend)` que no hay autenticación real.

- [ ] **Paso 3: Construir el panel lateral**

Port de las líneas 188–207. Mitad derecha con fondo `linear-gradient(150deg, rgba(150,198,188,0.16), rgba(15,27,46,0.55) 55%, rgba(185,176,214,0.14))`, más una luz radial central `radial-gradient(60% 55% at 50% 44%, rgba(216,185,120,0.18), transparent 62%)` y un degradado inferior.

En el centro: `OrbitalRings` de `min(78%,460px)` con radios 180/130/82 y nodos oro/teal/lavanda, girando a `fm-spin 120s` con opacidad `.55`; y el logo de 170px flotando con `fm-float 8s` sobre un halo respirando.

Abajo: la cita de marca en Cormorant cursiva `clamp(20px,2.2vw,28px)` con máximo 30ch, y la atribución en kicker oro con `letter-spacing: .32em`.

- [ ] **Paso 4: Responsive**

Por debajo de 900px, la rejilla 50/50 se apila: el panel lateral pasa **arriba** con altura de 40vh (para que el logo y la cita reciban al usuario) y el formulario debajo. Por debajo de 640px, reducir el logo a 110px y ocultar los aros exteriores.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat(auth): build split access screen with login and register"
```

---

# FASE 14 — Mi Santuario

Objetivo: el espacio personal: estadísticas, continuación, frecuencia del día y diario.

---

### Task 14.1: Store del diario

**Files:**
- Create: `frontend/src/stores/journal-store.ts`
- Create: `frontend/tests/stores/journal-store.test.ts`

**Interfaces:**
- Produces:
  - `useJournalStore` — `{ entries: JournalEntry[]; draft: { mood: number | null; text: string }; setMood(i): void; setText(t): void; save(now: Date): void; discard(): void }`, persistido en `localStorage` bajo `fm.journal`.
  - Tipo `JournalEntry` = `{ id: string; mood: number; text: string; createdAt: string }`.

- [ ] **Paso 1: Escribir los tests que fallan**

`frontend/tests/stores/journal-store.test.ts`:
- `"el diario arranca vacío y sin borrador"`.
- `"guardar añade una entrada y limpia el borrador"` → tras fijar estado y texto y llamar a `save`, hay 1 entrada, `draft.mood` es nulo y `draft.text` es cadena vacía.
- `"no guarda una entrada sin texto"` → con texto vacío, `save` no añade nada.
- `"no guarda una entrada sin estado de ánimo"` → con `mood` nulo, `save` no añade nada.
- `"la entrada guarda la fecha proporcionada"` → `createdAt` es el ISO de la fecha pasada, no de `Date.now()`.
- `"las entradas más recientes van primero"` → tras dos guardados, la primera del array es la última creada.
- `"descartar limpia el borrador sin guardar"`.

- [ ] **Paso 2: Ejecutar el test para verlo fallar**

```bash
cd frontend && npm run test -- journal-store
```

Esperado: FALLA.

- [ ] **Paso 3: Implementar el store**

`save` recibe la fecha por parámetro para ser determinista y testeable. El id se genera con `crypto.randomUUID()`.

- [ ] **Paso 4: Ejecutar el test y verificar que pasa**

```bash
cd frontend && npm run test -- journal-store
```

Esperado: los 7 casos PASAN.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat(sanctuary): add persisted journal store"
```

---

### Task 14.2: Panel del santuario

**Files:**
- Create: `frontend/src/components/features/sanctuary/sanctuary-header.tsx`, `frontend/src/components/features/sanctuary/stats-row.tsx`, `frontend/src/components/features/sanctuary/continue-card.tsx`, `frontend/src/components/features/sanctuary/daily-card.tsx`, `frontend/src/components/features/sanctuary/journal-panel.tsx`
- Create: `frontend/src/app/[locale]/mi-santuario/page.tsx`

**Interfaces:**
- Consumes: `useJournalStore`, `usePlayerStore`, `Stat`, `ProgressBar`, `GlassPanel`, `Textarea`, `Button`, `EmptyState`.
- Produces: la ruta `/mi-santuario`.

- [ ] **Paso 1: Construir la cabecera**

Port de las líneas 1001–1007. Fila con hueco 20px: un avatar orbe de 70px con `radial-gradient(circle at 40% 35%, rgba(247,244,234,0.85), rgba(216,185,120,0.5) 45%, transparent 72%)`, `box-shadow: 0 0 40px 8px rgba(216,185,120,0.25)` y `fm-breathe 6s`; al lado, kicker oro y `Display size="md"` con el saludo.

- [ ] **Paso 2: Construir la fila de estadísticas**

Port de las líneas 1009–1016. Rejilla `repeat(auto-fit, minmax(180px, 1fr))` con hueco 18px. Cuatro `GlassPanel` con radio 18px y padding `22px 24px`, cada uno con un `Stat` de 40px en su tono (oro, teal, lavanda, marfil).

- [ ] **Paso 3: Construir las cards de continuar y frecuencia del día**

Port de las líneas 1018–1039. Rejilla `1.4fr 1fr` con hueco 28px, alineada arriba. Columna izquierda con dos cards apiladas (hueco 24px):

- **Continuar:** radio 22px, fondo `linear-gradient(120deg, rgba(150,198,188,0.12), rgba(185,176,214,0.08))` con `blur(12px)`, padding 30px. Kicker teal, título en Cormorant peso 400 a 28px, subtítulo en sans 13px al 60 %, una `ProgressBar` de 5px al 62 %, y un botón de acento teal "Retomar" que lleva a la lección correspondiente.
- **Frecuencia del día:** `GlassPanel` con padding 30px, fila con hueco 24px: un orbe teal de 80px respirando, el bloque de texto (kicker oro, título en Cormorant 24px, subtítulo en sans 13px), y un botón redondo de play de 56px que abre esa frecuencia en el reproductor.

- [ ] **Paso 4: Construir el panel del diario**

Port de las líneas 1041–1052. `GlassPanel` con radio 22px y padding 28px: kicker lavanda, título en Cormorant peso 400 a 26px, la etiqueta "Tu estado" en sans 12px al 60 %, y una fila de cinco botones circulares de 42px (uno por estado de ánimo) con los colores del prototipo — Calma `150,198,188`, Alegría `216,185,120`, Nostalgia `185,176,214`, Cansancio `120,140,175`, Gratitud `247,244,234`. Inactivo: fondo al 16 % y borde tenue. Activo: fondo al 50 % y borde al 90 %.

Debajo, un `Textarea variant="journal"` de 5 filas con fondo `rgba(15,27,46,0.35)`, radio 14px y Cormorant 17px; y un botón de acento lavanda "Guardar en mi diario" a ancho completo.

Cada botón de estado necesita `aria-label` con su nombre y `aria-pressed`; el color por sí solo no comunica el estado.

- [ ] **Paso 5: Añadir la lista de entradas**

Bajo el formulario, mostrar las entradas guardadas: cada una con su punto de color de estado, la fecha formateada según el locale, y el texto en Cormorant 16px. Si no hay ninguna, `<EmptyState>` con el copy de `states.emptyJournal`.

Al guardar, la nueva entrada aparece con una animación de entrada suave y el formulario se limpia con un pulso de confirmación dorado.

- [ ] **Paso 6: Responsive**

A 900px, la rejilla `1.4fr 1fr` pasa a una columna con el diario debajo. Las estadísticas pasan a 2 columnas a 640px.

- [ ] **Paso 7: Commit**

```bash
git add frontend && git commit -m "feat(sanctuary): build dashboard with stats, continue cards and journal"
```

---

# FASE 15 — 3D puntual y perezoso

Objetivo: dos escenas WebGL que elevan momentos clave, cargadas bajo demanda y con degradación completa a la versión 2D. **La interfaz sigue siendo HTML-first**: si WebGL falla, no se pierde nada.

---

### Task 15.1: Infraestructura de carga perezosa de 3D

**Files:**
- Create: `frontend/src/components/three/lazy-scene.tsx`, `frontend/src/hooks/use-webgl-support.ts`
- Create: `frontend/tests/hooks/use-webgl-support.test.ts`

**Interfaces:**
- Produces:
  - `useWebGLSupport()` → `'unknown' | 'supported' | 'unsupported'`.
  - `<LazyScene fallback, load, className>` — monta la escena sólo si hay soporte, no hay movimiento reducido, el dispositivo no es de gama baja y el contenedor está en el viewport.

- [ ] **Paso 1: Instalar las dependencias 3D**

```bash
cd frontend && npm i three @react-three/fiber @react-three/drei && npm i -D @types/three
```

- [ ] **Paso 2: Escribir el test que falla**

`frontend/tests/hooks/use-webgl-support.test.ts`:
- `"devuelve soportado cuando el canvas da contexto webgl"` → con `getContext` simulado devolviendo un objeto, el resultado es `'supported'`.
- `"devuelve no soportado cuando el canvas no da contexto"` → con `getContext` devolviendo `null`, es `'unsupported'`.
- `"devuelve no soportado si getContext lanza"` → no propaga la excepción.

- [ ] **Paso 3: Ejecutar el test para verlo fallar y luego implementar**

```bash
cd frontend && npm run test -- use-webgl-support
```

Implementar el hook y volver a ejecutar hasta ver los 3 casos en verde.

- [ ] **Paso 4: Implementar `LazyScene`**

`"use client"`. Reglas de montaje, todas obligatorias:
- No monta nada en el servidor: la escena se importa con `next/dynamic` y `ssr: false`.
- No monta si `useWebGLSupport()` no es `'supported'`.
- No monta si `useReducedMotionSafe()` es verdadero.
- No monta si `navigator.hardwareConcurrency` es menor que 4 o si `navigator.deviceMemory` (cuando existe) es menor que 4 — heurística de gama baja.
- Sólo monta cuando el contenedor entra en el viewport, usando `IntersectionObserver`.
- Mientras no monta, renderiza el `fallback` — que **siempre** es la versión 2D ya construida, nunca un hueco vacío.
- Al salir del viewport, desmonta la escena para liberar la GPU.

Configuración común del `Canvas` de R3F: `dpr={[1, 1.5]}`, `gl={{ antialias: true, powerPreference: 'low-power', alpha: true }}`, y `frameloop="always"` sólo mientras está visible.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat(three): add lazy scene loader with graceful 2D fallback"
```

---

### Task 15.2: Esfera del portal en WebGL

**Files:**
- Create: `frontend/src/components/three/portal-sphere.tsx`
- Modify: `frontend/src/components/features/portal/portal-scene.tsx`

**Interfaces:**
- Consumes: `LazyScene`.
- Produces: `<PortalSphere />` montada tras la geometría SVG del portal.

- [ ] **Paso 1: Diseñar la escena**

Una esfera de puntos (constelación esférica) de unos 1800 vértices distribuidos con el método de Fibonacci, con material de puntos de tamaño atenuado por distancia, color marfil con acento oro en los polos, y opacidad baja (0.5–0.7). Rota muy lentamente sobre su eje Y (una vuelta cada ~120 s, coincidiendo con el `fm-spin` de la geometría SVG que la rodea).

Dentro, un núcleo de luz: una esfera pequeña con material aditivo dorado que respira en escala entre 1 y 1.05 en un ciclo de 7 s, coincidiendo con `fm-breathe`.

Sin luces de escena, sin sombras, sin postprocesado: sólo materiales autoiluminados. Esto mantiene el coste en una sola pasada.

- [ ] **Paso 2: Integrarla en el portal**

En `portal-scene.tsx`, envolver `<PortalSphere />` en `<LazyScene>` cuyo `fallback` es **exactamente** la composición SVG actual. Colocarla entre la geometría de aros y el logo, con `pointer-events: none` y ocupando el mismo cuadro que la geometría (`min(78vh, 640px)`).

El logo, el título y el botón siguen siendo HTML y quedan por encima.

- [ ] **Paso 3: Verificar el coste**

Con las DevTools abiertas, comprobar en la pestaña de rendimiento que la escena se mantiene por encima de 55 FPS en desktop y que el bundle adicional se carga en un chunk separado (verificar en el output de `npm run build` que `three` no entra en el bundle inicial).

```bash
cd frontend && npm run build
```

Esperado: los chunks de `three` aparecen como carga diferida, no en el JS de primera carga de la ruta `/`.

- [ ] **Paso 4: Commit**

```bash
git add frontend && git commit -m "feat(three): add lazy portal constellation sphere"
```

---

### Task 15.3: Orbe de resultado en WebGL

**Files:**
- Create: `frontend/src/components/three/result-orb.tsx`
- Modify: `frontend/src/components/features/discover/quiz-result.tsx`

**Interfaces:**
- Consumes: `LazyScene`.
- Produces: `<ResultOrb color />`.

- [ ] **Paso 1: Diseñar la escena**

Una esfera de radio 1 con material que combine transparencia y refracción suave — el "cristal astral" del PRD. Sobre ella, una capa de partículas orbitando en un plano inclinado, del color de la frecuencia resultante. La esfera deforma su superficie con un ruido muy sutil y muy lento (amplitud por debajo del 3 % del radio, ciclo de ~8 s), de modo que parezca viva sin llamar la atención.

- [ ] **Paso 2: Integrarlo en el resultado**

Reemplazar el orbe CSS del resultado por `<LazyScene>` con ese mismo orbe CSS como `fallback`, en un cuadro de 150px. El color se deriva de la frecuencia resultante con el mismo mapa que usa la versión 2D.

- [ ] **Paso 3: Verificar**

Comprobar que en un dispositivo sin WebGL o con movimiento reducido se ve el orbe CSS y la experiencia no se degrada.

- [ ] **Paso 4: Commit**

```bash
git add frontend && git commit -m "feat(three): add lazy result orb with 2D fallback"
```

---

# FASE 16 — Estados, accesibilidad, responsive y rendimiento

Objetivo: la fase que separa un prototipo bonito de un producto. Ninguna tarea aquí es opcional.

---

### Task 16.1: Estados de carga, error y 404

**Files:**
- Create: `frontend/src/app/[locale]/not-found.tsx`, `frontend/src/app/[locale]/error.tsx`, `frontend/src/app/[locale]/loading.tsx`
- Create: `frontend/src/app/[locale]/biblioteca/loading.tsx`, `frontend/src/app/[locale]/academia/loading.tsx`, `frontend/src/app/[locale]/tienda/loading.tsx`, `frontend/src/app/[locale]/experiencias/loading.tsx`

**Interfaces:**
- Consumes: `Skeleton`, `LoadingOrb`, `EmptyState`, `ErrorState`, namespace `states`.

- [ ] **Paso 1: Construir el 404**

Una pantalla completa en el lenguaje del mundo: la geometría sagrada aparece **incompleta** (un aro con un arco faltante), el título y el cuerpo del namespace `states`, y dos botones — volver al portal y ver los realms. Nada de "404" en grande ni ilustraciones genéricas.

- [ ] **Paso 2: Construir el error boundary**

`error.tsx` es un client component que recibe `error` y `reset`. Muestra `<ErrorState>` con el copy de marca y un botón que invoca `reset()`. Registra el error en consola con `console.error`. Nunca muestra el stack al usuario.

- [ ] **Paso 3: Construir los esqueletos por realm**

Cada `loading.tsx` reproduce la **silueta** de su vista con `Skeleton`, no un orbe genérico:
- Biblioteca: un disco grande centrado y seis pequeños en sus posiciones orbitales, todos como `Skeleton variant="disc"`.
- Academia: la card destacada y las dos secundarias como `Skeleton variant="card"`.
- Tienda: la rejilla bento completa en esqueleto, respetando las proporciones 3 / destacado+lateral / 3.
- Experiencias: la card destacada y tres filas.

El `loading.tsx` raíz muestra el `LoadingOrb` centrado.

- [ ] **Paso 4: Verificar**

Forzar una ruta inexistente y comprobar el 404 en ambos idiomas. Lanzar un error deliberado en una página y comprobar el boundary. Ralentizar la red en DevTools y comprobar que aparecen los esqueletos con la silueta correcta.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "feat: add loading skeletons, error boundary and branded 404"
```

---

### Task 16.2: Auditoría de accesibilidad

**Files:**
- Modify: todos los componentes que la auditoría señale
- Create: `frontend/docs/accessibility.md`

- [ ] **Paso 1: Instalar la herramienta de auditoría**

```bash
cd frontend && npm i -D @axe-core/cli
```

- [ ] **Paso 2: Auditar las nueve rutas**

Con el servidor de desarrollo corriendo, ejecutar axe contra cada ruta en ambos idiomas y guardar los resultados.

```bash
cd frontend && npx axe http://localhost:3000/ http://localhost:3000/inicio http://localhost:3000/acceso http://localhost:3000/descubrete http://localhost:3000/biblioteca http://localhost:3000/academia http://localhost:3000/experiencias http://localhost:3000/tienda http://localhost:3000/mi-santuario --exit
```

Esperado tras las correcciones: cero violaciones de nivel serio o crítico.

- [ ] **Paso 3: Corregir el contraste**

Comprobar manualmente los textos secundarios: el marfil al 55 % sobre el fondo `--void` puede quedar por debajo de 4.5:1. Donde no llegue, **subir la opacidad hasta cumplir** en lugar de cambiar el color. Los kickers de 11px son texto pequeño y necesitan 4.5:1; los títulos grandes pueden quedarse en 3:1. Documentar en `accessibility.md` los valores mínimos de opacidad que se han fijado por tamaño.

- [ ] **Paso 4: Recorrido completo por teclado**

Recorrer cada vista con Tab, Shift+Tab, Enter, Espacio y flechas. Verificar: el foco es siempre visible sobre el fondo oscuro, el orden es lógico, la navegación de constelación despliega su badge al enfocar, los grupos de radio del quiz y de fechas responden a flechas, el dock del reproductor es operable, y no existe ninguna trampa de foco.

Añadir un enlace "Saltar al contenido" como primer elemento enfocable del layout, visualmente oculto hasta recibir foco.

- [ ] **Paso 5: Verificar con lector de pantalla**

Recorrer portal, home, biblioteca y el flujo de reserva con un lector de pantalla. Comprobar que: los landmarks se anuncian, los cambios de página se anuncian, los estados de carga se anuncian, los controles sólo-icono tienen nombre, y las capas decorativas (canvas, nebulosas, cursor, aros) están todas ocultas con `aria-hidden`.

- [ ] **Paso 6: Documentar**

`frontend/docs/accessibility.md` recoge: las decisiones de contraste por tamaño, el mapa de landmarks, el comportamiento de foco de cada componente compuesto, y qué se ha hecho para el modo de movimiento reducido en cada vista.

- [ ] **Paso 7: Commit**

```bash
git add frontend && git commit -m "fix(a11y): resolve audit findings and document accessibility decisions"
```

---

### Task 16.3: Repaso responsive de las nueve vistas

**Files:**
- Modify: los componentes que lo requieran

- [ ] **Paso 1: Revisar a 1440 y 1280**

Comparar cada vista con el prototipo, que fue diseñado a 1440. A 1280 comprobar que ninguna rejilla se rompe y que los `clamp` responden.

- [ ] **Paso 2: Revisar a 768**

Punto crítico. Verificar los cambios ya especificados: navegación de constelación en barra inferior, hero de home apilado, sistema solar de biblioteca en rejilla, filas de experiencias apiladas, bento de tienda a una o dos columnas, acceso apilado con el panel arriba, santuario a una columna, y dock del reproductor compacto.

- [ ] **Paso 3: Revisar a 390**

Comprobar: ningún desbordamiento horizontal en ninguna vista (verificar con `document.documentElement.scrollWidth` igual al ancho del viewport); todos los objetivos táctiles llegan a 44px; los títulos con `clamp` no se cortan; el disco destacado de biblioteca cabe; y el dock respeta el área segura inferior.

- [ ] **Paso 4: Revisar la orientación horizontal en móvil**

Las vistas con `min-height: 100vh` (portal, acceso, descúbrete) deben seguir siendo usables en horizontal. Sustituir `100vh` por `100dvh` en todas ellas para evitar el problema de la barra de direcciones móvil.

- [ ] **Paso 5: Commit**

```bash
git add frontend && git commit -m "fix(responsive): polish all nine realms across four breakpoints"
```

---

### Task 16.4: Rendimiento

**Files:**
- Modify: los componentes que lo requieran
- Create: `frontend/docs/performance.md`

- [ ] **Paso 1: Medir la línea base**

Construir en producción, servir, y medir con Lighthouse las rutas `/`, `/inicio` y `/biblioteca` en perfil móvil.

```bash
cd frontend && npm run build && npm run start
```

Registrar en `performance.md` las métricas de partida.

- [ ] **Paso 2: Auditar el bundle**

```bash
cd frontend && npx @next/bundle-analyzer
```

O, si no está configurado, revisar el resumen que imprime `npm run build`. Objetivo: el JS de primera carga de cualquier ruta por debajo de **200 KB** comprimido. Si se supera, revisar que `three` esté fuera del bundle inicial, que `motion` se importe granularmente y que ningún componente de `features/` se importe desde el layout.

- [ ] **Paso 3: Verificar el presupuesto de animación**

Con la grabación de rendimiento del navegador, comprobar en la home: sin caídas por debajo de 55 FPS al hacer scroll, el canvas consume menos del 25 % del tiempo de frame, y no hay recálculos de layout provocados por las animaciones (todas deben ser de `transform` y `opacity`).

Si el canvas cuesta demasiado, reducir el conteo de partículas en pantallas pequeñas — 54 en desktop, 28 por debajo de 768px — pero **nunca** eliminarlas.

- [ ] **Paso 4: Comprobar las pausas**

Verificar que: el canvas se detiene con la pestaña oculta, las escenas 3D se desmontan al salir del viewport, el intervalo del reproductor se limpia al pausar, y los `requestAnimationFrame` del cursor y de Lenis se cancelan al desmontar. Un fallo aquí no se ve pero drena batería.

- [ ] **Paso 5: Optimizar la carga del logo**

El logo aparece en header, portal, home y acceso. Verificar que `next/image` lo sirve en formato moderno, con `priority` sólo en el portal y el header, y con `sizes` correcto en cada uso.

- [ ] **Paso 6: Documentar y hacer commit**

Registrar en `performance.md` las métricas finales, el presupuesto acordado y las decisiones tomadas.

```bash
git add frontend && git commit -m "perf: meet frame and bundle budgets across realms"
```

---

### Task 16.5: Verificación final y documentación

**Files:**
- Modify: `frontend/README.md`
- Create: `frontend/docs/fidelity-checklist.md`

- [ ] **Paso 1: Ejecutar la verificación completa**

```bash
cd frontend && npm run lint && npm run typecheck && npm run test && npm run build
```

Esperado: los cuatro comandos en verde, sin advertencias. **No declarar el trabajo terminado sin haber visto esta salida.**

- [ ] **Paso 2: Recorrer la lista de fidelidad**

Crear `frontend/docs/fidelity-checklist.md` a partir de la sección 10 de `DESIGN_CONTEXT.md`, y recorrerla **vista por vista** para las nueve rutas, marcando cada punto:

- Fondo cósmico visible y recoloreado por realm.
- Cursor luminoso activo en desktop.
- Entradas con fade-up escalonado.
- Geometría sagrada / aros presentes donde corresponde.
- Separador de onda entre secciones.
- Glassmorphism + glows, radios y pills correctos.
- Tipografía correcta (Cormorant en títulos, Jost en UI, kickers en mayúsculas espaciadas).
- Copy bilingüe ES/EN y en voz de marca.
- Item destacado con jerarquía elaborada donde aplica.
- Toggle de audio funcional y silenciable.
- `prefers-reduced-motion` respetado y objetivos táctiles ≥ 44px.

Registrar en el documento cualquier desviación consciente respecto al prototipo, con su justificación.

- [ ] **Paso 3: Retirar el andamiaje**

Eliminar la página de sandbox si aún existe. Verificar que `/es/_kit` devuelve 404 en producción. Buscar y revisar todos los `TODO(backend)` para confirmar que están donde deben y que el README los recoge.

```bash
cd frontend && grep -rn "TODO(backend)" src/
```

- [ ] **Paso 4: Completar el README**

Añadir a `frontend/README.md`: la arquitectura en tres capas, la convención de i18n con claves en `data/` y textos en `messages/`, cómo añadir un realm nuevo, cómo añadir un componente al UI Kit, la lista de puntos pendientes de backend, y el alcance explícitamente aplazado (blog, membresía, búsqueda, perfil, favoritos, pedidos, notificaciones, ajustes, recuperación de contraseña, pagos reales, CMS).

- [ ] **Paso 5: Commit final**

```bash
git add frontend && git commit -m "docs: add fidelity checklist and complete frontend documentation"
```

---

## Notas de ejecución

**Orden de dependencias que no se puede alterar:**
- Fase 0 → Fase 1 → Fase 2 antes que cualquier otra cosa.
- Fase 3 antes que la Fase 5 (el layout monta el motor del mundo).
- Fase 4 antes que las fases 6–14 (todas consumen el UI Kit).
- Task 9.1 (store del reproductor) antes que la Task 7.2 (la home lo usa) y que la Task 8.2 (el resultado del quiz lo usa).
- Task 12.1 (store del carrito) antes que las tasks 12.2 y 12.4.
- Fase 15 después de las fases 6 y 8 (necesita los fallbacks 2D ya construidos).
- Fase 16 al final, cuando existe todo lo que hay que auditar.

**Paralelizable:** las fases 9, 10, 11, 12, 13 y 14 son independientes entre sí una vez completadas las fases 0–5. Si se ejecuta con varios agentes, son buenos candidatos para trabajo simultáneo, siempre que cada uno se limite a su subdirectorio de `features/` y coordine los cambios a `messages/*.json`.

**Puntos de revisión recomendados:** al terminar la Fase 3 (el mundo debe sentirse vivo antes de construir contenido), al terminar la Fase 5 (la navegación completa debe funcionar), al terminar la Fase 7 (la home valida el sistema entero), y al terminar la Fase 16.

**Qué hacer si el prototipo y este plan se contradicen:** manda el prototipo en lo visual y este plan en lo arquitectónico. Si la contradicción es de comportamiento (por ejemplo, el filtro de biblioteca atado al español), manda este plan, que ya documenta la corrección.
