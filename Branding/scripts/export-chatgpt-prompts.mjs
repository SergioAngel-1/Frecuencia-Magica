/**
 * Genera `docs/prompts-chatgpt.md`: un bloque por imagen, listo para pegar en ChatGPT (GPT Image), que no
 * tiene campo de negativo ni selector de formato. Uso: `npm run export:chatgpt-prompts` desde `Branding/`.
 * Mismos datos que el brief (`src/data/photography.js`): se edita allí y se regeneran los dos.
 */
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expandAll, isAtmosphere } from '../src/data/photography.js'
import { STATES, STATE_LABELS, correctionLines, groupByState, statusOf } from '../src/data/photography-status.js'

const AVOID =
  'Avoid: text, letters, watermark, logo, neon, glowing neon tube, rainbow spectrum, saturated colors, HDR, ' +
  'more than three vertical light lines, faces, facial features, eyes, nose, lips, ear, nude or anatomical detail, ' +
  'DNA, brain, dense starfield, lens flare, stock-photo look, cartoon, CGI plastic look.'
/** Productos con foto de referencia: el único texto admitido es el de su etiqueta. */
const AVOID_REFERENCE = AVOID.replace(
  'text, letters, watermark, logo,',
  'watermark, any text or logo that is not on the product in the reference image, invented or misspelled label text,',
)
/** Atmósferas (enmienda 2026-10-17): color natural, sin personas; no se pide «sin saturación» a secas. */
const AVOID_ATMOSPHERE =
  'Avoid: text, letters, watermark, logo, neon, glowing neon tube, rainbow spectrum, HDR, oversaturated colors, ' +
  'blown-out sun disc, lens flare, a navy or gold color cast over the whole image, crushed black shadows, ' +
  'people, faces, human figures, boats, stock-photo look, cartoon, CGI plastic look.'
const AVOID_PORTRAIT = AVOID.replace('faces, facial features, eyes, nose, lips, ear, ', '')

const FORMAT = {
  '16:9': 'Wide landscape image, 16:9 aspect ratio.',
  '16:8': 'Wide landscape image, 16:9 aspect ratio (it will be cropped to 2:1, keep the subject away from the top and bottom edges).',
  '3:4': 'Vertical portrait image, 3:4 aspect ratio.',
  '1:1': 'Square image, 1:1 aspect ratio.',
  '1.91:1': 'Wide landscape image, 16:9 aspect ratio (it will be cropped to 1.91:1).',
}
const RATIO = { wide: '16:9', cinema: '16:8', portrait: '3:4', square: '1:1' }

/** Qué hacer con cada sección, antes de sus imágenes. */
const INTRO = {
  corregir:
    'Entregadas con una desviación. Cada entrada dice qué parte del prompt falló según el resultado y trae ya el prompt con ese punto reforzado: regenera con él en un chat nuevo. Van de más a menos urgente: primero la gravedad y, a igual gravedad, la prioridad de la vista (P0 → P2). La baja no justifica regenerar salvo que se vea mal en pantalla.',
  faltante: 'Aún sin entregar. Guárdalas con el nombre indicado para que se procesen solas.',
  'por-cablear':
    'Entregadas (los `states-<estado>.png` ya están en `frontend/public/editorial/`); lo que falta es la vista. El prompt sólo sirve si hay que repetirlas.',
  'sin-uso': 'Publicadas, pero ninguna vista las pinta hoy. El prompt sólo sirve si se rehacen.',
  completada: 'Entregadas y sin desviación conocida. Se conserva el prompt por si hay que repetirlas.',
}

const rows = expandAll().map((row) => ({ ...row, ratio: row.ratio ?? RATIO[row.preset] }))
const byState = groupByState(rows)
const SHORT = {
  corregir: 'a corregir',
  faltante: 'faltantes',
  'por-cablear': 'por cablear',
  'sin-uso': 'no tenidas en cuenta',
  completada: 'completadas',
}
const counts = STATES.map((state) => `${byState.get(state).length} ${SHORT[state]}`).join(' · ')

const out = [
  '# Prompts para ChatGPT — Frecuencia Mágica',
  '',
  '> Generado por `npm run export:chatgpt-prompts` (desde `Branding/`) con los mismos datos que `docs/brief-fotografico.md`. No editar a mano.',
  '> Uso: un chat nuevo de ChatGPT por imagen (así no arrastra el estilo de la anterior), pega el bloque entero sin adjuntar nada (salvo en los productos de la tienda, que llevan adjunta la foto real del producto, como indica su entrada), descarga y guarda con el nombre indicado en `frontend/public/editorial/`. Si cambia algo, pide la corrección concreta en el mismo chat en vez de regenerar desde cero.',
  '> El orden y las secciones son los de la sección 5 de `docs/brief-fotografico.md`; el estado de cada imagen vive en `Branding/src/data/photography-status.js`.',
  '> **Variantes por tema** (`<slot>-<tema>.png`, p. ej. `home-hero-dawn.png`; spec `docs/superpowers/specs/2026-10-17-temas-globales-design.md`): el sitio tiene cinco temas (noche, atardecer, amanecer, luna, bosque) y un slot escénico puede traer una imagen propia en los temas donde la de la noche no funciona. La luna comparte la imagen de la noche. Cada variante lleva el mismo ratio, prioridad y encuadre que su slot, y el estilo de las atmósferas: color natural, sin personas y otro «Avoid». El mapa de abajo dice qué falta por tema. Si una variante tarda, la web muestra la imagen de la noche: no bloquea nada.',
  '> Las demás imágenes de atmósfera (`atmosphere-forest-autumn`, `resonario-celtic`, `resonario-kind-banner-*`; enmienda 2026-10-17, `docs/superpowers/specs/2026-10-17-ambientes-v2-design.md`) llevan el mismo estilo. Los productos de la tienda no se generan: son fotografía real que hará Marisol.',
  '',
  `**${rows.length} imágenes:** ${counts}. Lo que hay que generar o regenerar está en las dos primeras secciones.`,
  '',
]

const variantRows = rows.filter((row) => row.theme)
const slotsWithVariants = [...new Set(variantRows.map((row) => row.slotId))]
out.push('## Mapa de variantes por tema', '')
out.push('| Slot | Atardecer | Amanecer | Luna | Bosque |', '|---|---|---|---|---|')
for (const slotId of slotsWithVariants) {
  const cells = ['dusk', 'dawn', 'moon', 'forest'].map((theme) => {
    const row = variantRows.find((candidate) => candidate.slotId === slotId && candidate.theme === theme)
    if (!row) return '—'
    return `${statusOf(row.file).state === 'completada' ? '✓' : 'por generar'} \`${row.file.replace(/\.avif$/, '.png')}\``
  })
  out.push(`| \`${slotId}\` | ${cells.join(' | ')} |`)
}
out.push('', '✓ ya entregada y publicada (reasignada de las atmósferas de Ambientes v2). — el tema usa la imagen de la noche.', '')

for (const [index, state] of STATES.entries()) {
  const items = byState.get(state)

  out.push(`## ${index + 1}. ${STATE_LABELS[state]} (${items.length})`, '', INTRO[state], '')
  if (items.length === 0) out.push('Ninguna.', '')

  for (const [position, { row, status }] of items.entries()) {
    const label = row.title ? `${row.view} · ${row.title}` : row.view
    const avoid = isAtmosphere(row)
      ? AVOID_ATMOSPHERE
      : row.reference
        ? AVOID_REFERENCE
        : row.realShoot
          ? AVOID_PORTRAIT
          : AVOID
    const opening = row.reference
      ? 'Create an image using the attached reference photo of the product. Follow this description exactly and do not add elements, text or effects that are not described or not in the reference.'
      : 'Create an image. Follow this description exactly and do not add elements, text or effects that are not described.'
    // En «a corregir» el título lleva la gravedad: el orden es el de urgencia y así se lee de un vistazo.
    const level = state === 'corregir' ? ` · ${status.severity}` : ''
    out.push(`### ${index + 1}.${position + 1}${level} · ${row.priority} · ${label}`, '')
    out.push(`- **Guardar como:** \`${row.file.replace(/\.(avif|jpg)$/, '.png')}\` (luego se convierte a \`${row.file}\`)`)
    out.push(`- **Formato:** ${row.ratio}`)
    if (state === 'corregir') out.push(...correctionLines(status))
    else if (status.note) out.push(`- **Nota:** ${status.note}`)
    if (isAtmosphere(row)) out.push('- **Estilo:** atmósfera (v2): color natural y escena según su tono; no lleva el etalonaje nocturno de las demás.')
    if (row.provisional) out.push(`- **Provisional:** ${row.provisional}`)
    if (row.reference) out.push('- **Adjuntar:** la foto real del producto. La forma y la etiqueta salen de ella; no escribas el texto de la etiqueta en el chat.')
    if (row.realShoot) out.push('- **Ojo:** sólo moodboard; la imagen publicada sale de una sesión real con Marisol.')
    out.push('', '```text', `${opening} ${FORMAT[row.ratio]} ${row.prompt} ${avoid}`, '```', '')
  }
}

const target = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/prompts-chatgpt.md')
writeFileSync(target, out.join('\n'))
console.log(`${rows.length} prompts escritos en ${target}`)
