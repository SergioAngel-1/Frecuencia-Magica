import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

/** `src/` de la web, resuelto desde `frontend/` (Vitest corre ahí). */
export const SRC = resolve(process.cwd(), 'src');

/**
 * Recorre `dir` y devuelve las rutas absolutas de los archivos que casan con
 * `pattern`. Lo comparten los tests guardia que inspeccionan el código fuente.
 */
export function sourceFiles(dir: string, pattern: RegExp = /\.(ts|tsx)$/): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);

    if (statSync(path).isDirectory()) return sourceFiles(path, pattern);

    return pattern.test(path) ? [path] : [];
  });
}

/** Lee un archivo de código como texto. */
export function readSource(path: string): string {
  return readFileSync(path, 'utf8');
}

/** Ruta relativa a `src/`, para mensajes de error legibles. */
export function fromSrc(path: string): string {
  return relative(SRC, path);
}
