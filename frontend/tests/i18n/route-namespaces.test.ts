import { existsSync } from 'node:fs';
import { dirname, join, resolve as resolvePath } from 'node:path';

import { describe, expect, it } from 'vitest';

import { BASE_NAMESPACES, pickMessages, ROUTE_NAMESPACES, type RouteRealm } from '@/i18n/messages';

import { readSource, sourceFiles, SRC } from '../helpers/source-files';

const FEATURES = join(SRC, 'components/features');

/** Capa viva, montada en el layout raíz: sus namespaces tienen que caber en BASE. */
const BASE_DIRS = [
  join(SRC, 'components/layout'),
  join(SRC, 'components/world'),
  join(SRC, 'components/ui'),
  join(FEATURES, 'player'),
];

/** Extrae los namespaces que pide un archivo: `useTranslations('ns')` y claves absolutas. */
function namespacesFromSource(source: string): Set<string> {
  const namespaces = new Set<string>();

  for (const match of source.matchAll(/useTranslations\(([^)]*)\)/g)) {
    const arg = match[1]?.trim() ?? '';
    if (arg === '') continue;
    const literal = arg.match(/^['"]([^'"]+)['"]$/);
    if (literal) namespaces.add(literal[1]!.split('.')[0]!);
  }

  // `useTranslations()` sin namespace lee claves absolutas (`auth.login.tab`):
  // el prefijo antes del primer punto es el namespace real.
  for (const match of source.matchAll(/const\s+(\w+)\s*=\s*useTranslations\(\s*\)/g)) {
    const call = new RegExp(String.raw`\b${match[1]!}\(\s*'([a-zA-Z][^']*)'`, 'g');
    for (const found of source.matchAll(call)) namespaces.add(found[1]!.split('.')[0]!);
  }

  return namespaces;
}

/** Especificadores de import/export de un archivo. */
function importSpecifiers(source: string): string[] {
  const specifiers: string[] = [];
  const patterns = [
    /from\s+['"]([^'"]+)['"]/g,
    /import\(\s*['"]([^'"]+)['"]\s*\)/g,
    /import\s+['"]([^'"]+)['"]/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) specifiers.push(match[1]!);
  }
  return specifiers;
}

/** Resuelve un import a archivo real, sólo si cae dentro de `features/` o `hooks/`. */
function resolveImport(fromFile: string, specifier: string): string | null {
  let base: string;
  if (specifier.startsWith('@/components/features/')) base = join(SRC, specifier.slice(2));
  else if (specifier.startsWith('@/hooks/')) base = join(SRC, specifier.slice(2));
  else if (specifier.startsWith('.')) base = resolvePath(dirname(fromFile), specifier);
  else return null;

  const candidates = [`${base}.tsx`, `${base}.ts`, join(base, 'index.tsx'), join(base, 'index.ts')];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

/** Namespaces que necesitan unos archivos, siguiendo features y hooks importados. */
function requiredNamespaces(startFiles: readonly string[]): Set<string> {
  const namespaces = new Set<string>();
  const queue = [...startFiles];
  const seen = new Set<string>();

  while (queue.length > 0) {
    const file = queue.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);

    const source = readSource(file);
    for (const namespace of namespacesFromSource(source)) namespaces.add(namespace);
    for (const specifier of importSpecifiers(source)) {
      const resolved = resolveImport(file, specifier);
      if (resolved && !seen.has(resolved)) queue.push(resolved);
    }
  }

  return namespaces;
}

/** Archivos de ruta de un realm (raíz de portal incluida). */
function routeFiles(realm: RouteRealm): string[] {
  if (realm === 'portal') return [join(SRC, 'app/[locale]/page.tsx')];
  return sourceFiles(join(SRC, 'app/[locale]', realm));
}

const baseSet = new Set<string>(BASE_NAMESPACES);

describe('namespaces de mensajes por ruta', () => {
  it('la capa viva no pide nada fuera de BASE', () => {
    for (const dir of BASE_DIRS) {
      const used = [...requiredNamespaces(sourceFiles(dir))];
      expect(
        used.filter((namespace) => !baseSet.has(namespace)),
        `${dir} pide namespaces fuera de BASE`,
      ).toEqual([]);
    }
  });

  it.each(Object.keys(ROUTE_NAMESPACES) as RouteRealm[])(
    'el realm «%s» sólo pide BASE + su ROUTE',
    (realm) => {
      const allowed = new Set<string>([...BASE_NAMESPACES, ...ROUTE_NAMESPACES[realm]]);
      const used = [...requiredNamespaces(routeFiles(realm))];
      expect(
        used.filter((namespace) => !allowed.has(namespace)),
        `el realm «${realm}» pide un namespace que su layout no provee`,
      ).toEqual([]);
    },
  );

  it('cada realm con namespaces propios tiene su layout que los provee', () => {
    for (const realm of Object.keys(ROUTE_NAMESPACES) as RouteRealm[]) {
      if (realm === 'portal' || ROUTE_NAMESPACES[realm].length === 0) continue;
      expect(
        existsSync(join(SRC, 'app/[locale]', realm, 'layout.tsx')),
        `falta src/app/[locale]/${realm}/layout.tsx`,
      ).toBe(true);
    }
  });

  it('pickMessages recorta el catálogo a los namespaces pedidos', async () => {
    const messages = (await import('../../messages/es.json')).default;
    const picked = pickMessages(messages, ['common', 'auth']);
    expect(Object.keys(picked).sort()).toEqual(['auth', 'common']);
    expect(picked.common).toEqual(messages.common);
    expect(picked.auth).toEqual(messages.auth);
  });
});
