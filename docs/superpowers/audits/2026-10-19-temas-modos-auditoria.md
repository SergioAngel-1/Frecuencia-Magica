# Auditoría de temas: modos, coherencia por vista, loader y rendimiento (2026-10-19)

Alcance: el cambio de tema (la «atmósfera»). Sólo lectura; no se tocó código. Línea base: `master` + `feat/temas-armonia-panel` (65334aa), 908 tests en verde en `tests/lib`.

## 1. Cómo está hoy el modelo (y por qué confunde)

Hay **un solo dato**, `choice` (`stores/atmosphere-store.ts`, `fm.atmosphere`), y tres cosas distintas lo escriben:

| Quién escribe `choice` | Origen (`ShiftSource`) | Ceremonia |
| --- | --- | --- |
| Tarjeta de tema en el selector del header | `manual` | confirma + cruce |
| Estado del ánimo en portal, Home y Descúbrete (`useArrival`) | `feeling` | cruce directo (en el portal, sin cruce) |
| «Según cómo te sientes» (`choice = null`) | `manual` | confirma + cruce |

Consecuencias:

1. **«Según cómo te sientes» no tiene que ver con sentir.** Es el modo «cada lugar propone el suyo» (`PLACE_ATMOSPHERE`). Su rótulo (`atmospheres.switcher.auto`) promete emoción y entrega geografía. El título del panel («Cómo te sientes») y las cinco tarjetas con nombres-emoción refuerzan la mezcla: elegir «Descanso» es a la vez un tema manual y una emoción.
2. **Una emoción elegida cancela el automático sin decirlo.** Elegir «Cansancio» en el portal o en la Home escribe `choice = dusk` y persiste entre visitas: desde ese momento ninguna vista propone su tema (Academia ya no es bosque) y el selector marca «Descanso» como si la persona lo hubiera elegido a mano. `activeFeeling` sólo reconstruye la emoción por coincidencia de tema (si dos emociones comparten tema —calma/alegría→dawn— no se sabe cuál fue).
3. **Mi Santuario no cierra el círculo.** Su `journal-panel` usa `ArrivalCheckIn` con las mismas ocho emociones pero **no cambia el tema** (sin `atmosphere`, sin `useArrival`); sólo `SanctuaryFeeling` nombra la emoción si el tema coincide. Los puntos donde sí hay selector con cruce: portal, Home, Descúbrete (intenciones).
4. **La reactividad a las frecuencias no existe.** Lo único que une audio y tema es el sentido contrario: la nota del drone sigue al tema (`use-ambient-audio.ts` → `baseNoteFor`). Ni el reproductor ni el tipo de pista (`AudioKind`: melody/nature/frequency/binaural/guided) mueven el tema; Resonario es `night` fijo.
5. **Bugs de `night` cableado en `useArrival`** (`hooks/use-arrival.ts`): `atmosphere = mounted && choice ? choice : 'night'` y `other()` usa `choice ?? 'night'`. En modo automático (sin `choice`) el panel y «Elegir otra opción» parten de la noche aunque el tema visible sea luna/bosque/amanecer. Debería usar `useAtmosphere().atmosphereId` (ya montado, sin desajuste si se guarda tras `mounted`).

## 2. Propuesta: dos modos que no se pisan

Un solo selector (el del header), dos modos excluyentes + la elección directa de tema como detalle del segundo:

- **Automático** (por defecto, `mode: 'auto'`): el sitio decide.
  - Por vista: `PLACE_ATMOSPHERE` (sin cambios).
  - Por escucha (nuevo): en Resonario y mientras suena una pista, el tema sigue al *tipo* y a la *frecuencia* de la pista, no a la emoción. Mapa propuesto (editable en `config/`): `nature → forest`, `melody → dusk`, `guided → dawn`, `binaural → moon`, `frequency → night` (cósmico; Hz bajos→night, altos→moon si se quiere granularidad con `hz`). Al parar el sonido, vuelve al tema del lugar. Cruce **ligero** (fundido, sin velo ni frase): es ambiente, no ritual.
- **Según cómo te sientes** (`mode: 'feeling'`): la persona declara una emoción (las ocho de `ARRIVALS`); el tema es global, persiste, y se cruza con la ceremonia completa (onda + frase). Aquí viven las emociones: portal, Home, Descúbrete **y Mi Santuario** (el check-in del diario pasa a proponerlo). Cambiar de vista no cambia el tema.
- Elegir uno de los cinco temas a mano queda como `feeling` con el nombre-emoción del tema (los cinco nombres ya son emociones: Consuelo, Descanso, Despertar, Recogimiento, Arraigo), no como un tercer modo.

Datos: `atmosphere-store` pasa de `choice` a `{ mode: 'auto' | 'feeling', feeling: ArrivalKey | null, theme: AtmosphereId | null }` (versión 2, con migración: `choice` no nulo → `feeling`/`theme`; nulo → `auto`). `resolveAtmosphere(place, state, listening?)`: `feeling → theme`; `auto → listening ?? PLACE_ATMOSPHERE[place]`. El script de arranque se regenera desde la config (sólo lee `mode`/`theme`; la escucha no existe antes de hidratar). `planShift`: `source: 'auto'` aplica con fundido ligero, `feeling` cruza, `manual` confirma.

Copy a rehacer (ES/EN): el título del panel («Cómo te sientes») pasa a ser el del modo; «Automático» describe «cada lugar y cada sonido proponen su luz»; «Según cómo te sientes» muestra la emoción activa. `atmospheres.switcher.auto` deja de usar la palabra «sientes».

## 3. Coherencia automática: cada vista con su tema

`PLACE_ATMOSPHERE` hoy, con mi lectura:

| Vista | Tema | Veredicto |
| --- | --- | --- |
| Portal, Home (`inicio`), Acceso | night | Coherente: umbral y cielo cósmico. |
| Resonario | night | Coherente como base; es donde entra la reactividad por escucha (§2). |
| Descúbrete, Mi Santuario | moon | Coherente (hacia dentro). Ojo: Descúbrete **cambia** a dawn/dusk/forest al mostrar su resultado en modo sentir: correcto, es una emoción. |
| Academia | forest | Coherente (aprender entre árboles). |
| Tienda (y carrito/compra), Sobre Marisol | dawn | Coherente (escoger con luz de mañana). |
| Experiencias | dusk | Coherente (celebrar al atardecer). |
| `/kit`, 404 raíz, `error.tsx` | — | El 404 de raíz queda fuera del proveedor (ya documentado y guardado por test); `kit` cae en `portal`/night. Aceptable. |

Riesgos de coherencia (no bugs): (a) Home y Resonario comparten noche con el portal, así que de portal→home→resonario nunca cambia nada: la «historia de cinco temas» sólo empieza en Descúbrete; (b) los lugares con tema claro (dawn en Tienda) son el único contraste de esquema `light` y el cruce desde Resonario/Academia es el más duro en contraste (ver §4.3); (c) sadness→night en el portal no produce cambio visible (`planShift` aplica porque `resolved === current`) y aun así fija `choice`.

## 4. Auditoría técnica

### 4.1 Loader (el bug que describes)

- `RouteTransition` pinta la espera con `background: var(--fm-night)` fijo y `LoadingScene` → `EditorialImage` → `ThemedPhoto` decide la variante con `useAtmosphere()`, que lee `usePathname()`. Durante la espera `pathname` sigue siendo el **de origen**, así que el loader sale con el tema de la vista que se deja (o con la base nocturna sobre un fondo nocturno) y, en el commit de ruta, el tema salta al del destino: se ven dos temas mezclados.
- Corrección: el listener de clics ya conoce `anchor.pathname`; resolver `placeFromPathname(destino)` → `resolveAtmosphere(place, estado)` y pintar el overlay con `data-atmosphere={temaDestino}` (como hace `AtmosphereShiftVeil`) y `background: var(--atmo-bg)`; `ThemedPhoto` necesita un tema forzado (prop `theme` o contexto) para que la esfera de `states.loading` use la variante del destino. Si el modo es `feeling`, el tema no cambia con la ruta y el loader usa el global.
- Carga directa (`loading.tsx` → `RealmLoading`, servidor): `ThemedPhoto` sólo monta la variante tras `useMounted`. Con red lenta —justo cuando se ve el loader— el JS aún no hidrató y, en un tema ≠ night, la regla de `globals.css` ya ocultó la base y no hay variante: **el loader sale sin imagen** hasta hidratar. Mejor: en el loader, sin variante montada, no ocultar la base (o usar el degradado del tema + orbe).
- El loader y la ceremonia de emoción deben ser dos lenguajes distintos: loader = espera por ruta con el tema de **llegada** (automático); velo de cruce = ceremonia de emoción. Ya están separados en código (`RouteTransition` omite la espera si `portalBusy`; no lo hace si `AtmosphereShift` está en marcha: añadir esa guarda para que no coexistan los dos velos, ambos `z-veil`/`z-portal`).

### 4.2 Peso de imágenes (lo más caro)

- `public/editorial`: 82 MB, 1006 AVIF (cinco anchos por imagen); 122 variantes de tema; 18 archivos > 300 KB (máx. 463 KB, `resonario-kind-banner-frequency-1672`).
- **Doble descarga en todo tema ≠ night.** `ThemedPhoto` renderiza siempre la base nocturna y sólo le pone `opacity: 0` por CSS (`globals.css`, bloque `data-photo-themes`): el navegador igual la descarga. En un héroe `priority` además se emite un `<link rel="preload">` de la base nocturna aunque el tema sea dawn. Cada foto con variante cuesta ≈ 2× en cualquier tema distinto de noche.
- Corrección propuesta: el servidor sí conoce el tema por defecto del lugar (la ruta está fija), así que debe renderizar **la imagen del tema de ese lugar** (`PLACE_ATMOSPHERE`) y sólo cuando la elección guardada difiera, intercambiar tras montar. Sin base oculta, sin preload erróneo. Con `mode: 'feeling'` guardado la elección difiere con frecuencia y las páginas son estáticas (el servidor no ve `localStorage`): para ese caso, la base va sin `priority` y con `fetchPriority="low"` mientras exista variante, y el script de arranque lanza el preload de la variante del tema elegido.
- No hay **precarga durante el cruce**: las variantes del tema destino sólo empiezan a pedirse cuando `applyChoice` corre (fin de `cover`, 1000 ms). Quedan 1700 ms de `hold` y, si no llegaron, el velo se levanta sobre el degradado y las fotos entran con fundido (parpadeo). Corrección: al aceptar el cambio (`confirming → in`), precargar las variantes del destino de todos los `ThemedPhoto` montados (registro en un store/ref) y que `hold` espere a `decode()` con tope (~2,5 s) antes de `out`.
- Descubrimiento adicional: el cambio automático entre rutas (cambio de lugar) tiene el mismo problema sin velo: pathname cambia → tokens saltan → variantes empiezan a descargar. Se resuelve con la misma precarga, hecha en el clic (donde ya se conoce el destino).
- Otros: `atmosphere-forest-autumn` está publicado y sin cablear (hallazgo abierto R32): ~390 KB en el repo sin uso; el manifiesto (`editorial-assets.generated.ts`, 122 slots + anchos) lo importa el loader en cliente: medir si pesa en el bundle (First Load JS ya está 280–309 kB sobre el presupuesto de 200 kB).

### 4.3 Motor y cruce

- `engine-profile`/`canvas-pause`: correcto; ningún tema baja de 0,34, el bucle del canvas nunca se detiene en la práctica. El worker recibe `{ type: 'theme' }` al cambiar: el trabajo es de pintado, no de descarga; medir en móvil (pendiente conocido de las esferas).
- `AtmosphereProvider`: el fundido de color (`data-theme-switching`, 0,9 s) y el velo (hold 1,7 s) se apilan: con el velo tapando, el fundido de tokens se gasta bajo él (trabajo de repintado total sin ser visible). En cruce con velo conviene saltarse `beginThemeSwitch`; mantenerlo sólo para el cambio automático sin velo.
- Accesibilidad: la región `aria-live` anuncia el nombre-emoción en cada cambio, incluido el automático por ruta/escucha. Con el modo automático reactivo (§2) hay que no anunciarlo (o hacerlo una sola vez por sesión), o el lector de pantalla hablará en cada pista.

### 4.4 Robustez menor

- `ThemedPhoto`: `loaded` y `failed` son estado por instancia; si cambian dos temas seguidos antes de cargar, la variante intermedia queda en memoria sin cancelar (el `Image` se desmonta pero la petición sigue). Aceptable; la precarga con tope la volverá irrelevante.
- `useAtmosphereShift` lee `usePathname()` en cada componente que lo usa: tres puntos de entrada y el selector crean cuatro suscripciones a la ruta; barato, no tocar.
- `planShift` con `busy`/`atPortal` aplica sin ceremonia y **sin guardar la emoción**: tras el portal no hay registro de que el tema vino de una emoción (sólo `useArrivalStore.key`, que sí se guarda). Con el rediseño de §2 el modo `feeling` guardará la emoción explícita.

## 5. Plan de trabajo (cada paso, un commit; implementación vía subagentes de opencode)

1. **Loader con el tema de llegada** (rápido, aislado): destino en `RouteTransition`, `theme` forzado en `ThemedPhoto`, fondo `--atmo-bg`, guarda contra el velo de cruce; test de la función pura destino→tema.
2. **Bugs de `night` en `useArrival`** (`atmosphere`, `other`).
3. **Imágenes**: servidor pinta el tema del lugar (sin base oculta ni preload erróneo) + precarga del destino en el clic y en `confirming→in` + `hold` condicionado a `decode()`.
4. **Modos** (`mode`, `feeling`, `theme`, migración v2, `resolveAtmosphere`, boot script, `planShift`, copy ES/EN, selector con dos secciones, Mi Santuario con su cruce, aria-live acotado).
5. **Automático por escucha**: mapa `AudioKind → tema` en `config/`, hook que lo deriva del reproductor, cruce ligero, vuelta al lugar al parar.
6. Documentar en `DESIGN.md` § Atmósferas y `CLAUDE.md` § Temas globales; actualizar tests de guardia (`themes-global`, `atmosphere-boot`, `atmosphere-shift-writers`, `theme-switcher-options`).

Decisiones del producto antes del paso 4–5: ver el resumen de la conversación.
