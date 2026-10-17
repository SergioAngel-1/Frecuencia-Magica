# Correcciones frontend v2 — Cambio de ambientes

| Campo | Valor |
|---|---|
| Fecha | 2026-10-17 |
| Estado | **Borrador para aprobación.** Nada de esto está construido. |
| Origen | Mensajes de Marisol tras revisar la v1, en `~/Documentos/Docs/Frecuencia Mágica/Correcciones frontend v2/`: `Mensajes Marisol.txt` (siete ajustes + referencias) y `Mensajes Marisol 2.txt` (cinco audios transcritos, con posibles errores de dictado; amplían y matizan el primero) |
| Qué enmienda | `AGENTS.md` (paleta cerrada, fondo único), `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md` (§2 y §4: sin stock, paleta cerrada) y su enmienda del 2026-10-10 (paisaje nocturno, sin neón ni arcoíris) |
| Siguiente paso | Aprobado este documento, un plan por línea de trabajo (`superpowers:writing-plans`), empezando por la Fase 0 y la Fase 1 |

Convención de este documento: **[Marisol]** es algo que ella dijo. **[Mi decisión]** es una decisión que tomé yo y que se puede revertir. **[Verificado]** es algo que comprobé leyendo el código.

---

## 1. Intención

La v1 acierta en la dirección (elegancia, imagen, sensación envolvente), pero **todas las vistas comparten la misma noche**: el cambio de paisaje no cambia el clima. Marisol pide que cada espacio tenga una atmósfera reconocible por paisaje, luz, tonalidad y contenido, que el sitio alterne secciones claras y oscuras, y que lo que la persona siente al llegar («¿Cómo llegas hoy?») cambie de verdad lo que ve y lo que oye.

Es un cambio de **sistema** (de un tema único a un tema por atmósfera), no un retoque de vistas. Eso es lo que lo hace viable con la estructura actual: los textos, bordes y superficies ya pasan por tokens, y un tema sólo tiene que redefinirlos.

**Cómo leer los dos bloques de mensajes.** Los siete ajustes del texto son el compromiso. Los audios son, en sus palabras, «ideas que me surgen» que yo debo coger y decirle «esto lo puedo complementar acá o acá»; aclara que no quiere cambiar la página («estoy feliz»), sino lo que notó tras mucho tiempo en ella: **siempre el mismo color**. Por eso el spec marca lo que sale de los audios como idea y lo coloca en la fase donde encaja, sin convertirlo en trabajo adicional obligatorio. Lo que más le importa de los audios: ambientes **reales** (mar que se mueve, bosque, agua, pájaros), que la respuesta de «¿Cómo llegas hoy?» **cambie el paisaje y el sonido**, y que la persona **elija** entre alternativas.

Éxito, en sus palabras: que se perciba claramente el cambio de ambiente, que los textos se lean bien, que todo siga siendo Frecuencia Mágica, y que una persona nueva identifique dónde comprar.

## 2. Objetivos, no objetivos y anti-objetivos

**Objetivos**
1. Un sistema de **atmósferas** que re-tematiza fondo, luz, superficies, botones, reproductor y texto, aplicable a una página entera o a una sección.
2. Tres muestras validadas por ella en computador y celular antes de extender: **descanso/atardecer, calma diurna/amanecer, tienda cálida con fotografía de producto**.
3. «¿Cómo llegas hoy?» y el resultado de Descúbrete responden con atmósfera + alternativas de escucha (nunca sólo un tono) + explicación + otra opción, y la atmósfera se puede cambiar a mano.
4. Resonario con cinco tipos de escucha diferenciados, muestra previa, volumen y continuidad entre secciones.
5. Tienda con presencia: acceso con la palabra «Tienda», bloque destacado en el inicio y producto que se siente real.
6. Espacios previstos para los videos de ella, sin botones de play falsos.
7. Navegación con nombres y «dónde estoy», y móvil sin tapados.
8. Un registro honesto de qué entra ahora y qué depende de lo que ella entregue.

**No objetivos** (siguen aplazados según `AGENTS.md`): backend, pagos reales, CMS, blog, membresía, búsqueda, perfil. Tampoco un interruptor global claro/oscuro: el cambio es por atmósfera, no un «modo».

**Anti-objetivos** (fracaso aunque funcione)
- Que el sitio pase a ser una plantilla clara genérica de bienestar. Cada atmósfera conserva lo común de marca (§4.3).
- Que un efecto, un video o una transición estorbe leer o comprar.
- Usar el contenido de los canales que ella cita como fuente (§7.4).
- Mostrar un control que no funciona (play sin audio o sin video).

## 3. Estado actual relevante [Verificado]

| Hecho | Dónde | Por qué importa |
|---|---|---|
| Un único fondo: `--fm-night` en `body`; el texto es una escalera de marfil (`text-fg-*`); 179 usos de `text-ivory/fg-*`, 59 de `border-gold/glass-brd`, 17 scrims `void`, 15 `fm-surface` | `tokens.css`, `components/`, `app/` | Es la superficie a re-tematizar. Los tokens semánticos ya existen; los literales no. |
| El realm sólo fija acento, `baseNote`, `visualMode` y `photoTreatment`; el engine (canvas, nebulosa) es de noche | `config/realms.ts`, `components/world/` | Una atmósfera clara necesita su propio perfil de engine. |
| **El reproductor no reproduce audio**: simula con un temporizador (`TODO(backend)`) | `player-dock.tsx` | Todo el punto 3 exige un motor de audio real. |
| El único sonido real es un drone sintetizado con Web Audio; se silencia mientras «suena» el reproductor | `lib/audio/drone.ts`, `ambient-mix.ts` | Hay infraestructura de síntesis reutilizable. |
| El reproductor ya vive en el layout, hay un solo `audioId` (abrir otro sustituye al anterior) y se puede recoger a un disco | `layout.tsx`, `player-store.ts` | Continuidad, no solapamiento y «reducir» ya existen en el modelo; con audio real hay que mantenerlos. **No hay control de volumen.** |
| `Audio` sólo tiene `tagId` (meditation, frequency, grounding, rest, ritual, breath), `duration`, `hz` | `types/content.ts` | Falta tipo de escucha, voz, muestra y origen. |
| «¿Cómo llegas hoy?» es el título del **diario de Mi Santuario** (5 estados: calma, alegría, nostalgia, cansancio, gratitud) y sólo guarda una entrada | `messages/es.json` → `journal`, `stores/journal-store.ts` | Hoy no cambia nada y exige sesión. Descúbrete es otro flujo (5 preguntas → 6 intenciones). |
| Nav: columna de puntos ≥1024 px con el nombre sólo al pasar el cursor; menú modal por debajo. **No hay texto «Tienda» visible**, aunque la tienda ya va primera en el orden | `realm-nav.tsx`, `realm-menu.tsx`, `config/realms.ts` | El punto 4 y el 7 son carencias reales. |
| `VideoPlayer` sin `src` **simula la reproducción** | `video-player.tsx`, `use-video-playback.ts` | Es exactamente el play falso que ella no quiere. |
| El diario guarda el ánimo como **índice numérico** de la lista `MOODS` (persistido en `fm.journal`) | `journal-store.ts`, `journal-entry.tsx` | Añadir o reordenar estados rompería las entradas ya guardadas: hay que pasar a ids estables con migración. |
| `Course` no tiene precio/gratuito, modalidad, «qué aprenderás» ni «qué incluye»; `Product` no tiene tamaño/contenido ni galería | `types/content.ts` | Datos nuevos, y contenido que sólo ella puede confirmar. |
| `palette.test.ts` rechaza cualquier hex fuera de la paleta cerrada; `branding-tokens.test.ts` prohíbe colores en `Branding/` | `tests/lib/` | La enmienda de paleta tiene que entrar por contrato y por estos guardas. |
| Las imágenes salen de un pipeline de PNG generados → AVIF, un asset por slot, tintado por `photoTreatment` | `config/editorial-media.ts`, `editorial:ingest` | Las atmósferas piden paisaje **sin tintar** y fotografía real de producto. |

## 4. El sistema de atmósferas

### 4.1 Nombre en código [Mi decisión]
En el código `ambient` ya significa el **drone** (`ambient-store`, `use-ambient-audio`, `ambient-mix`). El concepto nuevo se llama **`atmosphere`** (`config/atmospheres.ts`, `data-atmosphere`). En la interfaz, «ambiente».

### 4.2 Catálogo
Nueve atmósferas: la actual, las siete de su tabla y `forest`, que nace de los audios («que cambien entre bosque, entre agua», «cuando necesito bosque está») y de sus tres imágenes de referencia.

| id | UI | Esquema | Carácter [Marisol] | Dónde vive por defecto |
|---|---|---|---|---|
| `night` | Noche cósmica | oscuro | la v1 actual, sin cambios | portal, acceso, 404 |
| `dusk` | Atardecer · Descanso | oscuro cálido | terracota, coral oscuro, ámbar suave; mar tranquilo al atardecer; sin rojo intenso ni luces deslumbrantes | elegible; respuesta a «descansar» |
| `dawn` | Amanecer · Calma de día | **claro** | azul cielo, marfil, dorado tenue; amanecer sobre lago o mar | elegible; respuesta a «calma» |
| `moon` | Luna · Escucha nocturna | oscuro profundo | azul noche y plata; mar bajo la luna, pocas estrellas | elegible; se ofrece primero como «otra opción» de noche |
| `forest` | Bosque · Raíz y agua | verde natural, luz media | [Mi decisión, de los audios y las imágenes] verde natural y luz filtrada; cascada y helechos; la variante otoñal (su imagen del bosque rojo y dorado) encaja con nostalgia | elegible; respuesta a «Raíz» y «Renovación»; escucha para estudiar |
| `study` | Estudio · Academia | **claro** | claro, acogedor, luz para leer; rincón junto a una ventana | Academia |
| `store` | Taller · Tienda | **claro cálido** | arena, crema, verde suave; productos sobre piedra o madera con luz lateral | Tienda |
| `gathering` | Encuentro · Experiencias | cálido, luz media (ni noche ni día pleno) | humano y cercano; personas en un espacio cálido | Experiencias |
| `marisol` | Luz de Marisol | **claro cálido** | personal, cálido y luminoso; fotos y videos reales de ella | Sobre Marisol |

Mi Santuario, Descúbrete, Resonario y Home no tienen atmósfera fija: toman la de su sitio o la elegida (§4.4).

### 4.3 Qué es una atmósfera
Un conjunto de valores, definido **sólo en `tokens.css`** (así `Branding/` lo muestra sin copiarlo):
- **Superficie**: gradiente de fondo (sustituye a `--fm-night` en ese ámbito), vidrio y su borde, scrim.
- **Texto**: la escalera de cinco peldaños (`fg`, `fg-body`, `fg-soft`, `fg-muted`, `fg-meta`) y un **acento de texto** propio. Sobre claro, el oro de marca (`#D8B978`) da ≈1,7:1 contra marfil: no sirve de texto, y cada atmósfera clara declara su derivado oscuro.
- **Luz**: halos y glows que reemplazan a los dorados.
- **Controles**: botón primario, foco, píldoras, barra y disco del reproductor.
- **Perfil de engine**: opacidad del canvas, de la nebulosa y de los blobs, y qué partículas (estrellas sólo en oscuras; en claras, nada o motas de luz).
- **Sonido**: nota y voz del drone.
- **Barra del navegador**: `theme-color`.

**Lo común de marca** (no cambia entre atmósferas): Cormorant Garamond y Jost y sus escalas; el isotipo y el logo; la forma del vidrio y los radios; la luz como acento (halos, nunca rellenos grandes); el movimiento lento (flotar, respirar, entrada escalonada); la voz del texto; el reproductor como pieza reconocible; el pie.

### 4.4 Cómo se resuelve y se aplica
- Atmósfera efectiva = **elección manual o de «¿Cómo llegas hoy?»** (si el realm es de escucha) **si no, la del realm**. [Mi decisión] Los realms con identidad propia (Academia, Tienda, Experiencias, Sobre Marisol) **no** se pisan por la elección: ella pide poder cambiar «el ambiente», pero cambiar el estudio a atardecer rompe lo que pidió para Academia. El selector manual vive en Resonario, Descúbrete (resultado), Mi Santuario y el reproductor.
- Un `AtmosphereProvider` (junto a `RealmProvider`) escribe `data-atmosphere` y `data-scheme` en `<html>`. Un `<AtmosphereScope>` los escribe en una sección: es lo que permite **alternar claro y oscuro dentro de una página** (punto 6). Las variables CSS cascadean, así que un hijo del scope se re-tematiza sin props.
- `RealmId` y `AtmosphereId` son ejes distintos. No se añade ningún realm ni ruta.
- La elección manual dura la sesión (`sessionStorage`), no es permanente. [Mi decisión]

### 4.5 Los controles fijos sobre fondos que alternan
Header, constelación, reproductor y WhatsApp flotan sobre cualquier atmósfera. Para que nunca pierdan legibilidad usan **vidrio denso tintado por la atmósfera activa** (no transparente), con el contraste calculado sobre su propia superficie. El scrim del header se adapta al esquema.

### 4.6 Transiciones
Cambiar de atmósfera (ruta, elección o scroll entre secciones) **funde dos capas de fondo con `opacity`**; los tokens de texto y superficie cambian bajo ese fundido. No se interpolan colores animando propiedades de pintado: se mantiene la regla de animar sólo `transform` y `opacity`. `RouteTransition` y la coreografía del portal siguen igual. `prefers-reduced-motion`: cambio sin movimiento, con fundido corto.

### 4.7 Imagen
- Los paisajes de atmósfera **conservan sus colores naturales** [Marisol]. Se añade el tratamiento `natural` (sin tintar) a `PhotoTreatment`.
- Un **slot por atmósfera** (`atmosphere.<id>.backdrop`, con recorte móvil) en el contrato de `editorial-media.ts`, con alt ES/EN, entrada en el brief y regeneración (`export:photo-brief`), como pide `CLAUDE.md`. Las secciones de tienda, academia, encuentros y Marisol añaden los suyos.
- Fallback sin foto: **el gradiente de la propia atmósfera**, no la zebra (la zebra es de noche). Nunca caja gris.
- Movimiento del paisaje [Marisol: «luz y movimiento suave»; en los audios, «que veas las olas moviéndose y alcances a escuchar el oleaje», «un mar moviéndose, de pronto pajaritos»]: el movimiento es parte de la experiencia, no un adorno. Dos niveles [Mi decisión]: (1) base, siempre: deriva lenta sobre imagen fija y luz que respira (sólo `transform`/`opacity`); (2) donde haya material, un **loop de video silenciado** (pocos MB, con póster) para mar, agua y bosque, que se apaga con `prefers-reduced-motion` y ahorro de datos. El sonido del paisaje no va en el video: lo pone el motor de audio (§6), emparejado con la atmósfera.
- **Tensión a resolver con ella — el rojo del mar.** En el texto pide evitar «rojo intenso y luces deslumbrantes»; en un audio imagina «el mar real, rojo». Lo trato como un atardecer natural de reflejos rojizos y ámbar sin saturar, y el color final se calibra sobre la fotografía real en la muestra. Está en las decisiones abiertas (§11).
- Texto sobre foto: el scrim de `EditorialOverlay` gana un tono claro u oscuro según la atmósfera; el contraste AA sigue siendo del scrim, no del peldaño.
- **Procedencia** [Marisol: «propias o autorizadas»]: esto enmienda el anti-objetivo «sin stock». Se permite fotografía propia o con licencia comercial comprobada. Mientras no lleguen, hay **imágenes provisionales generadas** (§9), decididas así por Sergio (D1 cerrada).
- **Slots nuevos, ya en el contrato y en el brief** (`frontend/src/config/editorial-media.ts`, `docs/brief-fotografico.md`, `docs/prompts-chatgpt.md`; 15 imágenes, todas `faltante` y sin cablear): `atmosphere.dusk`, `atmosphere.dawn` y `atmosphere.store` (las tres muestras, se generan primero), `atmosphere.moon`, `atmosphere.forest`, `atmosphere.forest-autumn` (opcional), `atmosphere.study`, `atmosphere.gathering`, `atmosphere.marisol`, `resonario.celtic` y `resonario.kind-banner.*` (cinco: melodías, naturaleza, frecuencias, binaurales, guiadas). Llevan un estilo propio (`GLOBAL.atmosphere` en `Branding/src/data/photography.js`): mismo lenguaje fotográfico que la noche, color natural en lugar del etalonaje marino y dorado, sin personas. Su fallback es `none` hasta que exista el degradado de cada atmósfera.
- **Los productos no se generan.** Son fotografía real que hará Marisol; el brief ya los marca como provisionales (sección 5.6).

### 4.8 Contraste como guarda
Un test `atmosphere-contrast` lee los tokens de cada atmósfera y falla si un par texto/superficie baja de AA (4,5:1 texto, 3:1 UI grande y foco). Es el equivalente de `palette.test.ts` para este sistema.

## 5. «¿Cómo llegas hoy?» cambia la experiencia [Marisol, punto 2]

**Un solo registro**, `ARRIVALS`, alimenta tanto el check-in de ánimo como el resultado de Descúbrete: `entrada → { atmósfera, alternativas de escucha (en orden), audio sugerido, texto de explicación }`. La entrada es un estado del diario o una intención del quiz.

### 5.1 La persona elige; el tono no es el punto de partida [Marisol, audio 3]
«Mucha gente el tono en lugar de desestresarlo lo estresa». Por eso, para cada entrada la respuesta ofrece **al menos dos tipos de escucha distintos y el tono nunca es la única opción ni la primera por defecto**. Su esquema, tal cual: *¿quieres escuchar el tono / una música ambiental / el sonido real (la cascada, el mar, los pájaros)?* La persona puede **recorrer las sugerencias** («que vaya cambiando») hasta que una le guste, sin salir del panel.

### 5.2 Vocabulario del check-in
Ella nombra: calma, tristeza, claridad, entusiasmo, relajarse, descansar o dormir, respirar y estudiar. El diario hoy ofrece calma, alegría, nostalgia, cansancio y gratitud. Propuesta [Mi decisión, a confirmar]: **ocho estados** — Calma, Cansancio, Nostalgia, Tristeza, Alegría (o entusiasmo), Gratitud, Claridad, Necesito respirar. «Estudiar» no es un estado: es un uso que se atiende en la Academia (§8). Como el diario guarda el ánimo por índice, los estados pasan a **ids estables con migración** de lo ya guardado. El tono de «Tristeza» es de acompañamiento, sin lenguaje clínico.

### 5.3 Tabla v1 [Mi decisión, a confirmar con ella], editable en config

| Entrada | Atmósfera | Alternativas de escucha (en este orden) |
|---|---|---|
| Cansancio (descansar, dormir) | `dusk` | sonido real de mar con oleaje · melodía suave · práctica guiada · tono de descanso |
| Calma | `dawn` | agua y pájaros · melodía instrumental · tono de calma |
| Tristeza · Nostalgia | `dusk` (la variante otoñal de `forest` si hay material) | melodía instrumental, arpa y celta · naturaleza · práctica guiada |
| Alegría · Gratitud | `dawn` | melodías luminosas · pájaros y agua |
| Claridad | `dawn` | melodía · naturaleza · binaural |
| Raíz (intención de Descúbrete) · Renovación | `forest` | sonido real de bosque y cascada · melodía · frecuencia |
| Necesito respirar | `dawn` | práctica de respiración guiada (§5.4) · agua · melodía |

`moon` no responde a un estado: se ofrece como «otra opción» de noche (por la hora local) y en el selector manual.

### 5.4 Comportamiento
1. Elegir cambia la atmósfera **de inmediato** (fundido) y abre un panel con: qué ofrece esa escucha en una frase, 2–3 alternativas, el recorrido entre sugerencias y «elegir otra opción» (otra atmósfera, no un reinicio del flujo).
2. **Respuesta sonora**: nace de un gesto de la persona (cumple la política de autoplay), con entrada en fundido a volumen bajo y control de parar siempre visible. Nunca suena nada al cargar la página.
3. Dónde vive [Mi decisión]: se extrae un componente `ArrivalCheckIn` que usan el diario de Mi Santuario (conserva su guardado) **y un bloque en la Home**. Ella lo piensa para «una persona normal que entró», sin sesión, así que no puede vivir sólo detrás del acceso. El resultado de Descúbrete aplica la misma respuesta con la intención dominante.
4. **Respirar** [idea de Marisol: «una imagen de alguien que empieza a hacer la respiración contigo»]. Se construye en dos pasos: ahora, un **guía de respiración visual** (el orbe de luz que inhala y exhala, con el ritmo indicado en texto, apoyado en el `breathe` del sistema); cuando ella entregue la grabación, un video suyo respirando con la persona en el slot `breathing-guide`. Hasta entonces no se promete «alguien» en pantalla.

### 5.5 Idea suya aún sin asignar: «cómo te sientes al empezar y al finalizar»
Dice que le encantó que el diario pida el ánimo **al empezar y al finalizar**. Hoy el diario guarda un solo estado. Podría leerse como un segundo check-in opcional al cerrar una escucha. No está en el alcance base; queda como pregunta (§11) y sólo se incluye si ella lo confirma.

## 6. Música y reproductor [Marisol, punto 3 y mensajes 2–3]

### 6.1 Cinco tipos de escucha
`kind`: `melody` (piano, cuerdas, acústico, **incluida la música de inspiración celta**), `nature` (lluvia, mar, agua, bosque, **canto de aves**, que ella señala como lo que más relaja; se prioriza en el catálogo, sin afirmarlo como hecho en la interfaz), `frequency` (frecuencias y tonos), `binaural`, `guided` (su voz).

Cada pista declara: nombre comprensible, tipo, duración real, **si lleva voz**, muestra, origen/licencia y disponibilidad (`ready` | `soon`). Cada **tipo** tiene su explicación (qué es, para qué momento, cómo escucharlo). Redacción sin afirmaciones médicas.

**Guía de escucha por pista** [Marisol, audio 5, con su ejemplo]: «este audio tiene sonidos binaurales, sonidos del mar, combinados con una frecuencia tal; te pedimos que lo utilices con audífonos estéreos…; siéntate en una posición cómoda…; te sirve para…». Cada pista declara su **composición** (p. ej. «sonido del mar + binaural a X Hz»), si **requiere auriculares**, una **postura o cómo escucharla** y **para qué momento sirve**. Se muestra antes de reproducir, junto a la muestra. Las pistas combinadas son una sola pista para el reproductor, con capas internas.

La pieza celta lleva el texto que ella envió, como su explicación, tal cual en ES y traducido al EN para que ella lo apruebe. Se presenta destacada dentro de `melody` [Mi decisión: leo «ella es especial» como pieza editorial, no como un sexto tipo; confirmar].

El Resonario se organiza por tipo, con la explicación visible; el filtro por `tagId` actual se sustituye por `kind`. Las prácticas guiadas figuran como «Próximamente», sin play, hasta que entreguen las grabaciones.

### 6.2 Motor de audio
Un motor único, montado en el layout junto al dock, con **un solo `AudioContext`** compartido con el drone:
- **Fuentes**: archivo (`<audio>` enrutado a un nodo de ganancia) y **síntesis** (tonos, binaurales con un oscilador por oído; y, como placeholder, texturas de mar o lluvia con ruido filtrado). La síntesis permite que frecuencias y binaurales **suenen de verdad ya**, sin esperar archivos. Una pista puede componer **capas** (p. ej. mar + binaural), sin dejar de ser una sola pista: al sustituirla o pausarla, todas sus capas lo hacen a la vez.
- **Emparejamiento paisaje–sonido**: la respuesta de «¿Cómo llegas hoy?» enlaza una atmósfera con su sonido real (el atardecer con el oleaje, el bosque con la cascada o los pájaros); la persona puede cambiar sólo el sonido sin cambiar la imagen.
- **Sustitución sin solape**: al elegir otra pista, la anterior baja en un fundido corto y sólo entonces entra la nueva.
- **Continuidad**: el motor y su `<audio>` viven en el layout; cambiar de sección no los desmonta ni reinicia.
- **Volumen**: control de volumen **visible junto a pausa** en el dock. Se aplica con un `GainNode`, no con `audio.volume`, porque en iOS el volumen del elemento no se controla por script. Se persiste aparte (el reproductor sigue sin persistir para no resucitar solo).
- **Muestra**: «escuchar muestra» en cada pista, de unos 20–30 s, con etiqueta «Muestra» y acceso a «Escuchar completa». Pasa por el mismo canal (nunca dos sonidos). Al terminar no reanuda la anterior. [Mi decisión]
- El elapsed y el fin de pista salen del motor, no del temporizador. El drone sigue cediendo ante una pista.
- Para móvil: el reproductor se puede **reducir** (ya existe); en rutas de compra arranca recogido.

### 6.3 Audio: lo que se puede y no se puede usar
Los canales que ella cita (Nature Relaxation Films, Soothing Relaxation) son **referencias de sensación**, no fuentes: su música e imagen tienen derechos de terceros. Se usa audio propio, sintetizado por nosotros o con licencia comercial documentada por pista. Cada pista registra su procedencia; sin licencia verificada, no se publica (§9).

## 7. Tienda con presencia [Marisol, punto 4]

1. **Acceso con la palabra «Tienda»** en el header, visible en todos los anchos (en móvil, compacto), con el carrito. La constelación de puntos se queda como complemento.
2. **Bloque destacado en la Home**: 3–4 productos con foto, nombre y precio y un botón «Ver la tienda» (`ButtonLink`). Es una sección en atmósfera `store`, entre secciones oscuras.
3. **Producto que se siente real**: `store-product-visual` pasa a **galería por producto** (envase con etiqueta legible, detalle de textura, imagen en uso) y `Product` gana tamaño/contenido. Las fotos finales requieren producto físico.
4. **Imágenes provisionales identificadas** para reemplazar antes de publicar (§9).
5. El catálogo actual (8 productos: aromas, velas, cristales, brumas, rituales, cuidado, bebidas, papelería) **es un placeholder**. La lista real, con nombres, tamaños y contenidos, la define ella.

## 8. Videos y cursos [Marisol, punto 5]

- **Registro de videos** (`config/videos.ts`): `welcome` (Home), `marisol-intro` (Sobre Marisol), `course-intro.<curso>` y `lesson.<curso>.<n>`. Cada uno: `src?`, póster, duración, disponibilidad.
- **`VideoSlot`**: con `src` muestra el `VideoPlayer`; sin él muestra el póster con «Próximamente» y **sin botón de play ni temporizador**. Se elimina la reproducción simulada de `useVideoPlayback`.
- **Página de curso**: qué aprenderás, qué incluye, duración, modalidad y gratuito/de pago, **alternando** texto, imagen, video y **módulos** plegables (la lección agrupada en módulos; el plegado usa la fila de rejilla `0fr`→`1fr`). `Course` gana esos campos.
- **Disponible al lanzamiento vs. «Próximamente»**: ver §11; la decisión es de ella.
- El texto provisional de los cursos se redacta en la voz de marca, marcado como a confirmar.
- **El catálogo actual de cursos es un placeholder** (tres cursos de demostración). Ella ya anotó que reorganizará y enviará: el **curso de los rituales**, el **curso de las esencias**, y la separación entre **cursos gratuitos y de pago**, además de las **grabaciones de los rituales** (ya envió algunos antes, que dice reorganizar). Hasta entonces los cursos reales no se pueden cargar; la estructura sí.
- **Estudiar** [idea de los audios: «de pronto, para estudiar»]: la lección y la página del curso (atmósfera `study`) ofrecen una escucha de fondo (agua, bosque, pájaros) con el mismo reproductor, sin cambiar de atmósfera. Entra en la Fase 2 si hay pistas.

## 9. Registro de materiales provisionales
Lo que ella pide («identificar cuáles reemplazar»), generado y no escrito a mano:
- Estado `provisional` en `photography-status.js`; el brief lista «Pendientes de reemplazar antes de publicar».
- Pistas con `license: 'provisional'` y videos `soon` aparecen en la misma lista.
- Una guarda de test impide marcar como publicable algo provisional o sin licencia.

## 10. Variedad, transiciones, navegación y móvil [Marisol, puntos 6 y 7]

**Ritmo de la Home** [Mi decisión, a validar en la Fase 2]: hero (noche) → frecuencia del día (`dawn`) → tienda (`store`) → bento de realms (noche) → Marisol (`marisol`) → pie. Alterna paisaje amplio, fotografía real, producto, video y bloque de lectura.

**Transiciones**: §4.6, más entradas por scroll con el escalonado existente. Sin parallax ni efectos que muevan texto mientras se lee o se compra.

**Navegación**
- Indicador explícito de **dónde estoy**: el nombre de la sección actual junto al botón de menú en el header (móvil y escritorio), además de `aria-current`.
- El botón de menú dice «Menú» con su palabra, no sólo el icono.
- El modal de menú ya lista los nombres con su emoción y el actual marcado; se conserva.

**Móvil (390 px)**: el reproductor, WhatsApp y los controles laterales no pueden tapar texto, precio ni botón. Criterios: el contenido reserva el espacio inferior de los fijos; en rutas de compra el dock arranca recogido; ningún botón de compra queda bajo un flotante. Se verifica con capturas a **1440 / 1280 / 768 / 390**.

## 11. Qué entra ahora y qué depende de ella (para responderle)

| # | Ajuste | Entra ahora (código) | Depende de lo que entregue | Decisión suya pendiente |
|---|---|---|---|---|
| 1 | Ambientes | Sistema de atmósferas, tres muestras, resto de atmósferas, selector manual, imágenes provisionales | Fotografía propia o licenciada de cada ambiente, de encuentros y de ella | Confirmar el carácter de cada atmósfera sobre la muestra |
| 2 | «¿Cómo llegas hoy?» | Registro, ocho estados, respuesta visual y sonora, alternativas y recorrido entre ellas, «otra opción», check-in en Home, guía de respiración visual | Pistas reales para cada alternativa; su video respirando | Aprobar la tabla de §5.3 y el vocabulario de §5.2 |
| 3 | Música | Motor real con capas, 5 tipos, explicaciones y guía de escucha por pista, volumen, muestras, continuidad; frecuencias y binaurales sintetizados | Melodías, naturaleza (mar, agua, bosque, aves), celta y **prácticas guiadas con su voz**, con licencia | Qué pistas hay al lanzamiento |
| 4 | Tienda | Enlace «Tienda», bloque en Home, galería y datos de producto | **Ella hará las fotos** de los productos reales; la lista real con tamaño y contenido | Catálogo de lanzamiento |
| 5 | Videos y cursos | Registro, `VideoSlot` «Próximamente», estructura de curso, módulos | Los cuatro tipos de video; **curso de rituales, curso de esencias, cursos gratuitos y de pago**, y sus grabaciones; qué aprende, qué incluye, modalidad y precio | Qué es gratuito y qué se publica al lanzamiento |
| 6 | Dinamismo | Ritmo claro/oscuro, transiciones | Material para alternar | — |
| 7 | Navegación y móvil | Todo | — | — |

### Decisiones abiertas

| # | Pregunta | Para | Lo que asumo mientras tanto |
|---|---|---|---|
| D1 | ~~¿De dónde salen las imágenes de las tres muestras?~~ **Cerrada:** provisionales generadas con la línea visual del sitio, marcadas para reemplazar; los productos quedan pendientes de las fotos reales de Marisol | Sergio | — |
| D2 | El rojo del mar: «evitar rojo intenso» (texto) frente a «el mar real, rojo» (audio) | Marisol | Atardecer natural de reflejos rojizos y ámbar, sin saturar |
| D3 | ¿Aprueba el vocabulario de ocho estados y la tabla de §5.3? | Marisol | Los que figuran |
| D4 | ¿La pieza celta es una melodía destacada o una sección propia? | Marisol | Melodía destacada con su texto |
| D5 | «Cómo te sientes al empezar y al finalizar»: ¿un segundo check-in al cerrar una escucha? | Marisol | No se incluye |
| D6 | ¿La elección manual de ambiente debe aplicar también a Academia, Tienda, Experiencias y Sobre Marisol? | Marisol | No: conservan su identidad |
| D7 | Qué pistas, videos, cursos y productos están en el lanzamiento y cuáles son «Próximamente» | Marisol | Todo lo que no entregue, «Próximamente» |
| D8 | ¿Cómo revisa las muestras (enlace de vista previa público)? | Sergio | Fuera del repositorio |

## 12. Fases
- **Fase 0 — Fundaciones.** Enmienda de contratos (`AGENTS.md`, spec editorial, `DESIGN.md`, `Branding/`). Tokens semánticos: sustituir los literales `ivory/void/gold` que escapan del sistema. `AtmosphereProvider`/`Scope`, capa de fondo con fundido, guarda de contraste. Enlace «Tienda», indicador de sección y «Menú» en el header: es barato y no depende de nada.
- **Fase 1 — Tres muestras.** `dusk`, `dawn` y `store`: fondo, luz, tarjetas, botones, reproductor y texto, con el selector manual, en Resonario, resultado de Descúbrete, Tienda, detalle de producto y el bloque de Home. El sonido de la muestra es el del drone re-afinado por atmósfera; el motor real entra en la Fase 2. La muestra de tienda usa `atmosphere.store` (escenario sin producto) y las ocho imágenes de producto ya publicadas, que son provisionales: los productos reales son de Marisol y están pendientes. **Puerta: ella las revisa en computador y celular antes de seguir.**
- **Fase 2 — Extensión**, una línea por plan: (a) resto de atmósferas, incluido `forest`, (b) motor de audio, catálogo de escucha y guía por pista, (c) «¿Cómo llegas hoy?» con sus ocho estados, el recorrido entre alternativas y la guía de respiración, (d) tienda y galería, (e) videos y cursos, (f) ritmo de la Home y pasada móvil.

## 13. Riesgos
- **Contraste** con 179 usos de texto de marfil: el riesgo mayor. Mitigado por Fase 0 y la guarda de §4.8.
- **Imágenes provisionales generadas** que no se parezcan a los paisajes reales que ella enseña (bosque otoñal, cascada con helechos, aurora): puede decepcionar en la muestra. Ver D1.
- **Rendimiento**: más imágenes por pantalla, el motor de audio y, si llega, video en loop. Se mantienen los presupuestos de `performance.md` (AVIF, `sizes`, `priority` sólo en el primer viewport).
- **Guardas de test** que cambian con el contrato: `palette`, `branding-tokens`, `photography-brief`, `editorial-*`, `z-layers`. Se actualizan al nuevo contrato sin debilitarlos.
- **Migración del diario**: pasar el ánimo de índice a id estable sin perder las entradas guardadas en el navegador de quien ya usó la v1.
- **Transcripción con errores de dictado**: los audios pueden estar mal transcritos. Lo que depende de un matiz dudoso (el rojo del mar, el diario «al empezar y al finalizar») está en las decisiones abiertas en lugar de asumirse.
- **Alcance blando**: los audios son ideas, no requisitos cerrados. El riesgo es que crezcan sin tope; por eso cada una tiene fase y se puede posponer sin romper los siete ajustes.
- **Síntesis de naturaleza** (mar, lluvia): sirve para validar la experiencia, no para publicar; queda como `provisional`.
- La **revisión de ella** necesita un enlace público de vista previa; ese alojamiento queda fuera del repositorio.

## 14. Qué queda al implementador
Valores concretos de cada paleta (se calibran contra la fotografía real y se aprueban en las muestras, con la guarda de contraste), nombres de tokens, forma exacta del selector manual, el diseño del panel de respuesta, si el fundido de fondo es una o dos capas, estructura interna del motor de audio y la redacción provisional de explicaciones y cursos, siempre en ES y EN con la voz de la marca.
