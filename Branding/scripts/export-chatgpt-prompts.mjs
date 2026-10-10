/**
 * Genera `docs/prompts-chatgpt.md`: un bloque por imagen, listo para pegar en ChatGPT (GPT Image), que no
 * tiene campo de negativo ni selector de formato. Uso: `npm run export:chatgpt-prompts` desde `Branding/`.
 * Mismos datos que el brief (`src/data/photography.js`): se edita allí y se regeneran los dos.
 */
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expandAll } from '../src/data/photography.js'

const AVOID =
  'Avoid: text, letters, watermark, logo, neon, glowing neon tube, rainbow spectrum, saturated colors, HDR, ' +
  'more than three vertical light lines, faces, facial features, eyes, nose, lips, ear, nude or anatomical detail, ' +
  'DNA, brain, dense starfield, lens flare, stock-photo look, cartoon, CGI plastic look.'
const AVOID_PORTRAIT = AVOID.replace('faces, facial features, eyes, nose, lips, ear, ', '')

const FORMAT = {
  '16:9': 'Wide landscape image, 16:9 aspect ratio.',
  '16:8': 'Wide landscape image, 16:9 aspect ratio (it will be cropped to 2:1, keep the subject away from the top and bottom edges).',
  '3:4': 'Vertical portrait image, 3:4 aspect ratio.',
  '1:1': 'Square image, 1:1 aspect ratio.',
  '1.91:1': 'Wide landscape image, 16:9 aspect ratio (it will be cropped to 1.91:1).',
}
const RATIO = { wide: '16:9', cinema: '16:8', portrait: '3:4', square: '1:1' }
const ORDER = { P0: 0, P1: 1, P2: 2 }

const rows = expandAll()
  .map((row, index) => ({ ...row, index, ratio: row.ratio ?? RATIO[row.preset] }))
  .sort((a, b) => ORDER[a.priority] - ORDER[b.priority] || a.index - b.index)

const out = [
  '# Prompts para ChatGPT — Frecuencia Mágica',
  '',
  '> Generado por `npm run export:chatgpt-prompts` (desde `Branding/`) con los mismos datos que `docs/brief-fotografico.md`. No editar a mano.',
  '> Uso: un chat nuevo de ChatGPT por imagen (así no arrastra el estilo de la anterior), pega el bloque entero sin adjuntar nada, descarga y guarda con el nombre indicado en `frontend/public/editorial/`. Si cambia algo, pide la corrección concreta en el mismo chat en vez de regenerar desde cero.',
  '',
  `**${rows.length} imágenes**, ordenadas por prioridad (P0 → P2).`,
  '',
]

for (const [n, row] of rows.entries()) {
  const label = row.title ? `${row.view} · ${row.title}` : row.view
  const avoid = row.realShoot ? AVOID_PORTRAIT : AVOID
  out.push(`## ${n + 1}. ${row.priority} · ${label}`, '')
  out.push(`- **Guardar como:** \`${row.file.replace(/\.(avif|jpg)$/, '.png')}\` (luego se convierte a \`${row.file}\`)`)
  out.push(`- **Formato:** ${row.ratio}`)
  if (row.realShoot) out.push('- **Ojo:** sólo moodboard; la imagen publicada sale de una sesión real con Marisol.')
  out.push('', '```text', `Create an image. Follow this description exactly and do not add elements, text or effects that are not described. ${FORMAT[row.ratio]} ${row.prompt} ${avoid}`, '```', '')
}

const target = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/prompts-chatgpt.md')
writeFileSync(target, out.join('\n'))
console.log(`${rows.length} prompts escritos en ${target}`)
