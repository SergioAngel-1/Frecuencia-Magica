import type { VideoEntry } from '@/config/videos';
import { videoState } from '@/config/videos';
import type { Audio, Course, Product } from '@/types/content';

/** Imágenes provisionales de un slot del brief (lo que hay que reemplazar por fotografía real). */
export type ProvisionalPhotoGroup = {
  slotId: string;
  view: string;
  files: readonly string[];
  note: string;
};

export type PendingInput = {
  audios: readonly Audio[];
  videos: readonly VideoEntry[];
  products: readonly Product[];
  courses: readonly Course[];
  photos: readonly ProvisionalPhotoGroup[];
  /** Texto en español de una clave de `messages/es.json`. */
  titleOf: (key: string) => string;
};

const KIND_LABEL: Record<Audio['kind'], string> = {
  melody: 'Melodías',
  nature: 'Naturaleza',
  frequency: 'Frecuencias',
  binaural: 'Binaurales',
  guided: 'Prácticas guiadas',
};

const cell = (text: string) => text.replaceAll('|', '\\|');

/**
 * Pistas que pueden publicarse tal cual: con fuente, y con procedencia propia,
 * con licencia o sintetizada por nosotros. Una pista `provisional` (síntesis de
 * relleno o material aún no entregado) nunca lo es, ni aunque suene hoy.
 */
export function publishableAudios(audios: readonly Audio[]): Audio[] {
  return audios.filter(
    (audio) =>
      audio.availability === 'ready' && audio.source !== null && audio.license !== 'provisional',
  );
}

/** Pistas que suenan hoy con síntesis de relleno: hay que sustituirlas antes de publicar. */
export function provisionalAudios(audios: readonly Audio[]): Audio[] {
  return audios.filter(
    (audio) => audio.availability === 'ready' && audio.license === 'provisional',
  );
}

/** Pistas aún sin material: ni suenan ni se muestran como reproducibles. */
export function soonAudios(audios: readonly Audio[]): Audio[] {
  return audios.filter((audio) => audio.availability === 'soon');
}

/** Agrupa los videos sin fuente: los de lección se resumen por curso (`lesson.c1.1–8`). */
function videoRows(videos: readonly VideoEntry[]): { label: string; what: string }[] {
  const rows: { label: string; what: string }[] = [];
  const lessonsByCourse = new Map<string, number[]>();

  for (const video of videos) {
    const lesson = /^lesson\.([^.]+)\.(\d+)$/.exec(video.id);
    if (lesson) {
      const list = lessonsByCourse.get(lesson[1]!) ?? [];
      list.push(Number(lesson[2]));
      lessonsByCourse.set(lesson[1]!, list);
    } else if (video.id.startsWith('course-intro.')) {
      rows.push({ label: `\`${video.id}\``, what: 'Presentación del curso' });
    } else {
      rows.push({ label: `\`${video.id}\``, what: WHAT_VIDEO[video.id] ?? 'Video de Marisol' });
    }
  }

  for (const [course, numbers] of lessonsByCourse) {
    const sorted = [...numbers].sort((a, b) => a - b);
    rows.push({
      label: `\`lesson.${course}.${sorted[0]}–${sorted[sorted.length - 1]}\``,
      what: `${sorted.length} lecciones en video del curso \`${course}\``,
    });
  }

  return rows;
}

const WHAT_VIDEO: Record<string, string> = {
  welcome: 'Saludo de bienvenida de Marisol (Home)',
  'marisol-intro': 'Presentación de Marisol (Sobre Marisol)',
  'breathing-guide': 'Marisol respirando con la persona (guía de respiración)',
};

const PHOTO_FORMAT = [
  'Por producto, hasta cuatro vistas, todas **cuadradas 1:1**, de al menos 2000 × 2000 px, en sRGB, JPEG de calidad alta o PNG, **sin texto ni marcas superpuestas** y sin fondo de stock:',
  '',
  '1. `cover`: el envase completo sobre piedra o madera con luz lateral (lo que ya pinta `store-product-visual`).',
  '2. `label`: la etiqueta legible, de frente.',
  '3. `texture`: un detalle de textura en primer plano.',
  '4. `inUse`: el producto en uso, sin rostros.',
  '',
  'Nombre de archivo `<id>-<vista>.jpg` (por ejemplo `p1-cover.jpg`). Con las fotos, el **tamaño** (p. ej. «30 ml») y el **contenido** o ingredientes tal como irán en la etiqueta: sin ese dato la ficha no pinta la fila. Una vista que falta no se rellena. No hay slots nuevos: cada vista es una instancia de `store-product-visual` que se da de alta en `Branding/src/data/photography.js` al llegar la foto.',
];

/**
 * Registro de materiales pendientes (spec §9), en Markdown. Función pura: el
 * script `export-pending-materials` la alimenta con los datos reales y el test
 * `pending-materials` comprueba que el documento committed coincide.
 */
export function renderPendingMaterials(input: PendingInput): string {
  const { audios, videos, products, courses, photos, titleOf } = input;
  const provisional = provisionalAudios(audios);
  const soon = soonAudios(audios);
  const publishable = publishableAudios(audios);
  const pendingVideos = videos.filter((video) => videoState(video) === 'soon');
  const provisionalProducts = products.filter((product) => product.provisional);
  const provisionalCourses = courses.filter((course) => course.provisional);
  const photoCount = photos.reduce((sum, group) => sum + group.files.length, 0);
  const audioTitle = (audio: Audio) => cell(titleOf(audio.titleKey));

  return [
    '# Materiales pendientes',
    '',
    '> Generado por `npm run export:pending-materials` (desde `frontend/`) a partir del catálogo de audio, el registro de videos, los productos, los cursos y el brief fotográfico. **No se edita a mano**: `tests/lib/pending-materials.test.ts` falla si se desvía.',
    '',
    'Lo que Marisol aún no entrega y que el sitio muestra como «Próximamente» o como provisional. Nada de esto se publica como real hasta que llegue el material con su procedencia (propio, con licencia comercial documentada o sintetizado por nosotros).',
    '',
    '## Resumen',
    '',
    '| Material | Pendiente |',
    '|---|---|',
    `| Audio con síntesis provisional | ${provisional.length} |`,
    `| Audio «Próximamente» | ${soon.length} |`,
    `| Videos «Próximamente» | ${pendingVideos.length} |`,
    `| Productos provisionales | ${provisionalProducts.length} |`,
    `| Cursos de demostración | ${provisionalCourses.length} |`,
    `| Imágenes provisionales | ${photoCount} |`,
    '',
    '## Audio',
    '',
    '### Con síntesis provisional (suenan hoy, no se publican)',
    '',
    'Texturas y capas sintetizadas por nosotros como relleno. Se sustituyen por grabaciones propias o con licencia comercial documentada antes de publicar.',
    '',
    '| Id | Pista | Tipo |',
    '|---|---|---|',
    ...provisional.map(
      (audio) => `| \`${audio.id}\` | ${audioTitle(audio)} | ${KIND_LABEL[audio.kind]} |`,
    ),
    '',
    '### «Próximamente» (sin material)',
    '',
    'Sin fuente ni duración: no tienen play, no entran por siguiente ni anterior y no se recomiendan.',
    '',
    '| Id | Pista | Tipo | Lleva voz |',
    '|---|---|---|---|',
    ...soon.map(
      (audio) =>
        `| \`${audio.id}\` | ${audioTitle(audio)} | ${KIND_LABEL[audio.kind]} | ${audio.voice ? 'sí' : 'no'} |`,
    ),
    '',
    '### Listo para publicar',
    '',
    'Con fuente y con procedencia propia, con licencia o sintetizada por nosotros (los tonos de frecuencia). Ninguna pista provisional figura aquí.',
    '',
    '| Id | Pista | Tipo |',
    '|---|---|---|',
    ...publishable.map(
      (audio) => `| \`${audio.id}\` | ${audioTitle(audio)} | ${KIND_LABEL[audio.kind]} |`,
    ),
    '',
    '## Video',
    '',
    'Ningún video tiene fuente: cada espacio muestra el póster con «Próximamente», sin play ni reloj.',
    '',
    '| Id | Qué entregar |',
    '|---|---|',
    ...videoRows(pendingVideos).map((row) => `| ${row.label} | ${cell(row.what)} |`),
    '',
    '## Productos',
    '',
    'Los ocho productos son de demostración (nombres, precios y fotos). El catálogo real —nombres, tamaños, contenidos y fotografía de cada producto— lo define Marisol.',
    '',
    '| Id | Producto de demostración |',
    '|---|---|',
    ...provisionalProducts.map(
      (product) => `| \`${product.id}\` | ${cell(titleOf(product.titleKey))} |`,
    ),
    '',
    '### Formato de entrega de las fotos de producto',
    '',
    ...PHOTO_FORMAT,
    '',
    '## Cursos',
    '',
    'Los tres cursos son de demostración (acceso, modalidad, «qué aprenderás» y «qué incluye» incluidos). Los reales —el curso de los rituales, el de las esencias, la separación entre gratuitos y de pago y las grabaciones— no se cargan hasta que Marisol los entregue.',
    '',
    '| Id | Curso de demostración | Lecciones |',
    '|---|---|---|',
    ...provisionalCourses.map(
      (course) => `| \`${course.id}\` | ${cell(titleOf(course.titleKey))} | ${course.lessons} |`,
    ),
    '',
    '## Imágenes provisionales',
    '',
    'Generadas, hacen de marco hasta tener fotografía propia de Marisol o con licencia comercial documentada (lista del brief, sección «Provisionales»).',
    '',
    '| Slot | Vista | Archivos | Qué hacer |',
    '|---|---|---|---|',
    ...photos.map(
      (group) =>
        `| \`${group.slotId}\` | ${cell(group.view)} | ${cell(group.files.map((file) => `\`${file}\``).join(', '))} | ${cell(group.note)} |`,
    ),
    '',
    '## A revisar cuando llegue el material',
    '',
    '- **Copy de llegada a revisar cuando melodías y guiadas pasen a `ready`.** Hoy la respuesta de «¿Cómo llegas hoy?» no promete melodías, bosque, cascada ni «sonidos reales» (la naturaleza es síntesis provisional): al llegar el material, la tabla de `config/arrivals.ts` manda y el texto de `messages/{es,en}.json` (`arrival`) debe reescribirse.',
    '- **Hex de las atmósferas** (`themeColor` y acentos provisionales de `config/atmospheres.ts` y `tokens.css`) a recalibrar sobre la fotografía real.',
    '',
  ].join('\n');
}
