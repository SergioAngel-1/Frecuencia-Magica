/**
 * Genera `docs/brief-fotografico.md` (raíz del repo) desde los datos de `src/data/photography.js`.
 * Uso: `npm run export:photo-brief` desde `Branding/`.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { renderBrief } from '../src/data/photography-brief.js'

const target = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/brief-fotografico.md')

mkdirSync(dirname(target), { recursive: true })
writeFileSync(target, renderBrief())

console.log(`Brief escrito en ${target}`)
