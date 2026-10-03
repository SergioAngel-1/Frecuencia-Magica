# Branding — showcase del sistema de diseño

Showcase vivo de **Frecuencia Mágica**. No define un sistema propio: importa los tokens reales de la web y los muestra, de modo que lo que cambie en `frontend/` cambia aquí.

> Reemplaza al showcase claro/pastel de junio de 2026, que no correspondía a la paleta del producto (ver `docs/superpowers/audits/2026-09-30-design-coherence-audit.md`).

## Rutas

| Ruta | Qué muestra |
|---|---|
| `/` | Entrada y fuentes de verdad |
| `/sistema` | Color, tipografía, superficies, movimiento, controles, estado, disco de frecuencia y patrones por realm |
| `/fotografia` | Brief fotográfico: medidas, contenido y un prompt por imagen |

## Uso

```bash
npm install
npm run dev              # http://localhost:5173
npm run build            # vite build
npm run lint             # oxlint
npm run export:photo-brief   # escribe ../docs/brief-fotografico.md
```

## Fuente única

| Se importa de | Qué |
|---|---|
| `frontend/src/app/tokens.css` | Paleta, escalas, radios, halos, keyframes y utilidades (`fm-surface`, zebra, `fm-container`) — vía `@import … theme(static)` |
| `frontend/src/config/` | Realms, bandas (`BANDS`) y portadas (`COVERS`) |
| `frontend/src/data/` | Catálogo de audios, cursos, experiencias y productos |
| `frontend/messages/es.json` | Copy de muestra |
| `frontend/src/lib/editorial/zebra.ts` | Ángulo y fase del skeleton zebra por slot |

Branding no declara colores, tamaños ni radios propios. Un test de la web (`frontend/tests/lib/branding-tokens.test.ts`) falla si aparece un hex suelto, una escala que `tokens.css` no declara o si el showcase deja de consumir el archivo compartido.

## Componentes (`src/components/ui/`)

Son puertos en JSX del UI Kit de la web (`frontend/src/components/ui/`), con los mismos valores. Si una pieza cambia allí, se actualiza aquí. Branding no usa `tailwind-merge`: `src/lib/cn.js` sólo une clases, así que un componente no debe recibir una utilidad que choque con las suyas.

Las piezas del showcase (`Section`, `Specimen`, `Mono`) viven en `src/components/showcase/` y no existen en la web.

## Brief fotográfico

`src/data/photography.js` es la única fuente del brief: un registro por imagen con su preset de medidas, foco, zona de texto, prioridad y prompt. Lo consumen la página `/fotografia` y el script de exportación. El contrato que manda sigue siendo `frontend/src/config/editorial-media.ts`; `frontend/tests/lib/photography-brief.test.ts` comprueba que el brief cubre cada slot registrado con su ratio, prioridad y foco, que los títulos por instancia coinciden con `messages/` y que `docs/brief-fotografico.md` está al día.

Para cambiar un prompt o una medida: edita `photography.js` y ejecuta `npm run export:photo-brief`.
