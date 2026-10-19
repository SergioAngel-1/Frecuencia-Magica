# Materiales pendientes

> Generado por `npm run export:pending-materials` (desde `frontend/`) a partir del catálogo de audio, el registro de videos, los productos, los cursos y el brief fotográfico. **No se edita a mano**: `tests/lib/pending-materials.test.ts` falla si se desvía.

Lo que Marisol aún no entrega y que el sitio muestra como «Próximamente» o como provisional. Nada de esto se publica como real hasta que llegue el material con su procedencia (propio, con licencia comercial documentada o sintetizado por nosotros).

## Resumen

| Material | Pendiente |
|---|---|
| Audio con síntesis provisional | 4 |
| Audio «Próximamente» | 5 |
| Videos «Próximamente» | 32 |
| Productos provisionales | 8 |
| Cursos de demostración | 3 |
| Imágenes provisionales | 137 |

## Audio

### Con síntesis provisional (suenan hoy, no se publican)

Texturas y capas sintetizadas por nosotros como relleno. Se sustituyen por grabaciones propias o con licencia comercial documentada antes de publicar.

| Id | Pista | Tipo |
|---|---|---|
| `b1` | Pulso sereno | Binaurales |
| `b2` | Pulso de raíz | Binaurales |
| `n1` | Orilla de mar | Naturaleza |
| `n2` | Lluvia en la ventana | Naturaleza |

### «Próximamente» (sin material)

Sin fuente ni duración: no tienen play, no entran por siguiente ni anterior y no se recomiendan.

| Id | Pista | Tipo | Lleva voz |
|---|---|---|---|
| `n3` | Canto de aves | Naturaleza | no |
| `m1` | Música celta para bajar el ritmo | Melodías | no |
| `m2` | Piano para la pausa | Melodías | no |
| `g1` | Respiración guiada | Prácticas guiadas | sí |
| `g2` | Un momento para ti | Prácticas guiadas | sí |

### Listo para publicar

Con fuente y con procedencia propia, con licencia o sintetizada por nosotros (los tonos de frecuencia). Ninguna pista provisional figura aquí.

| Id | Pista | Tipo |
|---|---|---|
| `a1` | Regreso a la Calma | Frecuencias |
| `a2` | Luz Interior | Frecuencias |
| `a3` | Raíces Profundas | Frecuencias |
| `a4` | Umbral del Sueño | Frecuencias |
| `a5` | Aroma de Cedro | Frecuencias |
| `a6` | Respirar el Cielo | Frecuencias |
| `a7` | Corazón Abierto | Frecuencias |

## Video

Ningún video tiene fuente: cada espacio muestra el póster con «Próximamente», sin play ni reloj.

| Id | Qué entregar |
|---|---|
| `welcome` | Saludo de bienvenida de Marisol (Home) |
| `marisol-intro` | Presentación de Marisol (Sobre Marisol) |
| `breathing-guide` | Marisol respirando con la persona (guía de respiración) |
| `course-intro.c1` | Presentación del curso |
| `course-intro.c2` | Presentación del curso |
| `course-intro.c3` | Presentación del curso |
| `lesson.c1.1–8` | 8 lecciones en video del curso `c1` |
| `lesson.c2.1–12` | 12 lecciones en video del curso `c2` |
| `lesson.c3.1–6` | 6 lecciones en video del curso `c3` |

## Productos

Los ocho productos son de demostración (nombres, precios y fotos). El catálogo real —nombres, tamaños, contenidos y fotografía de cada producto— lo define Marisol.

| Id | Producto de demostración |
|---|---|
| `p1` | Aceite Esencial · Cedro Sagrado |
| `p2` | Vela Ritual · Luz de Vela |
| `p3` | Cuarzo de Serenidad |
| `p4` | Bruma de Enraizamiento |
| `p5` | Incienso · Bosque de Copal |
| `p6` | Sal de Baño · Luna Llena |
| `p7` | Infusión · Calma de Cedro |
| `p8` | Diario de Frecuencias |

### Formato de entrega de las fotos de producto

Por producto, hasta cuatro vistas, todas **cuadradas 1:1**, de al menos 2000 × 2000 px, en sRGB, JPEG de calidad alta o PNG, **sin texto ni marcas superpuestas** y sin fondo de stock:

1. `cover`: el envase completo sobre piedra o madera con luz lateral (lo que ya pinta `store-product-visual`).
2. `label`: la etiqueta legible, de frente.
3. `texture`: un detalle de textura en primer plano.
4. `inUse`: el producto en uso, sin rostros.

Nombre de archivo `<id>-<vista>.jpg` (por ejemplo `p1-cover.jpg`). Con las fotos, el **tamaño** (p. ej. «30 ml») y el **contenido** o ingredientes tal como irán en la etiqueta: sin ese dato la ficha no pinta la fila. Una vista que falta no se rellena. No hay slots nuevos: cada vista es una instancia de `store-product-visual` que se da de alta en `Branding/src/data/photography.js` al llegar la foto.

## Cursos

Los tres cursos son de demostración (acceso, modalidad, «qué aprenderás» y «qué incluye» incluidos). Los reales —el curso de los rituales, el de las esencias, la separación entre gratuitos y de pago y las grabaciones— no se cargan hasta que Marisol los entregue.

| Id | Curso de demostración | Lecciones |
|---|---|---|
| `c1` | El Arte de Volver a Ti | 8 |
| `c2` | Rituales Conscientes | 12 |
| `c3` | Aromas que Sanan | 6 |

## Imágenes provisionales

Generadas, hacen de marco hasta tener fotografía propia de Marisol o con licencia comercial documentada (lista del brief, sección «Provisionales»).

| Slot | Vista | Archivos | Qué hacer |
|---|---|---|---|
| `store-product-visual` | Tienda · productos | `store-product-visual-p1.avif`, `store-product-visual-p2.avif`, `store-product-visual-p3.avif`, `store-product-visual-p4.avif`, `store-product-visual-p5.avif`, `store-product-visual-p6.avif`, `store-product-visual-p7.avif`, `store-product-visual-p8.avif` | Pendiente de Marisol: son fotografía real de sus productos y quedan por hacer (envase con etiqueta legible, tamaño o contenido, textura, una imagen en uso). Las ocho publicadas son provisionales; el catálogo real (nombres, tamaños, contenidos) también lo define ella. No se generan imágenes nuevas de producto. |
| `atmosphere.forest-autumn` | Atmósfera · Bosque otoñal (nostalgia) | `atmosphere-forest-autumn.avif` | Sólo si hay material: la variante otoñal es opcional (spec §4.2). Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.celtic` | Resonario · música de inspiración celta | `resonario-celtic.avif` | Imagen de apoyo. Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.kind-banner.*` | Resonario · tipo de escucha | `resonario-kind-banner-melody.avif`, `resonario-kind-banner-nature.avif`, `resonario-kind-banner-frequency.avif`, `resonario-kind-banner-binaural.avif`, `resonario-kind-banner-guided.avif` | Imágenes de apoyo. Sustituir por fotografía propia o con licencia comercial documentada. |
| `academy.hero` | Academia · hero · tema | `academy-hero-dawn.avif`, `academy-hero-dusk.avif`, `academy-hero-forest.avif`, `academy-hero-moon.avif` | Sustituir por fotografía propia o con licencia comercial documentada. |
| `store.hero` | Tienda · hero · tema | `store-hero-dawn.avif`, `store-hero-dusk.avif`, `store-hero-forest.avif`, `store-hero-moon.avif` | Escenario sin producto. La fotografía real de los productos (envases con etiqueta legible, textura, en uso) la hace Marisol; esta imagen se sustituye o se conserva sólo como fondo. |
| `about.hero` | Sobre Marisol · hero · tema | `about-hero-dawn.avif`, `about-hero-dusk.avif`, `about-hero-forest.avif`, `about-hero-moon.avif` | Marco provisional. Sustituir por fotografías y videos reales de Marisol (spec §8). |
| `portal.hero` | Portal · umbral · tema | `portal-hero-dusk.avif`, `portal-hero-dawn.avif`, `portal-hero-forest.avif`, `portal-hero-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home.hero` | Home · hero · tema | `home-hero-dusk.avif`, `home-hero-dawn.avif`, `home-hero-forest.avif`, `home-hero-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `auth.hero` | Acceso · hero · tema | `auth-hero-dusk.avif`, `auth-hero-dawn.avif`, `auth-hero-forest.avif`, `auth-hero-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `discover.hero` | Descúbrete · hero · tema | `discover-hero-dusk.avif`, `discover-hero-dawn.avif`, `discover-hero-forest.avif`, `discover-hero-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `experiences.hero` | Experiencias · hero · tema | `experiences-hero-dusk.avif`, `experiences-hero-dawn.avif`, `experiences-hero-forest.avif`, `experiences-hero-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `booking.hero` | Reserva · hero · tema | `booking-hero-dusk.avif`, `booking-hero-dawn.avif`, `booking-hero-forest.avif`, `booking-hero-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `sanctuary.hero` | Mi Santuario · hero · tema | `sanctuary-hero-dusk.avif`, `sanctuary-hero-dawn.avif`, `sanctuary-hero-forest.avif`, `sanctuary-hero-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home.daily-frequency` | Home · frecuencia del día · tema | `home-daily-frequency-dawn.avif`, `home-daily-frequency-dusk.avif`, `home-daily-frequency-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home.realms-banner` | Home · banner de realms · tema | `home-realms-banner-dawn.avif`, `home-realms-banner-dusk.avif`, `home-realms-banner-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home.footer-banner` | Home · cierre · tema | `home-footer-banner-dawn.avif`, `home-footer-banner-dusk.avif`, `home-footer-banner-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home-membership` | Home · membresía · tema | `home-membership-dawn.avif`, `home-membership-dusk.avif`, `home-membership-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `about.angels` | Sobre Marisol · Experiencias con Ángeles · tema | `about-angels-dawn.avif`, `about-angels-dusk.avif`, `about-angels-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `auth.form-atmosphere` | Acceso · formulario · tema | `auth-form-atmosphere-dawn.avif`, `auth-form-atmosphere-dusk.avif`, `auth-form-atmosphere-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `discover.question-atmosphere` | Descúbrete · pregunta · tema | `discover-question-atmosphere-dawn.avif`, `discover-question-atmosphere-dusk.avif`, `discover-question-atmosphere-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.featured` | Resonario · destacado · tema | `resonario-featured-dawn.avif`, `resonario-featured-dusk.avif`, `resonario-featured-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.archive-banner` | Resonario · archivo · tema | `resonario-archive-banner-dawn.avif`, `resonario-archive-banner-dusk.avif`, `resonario-archive-banner-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `academy.featured-course` | Academia · curso destacado · tema | `academy-featured-course-dawn.avif`, `academy-featured-course-dusk.avif`, `academy-featured-course-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `experiences.featured` | Experiencias · destacada · tema | `experiences-featured-dawn.avif`, `experiences-featured-dusk.avif`, `experiences-featured-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `store.ritual-banner` | Tienda · banner ritual · tema | `store-ritual-banner-dawn.avif`, `store-ritual-banner-dusk.avif`, `store-ritual-banner-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `academy.completion` | Academia · curso completado · tema | `academy-completion-forest.avif`, `academy-completion-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `booking.confirmation` | Reserva · confirmación · tema | `booking-confirmation-dusk.avif`, `booking-confirmation-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `states.loading` | Estados · carga · tema | `states-loading-dawn.avif`, `states-loading-dusk.avif`, `states-loading-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `states.empty` | Estados · vacío · tema | `states-empty-dawn.avif`, `states-empty-dusk.avif`, `states-empty-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `states.error` | Estados · error · tema | `states-error-dawn.avif`, `states-error-dusk.avif`, `states-error-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `states.offline` | Estados · sin conexión · tema | `states-offline-dawn.avif`, `states-offline-dusk.avif`, `states-offline-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `sanctuary.continue` | Mi Santuario · continuar · tema | `sanctuary-continue-dawn.avif`, `sanctuary-continue-dusk.avif`, `sanctuary-continue-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `sanctuary.daily` | Mi Santuario · práctica diaria · tema | `sanctuary-daily-dawn.avif`, `sanctuary-daily-dusk.avif`, `sanctuary-daily-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `sanctuary.journal` | Mi Santuario · diario · tema | `sanctuary-journal-dawn.avif`, `sanctuary-journal-dusk.avif`, `sanctuary-journal-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `sanctuary.empty` | Mi Santuario · vacío · tema | `sanctuary-empty-dawn.avif`, `sanctuary-empty-dusk.avif`, `sanctuary-empty-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `cart.empty` | Carrito · vacío · tema | `cart-empty-dawn.avif`, `cart-empty-dusk.avif`, `cart-empty-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `checkout.confirmation` | Compra · confirmación · tema | `checkout-confirmation-dawn.avif`, `checkout-confirmation-dusk.avif`, `checkout-confirmation-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `discover.tuning` | Descúbrete · afinación · tema | `discover-tuning-dawn.avif`, `discover-tuning-dusk.avif`, `discover-tuning-forest.avif`, `discover-tuning-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `discover.result` | Descúbrete · resultado · tema | `discover-result-dawn.avif`, `discover-result-dusk.avif`, `discover-result-forest.avif`, `discover-result-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.hero` | Resonario · hero · tema | `resonario-hero-moon.avif`, `resonario-hero-dusk.avif`, `resonario-hero-dawn.avif`, `resonario-hero-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |

## A revisar cuando llegue el material

- **Copy de llegada a revisar cuando melodías y guiadas pasen a `ready`.** Hoy la respuesta de «¿Cómo llegas hoy?» no promete melodías, bosque, cascada ni «sonidos reales» (la naturaleza es síntesis provisional): al llegar el material, la tabla de `config/arrivals.ts` manda y el texto de `messages/{es,en}.json` (`arrival`) debe reescribirse.
- **Hex de las atmósferas** (`themeColor` y acentos provisionales de `config/atmospheres.ts` y `tokens.css`) a recalibrar sobre la fotografía real.
