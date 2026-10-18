import type { AtmosphereId } from '@/types/atmosphere';

import type { Rgb } from './colors';
import { advanceParticle, createParticles, createStars, type Particle } from './particles';
import { SCENE_THEMES, type ParticleKind, type SceneTheme } from './themes';

const STAR_COUNT = 220;
const TAU = Math.PI * 2;

/** Cubos de alfa para agrupar las estrellas: cada cubo se rellena con un solo `fill`. */
const STAR_BUCKETS = 8;

/** Techo de lado del sprite de nebulosa: una nebulosa es luz suave, no necesita más. */
const NEBULA_SPRITE_MAX_PX = 1024;

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
 * Tope de repintado del bucle: no pinta dos veces en menos de esto, para no
 * gastar frames en pantallas de alta frecuencia. Ya no manda en la velocidad:
 * las partículas avanzan por `dt` real (`particles.ts`), así que 60, 120 y
 * 144 Hz se mueven igual aunque aquí se salten frames.
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

/** Un lienzo fuera de pantalla para hornear sprites: `OffscreenCanvas` en el worker o donde exista. */
type SpriteCanvas = {
  canvas: OffscreenCanvas | HTMLCanvasElement;
  ctx: CosmicContext;
};

/**
 * Crea un lienzo de trabajo fuera de pantalla del tamaño pedido. Prefiere
 * `OffscreenCanvas` (único disponible en el worker, sin `document`); en el hilo
 * principal, si no lo hay o no da contexto, cae a `document.createElement`.
 * Devuelve `null` si el entorno no puede pintar (tests sin canvas reales).
 */
function createSpriteCanvas(width: number, height: number): SpriteCanvas | null {
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (ctx) return { canvas, ctx };
  }
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) return { canvas, ctx };
  }
  return null;
}

/**
 * Hornea una nebulosa a un sprite: un gradiente radial del color del tema sobre
 * un lienzo cuadrado, centrado, listo para colocarlo con `drawImage` en lugar de
 * crear el gradiente y rellenar el viewport en cada frame. El bucle lo dibuja
 * desplazado por la deriva, así que la animación no cambia.
 */
function bakeNebula(
  rgb: Rgb,
  alpha: number,
  radiusCss: number,
  dpr: number,
): OffscreenCanvas | HTMLCanvasElement | null {
  const size = Math.max(2, Math.min(Math.round(radiusCss * 2 * dpr), NEBULA_SPRITE_MAX_PX));
  const sprite = createSpriteCanvas(size, size);
  if (!sprite) return null;

  const [r, g, b] = rgb;
  const center = size / 2;
  const gradient = sprite.ctx.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  sprite.ctx.fillStyle = gradient;
  sprite.ctx.fillRect(0, 0, size, size);

  return sprite.canvas;
}

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
  // Índices de estrellas agrupados por cubo de alfa, reutilizados cada frame para
  // pintar cada cubo con un solo `beginPath`/`fill` (Task 4.1 — presupuesto de canvas).
  const starBuckets: number[][] = Array.from({ length: STAR_BUCKETS }, () => []);
  // Las tres nebulosas horneadas a sprite; `null` si el entorno no puede crear
  // lienzos (tests), en cuyo caso `draw` cae al gradiente por frame de siempre.
  let nebulae: (OffscreenCanvas | HTMLCanvasElement)[] | null = [];
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

  // Hornea las nebulosas al sprite de su color y radio actuales. Se rehace al
  // cambiar tamaño (radio en píxeles), acento (la nebulosa sin color propio lo
  // toma del acento) o tema (color). Si algún sprite no puede crearse, deja
  // `nebulae` en `null`: `draw` usa entonces el gradiente por frame.
  const rebuildNebulae = () => {
    const max = Math.max(width, height) || 1;
    const sprites: (OffscreenCanvas | HTMLCanvasElement)[] = [];

    for (let i = 0; i < theme.nebulae.length; i++) {
      const spot = NEBULA_SPOTS[i];
      if (!spot) continue;
      const sprite = bakeNebula(theme.nebulae[i] ?? accent, theme.nebulaAlpha, spot[2] * max, dpr);
      if (!sprite) {
        nebulae = null;
        return;
      }
      sprites.push(sprite);
    }

    nebulae = sprites;
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
    rebuildNebulae();
  };

  const resize = (viewport: CosmicViewport) => {
    ({ width, height, dpr } = viewport);
    ctx.canvas.width = width * dpr;
    ctx.canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // El radio de las nebulosas va en píxeles: se rehornean con cada tamaño.
    rebuildNebulae();

    // Cambio de breakpoint: regenerar las partículas del tema y sus sprites.
    if (small !== viewport.small || particles.length === 0) {
      small = viewport.small;
      rebuildParticles();
    }
  };

  const draw = (time: number, twinkleFrozen: boolean) => {
    ctx.clearRect(0, 0, width, height);
    const max = Math.max(width, height);

    // Nebulosas radiales a la deriva, dibujadas con el sprite horneado: sólo se
    // desplaza la imagen, sin crear gradientes ni rellenar el viewport por frame.
    ctx.globalAlpha = level;
    if (nebulae && nebulae.length === theme.nebulae.length) {
      for (let i = 0; i < theme.nebulae.length; i++) {
        const sprite = nebulae[i]!;
        const [spotX, spotY, spotR] = NEBULA_SPOTS[i]!;
        const dx = Math.sin(time * 0.0001 * (0.6 + i * 0.3)) * 0.03;
        const dy = Math.cos(time * 0.0001 * (0.5 + i * 0.25)) * 0.03;
        const radius = spotR * max;
        const cx = (spotX + dx) * width;
        const cy = (spotY + dy) * height;
        ctx.drawImage(sprite, cx - radius, cy - radius, radius * 2, radius * 2);
      }
    } else {
      // Entornos sin lienzos de trabajo (tests): el gradiente por frame de antes.
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
    }

    // Estrellas: parpadeo senoidal. Se agrupan por cubos de alfa (≤8) y cada cubo
    // se pinta con un solo `beginPath`/`fill`; el alfa va en `globalAlpha`, sin
    // construir ni analizar 220 cadenas de color por frame.
    const { stars: look } = theme;
    if (look.count > 0) {
      const [sr, sg, sb] = look.rgb;
      ctx.fillStyle = `rgb(${sr},${sg},${sb})`;
      const span = look.twinkle;
      for (const bucket of starBuckets) bucket.length = 0;
      for (let i = 0; i < look.count && i < stars.length; i++) {
        const star = stars[i]!;
        const tw = twinkleFrozen
          ? 0.7
          : 0.5 + 0.5 * Math.sin(time * 0.0001 * 6 * star.sp + star.tw);
        const bucket = Math.min(STAR_BUCKETS - 1, Math.floor(tw * STAR_BUCKETS));
        starBuckets[bucket]!.push(i);
      }
      for (let b = 0; b < STAR_BUCKETS; b++) {
        const list = starBuckets[b]!;
        if (list.length === 0) continue;
        const tw = (b + 0.5) / STAR_BUCKETS;
        ctx.globalAlpha = (0.25 + span * tw) * look.alpha * level;
        ctx.beginPath();
        for (let k = 0; k < list.length; k++) {
          const star = stars[list[k]!]!;
          const x = star.x * width;
          const y = star.y * height;
          // Sin `moveTo`, el canvas une cada círculo con el anterior y `fill` rellenaría el polígono.
          ctx.moveTo(x + star.r, y);
          ctx.arc(x, y, star.r, 0, TAU);
        }
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
      rebuildNebulae();
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
        if (p) advanceParticle(p, elapsed, random, seconds);
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
