# Frecuencia Mágica

Portal inmersivo y cinematográfico de bienestar (marca "Marisol"). **No es un sitio web: es un universo de 8 realms navegables.** Bilingüe ES/EN.

## Fuentes de verdad

| Qué | Dónde |
|---|---|
| Plan de implementación (manda en lo arquitectónico) | `docs/superpowers/plans/2026-07-28-frecuencia-magica-frontend.md` |
| Progreso por secciones del plan | `docs/superpowers/plans/sections-plan-completed.md` |
| Diseño visual (manda en lo visual) | `frontend-prototype/project/Frecuencia Magica.dc.html` |
| Contexto de diseño | `frontend-prototype/project/DESIGN_CONTEXT.md` |
| Dirección creativa | `frontend-prototype/project/uploads/PRD - FRECUENCIA MÁGICA {1,2,3,4}` |

`frontend-prototype/` es **sólo lectura**. Nunca modificarlo. El código de producción vive en `frontend/`.

Si el prototipo y el plan se contradicen: manda el prototipo en lo visual, el plan en lo arquitectónico y en lo funcional.

## Restricciones no negociables

Estas aplican a **todo** cambio en `frontend/`. El plan las detalla en su sección "Global Constraints".

### Marca

- Voz: íntima, serena, poética, en segunda persona ("vuelve a ti", "respira"). Nunca marketing agresivo ni jerga wellness.
- Copy siempre bilingüe ES/EN. Nunca hardcodear texto en un componente: va en `frontend/messages/{es,en}.json`. Idioma por defecto `es`.
- Cero emojis (única excepción: el ✓ de confirmación). Sin gradientes chillones. Minimalismo cálido.
- Placeholders: prohibidas fotos de stock, Unsplash, Lorem Picsum y cajas grises. Todo placeholder es composición de gradiente/geometría/luz que ya parece arte final. El único bitmap permitido es el logo.

### Paleta y tipografía — valores exactos, no aproximar

```
--void #0F1B2E   --void-2 #0a1220   --gold #D8B978
--teal #96C6BC   --lav    #B9B0D6   --ivory #F7F4EA
--glass rgba(247,244,234,0.045)     --glass-brd rgba(216,185,120,0.20)
--color-warn #C98B7A   (único color añadido; sólo errores de formulario)
```

Fondo de la app: `radial-gradient(140% 100% at 50% -10%, #16273f 0%, var(--void) 45%, var(--void-2) 100%)`

**No introducir colores ni fuentes nuevas.** Los acentos entran como halos, bordes y glows — nunca como rellenos sólidos grandes.

Tipografía: **Cormorant Garamond** (serif) en títulos, cifras de frecuencia, precios y texto poético. **Jost** (sans) en kickers, labels, meta y UI. Body en peso 300. Kickers en MAYÚSCULAS, 11px, `letter-spacing` entre `.14em` y `.4em`.

### Movimiento

- Nada es estático: fondo vivo, elementos que respiran/flotan/orbitan, entradas con fade-up escalonado (`.1s`, `.25s`, `.4s`, `.55s`).
- Nada aparece de golpe: todo emerge.
- `prefers-reduced-motion: reduce` se respeta **siempre**. Modo simplificado, nunca eliminar contenido.

### Accesibilidad y rendimiento

- Hit targets ≥ 44px. Texto base ≥ 15px. Foco visible sobre fondo oscuro.
- Landmarks semánticos, navegación completa por teclado, `aria-label` en todo control sólo-icono, `aria-hidden` en toda capa decorativa (canvas, cursor, nebulosas, aros).
- 60 FPS en desktop, mínimo 30 FPS en móvil de gama media. `devicePixelRatio` capado a 2. Animar sólo `transform` y `opacity`.
- Breakpoints obligatorios: 1440, 1280, 768, 390. **Toda vista debe existir en móvil.**

### Código

- TypeScript `strict`. Cero `any` sin comentario que lo justifique.
- Arquitectura en tres capas, sin saltárselas:
  - `components/ui/` — UI Kit **puro**: no importa de `data/`, `stores/` ni `i18n/`. Recibe texto ya traducido por props.
  - `components/world/` — motor inmersivo, montado una sola vez en el layout.
  - `components/features/` — un subdirectorio por realm; compone UI Kit + world + datos.
- Los textos **no** viven en `data/`: cada entidad guarda una clave de traducción; el texto está en `messages/`.
- Server Components por defecto. `"use client"` sólo con estado, efectos, listeners o animación imperativa.
- Un componente por archivo. Si un archivo supera ~200 líneas, dividir por responsabilidad.
- Todo enlace interno usa el `Link` de `@/i18n/navigation`, nunca el de `next/link`.
- Estado transversal (reproductor, carrito, audio, diario) en Zustand. Estado de flujo (quiz, reserva, checkout) en reducers **puros** y testeados.

### Testing

Sólo lógica: stores, reducers, hooks y utilidades puras, con Vitest. No se testean componentes visuales. Las funciones puras reciben por parámetro sus dependencias no deterministas (`Math.random`, `Date`) para poder testearlas.

## Comandos

```bash
cd frontend && npm run dev
```

Verificación completa antes de dar por terminado cualquier trabajo — los cuatro deben estar en verde:

```bash
cd frontend && npm run lint && npm run typecheck && npm run test && npm run build
```

## Alcance

**Dentro:** los 9 realms del prototipo (portal, home, acceso, descúbrete, biblioteca, academia, experiencias, tienda, mi santuario), responsive, estados de carga/vacío/error, 404, i18n ES/EN, dos escenas 3D puntuales y perezosas.

**Aplazado (no construir sin pedirlo):** blog, membresía como página propia, about, contacto, búsqueda global, perfil, favoritos, pedidos, notificaciones, ajustes, recuperar contraseña, magic link, backend real, pagos, CMS.

No hay backend. Los puntos que lo requieren se marcan con `// TODO(backend)`.

## Git

Commits en Conventional Commits, en inglés. Terminar cada mensaje con:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```
