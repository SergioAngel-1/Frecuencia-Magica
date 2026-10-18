import type { ParticleKind } from './themes';

/** Estrella de fondo, en coordenadas normalizadas `[0,1]`. */
export type Star = {
  x: number;
  y: number;
  /** Radio en píxeles. */
  r: number;
  /** Fase inicial del parpadeo. */
  tw: number;
  /** Velocidad del parpadeo. */
  sp: number;
};

/** Partícula del lienzo (polen, brasa, mota, luciérnaga, espora), en coordenadas normalizadas. */
export type Particle = {
  /** Cómo se mueve (`themes.ts`). */
  kind: ParticleKind;
  /** Fase propia: desfasa el vaivén y el titileo de cada una. */
  phase: number;
  /** Índice del grupo del tema al que pertenece: de él salen el color y el alfa. */
  group: number;
  x: number;
  y: number;
  /** Radio en píxeles. */
  r: number;
  /** Velocidad vertical (ascendente). */
  vy: number;
  /** Deriva horizontal. */
  vx: number;
  /** Alfa base. */
  a: number;
};

/** Interpola dentro de `[min, max]` con la fuente de aleatoriedad dada. */
function range(random: () => number, min: number, max: number): number {
  return min + random() * (max - min);
}

/**
 * Genera `count` estrellas con los rangos exactos del prototipo.
 * Recibe la aleatoriedad por parámetro para poder testear de forma determinista;
 * en producción se le pasa `Math.random`.
 */
export function createStars(count: number, random: () => number): Star[] {
  const stars: Star[] = [];

  for (let i = 0; i < count; i++) {
    stars.push({
      x: random(),
      y: random(),
      r: range(random, 0.3, 1.4),
      tw: range(random, 0, 6.28),
      sp: range(random, 0.4, 1.4),
    });
  }

  return stars;
}

/**
 * Genera `count` partículas de un tipo. Con el tipo por defecto (`rise`) son las del
 * prototipo, con sus rangos exactos; los demás ajustan la velocidad al movimiento
 * que les toca. El alfa y el radio los fija el grupo del tema.
 */
export function createParticles(
  count: number,
  random: () => number,
  options: {
    kind?: ParticleKind;
    group?: number;
    radius?: readonly [number, number];
    alpha?: readonly [number, number];
  } = {},
): Particle[] {
  const { kind = 'rise', group = 0, radius = [0.6, 2.2], alpha = [0.15, 0.6] } = options;
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      kind,
      group,
      phase: range(random, 0, 6.28),
      x: random(),
      y: random(),
      r: range(random, radius[0], radius[1]),
      vy: kind === 'mote' ? range(random, 0.004, 0.02) : range(random, 0.02, 0.1),
      vx: kind === 'mote' ? range(random, 0.01, 0.04) : range(random, -0.02, 0.02),
      a: range(random, alpha[0], alpha[1]),
    });
  }

  return particles;
}

/** Módulo que devuelve siempre un valor en `[0, 1)`: una partícula que sale por un lado entra por el otro. */
function wrap(value: number): number {
  return ((value % 1) + 1) % 1;
}

/**
 * Avanza una partícula un paso, mutándola en su sitio (no crea copias por frame).
 * `dt` son los segundos desde el frame anterior —ya acotados a 0,1 s por
 * `scene.frame`— y los incrementos se escalan por `dt` normalizado a 60 fps, de
 * modo que 60, 120 y 144 Hz muevan igual. `time` son los segundos de la escena
 * (sólo lo usan los movimientos con vaivén).
 *
 * - `rise` (el original): sube y deriva ligeramente; al salir por arriba (`y < -0.02`)
 *   reaparece por abajo (`y = 1.02`) con una `x` nueva.
 * - `ember`: como `rise`, más lenta y con un vaivén lateral.
 * - `spore`: cae despacio con vaivén; al salir por abajo reaparece arriba con una `x` nueva.
 * - `mote`: deriva en diagonal, hacia la derecha y arriba, y vuelve a entrar por el lado contrario.
 * - `firefly`: vaga por una trayectoria suave que se cierra sobre sí misma.
 *
 * Muta `p` y lo devuelve (la misma referencia), salvo por la `x` o la `y` de
 * reaparición, que toman de `random`.
 */
export function advanceParticle(
  p: Particle,
  dt = 1 / 60,
  random: () => number = Math.random,
  time = 0,
): Particle {
  const step = dt * 60;

  switch (p.kind) {
    case 'ember': {
      p.y -= p.vy * 0.0024 * step;
      if (p.y < -0.02) {
        p.y = 1.02;
        p.x = random();
      } else {
        p.x += (p.vx * 0.002 + Math.sin(time * 2.2 + p.phase) * 0.0003) * step;
      }
      return p;
    }
    case 'spore': {
      p.y += p.vy * 0.0016 * step;
      if (p.y > 1.02) {
        p.y = -0.02;
        p.x = random();
      } else {
        p.x += Math.sin(time * 0.9 + p.phase) * 0.00035 * step;
      }
      return p;
    }
    case 'mote': {
      p.x += p.vx * 0.004 * step;
      p.y -= p.vy * 0.004 * step;
      if (p.x > 1.02) {
        p.x = -0.02;
        p.y = random();
      } else if (p.y < -0.02) {
        p.y = 1.02;
        p.x = random();
      }
      return p;
    }
    case 'firefly':
      p.x = wrap(p.x + Math.cos(time * 0.55 + p.phase) * 0.0005 * step);
      p.y = wrap(p.y + Math.sin(time * 0.4 + p.phase * 1.7) * 0.0004 * step);
      return p;
    case 'rise': {
      p.y -= p.vy * 0.004 * step;
      if (p.y < -0.02) {
        p.y = 1.02;
        p.x = random();
      } else {
        p.x += p.vx * 0.004 * step;
      }
      return p;
    }
  }
}
