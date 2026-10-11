# Isotipo 3D de Frecuencia Mágica — spec del modelo (Blender)

**Fecha:** 2026-10-10
**Estado:** pendiente de revisión
**Ejecuta:** un modelo conectado al MCP de Blender
**Alcance:** sólo el activo 3D (`.blend` + `.glb`). La integración en la web —sustituir los discos por el isotipo girando, p. ej. en Mi Santuario— es otro spec y otro plan.

## 1. Objetivo

Un modelo 3D del isotipo cuya vista frontal sea **idéntica al logo real** (`frontend/public/logo.png`), con una única excepción decidida: **sin los cuatro arcos dorados exteriores**. Debe girar lenta e indefinidamente sobre su eje vertical y verse terminado desde cualquier ángulo.

Se parte del prototipo `3D Prototypes/Isotipo Frecuencia mágica 3D contraste` (GLB sin extensión), que es el más cercano, y se corrige hasta cumplir los criterios de la sección 7.

## 2. Fuentes

| Qué                                | Dónde                                                  | Nota                                                                                                                              |
| ---------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Logo real (única referencia)       | `frontend/public/logo.png`                             | 500 × 500 px, RGBA. No hay vector ni versión mayor: 1 px = 0,006 U, y ese es el límite de precisión                               |
| Prototipo de partida               | `3D Prototypes/Isotipo Frecuencia mágica 3D contraste` | 5 mallas, 2 materiales, 920 kB                                                                                                    |
| Variante con los elementos menores | `3D Prototypes/Isotipo Frecuencia Mágica 3D Completo`  | Misma estrella y onda; añade estrella inferior, 5 puntos y arcos. Sirve de cantera de piezas                                      |
| Variante con la paleta exacta      | `3D Prototypes/Isotipo Frecuencia Mágica 3D`           | Sus materiales ya usan `#D8B978` y `#96C6BC`                                                                                      |
| Variante plana                     | `3D Prototypes/Isotipo Frecuencia Mágica 3D acostado`  | Otro modelado (tumbado, nodos con nombre). Es el único **no espejado**, pero sus proporciones se alejan más (IoU 0,21). No se usa |
| Herramientas de medida             | `3D Prototypes/analysis/`                              | `render.py`, `measure.py`, `wave.py` y los renders del prototipo                                                                  |

## 3. Sistema de medida

Todas las cotas de este documento van en **U**, con estas convenciones:

- **U = ancho de la estrella principal** (de punta izquierda a punta derecha). En el logo, 169 px; en el prototipo, 1,717 unidades de Blender.
- **Origen = cruce de los brazos de la estrella.** En el logo, el píxel (250, 157).
- **x hacia la derecha, y hacia abajo** (convención de imagen). En Blender: `X = x`, `Z = −y`, profundidad en `Y`.
- Las cotas salen de `measure.py` y `wave.py` sobre el logo; el error de lectura es de ±0,006 U (1 px).

## 4. Diferencias entre el prototipo «contraste» y el logo real

Medido con un render ortográfico frontal a 1000 px, alineado con el logo por la estrella. Sin contar los arcos, la silueta del prototipo coincide con la del logo en un **IoU de 0,425**. La estrella está bien; casi todo el error viene de lo demás.

### D1 — Está espejado

Visto de frente (eje +Z de glTF, −Y en Blender), el prototipo muestra el logo en espejo horizontal: el rombo de la onda queda a la izquierda y el zigzag a la derecha. En el logo, el zigzag va a la izquierda y el rombo a la derecha. Las variantes «base» y «Completo» comparten el defecto.

### D2 — Faltan elementos y sobran dos

| Elemento del logo                            | En «contraste»                                                                                      |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Estrella inferior hueca (4 puntas, contorno) | Falta. Existe en «Completo», pero un 43 % más grande (0,238 U frente a 0,166 U) y 0,09 U más arriba |
| 9 puntos dorados                             | Faltan todos. «Completo» tiene 5, en otras posiciones                                               |
| Destello macizo de 4 puntas a la izquierda   | Falta                                                                                               |
| 2 destellos pequeños bajo la onda            | Faltan                                                                                              |
| —                                            | Sobra un destello **hueco** arriba, en (+0,547, −0,427), de 0,167 U: el logo no tiene nada ahí      |
| —                                            | Sobra un destello hueco en (−0,691, +0,840), de 0,093 U: tampoco está en el logo                    |
| 4 arcos exteriores                           | No están. **Correcto: se excluyen a propósito**                                                     |

### D3 — La estrella es fiel; su remate no

- Silueta de la estrella: coincide. Punta superior en −0,70 U (logo −0,69 U); ancho del fuste 0,088 / 0,057 / 0,025 U a 0,3 / 0,6 / 0,9 U de altura (logo 0,083 / 0,053 / 0,030 U).
- Las dos esferas del remate están **fundidas con el fuste**, más grandes y más arriba: la grande, centro en ≈ +1,02 U y Ø ≈ 0,14 U (logo: +1,151 U y Ø 0,10 U); la pequeña, ≈ +1,14 U y Ø ≈ 0,09 U (logo: +1,269 U y Ø 0,06 U).
- En el logo el fuste termina en punta en ≈ +1,05 U y las esferas quedan separadas de él y entre sí.

### D4 — La onda no sigue el trazado

Comparando el prototipo ya espejado:

| Cota                             | Logo                                                                      | Prototipo                                                   |
| -------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Extensión horizontal             | −1,325 … +1,314 U                                                         | −1,141 … +1,280 U (la cola izquierda se queda 0,18 U corta) |
| Hueco alrededor del fuste        | 0,12 U (de −0,06 a +0,065)                                                | 0,34 U (de −0,178 a +0,164)                                 |
| Línea base, izquierda / derecha  | +0,624 / +0,624 U                                                         | +0,627 / +0,559 U: la cola derecha sube 0,07 U              |
| Picos del zigzag izquierdo       | (−0,544, +0,426) (−0,367, +0,254) (−0,207, +0,361)                        | (−0,613, +0,472) (−0,452, +0,316) (−0,305, +0,415)          |
| Valles del zigzag izquierdo      | (−0,462, +0,858) (−0,272, +0,775) y descenso final hasta ≈ (−0,06, +1,02) | (−0,542, +0,828) (−0,367, +0,749) (−0,167, +0,972)          |
| Pico del lado derecho            | (+0,207, +0,379)                                                          | (+0,288, +0,345)                                            |
| Rombo: punta superior / inferior | (+0,574, +0,320) / (+0,574, +0,923)                                       | (+0,624, +0,271) / (+0,621, +0,847)                         |
| Grosor del trazo en las colas    | 0,012 U en ambas                                                          | 0,0085 U (izquierda) y 0,003 U (derecha)                    |
| Área del zigzag izquierdo        | 0,0806 U²                                                                 | 0,0567 U² (trazo un 30 % más fino)                          |

Causa conocida de la cola inclinada: el nodo `Mesh_0.005` lleva una rotación de 5° sobre el eje vertical. El zigzag entero está desplazado unos 0,07–0,10 U hacia fuera.

### D5 — Color y material

|      | Logo (medio · claro · oscuro)     | Token de marca | Prototipo                            |
| ---- | --------------------------------- | -------------- | ------------------------------------ |
| Oro  | `#D4B26F` · `#F9DCA1` · `#AD8840` | `#D8B978`      | `#CDA44A`, más saturado y anaranjado |
| Onda | `#5F9792` · `#8EBBB2` · `#386E6A` | `#96C6BC`      | `#2477AB`: es **azul**, no turquesa  |

- Oro: metálico 0,47 y rugosidad 0,01, casi un espejo. Sin un entorno que reflejar se ve plano y oscuro.
- Onda: usa `KHR_materials_clearcoat` y `KHR_materials_sheen` (brillo blanco). De ahí el canto blanquecino al girar.

### D6 — Volumen

- Profundidad de la estrella: 0,234 U. De la onda: 0,24 U en una mitad y 0,31 U en la otra. La onda es **más gruesa que la estrella**, y sus dos mitades no miden lo mismo.
- El trazo de la onda mide 0,012 U de ancho y hasta 0,31 U de fondo: de frente es una línea; a 45° es una cinta ancha que tapa la estrella.
- Un destello está adelantado 0,19 U respecto al plano del resto y flota delante.

### D7 — Malla y exportación

- La estrella (`Sphere.001`) tiene 24 158 vértices y 13 436 triángulos para una forma de 16 facetas.
- Escalas sin aplicar (0,073 en la estrella; 0,29 y 0,49 en los destellos).
- Nombres genéricos (`Sphere.001`, `Cube`, `Mesh_0.005`).
- El origen no está en el eje del fuste: el centro de la caja queda 0,09 U a un lado.

## 5. Modelo objetivo

### 5.1 Inventario y cotas (del logo)

Centro y tamaño de cada elemento, en U. `Ø` es diámetro; `w × h`, ancho por alto.

**Oro**

| Nombre      | Elemento                                       | Centro (x, y)      | Tamaño                                                                    |
| ----------- | ---------------------------------------------- | ------------------ | ------------------------------------------------------------------------- |
| `Star`      | Estrella de 8 puntas con fuste                 | (0, 0) en el cruce | x de −0,49 a +0,51; punta superior en −0,69; fuste en punta hasta ≈ +1,05 |
| `Sphere_L`  | Esfera grande                                  | (+0,003, +1,151)   | Ø 0,10                                                                    |
| `Sphere_S`  | Esfera pequeña                                 | (+0,006, +1,269)   | Ø 0,06                                                                    |
| `LowerStar` | Estrella de 4 puntas **hueca** (sólo contorno) | (+0,006, +1,447)   | 0,166 × 0,183                                                             |
| `Spark_01`  | Destello macizo de 4 puntas                    | (−0,595, +0,186)   | 0,10 × 0,10                                                               |
| `Spark_02`  | Destello pequeño                               | (−0,364, +1,107)   | 0,041 × 0,047                                                             |
| `Spark_03`  | Destello pequeño                               | (+0,358, +1,124)   | 0,030 × 0,036                                                             |
| `Dot_01`    | Punto                                          | (−0,601, −0,136)   | Ø 0,04                                                                    |
| `Dot_02`    | Punto                                          | (+0,604, −0,136)   | Ø 0,036                                                                   |
| `Dot_03`    | Punto                                          | (+0,580, +0,186)   | Ø 0,033                                                                   |
| `Dot_04`    | Punto                                          | (−0,370, +0,148)   | Ø 0,033                                                                   |
| `Dot_05`    | Punto                                          | (+0,405, +0,186)   | Ø 0,03                                                                    |
| `Dot_06`    | Punto                                          | (−0,388, −0,320)   | Ø 0,027                                                                   |
| `Dot_07`    | Punto                                          | (+0,408, −0,317)   | Ø 0,027                                                                   |
| `Dot_08`    | Punto                                          | (−0,615, +1,018)   | Ø 0,024                                                                   |
| `Dot_09`    | Punto                                          | (+0,550, +1,065)   | Ø 0,024                                                                   |

Los elementos de menos de 0,05 U ocupan 4–8 px en el logo: antes de modelarlos, ampliar el PNG y confirmar si cada uno es punto redondo o destello de cuatro puntas.

**Turquesa**

| Nombre   | Elemento                           | Cotas                                                                                                                                                                                   |
| -------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Wave_L` | Cola izquierda + zigzag            | De x = −1,325 hasta ≈ −0,06. Línea base en y = +0,624. Picos y valles según la columna «Logo» de D4                                                                                     |
| `Wave_R` | Subida, rombo hueco y cola derecha | De x ≈ +0,065 hasta +1,314. Pico en (+0,207, +0,379). Rombo de cuatro puntas cóncavas con vértices superior e inferior en (+0,574, +0,320) y (+0,574, +0,923). Línea base en y = +0,624 |

El trazo de la onda mide 0,012 U en las colas y se afina hacia los extremos. Su grosor a lo largo del zigzag y del rombo se calca del logo, no se supone constante.

**No se modela:** los cuatro arcos exteriores.

### 5.2 Método de trazado

Calcar, no reinterpretar. El logo se carga en Blender como imagen de referencia en la vista frontal, escalada para que la estrella mida 1 U y centrada en el cruce de brazos. Cada silueta se traza sobre ella con curvas o vértices y se comprueba con `measure.py` antes de darle volumen.

La estrella del prototipo se conserva: su silueta ya coincide. Se le aplican el espejo (D1), la limpieza de malla (D7) y el nuevo fondo (5.3), y se le separan las esferas.

### 5.3 Volumen

El logo es dibujo de línea. El volumen debe leerse como joya fina, no como bloque.

| Elemento                        | Forma                                                                                            | Fondo máximo                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| `Star`                          | Doble pirámide facetada: arista viva del centro a cada punta, como las facetas pintadas del logo | 0,12 U en el centro, hasta 0 en las puntas                      |
| `Sphere_L`, `Sphere_S`, `Dot_*` | Esferas                                                                                          | Su diámetro                                                     |
| `Wave_L`, `Wave_R`              | Hilo de sección redondeada que sigue el trazo                                                    | Igual al ancho del trazo en cada punto, con un máximo de 0,03 U |
| `LowerStar`                     | Hilo de contorno, hueco                                                                          | 0,02 U                                                          |
| `Spark_*`                       | Doble pirámide de 4 puntas                                                                       | 0,03 U                                                          |

- Todo es **simétrico respecto al plano frontal**: la cara trasera lleva el mismo relieve que la delantera.
- Todos los elementos comparten ese plano medio. Nada flota delante ni detrás.
- Fondo total del modelo ≤ 0,12 U.

Al girar, la cara trasera muestra el logo espejado. Es inherente a un emblema plano que gira y se acepta.

### 5.4 Materiales

Dos materiales, sólo PBR base de glTF (`pbrMetallicRoughness`), sin texturas ni extensiones `KHR_materials_*`:

| Material  | Color base | Metálico | Rugosidad |
| --------- | ---------- | -------- | --------- |
| `FM_Gold` | `#D8B978`  | 0,9      | 0,35      |
| `FM_Teal` | `#96C6BC`  | 0,6      | 0,35      |

Son los tokens de la paleta cerrada del proyecto. Los claros y oscuros que el logo pinta a mano (oro de `#F9DCA1` a `#AD8840`, turquesa de `#8EBBB2` a `#386E6A`) deben salir de la luz sobre las facetas, no de texturas. Metálico y rugosidad son punto de partida: se ajustan en la verificación A6 sin salir de PBR base.

### 5.5 Orientación, origen y escala

- **Frente:** eje +Z de glTF (−Y en Blender). Desde ahí se ve el logo tal cual, sin espejo.
- **Arriba:** +Y de glTF (+Z en Blender).
- **Origen:** sobre el eje del fuste (x = 0), en el plano medio, a media altura de la caja del modelo. El giro en la web será sobre el eje vertical que pasa por el origen.
- **Escala:** 1 U = 1 unidad de Blender. La caja resultante mide ≈ 2,64 × 2,25 × 0,12 U.
- Transformaciones aplicadas: posición, rotación y escala de cada objeto en identidad.

## 6. Entregables

| Archivo                                                                                | Contenido                                                                                    |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `3D Prototypes/isotipo-frecuencia-magica.blend`                                        | Escena de trabajo con los objetos separados y nombrados como en 5.1, bajo un vacío `Isotipo` |
| `3D Prototypes/isotipo-frecuencia-magica.glb`                                          | Exportación para web                                                                         |
| `3D Prototypes/analysis/final-front.png`, `final-three.png`, `overlay-final-front.png` | Renders de verificación y superposición con el logo                                          |

Requisitos del GLB:

- Una escena, un nodo raíz `Isotipo` y **dos mallas**: `Isotipo_Gold` y `Isotipo_Teal` (los objetos se unen por material al exportar: dos llamadas de dibujo).
- Sin animaciones, cámaras ni luces. El giro lo pone la web.
- Normales: planas en la estrella y los destellos (facetas vivas); suaves en esferas e hilos.
- Sin UV, sin texturas, sin colores por vértice.
- **≤ 12 000 triángulos** y **≤ 200 kB** sin comprimir.

## 7. Criterios de aceptación

Se verifican sobre un render ortográfico frontal a 1000 px con fondo transparente (`render.py`), medido contra el logo con `measure.py` (que ya descuenta los arcos).

| #   | Criterio                                        | Umbral                                                                                                                               |
| --- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| A1  | IoU de la silueta frontal con el logo sin arcos | ≥ 0,85 (hoy 0,425)                                                                                                                   |
| A2  | Centro de cada elemento de 5.1                  | A ±0,015 U de su cota                                                                                                                |
| A3  | Tamaño de cada elemento de 5.1                  | A ±8 % de su cota (±0,006 U en los menores de 0,05 U)                                                                                |
| A4  | Inventario                                      | 16 componentes dorados y 2 turquesa en la vista frontal; ninguno de más                                                              |
| A5  | Onda                                            | Cada pico y valle de D4 a ±0,015 U; línea base en +0,624 ±0,01 U en ambas colas; hueco alrededor del fuste de 0,12 ±0,02 U           |
| A6  | Color                                           | Con luz de estudio neutra, el color medio del render frontal queda a ΔE₀₀ ≤ 8 del medio del logo (oro `#D4B26F`, turquesa `#5F9792`) |
| A7  | Sin espejo                                      | En la vista frontal el zigzag queda a la izquierda del fuste y el rombo a la derecha                                                 |
| A8  | Volumen                                         | Fondo total ≤ 0,12 U; todos los elementos centrados en el plano medio; relieve idéntico por ambas caras                              |
| A9  | Origen                                          | El eje vertical por el origen pasa por el fuste (                                                                                    | x   | ≤ 0,005 U) |
| A10 | Exportación                                     | Cumple los requisitos de la sección 6 y pasa el validador de glTF sin errores                                                        |
| A11 | Vista a 45°                                     | En `final-three.png` la onda se lee como un hilo, no como una cinta, y no tapa la estrella                                           |

Si A1 no alcanza 0,85 cumpliéndose A2–A5, manda la precisión del PNG de 500 px: se documenta el valor obtenido y la superposición, y decide el usuario.

## 8. Verificación

```bash
# 1. Render frontal, lateral, cenital y a 45° del GLB (Blender en modo consola)
blender -b --python "3D Prototypes/analysis/render.py" -- \
  "3D Prototypes/isotipo-frecuencia-magica.glb" "3D Prototypes/analysis/final"

# 2. Medidas por elemento, IoU y superposición con el logo
python "3D Prototypes/analysis/measure.py" frontend/public/logo.png \
  "3D Prototypes/analysis/final-front.png"

# 3. Picos, valles y grosor de la onda (cx, cy y U del render: los imprime measure.py)
python "3D Prototypes/analysis/wave.py" frontend/public/logo.png \
  "3D Prototypes/analysis/final-front.png" <cx> <cy> <U>
```

- `measure.py` y `wave.py` necesitan `numpy`, `pillow` y `scipy`.
- `measure.py` acepta el prefijo `flip:` delante de un render para medirlo espejado; el modelo final **no** debe necesitarlo.
- `measure.py` imprime también el color medio de cada material en el render: con él se comprueba A6.
- `render.py` ilumina con un ambiente gris uniforme: es la «luz de estudio neutra» de A6.
- En la superposición, rojo es «sólo logo», azul «sólo modelo» y blanco «coinciden».

## 9. Fuera de alcance

- La integración en la web: componente, carga perezosa, giro, sustitución de los discos, movimiento reducido y presupuesto de rendimiento. Va en su propio spec.
- Los cuatro arcos exteriores.
- Animación dentro del archivo, texturas e iluminación horneada.
- Las otras tres variantes: no se corrigen.

## 10. Riesgos

- **Referencia de 500 px.** Los elementos menores miden 4–8 px y el trazo de la onda, 2 px. Las cotas de esos elementos tienen un error relativo alto. Un logo vectorial o de mayor resolución, si aparece, sustituye a las tablas de 5.1.
- **Hilos muy finos en pantalla.** A tamaño de tarjeta, un hilo de 0,012 U puede quedar por debajo de un píxel y parpadear al girar. Si ocurre, se resuelve en la integración (tamaño mínimo o suavizado), no engordando el modelo.
- **Color bajo luz real.** El color percibido depende del entorno de la escena web. A6 fija el punto de partida; el ajuste fino se hará al integrarlo.
