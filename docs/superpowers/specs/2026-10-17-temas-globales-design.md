# Temas globales — de atmósferas por lugar a un cambio de tema real

| Campo | Valor |
|---|---|
| Fecha | 2026-10-17 |
| Estado | Aprobado en chat por Sergio (2026-10-17) |
| Enmienda | `2026-10-17-ambientes-v2-design.md` (§ 4 y § 5: las nueve atmósferas por lugar pasan a cinco temas globales) |
| Vocabulario | En la interfaz son **temas**. En el código se conserva el nombre `atmosphere` (`data-atmosphere`, `AtmosphereId`, `config/atmospheres.ts`) para no mover los guardias y los tokens existentes; `DESIGN.md` § Atmósferas dice «tema» donde antes decía «atmósfera». |

## 1. Intención

Ambientes v2 trató cada atmósfera como un *lugar* (Academia es «estudio», Tienda es «taller»…), dejó elegir a mano sólo en tres vistas, pintó la Home por bloques de atmósferas distintas y mantuvo el mismo motor de partículas con un multiplicador. Resultado: el color parece puesto encima de una página que sigue siendo nocturna.

Se quiere lo que hace un selector día/noche, ampliado a cinco: **elegir un tema cambia los tokens de color de todo el sitio y trae su propio fondo vivo y sus propias imágenes.** Cada vista responde a cada tema.

## 2. Decisiones (Sergio, 2026-10-17)

- **Cinco temas:** `night` (Noche), `dusk` (Atardecer), `dawn` (Amanecer, esquema claro), `moon` (Luna), `forest` (Bosque). Desaparecen `study`, `store`, `gathering` y `marisol` como atmósferas.
- **Alcance:** global y persistente. Lo elegido manda en todo el sitio. Sin elección, cada realm abre con el tema que sugiere (`PLACE_ATMOSPHERE`).
- **Control:** en el header, siempre accesible (también en móvil).
- **Imágenes:** variantes por tema sólo donde la imagen base no funciona. Los prompts van a `docs/prompts-chatgpt.md`.

Decisiones del implementador (revertibles): los temas sugeridos por realm de § 3; «¿Cómo llegas hoy?» cambia el tema global; el drone sigue la nota del tema elegido; Luna reutiliza las imágenes de Noche.

## 3. Modelo

```
AtmosphereId = 'night' | 'dusk' | 'dawn' | 'moon' | 'forest'
elección     = AtmosphereId | null          (null = «Automático»)
activo       = elección ?? PLACE_ATMOSPHERE[lugar]
```

| Lugar | Tema sugerido |
|---|---|
| portal, home, auth, descubrete, resonario, sanctuario | `night` |
| academia | `dawn` |
| tienda | `dawn` |
| experiencias | `dusk` |
| story (Sobre Marisol) | `dawn` |

- **Persistencia:** `localStorage` clave `fm.atmosphere` (antes `sessionStorage`; el formato sube de versión y el valor viejo se descarta). Lo lee el script de arranque en `<head>` antes del primer pintado, igual que hoy.
- **Una sola verdad:** `resolveAtmosphere(place, choice)` = `choice ?? PLACE_ATMOSPHERE[place]`. Desaparecen `LISTENING_PLACES`, `PICKER_ATMOSPHERES` y la lógica de «lugar de escucha».
- **Tokens:** cada tema redefine en `tokens.css` el conjunto ya existente (texto, acentos, vidrio, velo, halo, fondo) y añade los del motor: `--nebula-a|b|c` (tripletes RGB). No se declara ningún valor de tema fuera de `tokens.css`.
- **Sin ámbitos locales:** se elimina `AtmosphereScope`/`ScopeBackdrop` de la Home (Marisol, tienda, llegada). Una página es un tema.

## 4. Motor vivo por tema

`lib/cosmic/themes.ts` (datos puros, sin DOM) define una **escena** por tema. El lienzo (`scene.ts`) la lee y la cambia con fundido (baja a 0, cambia el perfil, sube) al recibir `{ type: 'theme' }` por el worker.

| Tema | Estrellas | Partículas | Nebulosas |
|---|---|---|---|
| Noche | 220 marfil, parpadeo | polen dorado asciende (el original, sin cambios) | teal, lavanda, acento del realm |
| Atardecer | ~60 tenues y cálidas | brasas ámbar que ascienden lentas y titilan | coral, ámbar, malva |
| Amanecer | ninguna | motas de luz que derivan en diagonal; oro oscuro y blanco sobre claro | cielo pálido, durazno, dorado suave |
| Luna | ~140 plata, parpadeo marcado | polvo plata, pocas, muy lentas | azul acero, plata, lavanda |
| Bosque | ~40 | luciérnagas que pulsan con trayectoria sinusoidal y esporas que caen | verde, dorado verdoso, teal |

- El multiplicador `engine` de cada tema pasa a ser casi 1: el motor ya no «se apaga» en los claros, se *adapta*. Los modos del realm (`cosmic|editorial|quiet`) siguen reduciendo la intensidad.
- `NebulaLayer` lee `--nebula-*`; la viñeta ya lee `--scrim`.
- Presupuesto: mismos recuentos máximos que hoy (54 partículas desktop, 28 móvil, 220 estrellas); `prefers-reduced-motion` sigue pintando un frame quieto.

## 5. Control

`ThemeSwitcher` en `SiteHeader`: un botón con la muestra del tema activo abre un panel (`role="radiogroup"`, cinco muestras + «Automático»). Hit target 44 px, `aria-label`, foco visible, `Escape` cierra. En móvil conviven con el resto de controles del header sin romper; si no cabe, vive también en `RealmMenu`. El cambio anuncia el nombre del tema en la región `aria-live` que ya existe.

Se retira `AtmospherePicker` (Resonario, Descúbrete, Santuario).

## 6. Imágenes por tema

- **Manifiesto:** `EDITORIAL_ASSETS` admite `slot@tema` (y `slot:instancia@tema`). `resolveEditorialMedia` devuelve `media.variants` con los temas que tienen imagen.
- **Render:** `EditorialImage` sigue siendo componente de servidor. Si el slot tiene variantes monta un hijo cliente `ThemedPhoto`: la base va en el HTML (noche); tras montar, la variante del tema activo entra con fundido encima. Una regla CSS oculta la base cuando el tema activo tiene variante (`[data-photo-themes~='dawn']`), de modo que no se ve nunca la foto equivocada. Sólo se descarga la variante del tema activo.
- **Reglas de cobertura** (qué slot necesita variante en qué tema):
  - `moon` comparte la imagen de `night`.
  - `dawn` necesita variante en **todo slot escénico** (héroes, bandas, campos): una foto nocturna oscura no funciona en un tema claro.
  - `dusk` y `forest` necesitan variante en los **héroes P0/P1** y en las bandas grandes donde el color dominante choca (azul-teal sobre terracota; azul sobre verde). Las bandas P2 y los campos de atmósfera sin trabajo narrativo reutilizan la base.
  - Portadas de audio, portadas de curso, visuales de experiencia y fotos de producto **no** tienen variante: son contenido del ítem.
- **Reutilización:** las imágenes de `atmosphere.*` ya entregadas se reasignan como variantes: `atmosphere.study` → `academy.hero@dawn`, `atmosphere.store` → `store.hero@dawn`, `atmosphere.gathering` → `experiences.hero@dusk`, `atmosphere.marisol` → `about.hero@dawn`, `atmosphere.dusk|dawn|moon|forest` → `resonario.hero@dusk|dawn|moon|forest`. Los slots `atmosphere.*` dejan de existir (`atmosphere.forest-autumn` sigue sin cablear).
- **Prompts:** cada variante nueva sale en `docs/prompts-chatgpt.md` (generado desde `Branding/src/data/photography.js`), con el mismo estilo y «Avoid» de las atmósferas, ratio del slot y nombre de archivo `<slot>-<tema>.png`.

## 7. Fuera de alcance

Tema automático por hora del día; temas por usuario en servidor (no hay backend); variantes de portadas de audio/curso/producto; rediseño de composiciones.

## 8. Riesgos

- **Destello al cargar en un tema no-noche:** el HTML es estático. Lo cubre el script de arranque (tokens y fondo) y la regla CSS que oculta la base; el motor arranca ya con el tema correcto (el hilo principal lo lee de `<html>`).
- **Contraste:** `atmosphere-contrast.test.ts` mide cada par de cada tema; los claros usan derivados oscuros.
- **Guardias de código fuente** (`palette`, `atmosphere-boot`, `band-chain`, `academy-editorial`…): se actualizan al nuevo contrato sin debilitarlos.
- **First Load JS** ya sobre presupuesto: las escenas son datos; no se añade librería.
