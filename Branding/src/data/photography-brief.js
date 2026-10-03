/**
 * Renderiza el brief fotográfico como Markdown. JS puro: lo usan la página `/fotografia`
 * (botón de descarga) y `scripts/export-photo-brief.mjs`, que escribe `docs/brief-fotografico.md`.
 */
import { DELIVERY, GLOBAL, PRESETS, SAFE, expandAll, formatSize, negativeFor, summarize } from './photography.js'

const fence = (text) => ['```text', text, '```'].join('\n')

function sizeLine(row) {
  if (row.preset) {
    const preset = PRESETS[row.preset]
    return `master ${formatSize(preset.master)} · tablet ${formatSize(preset.tablet)} · móvil ${formatSize(preset.mobile)} · generar a ${preset.generate} y reescalar · peso ${preset.budget}`
  }

  return `${formatSize(row.size)} · ${row.ratio}`
}

function renderRow(row) {
  const heading = row.title ? `${row.slotId} · ${row.title}` : row.slotId
  const lines = [
    `#### \`${heading}\` — ${row.view} · ${row.priority}`,
    '',
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
  const groups = new Map()

  for (const row of rows) {
    const group = row.view.split(' · ')[0]
    groups.set(group, [...(groups.get(group) ?? []), row])
  }

  const out = [
    '# Brief fotográfico — Frecuencia Mágica',
    '',
    '> Generado por `npm run export:photo-brief` desde `Branding/src/data/photography.js`. No editar a mano: cambia el dato y vuelve a generarlo.',
    '> El contrato que manda es `frontend/src/config/editorial-media.ts` (ratio, prioridad, focal); un test de la web falla si el brief se desvía.',
    '',
    `**${summary.total} imágenes** (${summary.registeredSlots} slots registrados, varios por instancia; ${summary.unregistered} fuera del registro): ` +
      `P0 ${summary.byPriority.P0} · P1 ${summary.byPriority.P1} · P2 ${summary.byPriority.P2}. ` +
      `${summary.realShoot} requiere sesión real (retrato de Marisol).`,
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
    '| Archivo | Vista | Ratio | Master | Prio. |',
    '|---|---|---|---|---|',
    ...rows.map((row) => `| \`${row.file}\` | ${row.view}${row.title ? ` · ${row.title}` : ''} | ${row.preset ? PRESETS[row.preset].ratio : row.ratio} | ${formatSize(row.size)} | ${row.priority} |`),
    '',
    '## 5. Imágenes',
  ]

  for (const [group, items] of groups) {
    out.push('', `### ${group}`, '', items.map(renderRow).join('\n\n'))
  }

  return `${out.join('\n')}\n`
}
