import type { AtmosphereId } from '@/types/atmosphere';

import type { Rgb } from './colors';
import { advanceParticle, createParticles, createStars, type Particle } from './particles';
import { SCENE_THEMES, type ParticleKind, type SceneTheme } from './themes';

const STAR_COUNT = 220;
const TAU = Math.PI * 2;

/** Posición (x, y) y radio de cada nebulosa, en fracciones del lienzo. Los colores los pone el tema. */
const NEBULA_SPOTS: readonly (readonly [number, number, number])[] = [
  [0.22, 0.3, 0.42],
  [0.78, 0.7, 0.4],
  [0.55, 0.45, 0.34],
];

/** Segundos que tarda el tema viejo en apagarse y el nuevo en encenderse al cambiar de tema. */
const THEME_FADE_OUT_SECONDS = 0.35;
const THEME_FADE_IN_SECONDS = 0.55;

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
  /**
   * Cambia de tema. Con el bucle en marcha el viejo se apaga y el nuevo se enciende
   * (`frame`); con movimiento reducido (`still`) el cambio es inmediato.
   */
  setTheme: (theme: AtmosphereId) => void;
  /** Avanza las partículas un paso y pinta el frame de `timestamp` (ms). */
  frame: (timestamp: number) => void;
  /** Un frame quieto, sin parpadeo: lo que se ve con movimiento reducido. */
  still: () => void;
};

/** Brillo propio de cada tipo de partícula en el instante `time` (segundos), de 0 a 1. */
function flicker(kind: ParticleKind, phase: number, time: number): number {
  switch (kind) {
    case 'ember':
      return 0.65 + 0.35 * Math.sin(time * 7 + phase);
    case 'mote':
      return 0.8 + 0.2 * Math.sin(time * 1.3 + phase);
    case 'firefly': {
      const pulse = Math.max(0, Math.sin(time * 1.8 + phase));

      return 0.08 + 0.92 * pulse * pulse;
    }
    case 'spore':
      return 0.75;
    case 'rise':
      return 1;
  }
}

/**
 * Fondo vivo: estrellas que parpadean, partículas que se mueven a su manera y
 * tres nebulosas a la deriva, según el tema (`themes.ts`). Se recolorea al acento
 * del realm sin regenerar nada (la noche) y se transforma al cambiar de tema.
 *
 * Port de `setupCanvas` / `drawFrame` del prototipo para la noche; los valores
 * mágicos son intencionales. No toca el DOM: el mismo código pinta desde un
 * worker (`OffscreenCanvas`) o desde el hilo principal.
 */
export function createCosmicScene(
  ctx: CosmicContext,
  initial: CosmicViewport,
  initialAccent: Rgb,
  random: () => number = Math.random,
  initialTheme: AtmosphereId = 'night',
): CosmicScene {
  let width = 0;
  let height = 0;
  let dpr = 1;
  let small = initial.small;
  let accent = initialAccent;
  let themeId: AtmosphereId = initialTheme;
  let theme: SceneTheme = SCENE_THEMES[initialTheme];

  const stars = createStars(STAR_COUNT, random);
  let particles: Particle[] = [];
  // Gradiente de cada partícula, pre-horneado en coordenadas locales centradas
  // en el origen: el bucle lo coloca con la transformación en lugar de crear
  // un gradiente por partícula y frame (Task 16.4 — presupuesto de animación).
  // Se regeneran al cambiar el acento, el tema o el número de partículas.
  let sprites: CanvasGradient[] = [];

  // Cambio de tema: `out` apaga el viejo, `in` enciende el nuevo; `level` es el alfa global.
  let pending: AtmosphereId | null = null;
  let phase: 'idle' | 'out' | 'in' = 'idle';
  let level = 1;
  let lastTimestamp: number | null = null;

  const rebuildSprites = () => {
    sprites = particles.map((p) => {
      const [r, g, b] = theme.groups[p.group]?.rgb ?? accent;
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r * 4);
      gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
      gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
      return gradient;
    });
  };

  const rebuildParticles = () => {
    particles = theme.groups.flatMap((group, index) =>
      createParticles(small ? group.mobile : group.count, random, {
        kind: group.kind,
        group: index,
        radius: group.radius,
        alpha: group.alpha,
      }),
    );
    rebuildSprites();
  };

  const applyTheme = (id: AtmosphereId) => {
    themeId = id;
    theme = SCENE_THEMES[id];
    rebuildParticles();
  };

  const resize = (viewport: CosmicViewport) => {
    ({ width, height, dpr } = viewport);
    ctx.canvas.width = width * dpr;
    ctx.canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Cambio de breakpoint: regenerar las partículas del tema y sus sprites.
    if (small !== viewport.small || particles.length === 0) {
      small = viewport.small;
      rebuildParticles();
    }
  };

  const draw = (time: number, twinkleFrozen: boolean) => {
    ctx.clearRect(0, 0, width, height);
    const max = Math.max(width, height);

    // Nebulosas radiales a la deriva.
    ctx.globalAlpha = level;
    for (let i = 0; i < theme.nebulae.length; i++) {
      const [r, g, b] = theme.nebulae[i] ?? accent;
      const dx = Math.sin(time * 0.0001 * (0.6 + i * 0.3)) * 0.03;
      const dy = Math.cos(time * 0.0001 * (0.5 + i * 0.25)) * 0.03;
      const [spotX, spotY, spotR] = NEBULA_SPOTS[i]!;
      const cx = (spotX + dx) * width;
      const cy = (spotY + dy) * height;
      const radius = spotR * max;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, `rgba(${r},${g},${b},${theme.nebulaAlpha})`);
      gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Estrellas: parpadeo senoidal. El alfa va en `globalAlpha` sobre un
    // relleno fijo: mismo resultado que un `rgba()` por estrella, sin
    // construir ni analizar 220 cadenas de color en cada frame.
    const { stars: look } = theme;
    if (look.count > 0) {
      const [sr, sg, sb] = look.rgb;
      ctx.fillStyle = `rgb(${sr},${sg},${sb})`;
      const swing = 0.6 * (look.twinkle / 0.6);
      for (let i = 0; i < look.count && i < stars.length; i++) {
        const star = stars[i]!;
        const tw = twinkleFrozen
          ? 0.7
          : 0.5 + 0.5 * Math.sin(time * 0.0001 * 6 * star.sp + star.tw);
        ctx.globalAlpha = (0.25 + swing * tw) * look.alpha * level;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.r, 0, TAU);
        ctx.fill();
      }
    }

    // Partículas, dibujadas con el sprite pre-horneado: la transformación lo lleva a su sitio.
    const seconds = twinkleFrozen ? 0.5 : time * 0.001;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const sprite = sprites[i];
      if (!p || !sprite) continue;
      ctx.globalAlpha = p.a * flicker(p.kind, p.phase, seconds) * level;
      ctx.setTransform(dpr, 0, 0, dpr, p.x * width * dpr, p.y * height * dpr);
      ctx.fillStyle = sprite;
      ctx.beginPath();
      ctx.arc(0, 0, p.r * 4, 0, TAU);
      ctx.fill();
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
  };

  /** Hace avanzar el fundido del cambio de tema `seconds` y devuelve el alfa global. */
  const advanceFade = (seconds: number) => {
    if (phase === 'out') {
      level = Math.max(0, level - seconds / THEME_FADE_OUT_SECONDS);
      if (level === 0 && pending) {
        applyTheme(pending);
        pending = null;
        phase = 'in';
      }
    } else if (phase === 'in') {
      level = Math.min(1, level + seconds / THEME_FADE_IN_SECONDS);
      if (level === 1) phase = 'idle';
    }
  };

  resize(initial);

  return {
    resize,
    setAccent: (next) => {
      accent = next;
      rebuildSprites();
    },
    setTheme: (next) => {
      if (next === themeId && pending === null) return;
      // Si ya hay un cambio en curso, sólo cambia el destino.
      pending = next;
      if (phase === 'idle' || phase === 'in') phase = 'out';
    },
    frame: (timestamp) => {
      const elapsed =
        lastTimestamp === null ? 0 : Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;
      advanceFade(elapsed);
      const seconds = timestamp * 0.001;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p) particles[i] = advanceParticle(p, random, seconds);
      }
      draw(timestamp, false);
    },
    still: () => {
      // Sin bucle no hay fundido: el tema pendiente se aplica de golpe.
      if (pending) {
        applyTheme(pending);
        pending = null;
      }
      phase = 'idle';
      level = 1;
      lastTimestamp = null;
      draw(0, true);
    },
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
