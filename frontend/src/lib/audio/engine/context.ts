/**
 * El `AudioContext` único de la web: lo comparten el motor de pistas y el drone.
 *
 * Se crea sólo al llamar a `getSharedAudioContext`, y quien lo llama lo hace
 * dentro de un gesto del usuario (pulsar play, activar el ambiente); así el
 * navegador no lo bloquea por autoplay. Nunca se cierra desde aquí.
 */

type AudioContextCtor = typeof AudioContext;

let shared: AudioContext | null = null;

/** El contexto compartido, creándolo la primera vez. `null` sin Web Audio (degrada en silencio). */
export function getSharedAudioContext(): AudioContext | null {
  if (shared) return shared;
  if (typeof window === 'undefined') return null;

  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
  if (!Ctor) return null;

  shared = new Ctor();
  return shared;
}
