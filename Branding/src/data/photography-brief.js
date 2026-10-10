/**
 * Renderiza el brief fotográfico como Markdown. JS puro: lo usan la página `/fotografia`
 * (botón de descarga) y `scripts/export-photo-brief.mjs`, que escribe `docs/brief-fotografico.md`.
 */
import { DELIVERY, GLOBAL, LANGUAGE, PRESETS, SAFE, expandAll, formatSize, negativeFor, summarize } from './photography.js'
import { SEVERITIES, STATES, STATE_LABELS, statusOf } from './photography-status.js'

const fence = (text) => ['```text', text, '```'].join('\n')
const cell = (text) => String(text).replaceAll('|', '\\|')
const viewOf = (row) => (row.title ? `${row.view} · ${row.title}` : row.view)

function sizeLine(row) {
  if (row.preset) {
    const preset = PRESETS[row.preset]
    return `master ${formatSize(preset.master)} · tablet ${formatSize(preset.tablet)} · móvil ${formatSize(preset.mobile)} · generar a ${preset.generate} y reescalar · peso ${preset.budget}`
  }

  return `${formatSize(row.size)} · ${row.ratio}`
}

/** Línea de estado de una entrada completa: la desviación de las que se corrigen, o lo que falta. */
function statusBullet(status) {
  if (!status.note) return null
  if (status.state === 'corregir') return `- **Desviación (${status.severity}):** ${status.note}`

  return `- **Qué falta:** ${status.note}`
}

const ratioOf = (row) => (row.preset ? PRESETS[row.preset].ratio : row.ratio)

/** Qué cuenta cada sección, antes de sus imágenes. */
const INTRO = {
  corregir:
    'Entregadas y publicadas, pero desviadas del brief o de su prompt. Van de más a menos grave; la gravedad es criterio visual, ' +
    'y la baja no justifica regenerar salvo que se vea mal en pantalla. Cada entrada trae el prompt para regenerarla.',
  faltante: 'Aún no entregadas. La vista de cada una ya está preparada, salvo donde la nota indica lo contrario. Cada entrada trae su prompt.',
  'por-cablear':
    'Entregadas, pero sin slot en el registro (`frontend/src/config/editorial-media.ts`) ni pantalla que las pinte. ' +
    'Los archivos están en `frontend/public/editorial/` como `states-<estado>.png`, sin convertir.',
  'sin-uso': 'Publicadas, pero ninguna vista las pinta con el diseño actual.',
  completada: 'Entregadas, publicadas, cableadas y sin desviación conocida.',
}

/** Secciones con la ficha completa (prompt incluido): lo que aún hay que generar o regenerar. */
const FULL = new Set(['corregir', 'faltante'])

const TABLES = {
  'por-cablear': { head: ['Archivo', 'Vista', 'Qué falta'], row: ({ row, status }) => [`\`${row.file}\``, viewOf(row), status.note] },
  'sin-uso': { head: ['Archivo', 'Vista', 'Por qué'], row: ({ row, status }) => [`\`${row.file}\``, viewOf(row), status.note] },
  completada: {
    head: ['Archivo', 'Vista', 'Slot', 'Ratio', 'Prio.'],
    row: ({ row }) => [`\`${row.file}\``, viewOf(row), `\`${row.slotId}\``, ratioOf(row), row.priority],
  },
}

function renderTable(state, items) {
  const { head, row } = TABLES[state]

  return [
    `| ${head.join(' | ')} |`,
    `|${head.map(() => '---').join('|')}|`,
    ...items.map((item) => `| ${row(item).map(cell).join(' | ')} |`),
  ].join('\n')
}

function renderRow(row, status) {
  const heading = row.title ? `${row.slotId} · ${row.title}` : row.slotId
  const lines = [
    `#### \`${heading}\` — ${row.view} · ${row.priority}`,
    '',
    ...(statusBullet(status) ? [statusBullet(status)] : []),
    `- **Archivo:** \`${row.file}\``,
    `- **Medidas:** ${sizeLine(row)}`,
    `- **Ratio / focal:** ${row.preset ? PRESETS[row.preset].ratio : row.ratio} · foco ${row.focal}`,
    `- **Zona de texto:** ${SAFE[row.safe]}`,
    `- **Contenido:** ${row.role}`,
  ]

  if (row.notes) lines.push(`- **Nota:** ${row.notes}`)
  if (row.realShoot) lines.push('- **Producción:** sesión fotográfica real (el prompt es sólo moodboard).')
  if (row.unregistered) lines.push('- **Estado:** fuera del registro de slots (aún sin cablear).')

  lines.push('', '**Prompt**', '', fence(row.prompt))

  if (row.realShoot) lines.push('', '**Negativo (moodboard):**', '', fence(negativeFor(row)))

  return lines.join('\n')
}

export function renderBrief() {
  const rows = expandAll()
  const summary = summarize()
  const byState = new Map(STATES.map((state) => [state, []]))

  for (const row of rows) {
    const status = statusOf(row.file)
    byState.get(status.state).push({ row, status })
  }

  // Dentro de «a corregir», primero lo que más se nota (el orden estable conserva el de las vistas).
  byState.get('corregir').sort((a, b) => SEVERITIES.indexOf(a.status.severity) - SEVERITIES.indexOf(b.status.severity))

  const count = (state) => byState.get(state).length

  const out = [
    '# Brief fotográfico — Frecuencia Mágica',
    '',
    '> Generado por `npm run export:photo-brief` desde `Branding/src/data/photography.js`. No editar a mano: cambia el dato y vuelve a generarlo.',
    '> El estado de cada imagen (a corregir, faltante, por cablear…) vive en `Branding/src/data/photography-status.js`; un test lo cruza con lo publicado.',
    '> El contrato que manda es `frontend/src/config/editorial-media.ts` (ratio, prioridad, focal); un test de la web falla si el brief se desvía.',
    '> Dirección vigente: enmienda 2026-10-10 de `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md` — la imagen es el paisaje luminoso; el world engine es su energía.',
    '',
    `**${summary.total} imágenes** (${summary.registeredSlots} slots registrados, varios por instancia; ${summary.unregistered} fuera del registro): ` +
      `P0 ${summary.byPriority.P0} · P1 ${summary.byPriority.P1} · P2 ${summary.byPriority.P2}. ` +
      `${summary.realShoot} requiere sesión real (retrato de Marisol).`,
    '',
    `**Estado:** ${count('completada')} completadas · ${count('corregir')} a corregir · ${count('faltante')} faltantes · ` +
      `${count('por-cablear')} por cablear · ${count('sin-uso')} no tenidas en cuenta. Ver la sección 5.`,
    '',
    '## 1. Entrega',
    '',
    `- **Formatos:** ${DELIVERY.formats}`,
    `- **Carpeta:** \`${DELIVERY.dir}\``,
    `- **Nombre:** ${DELIVERY.naming}`,
    `- **Color:** ${DELIVERY.color}`,
    `- **Dimensiones:** ${DELIVERY.dpr}`,
    '',
    '## 2. Estilo común',
    '',
    'Cada prompt ya incluye este bloque al final; se repite aquí para ajustarlo en un solo sitio.',
    '',
    '**Prompt base**',
    '',
    fence(GLOBAL.base),
    '',
    '**Prompt negativo** (pegarlo tal cual en el campo de negativo del agente)',
    '',
    fence(GLOBAL.negative),
    '',
    '**Tratamientos por acento**',
    '',
    ...Object.entries(GLOBAL.treatments).map(([key, text]) => `- \`${key}\`: ${text}`),
    '',
    '**Vocabulario visual** (la imagen es el paisaje; el world engine es su energía)',
    '',
    ...LANGUAGE.elements.map((el) => `- **${el.name}:** ${el.feel} Realms: ${el.realms}.`),
    `- **${LANGUAGE.signature.name}:** ${LANGUAGE.signature.feel}`,
    `- **Slots con cuerpo de luz:** ${LANGUAGE.bodyOfLight.slots.map((id) => `\`${id}\``).join(', ')}.`,
    '',
    '**Reglas**',
    '',
    ...GLOBAL.rules.map((rule) => `- ${rule}`),
    '',
    '## 3. Medidas',
    '',
    '| Preset | Ratio | Master | Tablet | Móvil | Generar a | Peso | Uso |',
    '|---|---|---|---|---|---|---|---|',
    ...Object.values(PRESETS).map(
      (p) => `| ${p.label} | ${p.ratio} | ${formatSize(p.master)} | ${formatSize(p.tablet)} | ${formatSize(p.mobile)} | ${p.generate} | ${p.budget} | ${p.use} |`,
    ),
    '',
    'Los pesos son recomendaciones de trabajo, no un contrato de la web. El master es 2× el ancho de render máximo (DPR capado a 2).',
    '',
    '## 4. Resumen',
    '',
    '| Archivo | Vista | Ratio | Master | Prio. | Estado |',
    '|---|---|---|---|---|---|',
    ...rows.map(
      (row) =>
        `| \`${row.file}\` | ${viewOf(row)} | ${ratioOf(row)} | ${formatSize(row.size)} | ${row.priority} | ${STATE_LABELS[statusOf(row.file).state]} |`,
    ),
    '',
    '## 5. Estado de las imágenes',
    '',
    'Cada imagen está en una sola sección. El estado se mantiene en `Branding/src/data/photography-status.js`.',
    '',
    '**Nota general sobre tamaños:** las imágenes entregadas llegan a 1672 px de ancho en 16:9, 1774 px en 2:1 y 1086 px en 3:4, ' +
      'por debajo del «generar a» de su preset (2048, 2048 y 1536 px); las cuadradas (1254 px) lo superan. No se trata como desviación individual.',
  ]

  for (const [index, state] of STATES.entries()) {
    const items = byState.get(state)

    out.push('', `### 5.${index + 1} ${STATE_LABELS[state]} (${items.length})`, '', INTRO[state], '')
    if (items.length === 0) out.push('Ninguna.')
    else out.push(FULL.has(state) ? items.map(({ row, status }) => renderRow(row, status)).join('\n\n') : renderTable(state, items))
  }

  return `${out.join('\n')}\n`
}
