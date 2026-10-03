import { REALMS } from '@/config/realms';
import type { RealmId } from '@/types/realm';

const DEFAULT_NOTE = 110;

const NOTE_BY_REALM = new Map<RealmId, number>(REALMS.map((realm) => [realm.id, realm.baseNote]));

/** Nota base del drone para un realm. Un realm desconocido cae en 110 Hz. */
export function baseNoteForRealm(realmId: RealmId): number {
  return NOTE_BY_REALM.get(realmId) ?? DEFAULT_NOTE;
}

/**
 * Las tres voces del acorde a partir de la nota base:
 * fundamental, la misma desafinada `×1.005` (batido lento) y su quinta (`×1.5`).
 */
export function voiceFrequencies(baseNote: number): [number, number, number] {
  return [baseNote, baseNote * 1.005, baseNote * 1.5];
}

export type DroneHandle = {
  setEnabled(on: boolean): void;
  retune(baseNote: number): void;
  dispose(): void;
};

/**
 * Construye el grafo de audio del drone ambiental y devuelve sus controles.
 *
 * Tres osciladores (dos senoidales batiendo entre sí y una triangular a la
 * quinta) pasan por un filtro paso-bajo hacia un maestro cuya ganancia respira
 * con un LFO lentísimo. No hay ficheros: el drone se sintetiza entero.
 */
export function createDrone(ctx: AudioContext): DroneHandle {
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 700;
  filter.connect(master);

  const [f0, f1, f2] = voiceFrequencies(DEFAULT_NOTE);
  const voiceSpecs: { type: OscillatorType; freq: number; gain: number }[] = [
    { type: 'sine', freq: f0, gain: 0.5 },
    { type: 'sine', freq: f1, gain: 0.5 },
    { type: 'triangle', freq: f2, gain: 0.18 },
  ];

  const voices = voiceSpecs.map((spec) => {
    const osc = ctx.createOscillator();
    osc.type = spec.type;
    osc.frequency.value = spec.freq;
    const gain = ctx.createGain();
    gain.gain.value = spec.gain;
    osc.connect(gain);
    gain.connect(filter);
    osc.start();
    return osc;
  });

  // LFO de respiración: modula la ganancia del maestro.
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.012;
  lfo.connect(lfoGain);
  lfoGain.connect(master.gain);
  lfo.start();

  return {
    setEnabled(on: boolean) {
      if (ctx.state === 'suspended') void ctx.resume();
      master.gain.setTargetAtTime(on ? 0.09 : 0, ctx.currentTime, 0.6);
    },
    retune(baseNote: number) {
      const freqs = voiceFrequencies(baseNote);
      voices.forEach((osc, i) => {
        // Constante de tiempo 2: el deslizamiento lento entre realms.
        osc.frequency.setTargetAtTime(freqs[i]!, ctx.currentTime, 2);
      });
    },
    dispose() {
      voices.forEach((osc) => osc.stop());
      lfo.stop();
      void ctx.close();
    },
  };
}
