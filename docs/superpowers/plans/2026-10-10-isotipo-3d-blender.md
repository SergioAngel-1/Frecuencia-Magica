# Isotipo 3D de Frecuencia Mágica — plan de ejecución (Blender)

**Fecha:** 2026-10-10
**Spec:** [`../specs/2026-10-10-isotipo-3d-blender-design.md`](../specs/2026-10-10-isotipo-3d-blender-design.md)
**Para:** un agente con acceso al MCP de Blender y a una terminal
**Resultado:** `3D Prototypes/isotipo-frecuencia-magica.blend` y `.glb`, verificados contra el logo real

## Cómo leer este plan

El spec dice **qué** debe ser el modelo y cómo se comprueba. Este plan dice **en qué orden** llegar y **qué debe ser cierto** al final de cada fase. No dicta herramientas, operadores ni código: eso lo decides tú.

**Tu criterio técnico manda en:**

- La técnica de modelado de cada pieza (curvas, malla directa, modificadores, nodos de geometría…).
- Si reutilizas una pieza del prototipo o la rehaces. Rehacer suele ser más rápido que corregir una malla sucia.
- El orden de las tareas dentro de una fase y cómo las agrupas.
- El reparto de triángulos entre piezas, mientras se cumpla el total.
- Los valores finales de metálico y rugosidad, dentro de PBR base.

**No está a tu criterio:**

- Las cotas, el inventario, la orientación, los materiales permitidos y los límites de exportación del spec (secciones 5 y 6).
- Los criterios de aceptación A1–A11 (sección 7 del spec).
- Las puertas de este plan: no se pasa de fase con la puerta en rojo.
- Los cuatro arcos exteriores: no se modelan.

Si una instrucción de este plan choca con el spec, **gana el spec**. Si el spec es imposible de cumplir en un punto, para y repórtalo (ver «Cuándo parar»).

## Reglas de trabajo

1. **Calca, no interpretes.** Toda silueta sale de trazar sobre el logo. Las tablas de cotas del spec son la comprobación, no el método.
2. **Mide antes de dar volumen.** Una silueta que no pasa la medida en plano no la arregla la extrusión.
3. **No toques los originales.** Los cuatro prototipos de `3D Prototypes/` y `frontend/public/logo.png` son de sólo lectura. Trabaja sobre copias.
4. **No modifiques nada fuera de `3D Prototypes/`.** Ni el `frontend/`, ni el spec, ni este plan.
5. **Guarda el `.blend` al cerrar cada fase**, con la escena en un estado que otro agente pueda retomar.
6. **Inspecciona antes de suponer.** Antes de editar un objeto, consulta su estado real en la escena.
7. **Verifica con los números, no con el ojo.** Una captura de la vista sirve para orientarte; aprobar una puerta exige la salida de los scripts de `3D Prototypes/analysis/`.

## Herramientas disponibles

- **MCP de Blender:** ejecutar Python en la escena, resumir objetos, capturar la vista y renderizar.
- **`3D Prototypes/analysis/render.py`:** renderiza un GLB en cuatro vistas ortográficas (frontal, cenital, lateral y a 45°) a 1000 px con fondo transparente. Se ejecuta con Blender en modo consola.
- **`3D Prototypes/analysis/measure.py`:** compara un render frontal con el logo sin arcos. Imprime centro, tamaño y área de cada componente en U, el color medio por material, el IoU y genera una superposición (rojo: sólo logo; azul: sólo modelo; blanco: coinciden).
- **`3D Prototypes/analysis/wave.py`:** imprime picos, valles, línea base y grosor del trazo de la onda.
- Los dos scripts de medida necesitan `numpy`, `pillow` y `scipy`. Si no están, créales un entorno aislado; no instales nada en el sistema.

Puedes ampliar o corregir estos scripts si lo necesitas (por ejemplo, para calcular ΔE o medir un solo elemento). No cambies su sistema de medida: unidad U, origen en el cruce de brazos, `y` hacia abajo.

## Fase 0 — Preparación

**Objetivo:** un entorno que mide lo mismo que midió el spec.

- Comprueba que Blender responde por el MCP y que los scripts de análisis se ejecutan.
- Reproduce la línea base: mide el prototipo «contraste» espejado contra el logo.
- Crea el archivo de trabajo `isotipo-frecuencia-magica.blend` con unidades tales que 1 U sea 1 unidad de Blender.
- Carga el logo como referencia en la vista frontal: la estrella mide 1 U de ancho y el cruce de sus brazos cae en el origen.

**Puerta 0:** la línea base da un IoU de 0,425 ±0,01. Si no, el entorno mide distinto: resuélvelo antes de seguir.

## Fase 1 — Estrella y remate

**Objetivo:** las cuatro piezas del eje vertical, todavía sin volumen definitivo.

- **`Star`:** la silueta del prototipo ya coincide con el logo; decide si la importas y limpias o la retrazas. En cualquier caso debe quedar **sin espejo**, con el fuste terminado en punta y **sin las esferas fundidas**.
- **`Sphere_L` y `Sphere_S`:** separadas del fuste y entre sí, con el centro y el diámetro del spec.
- **`LowerStar`:** estrella de cuatro puntas hueca, sólo contorno.

**Puerta 1:** estas cuatro piezas cumplen A2 y A3, y la superposición no muestra rojo ni azul apreciable en el eje vertical.

## Fase 2 — Onda

**Objetivo:** las dos mitades de la onda. Es la pieza con más error en el prototipo y la más delicada.

- **Rehazla desde el logo.** La del prototipo está desplazada, inclinada y con grosor desigual: no merece corrección.
- **`Wave_L`:** cola izquierda, zigzag y descenso final hasta el fuste.
- **`Wave_R`:** subida desde el fuste, pico, rombo hueco de cuatro puntas cóncavas y cola derecha.
- El grosor del trazo **varía**: fino en las colas, más lleno en el zigzag y el rombo. Cálcalo del logo.
- Las dos colas comparten línea base horizontal.

**Puerta 2:** se cumple A5 completo (picos, valles, línea base y hueco alrededor del fuste) y A7 (zigzag a la izquierda, rombo a la derecha).

## Fase 3 — Destellos y puntos

**Objetivo:** los doce elementos menores.

- Antes de modelar, **amplía el logo** y decide para cada elemento menor de 0,05 U si es punto redondo o destello de cuatro puntas. La tabla del spec da posición y tamaño; la forma la confirmas tú.
- **`Spark_01`–`Spark_03`** y **`Dot_01`–`Dot_09`**, en sus cotas.
- Deja anotado en el informe final qué forma asignaste a cada uno y por qué.

**Puerta 3:** se cumple A4 (16 componentes dorados y 2 turquesa en la vista frontal, ninguno de más) y A2–A3 para estos elementos, con la tolerancia ampliada de los menores.

## Fase 4 — Puerta de silueta

**Objetivo:** confirmar el conjunto en plano antes de invertir en volumen.

- Mide la silueta completa contra el logo.
- Revisa la superposición entera y corrige cualquier pieza con rojo o azul visible.

**Puerta 4:** A1 (IoU ≥ 0,85), A2, A3, A4, A5 y A7 a la vez.

Si A2–A5 se cumplen y A1 no llega, aplica la salida que prevé el spec: documenta el valor y la superposición, y continúa. **No deformes piezas correctas para ganar IoU.**

## Fase 5 — Volumen

**Objetivo:** el relieve de la sección 5.3 del spec, sin alterar la silueta.

- Da a cada pieza su forma y su fondo máximo: estrella y destellos como doble pirámide facetada; onda y estrella inferior como hilo de sección redondeada; esferas y puntos como esferas.
- Todo simétrico respecto al plano frontal y centrado en él.
- Normales planas donde el spec pide facetas vivas; suaves en hilos y esferas.
- Vuelve a medir la vista frontal: el volumen no debe haber movido ninguna cota.

**Puerta 5:** se cumplen A8 y A11, y la Puerta 4 sigue en verde.

Para A11, juzga el render a 45°: la onda se lee como hilo y la estrella sigue siendo la protagonista. Si dudas, el hilo es demasiado grueso.

## Fase 6 — Materiales

**Objetivo:** los dos materiales del spec.

- Crea `FM_Gold` y `FM_Teal` con los colores base de la paleta y asígnalos.
- Sólo PBR base: ni texturas, ni colores por vértice, ni capas de barniz, brillo o transmisión.
- Ajusta metálico y rugosidad hasta cumplir el color medio, partiendo de los valores del spec.
- Elimina cualquier material heredado del prototipo.

**Puerta 6:** se cumple A6 en el render frontal y el archivo contiene exactamente dos materiales.

Si A6 no se alcanza con ningún ajuste dentro de PBR base, repórtalo con el mejor valor obtenido. **No cambies los colores base** para forzarlo.

## Fase 7 — Limpieza y exportación

**Objetivo:** el GLB de la sección 6 del spec.

- Transformaciones aplicadas, objetos nombrados como en el spec y agrupados bajo `Isotipo`.
- Origen sobre el eje del fuste, en el plano medio y a media altura; frente y arriba según el spec.
- Reduce la malla hasta el presupuesto **sin perder silueta**: recorta primero donde no se ve (esferas y puntos diminutos, caras interiores).
- Guarda el `.blend` con las piezas separadas. Para el GLB, une por material en dos mallas: `Isotipo_Gold` e `Isotipo_Teal`.
- Exporta sin animaciones, cámaras, luces, UV ni texturas.

**Puerta 7:** se cumplen A9 y A10, incluidos los límites de triángulos y peso y el validador de glTF sin errores.

## Fase 8 — Verificación final

**Objetivo:** demostrar que el archivo exportado, no la escena, cumple el spec.

- Renderiza el **GLB exportado** con `render.py` y mídelo con `measure.py` y `wave.py`, **sin espejar**.
- Repasa A1–A11 uno por uno contra esas salidas.
- Guarda en `3D Prototypes/analysis/` los renders `final-front.png` y `final-three.png` y la superposición `overlay-final-front.png`.

**Puerta 8:** A1–A11 en verde, o cada excepción documentada con su medida.

## Informe final

Entrega un informe breve con:

- Una tabla A1–A11: umbral, valor obtenido y estado.
- La línea base y el resultado final del IoU.
- Triángulos y peso del GLB.
- La forma asignada a cada elemento menor (fase 3).
- Las decisiones técnicas relevantes: qué piezas se reutilizaron y cuáles se rehicieron.
- Cualquier desviación del spec, con su motivo y su medida.

No declares cumplido un criterio que no hayas medido sobre el GLB exportado.

## Cuándo parar y preguntar

Detente y reporta, en lugar de improvisar, si:

- La Puerta 0 no reproduce la línea base.
- Dos cotas del spec se contradicen entre sí o con el logo ampliado.
- Un criterio sólo puede cumplirse incumpliendo otro.
- El presupuesto de triángulos o de peso no alcanza sin dañar la silueta.
- Cumplir algo exigiría modelar los arcos, usar texturas o extensiones de material, o tocar archivos fuera de `3D Prototypes/`.

En cualquier otro caso, decide y sigue.

## Fuera de este plan

La integración en la web (componente, carga perezosa, giro, sustitución de los discos de Mi Santuario, movimiento reducido y rendimiento) tendrá su propio spec y su propio plan.
