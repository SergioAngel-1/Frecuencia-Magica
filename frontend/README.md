# Frecuencia Mágica — Frontend

Portal inmersivo y cinematográfico de bienestar. Un universo de 9 realms navegables, bilingüe ES/EN.

Las restricciones del proyecto (paleta, tipografía, movimiento, accesibilidad, arquitectura) están en [`../CLAUDE.md`](../CLAUDE.md) y son de obligado cumplimiento. El plan de implementación completo está en [`../docs/superpowers/plans/`](../docs/superpowers/plans/), y la fuente de verdad visual es el prototipo en [`../frontend-prototype/`](../frontend-prototype/).

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
