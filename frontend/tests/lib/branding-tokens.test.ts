import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const FRONTEND = process.cwd();
const BRANDING = resolve(FRONTEND, '../Branding');
const TOKENS = readFileSync(resolve(FRONTEND, 'src/app/tokens.css'), 'utf8');
const GLOBALS = readFileSync(resolve(FRONTEND, 'src/app/globals.css'), 'utf8');
const BRANDING_CSS = readFileSync(resolve(BRANDING, 'src/index.css'), 'utf8');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);

    if (statSync(path).isDirectory()) return sourceFiles(path);

    return /\.(jsx?|css)$/.test(path) ? [path] : [];
  });
}

/** Los prompts del brief fotográfico citan la paleta en hex: es texto para el agente, no estilo. */
const PROMPT_DATA = /[\\/]data[\\/]photography\.js$/;

const BRANDING_SOURCES = sourceFiles(resolve(BRANDING, 'src'))
  .filter((file) => !PROMPT_DATA.test(file))
  .map((file) => ({ file: relative(BRANDING, file), text: readFileSync(file, 'utf8') }));

function declared(prefix: string): Set<string> {
  return new Set(
    [...TOKENS.matchAll(new RegExp(`--${prefix}-([a-z0-9-]+):`, 'g'))].map((match) => match[1]!),
  );
}

describe('single source of design tokens', () => {
  it('the web consumes tokens.css and does not redeclare the theme', () => {
    expect(GLOBALS).toMatch(/@import ['"]\.\/tokens\.css['"]/);
    expect(GLOBALS).not.toContain('@theme');
  });

  it('Branding imports the same file and declares no theme of its own', () => {
    expect(BRANDING_CSS).toContain('../../frontend/src/app/tokens.css');
    expect(BRANDING_CSS).toContain('theme(static)');
    expect(BRANDING_CSS).not.toContain('@theme');
  });

  it('Branding writes no palette hex of its own', () => {
    for (const { file, text } of BRANDING_SOURCES) {
      expect(text.match(/#[0-9a-fA-F]{6}\b/g), file).toBeNull();
    }
  });

  it('every named scale Branding uses exists in tokens.css', () => {
    const scales = [
      { name: 'tracking', pattern: /\btracking-([a-z]+)\b/g, known: declared('tracking') },
      { name: 'glow', pattern: /\bshadow-glow-([a-z]+)\b/g, known: declared('shadow-glow') },
      { name: 'ivory tier', pattern: /\btext-fg-([a-z]+)\b/g, known: declared('color-fg') },
    ];

    for (const { name, pattern, known } of scales) {
      expect(known.size, `${name} tokens found in tokens.css`).toBeGreaterThan(0);

      for (const { file, text } of BRANDING_SOURCES) {
        for (const match of text.matchAll(pattern)) {
          expect(known.has(match[1]!), `${file}: ${match[0]}`).toBe(true);
        }
      }
    }
  });
});

describe('legacy pastel showcase', () => {
  it('is gone', () => {
    expect(existsSync(resolve(BRANDING, 'src/tokens'))).toBe(false);
    expect(existsSync(resolve(BRANDING, 'src/pages/PaletaTipografia.jsx'))).toBe(false);

    const manifest = JSON.parse(readFileSync(resolve(BRANDING, 'package.json'), 'utf8')) as {
      dependencies: Record<string, string>;
    };

    expect(manifest.dependencies).not.toHaveProperty('lucide-react');
  });
});
