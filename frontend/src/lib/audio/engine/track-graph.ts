import { buildSynthLayers, type RandomSource } from './synth';
import { createFileSource } from './file-source';
import type { EngineTrack } from './track';

/** Grafo de una pista: su ganancia (el fundido) y sus fuentes. */
export type TrackGraph = {
  /** Ganancia propia de la pista: el fundido la sube y la baja. Desemboca en el maestro. */
  output: GainNode;
  /** Empieza a sonar (las fuentes sintéticas ya suenan desde su creación). */
  start(): void;
  pause(): void;
  resume(): void;
  seek(seconds: number): void;
  /** Posición real de la fuente (un archivo la da); `null` si la síntesis sigue el reloj del motor. */
  position(): number | null;
  /** Detiene las fuentes en el instante `when` del contexto. */
  stop(when: number): void;
};

const NOTHING = () => undefined;

/**
 * Construye el grafo de una pista y lo conecta al maestro. Muda hasta que el
 * motor le suba la ganancia: una pista nunca suena antes de su fundido.
 * `preview` elige la muestra del archivo (`sampleSrc`) cuando la pista la tiene.
 */
export function createTrackGraph(
  ctx: AudioContext,
  track: EngineTrack,
  master: AudioNode,
  random: RandomSource,
  preview = false,
): TrackGraph {
  const output = ctx.createGain();
  output.gain.value = 0;
  output.connect(master);

  if (track.source.type === 'synth') {
    const layers = buildSynthLayers(ctx, track.source.recipe, output, random);
    return {
      output,
      start: NOTHING,
      pause: NOTHING,
      resume: NOTHING,
      seek: NOTHING,
      position: () => null,
      stop: (when) => layers.stop(when),
    };
  }

  const { src, sampleSrc } = track.source;
  const file = createFileSource(ctx, preview && sampleSrc ? sampleSrc : src, output);
  return {
    output,
    start: file.start,
    pause: file.pause,
    resume: file.resume,
    seek: file.seek,
    position: () => file.position(),
    stop: (when) => file.stop(when),
  };
}
