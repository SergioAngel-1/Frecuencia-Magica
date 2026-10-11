/**
 * Lector mínimo de los GLB del isotipo.
 *
 * No es un lector de glTF general: asume el formato que escribe
 * `3D Prototypes/web/tools/gen.py` — una primitiva por malla, `POSITION` int16
 * y `NORMAL` int8 normalizados e intercalados (`KHR_mesh_quantization`),
 * índices uint16 y material `pbrMetallicRoughness` sin texturas.
 */

export type IsotypeMesh = {
  /** Vértices intercalados: posición (3 × int16) y normal (3 × int8). */
  vertices: Uint8Array;
  /** Índices uint16, como bytes. */
  indices: Uint8Array;
  stride: number;
  normalOffset: number;
  indexCount: number;
  /** Escala del nodo: descuantiza las posiciones. */
  scale: number;
  base: [number, number, number];
  metallic: number;
  roughness: number;
};

type Accessor = { bufferView: number; byteOffset?: number; count: number };
type BufferView = { byteOffset?: number; byteLength: number; byteStride?: number };

type GlbJson = {
  nodes: { mesh?: number; scale?: number[] }[];
  meshes: {
    primitives: {
      attributes: { POSITION: number; NORMAL: number };
      indices: number;
      material: number;
    }[];
  }[];
  accessors: Accessor[];
  bufferViews: BufferView[];
  materials: {
    pbrMetallicRoughness: {
      baseColorFactor?: number[];
      metallicFactor?: number;
      roughnessFactor?: number;
    };
  }[];
};

const GLB_MAGIC = 0x46546c67;
const HEADER_BYTES = 12;
const CHUNK_HEADER_BYTES = 8;

function at<T>(list: readonly T[], index: number, what: string): T {
  const item = list[index];

  if (item === undefined) throw new Error(`isotype glb: missing ${what} ${index}`);

  return item;
}

export function parseIsotypeGlb(buffer: ArrayBuffer): IsotypeMesh[] {
  const view = new DataView(buffer);

  if (view.byteLength < HEADER_BYTES || view.getUint32(0, true) !== GLB_MAGIC) {
    throw new Error('isotype glb: not a GLB file');
  }

  const jsonLength = view.getUint32(HEADER_BYTES, true);
  const jsonStart = HEADER_BYTES + CHUNK_HEADER_BYTES;
  const json = JSON.parse(
    new TextDecoder().decode(new Uint8Array(buffer, jsonStart, jsonLength)),
  ) as GlbJson;
  const bin = new Uint8Array(buffer, jsonStart + jsonLength + CHUNK_HEADER_BYTES);

  return json.nodes.flatMap((node) => {
    if (node.mesh === undefined) return [];

    const primitive = at(at(json.meshes, node.mesh, 'mesh').primitives, 0, 'primitive');
    const position = at(json.accessors, primitive.attributes.POSITION, 'accessor');
    const normal = at(json.accessors, primitive.attributes.NORMAL, 'accessor');
    const index = at(json.accessors, primitive.indices, 'accessor');
    const vertexView = at(json.bufferViews, position.bufferView, 'bufferView');
    const indexView = at(json.bufferViews, index.bufferView, 'bufferView');
    const material = at(json.materials, primitive.material, 'material').pbrMetallicRoughness;
    const [r = 1, g = 1, b = 1] = material.baseColorFactor ?? [];
    const vertexStart = vertexView.byteOffset ?? 0;
    const indexStart = (indexView.byteOffset ?? 0) + (index.byteOffset ?? 0);

    return [
      {
        vertices: bin.subarray(vertexStart, vertexStart + vertexView.byteLength),
        indices: bin.subarray(indexStart, indexStart + index.count * 2),
        stride: vertexView.byteStride ?? 12,
        normalOffset: normal.byteOffset ?? 0,
        indexCount: index.count,
        scale: node.scale?.[0] ?? 1,
        base: [r, g, b],
        metallic: material.metallicFactor ?? 1,
        roughness: material.roughnessFactor ?? 1,
      },
    ];
  });
}
