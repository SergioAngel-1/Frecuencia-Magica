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

/** Partícula de polen dorado que asciende, en coordenadas normalizadas. */
export type Particle = {
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

/** Genera `count` partículas de polen con los rangos exactos del prototipo. */
export function createParticles(count: number, random: () => number): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: random(),
      y: random(),
      r: range(random, 0.6, 2.2),
      vy: range(random, 0.02, 0.1),
      vx: range(random, -0.02, 0.02),
      a: range(random, 0.15, 0.6),
    });
  }

  return particles;
}

/**
 * Avanza una partícula un frame: sube y deriva ligeramente. Al salir por
 * arriba (`y < -0.02`), reaparece por abajo (`y = 1.02`) con una `x` nueva.
 *
 * Es pura salvo por la `x` de reaparición, que toma de `random` (`Math.random`
 * por defecto); el resto del movimiento es determinista.
 */
export function advanceParticle(p: Particle, random: () => number = Math.random): Particle {
  const y = p.y - p.vy * 0.004;

  if (y < -0.02) {
    return { ...p, y: 1.02, x: random() };
  }

  return { ...p, y, x: p.x + p.vx * 0.004 };
}
