#!/usr/bin/env node
/**
 * Genera `docs/materiales-pendientes.md` (raíz del repo): lo que Marisol aún no
 * entrega y el sitio muestra como «Próximamente» o provisional (spec §9).
 *
 * Lee el catálogo de audio, el registro de videos, los productos, los cursos y
 * el brief fotográfico; el documento no se edita a mano. Corre código
 * TypeScript de `src/` con el strip de tipos de Node y `ts-alias-hooks.mjs`.
 *
 * Uso: `npm run export:pending-materials` (desde `frontend/`).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const { resolve: resolveTs } = await import('./ts-alias-hooks.mjs');
registerHooks({ resolve: resolveTs });

const { collectPendingInputs } = await import('./pending-materials-inputs.mjs');
const { renderPendingMaterials } = await import('../src/lib/materials/pending.ts');

const target = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../docs/materiales-pendientes.md',
);

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, renderPendingMaterials(collectPendingInputs()));

process.stdout.write(`Registro escrito en ${target}\n`);
