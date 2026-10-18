import type { SynthRecipe } from '@/types/content';

/** Fuente de azar por parámetro: el motor la inyecta, así el ruido se puede fijar en tests. */
export type RandomSource = () => number;

/** Ganancia por defecto de cada capa; la receta la fija con su propio `gain`. */
const DEFAULT_LEVEL = { tone: 0.5, binaural: 0.35, texture: 0.5 } as const;

/** Segundos de ruido que se repiten en bucle para mar y lluvia. */
const NOISE_SECONDS = 2;
/** Ritmo lentísimo del vaivén del mar y cuánto modula su ganancia. */
const SEA_SWELL_HZ = 0.08;
const SEA_SWELL_DEPTH = 0.3;

export type SynthLayers = {
  /** Detiene todas las fuentes de la receta en el instante `when` del contexto. */
  stop(when: number): void;
};

type Stoppable = { stop(when?: number): void };

/** Ruido blanco en bucle: la base del mar y de la lluvia. */
function noiseSource(ctx: AudioContext, random: RandomSource): AudioBufferSourceNode {
  const length = Math.floor(ctx.sampleRate * NOISE_SECONDS);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

/** Una capa de nivel fijo que desemboca en `out`. */
function levelNode(ctx: AudioContext, level: number, out: AudioNode): GainNode {
  const node = ctx.createGain();
  node.gain.value = level;
  node.connect(out);
  return node;
}

/**
 * Construye las capas sonoras de una receta y las conecta a `out`. Cada capa
 * presente suena a la vez; la pista entera se silencia o se detiene de una vez.
 *
 * - `tone`: un oscilador senoidal a su Hz.
 * - `binaural`: un oscilador por oído, panoramizado a izquierda (portadora) y
 *   derecha (portadora + pulso). La diferencia de frecuencia es el pulso.
 * - `sea` y `rain`: ruido filtrado en bucle; el mar respira con un LFO lento.
 */
export function buildSynthLayers(
  ctx: AudioContext,
  recipe: SynthRecipe,
  out: AudioNode,
  random: RandomSource,
): SynthLayers {
  const stoppables: Stoppable[] = [];

  if (recipe.tone) {
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = recipe.tone.hz;
    oscillator.connect(levelNode(ctx, recipe.tone.gain ?? DEFAULT_LEVEL.tone, out));
    oscillator.start();
    stoppables.push(oscillator);
  }

  if (recipe.binaural) {
    const { carrierHz, beatHz } = recipe.binaural;
    const level = levelNode(ctx, recipe.binaural.gain ?? DEFAULT_LEVEL.binaural, out);

    const ears = [
      { frequency: carrierHz, pan: -1 },
      { frequency: carrierHz + beatHz, pan: 1 },
    ];
    for (const ear of ears) {
      const oscillator = ctx.createOscillator();
      oscillator.frequency.value = ear.frequency;
      const panner = ctx.createStereoPanner();
      panner.pan.value = ear.pan;
      oscillator.connect(panner);
      panner.connect(level);
      oscillator.start();
      stoppables.push(oscillator);
    }
  }

  if (recipe.sea) {
    const level = levelNode(ctx, recipe.sea.gain ?? DEFAULT_LEVEL.texture, out);
    const noise = noiseSource(ctx, random);
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 600;
    noise.connect(lowpass);
    lowpass.connect(level);

    // El vaivén: un LFO lentísimo suma y resta a la ganancia de la capa.
    const swell = ctx.createOscillator();
    swell.frequency.value = SEA_SWELL_HZ;
    const swellDepth = ctx.createGain();
    swellDepth.gain.value = (recipe.sea.gain ?? DEFAULT_LEVEL.texture) * SEA_SWELL_DEPTH;
    swell.connect(swellDepth);
    swellDepth.connect(level.gain);

    noise.start();
    swell.start();
    stoppables.push(noise, swell);
  }

  if (recipe.rain) {
    const level = levelNode(ctx, recipe.rain.gain ?? DEFAULT_LEVEL.texture, out);
    const noise = noiseSource(ctx, random);
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1800;
    bandpass.Q.value = 0.6;
    noise.connect(bandpass);
    bandpass.connect(level);
    noise.start();
    stoppables.push(noise);
  }

  return {
    stop(when) {
      for (const node of stoppables) node.stop(when);
    },
  };
}
