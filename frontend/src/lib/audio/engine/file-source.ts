/**
 * Fuente de archivo: un `<audio>` enrutado a un nodo del grafo, para que su
 * ganancia y su volumen maestro sean los mismos que los de la síntesis.
 */
export type FileSource = {
  start(): void;
  pause(): void;
  resume(): void;
  seek(seconds: number): void;
  /** Segundos que lleva el elemento. */
  position(): number;
  /** Para el elemento en el instante `when` del contexto, al terminar el fundido. */
  stop(when: number): void;
};

export function createFileSource(ctx: AudioContext, src: string, out: AudioNode): FileSource {
  const element = new Audio(src);
  element.preload = 'auto';
  const routed = ctx.createMediaElementSource(element);
  routed.connect(out);

  // El navegador rechaza reproducir sin gesto; el motor sólo llega aquí desde uno.
  const play = () => {
    void element.play().catch(() => undefined);
  };

  return {
    start: play,
    resume: play,
    pause() {
      element.pause();
    },
    seek(seconds) {
      element.currentTime = seconds;
    },
    position: () => element.currentTime,
    stop(when) {
      // El elemento no tiene reloj de contexto: se para cuando acaba el fundido.
      const delayMs = Math.max(0, (when - ctx.currentTime) * 1000);
      setTimeout(() => {
        element.pause();
        element.currentTime = 0;
        routed.disconnect();
      }, delayMs);
    },
  };
}
