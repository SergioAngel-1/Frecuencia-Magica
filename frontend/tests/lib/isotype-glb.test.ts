import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { ISOTYPE_ASSETS, ISOTYPE_RINGED_POSTER, type IsotypeVariant } from '@/config/isotype';
import { parseIsotypeGlb } from '@/lib/isotype/glb';

const PUBLIC = resolve(process.cwd(), 'public');
const VARIANTS = Object.keys(ISOTYPE_ASSETS) as IsotypeVariant[];

function readModel(variant: IsotypeVariant): ArrayBuffer {
  const file = readFileSync(resolve(PUBLIC, `.${ISOTYPE_ASSETS[variant].model}`));

  return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
}

describe('isotype models', () => {
  it.each(VARIANTS)('ships the %s model and its poster', (variant) => {
    const { model, poster } = ISOTYPE_ASSETS[variant];

    expect(existsSync(resolve(PUBLIC, `.${model}`))).toBe(true);
    expect(existsSync(resolve(PUBLIC, `.${poster}`))).toBe(true);
  });

  it('ships the ringed poster the header uses', () => {
    expect(existsSync(resolve(PUBLIC, `.${ISOTYPE_RINGED_POSTER}`))).toBe(true);
  });

  it.each(VARIANTS)('reads the %s model as a gold mesh and a teal mesh', (variant) => {
    const meshes = parseIsotypeGlb(readModel(variant));

    expect(meshes).toHaveLength(2);

    for (const mesh of meshes) {
      // Posición int16 ×3 (más relleno) y normal int8 ×3, en 12 bytes: lo que espera el visor.
      expect(mesh.stride).toBe(12);
      expect(mesh.normalOffset).toBe(8);
      expect(mesh.vertices.byteLength % mesh.stride).toBe(0);
      expect(mesh.indices.byteLength).toBe(mesh.indexCount * 2);
      expect(mesh.indexCount % 3).toBe(0);
      expect(mesh.scale).toBeGreaterThan(0);
    }

    const [gold, teal] = meshes;

    // El oro tira a rojo y el turquesa a azul: el orden de las mallas no se ha cruzado.
    expect(gold?.base[0]).toBeGreaterThan(gold?.base[2] ?? 1);
    expect(teal?.base[2]).toBeGreaterThan(teal?.base[0] ?? 1);
  });

  it('keeps every index inside its vertex buffer', () => {
    for (const variant of VARIANTS) {
      for (const mesh of parseIsotypeGlb(readModel(variant))) {
        const indices = new Uint16Array(
          mesh.indices.buffer.slice(
            mesh.indices.byteOffset,
            mesh.indices.byteOffset + mesh.indices.byteLength,
          ),
        );

        expect(Math.max(...indices)).toBeLessThan(mesh.vertices.byteLength / mesh.stride);
      }
    }
  });

  it('keeps the optical model lighter than the detail one', () => {
    expect(readModel('sm').byteLength).toBeLessThan(readModel('detail').byteLength);
  });

  it('rejects a file that is not a GLB', () => {
    expect(() => parseIsotypeGlb(new ArrayBuffer(32))).toThrow();
  });
});
