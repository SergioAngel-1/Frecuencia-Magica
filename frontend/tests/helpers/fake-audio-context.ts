/**
 * Contexto Web Audio falso para testear el motor sin navegador.
 *
 * El reloj (`currentTime`) lo controla el test. Los parámetros de audio
 * guardan su automatización y se evalúan en cualquier instante: así un test
 * lee la ganancia real que habría en ese momento (`valueAt(t)`) y, con
 * `value`, la del reloj actual. Sólo modela lo que usa el motor: rampas
 * lineales y valores en un instante; `setTargetAtTime` se trata como un
 * valor en su instante, una aproximación suficiente para los tests.
 */

type AutomationPoint = { t: number; v: number; linear: boolean };

export class FakeAudioParam {
  private points: AutomationPoint[];
  private readonly created: number;

  constructor(
    private readonly clock: { currentTime: number },
    initial: number,
  ) {
    // Un parámetro nace en el instante de su nodo: antes de existir no suena.
    this.created = clock.currentTime;
    this.points = [{ t: this.created, v: initial, linear: false }];
  }

  private add(point: AutomationPoint): this {
    // Inserción ordenada y estable: un punto con el mismo instante va después.
    const index = this.points.findIndex((existing) => existing.t > point.t);
    if (index === -1) this.points.push(point);
    else this.points.splice(index, 0, point);
    return this;
  }

  setValueAtTime(v: number, t: number): this {
    return this.add({ t, v, linear: false });
  }

  linearRampToValueAtTime(v: number, t: number): this {
    return this.add({ t, v, linear: true });
  }

  setTargetAtTime(v: number, t: number, _timeConstant: number): this {
    return this.add({ t, v, linear: false });
  }

  cancelScheduledValues(t: number): this {
    // El punto de nacimiento nunca se cancela: el parámetro siempre tiene valor.
    this.points = [this.points[0]!, ...this.points.slice(1).filter((point) => point.t < t)];
    return this;
  }

  /** Valor del parámetro en el instante `time` del contexto. */
  valueAt(time: number): number {
    if (time < this.created) return 0;
    let anchor = this.points[0]!;

    for (let i = 1; i < this.points.length; i += 1) {
      const next = this.points[i]!;
      if (next.t > time) {
        if (!next.linear) return anchor.v;
        const progress = (time - anchor.t) / (next.t - anchor.t);
        return anchor.v + (next.v - anchor.v) * progress;
      }
      anchor = next;
    }

    return anchor.v;
  }

  /** Valor en el instante actual del reloj del contexto. */
  get value(): number {
    return this.valueAt(this.clock.currentTime);
  }

  set value(v: number) {
    this.add({ t: this.clock.currentTime, v, linear: false });
  }
}

export class FakeAudioNode {
  readonly connections: FakeAudioNode[] = [];

  connect(destination: FakeAudioNode): FakeAudioNode {
    this.connections.push(destination);
    return destination;
  }

  disconnect(): void {
    this.connections.length = 0;
  }
}

export class FakeGainNode extends FakeAudioNode {
  readonly gain: FakeAudioParam;

  constructor(clock: { currentTime: number }) {
    super();
    this.gain = new FakeAudioParam(clock, 1);
  }
}

export class FakeOscillatorNode extends FakeAudioNode {
  type: OscillatorType = 'sine';
  readonly frequency: FakeAudioParam;
  readonly started: number[] = [];
  readonly stopped: number[] = [];

  constructor(clock: { currentTime: number }) {
    super();
    this.frequency = new FakeAudioParam(clock, 440);
  }

  start(when = 0): void {
    this.started.push(when);
  }

  stop(when = 0): void {
    this.stopped.push(when);
  }
}

export class FakeStereoPannerNode extends FakeAudioNode {
  readonly pan: FakeAudioParam;

  constructor(clock: { currentTime: number }) {
    super();
    this.pan = new FakeAudioParam(clock, 0);
  }
}

export class FakeBiquadFilterNode extends FakeAudioNode {
  type: BiquadFilterType = 'lowpass';
  readonly frequency: FakeAudioParam;
  readonly Q: FakeAudioParam;

  constructor(clock: { currentTime: number }) {
    super();
    this.frequency = new FakeAudioParam(clock, 350);
    this.Q = new FakeAudioParam(clock, 1);
  }
}

export class FakeAudioBuffer {
  private readonly data: Float32Array;

  constructor(length: number) {
    this.data = new Float32Array(length);
  }

  getChannelData(): Float32Array {
    return this.data;
  }
}

export class FakeAudioBufferSourceNode extends FakeAudioNode {
  buffer: FakeAudioBuffer | null = null;
  loop = false;
  readonly started: number[] = [];
  readonly stopped: number[] = [];

  start(when = 0): void {
    this.started.push(when);
  }

  stop(when = 0): void {
    this.stopped.push(when);
  }
}

export type FakeContextOptions = {
  /** Estado inicial. `suspended` simula el bloqueo de autoplay del navegador. */
  state?: 'running' | 'suspended';
  /** Si `resume()` consigue reanudar el contexto (un gesto válido lo logra). */
  resumable?: boolean;
};

export class FakeAudioContext {
  /** Reloj del contexto, en segundos. Lo mueve el test. */
  currentTime = 0;
  readonly sampleRate = 48000;
  state: 'running' | 'suspended' | 'closed';
  readonly destination = new FakeAudioNode();
  readonly oscillators: FakeOscillatorNode[] = [];
  readonly gains: FakeGainNode[] = [];
  readonly panners: FakeStereoPannerNode[] = [];
  readonly bufferSources: FakeAudioBufferSourceNode[] = [];
  readonly filters: FakeBiquadFilterNode[] = [];
  resumeCalls = 0;
  private readonly resumable: boolean;

  constructor(options: FakeContextOptions = {}) {
    this.state = options.state ?? 'running';
    this.resumable = options.resumable ?? true;
  }

  private get clock(): { currentTime: number } {
    return this;
  }

  createOscillator(): FakeOscillatorNode {
    const node = new FakeOscillatorNode(this.clock);
    this.oscillators.push(node);
    return node;
  }

  createGain(): FakeGainNode {
    const node = new FakeGainNode(this.clock);
    this.gains.push(node);
    return node;
  }

  createStereoPanner(): FakeStereoPannerNode {
    const node = new FakeStereoPannerNode(this.clock);
    this.panners.push(node);
    return node;
  }

  createBiquadFilter(): FakeBiquadFilterNode {
    const node = new FakeBiquadFilterNode(this.clock);
    this.filters.push(node);
    return node;
  }

  createBuffer(_channels: number, length: number, _sampleRate: number): FakeAudioBuffer {
    return new FakeAudioBuffer(length);
  }

  createBufferSource(): FakeAudioBufferSourceNode {
    const node = new FakeAudioBufferSourceNode();
    this.bufferSources.push(node);
    return node;
  }

  private readonly stateListeners = new Set<() => void>();

  addEventListener(type: string, listener: () => void): void {
    if (type === 'statechange') this.stateListeners.add(listener);
  }

  removeEventListener(type: string, listener: () => void): void {
    if (type === 'statechange') this.stateListeners.delete(listener);
  }

  /**
   * Cambia el estado como lo haría el navegador (llamada, segundo plano,
   * bloqueo) y despacha `statechange` a quien escuche.
   */
  setState(next: 'running' | 'suspended' | 'closed'): void {
    if (this.state === next) return;
    this.state = next;
    for (const listener of this.stateListeners) listener();
  }

  /** Listeners registrados (para comprobar que se liberan). */
  get stateListenerCount(): number {
    return this.stateListeners.size;
  }

  resume(): Promise<void> {
    this.resumeCalls += 1;
    if (this.resumable && this.state === 'suspended') this.setState('running');
    return Promise.resolve();
  }

  suspend(): Promise<void> {
    this.setState('suspended');
    return Promise.resolve();
  }

  close(): Promise<void> {
    this.setState('closed');
    return Promise.resolve();
  }
}

/**
 * Salidas de pista audibles en el instante `t`: los nodos de ganancia que
 * desembocan en un maestro (un nodo conectado al destino) y no están a cero.
 */
export function audibleTrackOutputs(ctx: FakeAudioContext, t: number): number {
  const masters = ctx.gains.filter((gain) => gain.connections.includes(ctx.destination));

  return ctx.gains.filter(
    (gain) =>
      gain.connections.some((node) => masters.includes(node as FakeGainNode)) &&
      gain.gain.valueAt(t) > 0.001,
  ).length;
}
