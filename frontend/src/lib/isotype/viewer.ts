import { ISOTYPE_VIEW } from '@/config/isotype';

import { parseIsotypeGlb, type IsotypeMesh } from './glb';

/**
 * Visor WebGL del isotipo, sin dependencias.
 *
 * Dos llamadas de dibujo (oro y turquesa) con un «estudio» procedural en el
 * shader: cielo cálido, rebote azul noche y dos focos. Sin texturas ni mapas
 * de entorno. Los valores salen de la prueba de `3D Prototypes/web/`.
 *
 * Este módulo se carga en diferido (`import()`): no entra en el JS de primera
 * carga de ninguna ruta.
 */

export type IsotypeViewer = {
  /** Pinta el modelo girado `angle` radianes sobre su eje vertical. */
  draw: (angle: number) => void;
  dispose: () => void;
};

const LOOK = {
  exposure: 1.12,
  sky: [1.0, 0.98, 0.94],
  ground: [0.1, 0.13, 0.2],
  key: 1.6,
  rim: 0.4,
  diffuse: 0.55,
} as const;

const VERTEX_SHADER = `
attribute vec3 aPos; attribute vec3 aNor;
uniform vec2 uRot; uniform float uScale;
varying vec3 vN;
void main() {
  vec3 p = aPos * uScale;
  vec3 q = vec3(p.x * uRot.x + p.z * uRot.y, p.y, -p.x * uRot.y + p.z * uRot.x);
  vN = vec3(aNor.x * uRot.x + aNor.z * uRot.y, aNor.y, -aNor.x * uRot.y + aNor.z * uRot.x);
  gl_Position = vec4(q.xy * ${(2 / ISOTYPE_VIEW).toFixed(6)}, -q.z * 0.4, 1.0);
}`;

const FRAGMENT_SHADER = `
precision mediump float;
varying vec3 vN;
uniform vec3 uBase, uSky, uGround; uniform vec4 uMat; uniform vec3 uLook;
const vec3 KEY = vec3(-0.5499, 0.6198, 0.5599);
const vec3 RIM = vec3(0.9103, 0.1138, 0.3983);
vec3 env(vec3 r, float rough) {
  float up = smoothstep(-0.55, 0.85, r.y);
  vec3 c = mix(uGround, uSky, up);
  float w = mix(0.22, 0.75, rough);
  c += uSky * uLook.x * exp(-dot(r - KEY, r - KEY) / w);
  c += vec3(1.0, 0.93, 0.8) * uLook.y * exp(-dot(r - RIM, r - RIM) / (w * 0.7));
  return c;
}
void main() {
  vec3 n = normalize(vN);
  float metallic = uMat.x, rough = uMat.y;
  vec3 r = reflect(vec3(0.0, 0.0, -1.0), n);
  float nv = max(n.z, 0.0);
  vec3 f0 = mix(vec3(0.04), uBase, metallic);
  vec3 fres = f0 + (1.0 - f0) * pow(1.0 - nv, 5.0) * 0.25;
  vec3 spec = fres * env(r, rough);
  vec3 diff = uBase * (1.0 - metallic) * uLook.z * env(n, 1.0);
  vec3 c = (spec + diff) * uMat.z;
  gl_FragColor = vec4(pow(c / (1.0 + c * 0.18), vec3(0.4545)), 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);

  if (!shader) throw new Error('isotype viewer: shader allocation failed');

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`isotype viewer: ${gl.getShaderInfoLog(shader) ?? 'shader failed'}`);
  }

  return shader;
}

/** `null` si el navegador no da un contexto WebGL: quien llama se queda con el póster. */
export function createIsotypeViewer(
  canvas: HTMLCanvasElement,
  meshes: readonly IsotypeMesh[],
): IsotypeViewer | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  });

  if (!gl) return null;

  const program = gl.createProgram();

  if (!program) return null;

  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
  gl.bindAttribLocation(program, 0, 'aPos');
  gl.bindAttribLocation(program, 1, 'aNor');
  gl.linkProgram(program);
  gl.useProgram(program);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const uRot = uniform('uRot');
  const uScale = uniform('uScale');
  const uBase = uniform('uBase');
  const uMat = uniform('uMat');

  const parts = meshes.map((mesh) => {
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

    return { mesh, vertexBuffer, indexBuffer };
  });

  gl.enable(gl.DEPTH_TEST);
  // Las mallas son cerradas: la cara trasera nunca se ve.
  gl.enable(gl.CULL_FACE);
  gl.clearColor(0, 0, 0, 0);
  gl.uniform3fv(uniform('uSky'), LOOK.sky);
  gl.uniform3fv(uniform('uGround'), LOOK.ground);
  gl.uniform3f(uniform('uLook'), LOOK.key, LOOK.rim, LOOK.diffuse);
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);

  return {
    draw(angle) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform2f(uRot, Math.cos(angle), Math.sin(angle));

      for (const { mesh, vertexBuffer, indexBuffer } of parts) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.vertexAttribPointer(0, 3, gl.SHORT, true, mesh.stride, 0);
        gl.vertexAttribPointer(1, 3, gl.BYTE, true, mesh.stride, mesh.normalOffset);
        gl.uniform1f(uScale, mesh.scale);
        gl.uniform3fv(uBase, mesh.base);
        gl.uniform4f(uMat, mesh.metallic, mesh.roughness, LOOK.exposure, 0);
        gl.drawElements(gl.TRIANGLES, mesh.indexCount, gl.UNSIGNED_SHORT, 0);
      }
    },
    dispose() {
      // Los navegadores limitan los contextos vivos: se suelta sin esperar al recolector.
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}

/** Descarga el modelo y monta el visor sobre `canvas`. `null` sin WebGL. */
export async function loadIsotypeViewer(
  canvas: HTMLCanvasElement,
  modelUrl: string,
  signal: AbortSignal,
): Promise<IsotypeViewer | null> {
  const response = await fetch(modelUrl, { signal });

  if (!response.ok) throw new Error(`isotype viewer: ${response.status} for ${modelUrl}`);

  return createIsotypeViewer(canvas, parseIsotypeGlb(await response.arrayBuffer()));
}
