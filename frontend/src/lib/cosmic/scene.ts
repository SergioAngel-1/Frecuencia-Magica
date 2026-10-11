import type { Rgb } from './colors';
import { advanceParticle, createParticles, createStars, type Particle } from './particles';

const STAR_COUNT = 220;
/** Partículas en desktop; se baja a 28 por debajo de 768px (presupuesto 16.4). */
const PARTICLE_COUNT = 54;
const PARTICLE_COUNT_MOBILE = 28;
const STAR_FILL = 'rgb(247,244,234)';
const TAU = Math.PI * 2;

/** Nebulosas fijas del canvas. La tercera se recolorea con el acento del realm. */
const NEBULAE: readonly { x: number; y: number; r: number; color: Rgb | null }[] = [
  { x: 0.22, y: 0.3, r: 0.42, color: [150, 198, 188] },
  { x: 0.78, y: 0.7, r: 0.4, color: [185, 176, 214] },
  { x: 0.55, y: 0.45, r: 0.34, color: null },
];

/**
 * El bucle no pinta dos veces en menos de esto: en pantallas de 120 Hz el
 * fondo sigue a 60 fps, que es el ritmo para el que están escritas sus
 * velocidades (el polen avanza por frame, no por tiempo).
 */
const MIN_FRAME_MS = 10;

/** El contexto 2D del canvas, en el hilo principal o en un worker. */
export type CosmicContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

/** Medidas del lienzo: tamaño CSS, densidad ya capada y breakpoint móvil. */
export type CosmicViewport = {
  width: number;
  height: number;
  dpr: number;
  small: boolean;
};

export type CosmicScene = {
  resize: (viewport: CosmicViewport) => void;
  setAccent: (accent: Rgb) => void;
  /** Avanza el polen un paso y pinta el frame de `timestamp` (ms). */
  frame: (timestamp: number) => void;
  /** Un frame quieto, sin parpadeo: lo que se ve con movimiento reducido. */
  still: () => void;
};

/**
 * Fondo cósmico: estrellas que parpadean, polen dorado que asciende y tres
 * nebulosas a la deriva. Se recolorea al acento del realm sin regenerar nada.
 *
 * Port literal de `setupCanvas` / `drawFrame` del prototipo; los valores
 * mágicos son intencionales. No toca el DOM: el mismo código pinta desde un
 * worker (`OffscreenCanvas`) o desde el hilo principal.
 */
export function createCosmicScene(
  ctx: CosmicContext,
  initial: CosmicViewport,
  initialAccent: Rgb,
  random: () => number = Math.random,
): CosmicScene {
  let width = 0;
  let height = 0;
  let dpr = 1;
  let accent = initialAccent;

  const stars = createStars(STAR_COUNT, random);
  let particles: Particle[] = [];
  // Gradiente de cada partícula, pre-horneado en coordenadas locales centradas
  // en el origen: el bucle lo coloca con la transformación en lugar de crear
  // 54 gradientes por frame (Task 16.4 — presupuesto de animación). Se
  // regeneran al cambiar el acento o el número de partículas.
  let sprites: CanvasGradient[] = [];

  const rebuildSprites = () => {
    const [r, g, b] = accent;

    sprites = particles.map((p) => {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r * 4);
      gradient.addColorStop(0, `rgba(${r},${g},${b},${p.a})`);
      gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
      return gradient;
    });
  };

  const resize = (viewport: CosmicViewport) => {
    ({ width, height, dpr } = viewport);
    ctx.canvas.width = width * dpr;
    ctx.canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Cambio de breakpoint: regenerar partículas (54 → 28) y sus sprites.
    const count = viewport.small ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT;
    if (particles.length !== count) {
      particles = createParticles(count, random);
      rebuildSprites();
    }
  };

  const draw = (time: number, twinkleFrozen: boolean) => {
    ctx.clearRect(0, 0, width, height);
    const max = Math.max(width, height);

    // Nebulosas radiales a la deriva.
    for (let i = 0; i < NEBULAE.length; i++) {
      const nebula = NEBULAE[i];
      if (!nebula) continue;
      const [r, g, b] = nebula.color ?? accent;
      const dx = Math.sin(time * (0.6 + i * 0.3)) * 0.03;
      const dy = Math.cos(time * (0.5 + i * 0.25)) * 0.03;
      const cx = (nebula.x + dx) * width;
      const cy = (nebula.y + dy) * height;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, nebula.r * max);
      gradient.addColorStop(0, `rgba(${r},${g},${b},0.11)`);
      gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Estrellas: parpadeo senoidal. El alfa va en `globalAlpha` sobre un
    // relleno fijo: mismo resultado que un `rgba()` por estrella, sin
    // construir ni analizar 220 cadenas de color en cada frame.
    ctx.fillStyle = STAR_FILL;
    for (const star of stars) {
      const tw = twinkleFrozen ? 0.7 : 0.5 + 0.5 * Math.sin(time * 6 * star.sp + star.tw);
      ctx.globalAlpha = 0.25 + 0.6 * tw;
      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.r, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Partículas de polen con el color de acento, dibujadas con el sprite
    // pre-horneado: la transformación lo lleva a su sitio.
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const sprite = sprites[i];
      if (!p || !sprite) continue;
      ctx.setTransform(dpr, 0, 0, dpr, p.x * width * dpr, p.y * height * dpr);
      ctx.fillStyle = sprite;
      ctx.beginPath();
      ctx.arc(0, 0, p.r * 4, 0, TAU);
      ctx.fill();
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize(initial);

  return {
    resize,
    setAccent: (next) => {
      accent = next;
      rebuildSprites();
    },
    frame: (timestamp) => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p) particles[i] = advanceParticle(p, random);
      }
      draw(timestamp * 0.0001, false);
    },
    still: () => draw(0, true),
  };
}

export type CosmicDriver = {
  setReduced: (reduced: boolean) => void;
  setVisible: (visible: boolean) => void;
  /** Tras un cambio de tamaño o de acento: repinta el frame quieto si no hay bucle. */
  refresh: () => void;
  stop: () => void;
};

/**
 * Lleva el ritmo de la escena: un bucle mientras la pestaña se ve y el
 * movimiento está permitido; con movimiento reducido, un único frame quieto.
 * Recibe `schedule`/`cancel` (`requestAnimationFrame` del hilo en que corra).
 */
export function createCosmicDriver(
  scene: CosmicScene,
  schedule: (callback: (timestamp: number) => void) => number,
  cancel: (handle: number) => void,
): CosmicDriver {
  let handle = 0;
  let running = false;
  let reduced = false;
  let visible = true;
  let last = -Infinity;

  const tick = (timestamp: number) => {
    handle = schedule(tick);
    if (timestamp - last < MIN_FRAME_MS) return;
    last = timestamp;
    scene.frame(timestamp);
  };

  const sync = () => {
    const shouldRun = visible && !reduced;

    if (shouldRun && !running) {
      running = true;
      handle = schedule(tick);
    } else if (!shouldRun && running) {
      running = false;
      cancel(handle);
    }
    if (reduced) scene.still();
  };

  sync();

  return {
    setReduced: (next) => {
      reduced = next;
      sync();
    },
    setVisible: (next) => {
      visible = next;
      sync();
    },
    refresh: () => {
      if (reduced) scene.still();
    },
    stop: () => {
      running = false;
      cancel(handle);
    },
  };
}
