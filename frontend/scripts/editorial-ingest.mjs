#!/usr/bin/env node
/**
 * Ingesta editorial: una sola compresión, desde el original.
 *
 * Lee cada PNG de `.editorial-originals/` y escribe en `public/editorial/`:
 *
 * - `<archivo>-<ancho>.avif` para cada ancho de `WIDTHS` que no supere el de
 *   la fuente, más el ancho exacto de la fuente si queda por debajo del mayor;
 * - `<archivo>.avif`, la variante mayor, para los consumidores que piden el
 *   archivo sin sufijo;
 * - el manifiesto `src/config/editorial-assets.generated.ts`.
 *
 * Qué se publica no lo decide este script: lo dice el estado del brief
 * (`Branding/src/data/photography-status.js`). Es idempotente: una variante
 * más reciente que su fuente, con la misma calidad, no se vuelve a codificar.
 * No toca `.editorial-trials/`, `_to_delete/`, `og-image.jpg` ni el README.
 *
 * Uso: `npm run editorial:ingest` (o `node scripts/editorial-ingest.mjs --force`).
 */
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { expandAll } from '../../Branding/src/data/photography.js';
import { statusOf } from '../../Branding/src/data/photography-status.js';

const FRONTEND = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGINALS = join(FRONTEND, '.editorial-originals');
const PUBLIC = join(FRONTEND, 'public/editorial');
const MANIFEST = join(FRONTEND, 'src/config/editorial-assets.generated.ts');
const STAMP = join(ORIGINALS, '.ingest-stamp.json');

/** Anchos de variante: los de `next/image` que caen en el rango útil, y el máster del brief. */
export const WIDTHS = [640, 828, 1200, 1920, 2880];

/**
 * Calidad AVIF, calibrada el 2026-10-10 con el sharp del proyecto (0.34.5,
 * libaom 3.13) a 1:1 y ampliada a 3× (lo que se ve a DPR 2 con la imagen
 * ampliada) contra el PNG, en q72, q80 y q88. La escala depende del codificador:
 * otro sharp da otros pesos y otro grano para la misma cifra.
 *
 * - degradado oscuro (`home-footer-banner`): q72 y q80 vuelven bandas lisas
 *   el grano horizontal del agua; q88 lo conserva (PSNR 46,9 / 47,2 / 47,8 dB);
 * - grano con cuerpo de luz (`home-hero`): q72 suaviza las motas del agua;
 *   q80 y q88 casi iguales (42,5 / 43,7 / 45,3 dB);
 * - objeto con detalle (`product-detail`): sin diferencia visible
 *   (45,5 / 45,8 / 46,4 dB).
 *
 * q88 es la menor calidad que no pierde el grano de la noche, que es la
 * materia de casi todas las imágenes. A 1672 px pesa 46–66 KB por imagen,
 * muy por debajo del presupuesto del brief (≤ 260 KB).
 */
export const AVIF_QUALITY = 88;
export const AVIF_EFFORT = 6;

/** Una imagen se sirve si el brief la da por completada, sin uso o a corregir pero publicada. */
function isServed(file) {
  const status = statusOf(file);
  return (
    status.state === 'completada' ||
    status.state === 'sin-uso' ||
    (status.state === 'corregir' && status.published === true)
  );
}

/** Anchos de una fuente: los de `WIDTHS` que caben, más el suyo si queda por debajo del mayor. */
export function variantWidths(sourceWidth) {
  const widths = WIDTHS.filter((width) => width <= sourceWidth);
  if (sourceWidth < WIDTHS[WIDTHS.length - 1] && !widths.includes(sourceWidth)) {
    widths.push(sourceWidth);
  }
  return widths.sort((a, b) => a - b);
}

function sourceFor(file) {
  const original = join(ORIGINALS, file.replace(/\.avif$/, '.png'));
  return existsSync(original) ? original : null;
}

function readStamp() {
  try {
    return JSON.parse(readFileSync(STAMP, 'utf8'));
  } catch {
    return {};
  }
}

async function ingest({ force }) {
  const stamp = readStamp();
  const sameSettings = stamp.quality === AVIF_QUALITY && stamp.effort === AVIF_EFFORT;
  const rows = expandAll().filter((row) => row.file.endsWith('.avif') && isServed(row.file));
  const assets = {};
  const widthsBySrc = {};
  const missing = [];
  let written = 0;

  for (const row of rows) {
    const source = sourceFor(row.file);
    if (!source) {
      missing.push(row.file);
      continue;
    }

    const base = row.file.replace(/\.avif$/, '');
    const { width: sourceWidth } = await sharp(source).metadata();
    const widths = variantWidths(sourceWidth);
    const sourceTime = statSync(source).mtimeMs;
    const largest = widths[widths.length - 1];

    for (const width of widths) {
      const target = join(PUBLIC, `${base}-${width}.avif`);
      const fresh =
        !force && sameSettings && existsSync(target) && statSync(target).mtimeMs >= sourceTime;
      if (fresh) continue;

      const pipeline = sharp(source).toColourspace('srgb');
      const resized =
        width === sourceWidth ? pipeline : pipeline.resize({ width, kernel: 'lanczos3' });
      await resized.avif({ quality: AVIF_QUALITY, effort: AVIF_EFFORT }).toFile(target);
      written += 1;
    }

    // El archivo sin sufijo es la variante mayor, byte a byte.
    writeFileSync(join(PUBLIC, row.file), readFileSync(join(PUBLIC, `${base}-${largest}.avif`)));

    // Variantes de otra pasada (otra fuente, otro tamaño) que ya no corresponden.
    // Los nombres del brief sólo llevan `[a-z0-9-]`: no hace falta escaparlos.
    const variant = new RegExp(`^${base}-(\\d+)\\.avif$`);
    for (const entry of readdirSync(PUBLIC)) {
      const match = entry.match(variant);
      if (match && !widths.includes(Number(match[1]))) unlinkSync(join(PUBLIC, entry));
    }

    const src = `/editorial/${row.file}`;
    assets[row.id] = src;
    widthsBySrc[src] = widths;
  }

  if (missing.length > 0) {
    throw new Error(`Faltan originales de imágenes publicadas: ${missing.join(', ')}`);
  }

  writeFileSync(MANIFEST, renderManifest(assets, widthsBySrc));
  writeFileSync(STAMP, `${JSON.stringify({ quality: AVIF_QUALITY, effort: AVIF_EFFORT })}\n`);

  return { images: rows.length, written };
}

function renderManifest(assets, widthsBySrc) {
  const byKey = Object.keys(assets).sort();
  const bySrc = Object.keys(widthsBySrc).sort();

  return [
    '/**',
    ' * Slot (o `slot:instancia`) → imagen publicada en `public/editorial/`.',
    ' * Lo escribe `npm run editorial:ingest`: un slot que no figura aquí pinta el fallback de su contrato.',
    ' * La ruta es la variante mayor; `EDITORIAL_ASSET_WIDTHS` lista las demás.',
    ' */',
    'export const EDITORIAL_ASSETS: Readonly<Record<string, string>> = {',
    ...byKey.map((key) => `  '${key}': '${assets[key]}',`),
    '};',
    '',
    '/**',
    ' * `src` de `EDITORIAL_ASSETS` → anchos publicados como `<archivo>-<ancho>.avif`, en orden',
    ' * creciente. Los lee el loader de `next/image` (`lib/editorial/image-loader.ts`).',
    ' */',
    'export const EDITORIAL_ASSET_WIDTHS: Readonly<Record<string, readonly number[]>> = {',
    ...bySrc.map((src) => `  '${src}': [${widthsBySrc[src].join(', ')}],`),
    '};',
    '',
  ].join('\n');
}

const force = process.argv.includes('--force');
const { images, written } = await ingest({ force });
process.stdout.write(
  `${images} imágenes ingeridas; ${written} variantes codificadas en AVIF q${AVIF_QUALITY}.\n`,
);
