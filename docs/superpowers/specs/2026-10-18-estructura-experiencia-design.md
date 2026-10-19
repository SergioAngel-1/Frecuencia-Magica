# Estructura de la experiencia — portal, home y ritmo de héroes (2026-10-18)

Decisiones tomadas sin ronda de preguntas (el usuario pidió actuar con criterio de UX). Todo lo marcado **[mi decisión]** es revisable.

## 1. Intención

Que la web se comporte en función de cómo se siente la persona, y que ese gesto ocurra en el lugar correcto: el umbral. Y que la secuencia de bloques de cada vista tenga un ritmo claro, sin héroes ni bandas fotográficas pegadas.

## 2. Hallazgos (verificados en el código)

- La elección de «¿Cómo llegas hoy?» ya fija el **tema global** (`useArrival.choose` → `useAtmosphereStore.setChoice`). El tema ya gobierna escena del lienzo, nebulosas, imagen por tema y nota del drone (`baseNoteFor`). No hay que inventar un segundo canal: la elección es el tema.
- Pero la pregunta vive en la tercera sección de la Home (`ArrivalSection`), tras dos bandas. Quien entra por el portal cruza sin elegir nada.
- Quien llega directo a `/inicio` (o a cualquier ruta) nunca pasa por el portal: la pregunta no puede existir **solo** allí.
- Bandas fotográficas consecutivas, hoy fundidas a propósito con `BandChain`: Home (héroe → frecuencia del día), Resonario (héroe → banner del archivo), Experiencias (héroe → destacada). Además, portal (100svh) → héroe de la Home (100svh): dos héroes seguidos en el cruce.
- Excepto el pie, el resto de vistas ya alterna bien (Tienda, Academia, Sobre Marisol, Santuario).

## 3. Decisiones

### 3.1 Portal = umbral + «¿Cómo llegas hoy?» [mi decisión]
- La escena del portal incorpora los ocho estados (`ArrivalCheckIn`) entre el subtítulo y «Cruzar el portal». Es **opcional**: el botón funciona sin elegir.
- Elegir cambia el tema **en vivo** (el portal mismo se recolorea: la persona ve la promesa cumplida antes de cruzar) y muestra una línea con el nombre del tema que se propone. Se puede cambiar de estado antes de cruzar.
- En el portal **no** suena ninguna pista ni se abre el reproductor: el cruce ya enciende el drone (afinado por el tema). Regla de la marca: «el sonido sólo empieza cuando tú lo eliges».
- Nuevo store persistido `stores/arrival-store.ts` (`fm.arrival`, versión 1) con la `ArrivalKey` elegida. Es lo que permite que la Home responda a un estado elegido en el portal. El tema sigue siendo la verdad visual/sonora (`atmosphere-store`); el arrival-store sólo guarda *qué estado* originó la elección.
- Móvil 390: los ocho estados en dos filas; el isotipo y el titular ceden alto (ya se calculan con `svh`).

### 3.2 La Home recibe lo elegido [mi decisión]
- `ArrivalSection` pasa a ser «Tu llegada»: si hay estado guardado, muestra directamente el panel (explicación, alternativas de escucha, respiración, «otra opción») con las pistas **sin abrir ninguna** hasta que la persona pulse; si no hay estado (llegó directo a `/inicio` o saltó el portal), muestra el check-in como hoy. Cambiar de estado es posible en ambos casos.
- `useArrival` se inicializa desde el store: el panel nace en el estado guardado sin sonar.

### 3.3 Orden de la Home [mi decisión, siguiendo la intuición del usuario: tarjetas antes que frecuencias]
1. Héroe (banda) — más bajo que el del portal (`split`, ~70vh): ya no compite con él.
2. **Elige por dónde entrar** (tarjetas/bento). Sin la `EditorialBanner` de apertura: encabezado de texto sobre la noche, para no pegar dos bandas.
3. **Tu llegada** (contenido).
4. Frecuencia del día + muestra del Resonario (banda).
5. Tienda (contenido).
6. Membresía (banda).
7. Marisol + video (contenido).
8. Pie.

### 3.4 Regla de ritmo, para todas las vistas [mi decisión]
**Nunca dos bandas fotográficas a sangre consecutivas** (héroe, `EditorialBanner`, `FullBleedSection` con foto, fila destacada con foto). Entre dos bandas va siempre un bloque de contenido sobre la noche. Excepción única: la última banda de una vista puede encontrarse con el banner del pie (`BandChain intoFooter`), que ya se diseñó así. Consecuencia: `BandChain` sin `intoFooter` deja de usarse; se guarda con un test.

Aplicación vista por vista:
- **Resonario**: héroe → (el banner del archivo pasa a encabezado de texto del sistema, sin foto) → sistema.
- **Experiencias**: héroe → encabezado de texto + destacada como tarjeta de contenido (no banda) → archivo.
- **Academia, Tienda, Sobre Marisol, Santuario, Descúbrete**: auditar contra la regla; hoy cumplen salvo hallazgo nuevo.

## 4. Fuera de alcance
Nuevas fotografías, nuevos temas, cambios en `tokens.css`, copy fuera de lo necesario (ES y EN), backend, y mover el control de tema del header.

## 5. Fases
- **Fase A** — estado y portal: `arrival-store`, `useArrival` inicializado, check-in en el portal, `ArrivalSection` adaptativa, i18n, tests.
- **Fase B** — Home: orden de §3.3, héroe `split`, encabezado de realms sin banda.
- **Fase C** — ritmo: Resonario, Experiencias, auditoría del resto, test guarda de `BandChain`.
- Cierre: una revisión, gate completo, `sections-plan-completed.md` y CLAUDE.md local al día.
