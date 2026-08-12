# Frecuencia Mágica — Frontend

Portal inmersivo y cinematográfico de bienestar. Un universo de 9 realms navegables, bilingüe ES/EN.

Las restricciones del proyecto (paleta, tipografía, movimiento, accesibilidad, arquitectura) están en [`../AGENTS.md`](../AGENTS.md) y son de obligado cumplimiento. El plan de implementación completo está en [`../docs/superpowers/plans/`](../docs/superpowers/plans/). **El prototipo original se perdió** (no existe `frontend-prototype/`): la fuente visual viva es el sistema codificado en `src/app/globals.css` y `src/config/`, y los activos de marca (Brand Book, PRDs) están en `~/Descargas/`.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · Motion · next-intl · Vitest

## Comandos

```bash
npm run dev
```

| Comando                | Qué hace                             |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Servidor de desarrollo con Turbopack |
| `npm run build`        | Build de producción                  |
| `npm run start`        | Sirve el build de producción         |
| `npm run lint`         | ESLint                               |
| `npm run lint:fix`     | ESLint con autocorrección            |
| `npm run format`       | Prettier sobre todo el proyecto      |
| `npm run format:check` | Comprueba formato sin escribir       |
| `npm run typecheck`    | TypeScript sin emitir                |
| `npm run test`         | Tests de lógica con Vitest           |
| `npm run test:watch`   | Tests en modo watch                  |

Antes de dar por terminado cualquier trabajo, los cuatro deben estar en verde:

```bash
npm run lint && npm run typecheck && npm run test && npm run build
```

## Arquitectura

Tres capas, sin saltárselas:

| Carpeta                    | Responsabilidad                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `src/app/[locale]/`        | Rutas. Una por realm, con segmentos localizados. Server Components por defecto                                           |
| `src/components/ui/`       | **UI Kit puro.** No importa de `data/`, `stores/` ni `i18n/`: recibe texto ya traducido por props                        |
| `src/components/world/`    | Motor inmersivo: canvas cósmico, cursor luminoso, audio ambiental, geometría sagrada. Se monta una sola vez en el layout |
| `src/components/layout/`   | Marco persistente: header, navegación de constelación, footer, shells                                                    |
| `src/components/features/` | Un subdirectorio por realm. Compone UI Kit + world + datos                                                               |
| `src/config/`              | Configuración estática: realms, bandas, fuentes, constantes de movimiento                                                |
| `src/data/`                | Catálogo de contenido tipado. **Sin textos**: sólo claves de traducción                                                  |
| `src/hooks/`               | Hooks reutilizables                                                                                                      |
| `src/i18n/`                | Routing localizado, navegación y carga de mensajes                                                                       |
| `src/lib/`                 | Utilidades puras y testeables                                                                                            |
| `src/stores/`              | Estado transversal con Zustand (reproductor, carrito, audio, diario)                                                     |
| `src/types/`               | Tipos compartidos                                                                                                        |
| `messages/`                | Todo el copy, ES y EN                                                                                                    |
| `tests/`                   | Tests de lógica, en espejo de `src/`                                                                                     |

## Internacionalización

El copy **nunca** se escribe en un componente. Cada entidad de `data/` guarda una clave (`titleKey`) y el texto vive en `messages/{es,en}.json`. Un test verifica que ambos catálogos tienen exactamente las mismas claves y que nada queda sin traducir.

Las rutas están localizadas: `/biblioteca` en español, `/en/library` en inglés. Todo enlace interno usa el `Link` de `@/i18n/navigation`, nunca el de `next/link`.

Toda página bajo `[locale]` empieza resolviendo el idioma:

```ts
const locale = await resolveLocale(params);
```

Eso valida el segmento, devuelve 404 si no es un idioma soportado y activa el render estático.

## Testing

Sólo lógica: stores, reducers, hooks y utilidades puras. No se testean componentes visuales. Las funciones puras reciben por parámetro sus dependencias no deterministas (`Math.random`, `Date`) para poder testearlas.

## Pendiente de backend

No hay servidor. Los puntos que lo requieren se marcan en el código con `// TODO(backend)`: autenticación real, pagos y checkout, reproducción de audio real, persistencia de diario y progreso, y CMS de contenido.

Fuera de alcance por ahora: blog, membresía como página propia, about, contacto, búsqueda global, perfil, favoritos, pedidos, notificaciones, ajustes y recuperación de contraseña.

## Añadir un realm nuevo

1. **Config:** crear el id en `src/config/realms.ts` (`RealmId`, acento, nota del drone) y su banda en `src/config/bands.ts`.
2. **Rutas:** añadir el segmento localizado en `src/i18n/routing.ts` (`pathnames`) — el `Link` de `@/i18n/navigation` traducirá `/nuevo` ↔ `/en/new` automáticamente.
3. **Copy:** crear el namespace en `messages/es.json` y `messages/en.json` con las mismas claves (el test de integridad lo exige).
4. **Datos:** el catálogo tipado en `src/data/` con claves de traducción, nunca textos.
5. **Vista:** `src/app/[locale]/<realm>/page.tsx` (Server Component, empieza con `const locale = await resolveLocale(params);`) que compone componentes de `src/components/features/<realm>/`.
6. **Navegación:** el realm aparece en `RealmNav`/`RealmsGrid` según los catálogos existentes (`config/realms.ts`).

## Añadir un componente al UI Kit

1. Crear el componente en `src/components/ui/<name>.tsx`: **puro** — no importa de `data/`, `stores/` ni `i18n/`; todo texto llega por props.
2. `"use client"` sólo si hay estado, efectos, listeners o animación imperativa.
3. Exportarlo desde `src/components/ui/index.ts` (barrel).
4. Añadirlo al catálogo interno `src/app/[locale]/kit/kit-catalog.tsx` (herramienta de desarrollo, nunca servida en producción).

## Documentación de decisiones

- Accesibilidad (contraste, landmarks, foco, reduced-motion): `docs/accessibility.md`.
- Rendimiento (presupuesto de bundle, FPS, pausas): `docs/performance.md`.
- Fidelidad por vista y desviaciones conscientes: `docs/fidelity-checklist.md`.
