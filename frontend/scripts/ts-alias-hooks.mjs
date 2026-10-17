/**
 * Hook de resolución de Node para correr código TypeScript de `src/` desde un
 * script, sin compilar: resuelve el alias `@/` a `src/` y añade la extensión
 * (`.ts`, `.tsx` o `/index.ts`) a los imports relativos sin ella. Node (>= 22.7)
 * ya borra los tipos; esto sólo le enseña a encontrar los archivos.
 *
 * Lo registra `scripts/export-pending-materials.mjs` con `module.registerHooks`
 * (Node >= 22.15).
 */
import { existsSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve as resolvePath } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SRC = resolvePath(dirname(fileURLToPath(import.meta.url)), '../src');
const CANDIDATES = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];

const isFile = (path) => existsSync(path) && statSync(path).isFile();

function locate(base) {
  for (const suffix of CANDIDATES) {
    if (isFile(base + suffix)) return base + suffix;
  }
  return null;
}

export function resolve(specifier, context, nextResolve) {
  let base = null;

  if (specifier.startsWith('@/')) {
    base = join(SRC, specifier.slice(2));
  } else if (
    (specifier.startsWith('./') || specifier.startsWith('../')) &&
    context.parentURL?.startsWith('file:') &&
    extname(specifier) === ''
  ) {
    base = resolvePath(dirname(fileURLToPath(context.parentURL)), specifier);
  }

  const hit = base ? locate(base) : null;
  if (hit) return nextResolve(pathToFileURL(hit).href, context);

  return nextResolve(specifier, context);
}
