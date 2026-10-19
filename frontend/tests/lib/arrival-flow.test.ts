import { describe, expect, it } from 'vitest';

import type { ArrivalKey } from '@/config/arrivals';
import { AUDIOS, isPlayable } from '@/data/audios';
import type { AtmosphereId } from '@/types/atmosphere';
import {
  ARRIVAL_FADE_IN_SECONDS,
  arrivalFadeIn,
  chooseArrival,
  currentAlternative,
  IDLE_ARRIVAL,
  nextAtmosphere,
  restoreArrival,
  stepAlternative,
} from '@/lib/arrival/flow';
import { respondToArrival } from '@/lib/arrival/respond';

const DAY = { catalog: AUDIOS, hour: 12 };
const NIGHT = { catalog: AUDIOS, hour: 23 };

describe('flujo de llegada (función pura)', () => {
  it('elegir una entrada devuelve su respuesta y la primera alternativa', () => {
    const flow = chooseArrival('mood:tiredness', DAY);

    expect(flow.key).toBe('mood:tiredness');
    expect(flow.response).toEqual(respondToArrival('mood:tiredness', DAY));
    expect(flow.response!.atmosphere).toBe('dusk');
    expect(flow.index).toBe(0);
  });

  it('sin entrada no hay alternativa ni se mueve nada', () => {
    expect(currentAlternative(IDLE_ARRIVAL)).toBeNull();
    expect(stepAlternative(IDLE_ARRIVAL, 1)).toBe(IDLE_ARRIVAL);
  });

  it('la primera alternativa es la primera de la respuesta, y es reproducible', () => {
    const flow = chooseArrival('mood:calm', DAY);
    const audio = currentAlternative(flow);

    expect(audio).toBe(flow.response!.alternatives[0]);
    expect(isPlayable(audio!)).toBe(true);
  });

  it('recorrer alternativas avanza y envuelve al final y al principio', () => {
    const flow = chooseArrival('mood:calm', DAY);
    const count = flow.response!.alternatives.length;
    expect(count).toBeGreaterThanOrEqual(2);

    let moved = flow;
    for (let i = 0; i < count; i += 1) moved = stepAlternative(moved, 1);
    expect(moved.index).toBe(0);

    const back = stepAlternative(flow, -1);
    expect(back.index).toBe(count - 1);
    expect(currentAlternative(back)).toBe(flow.response!.alternatives[count - 1]);
  });

  it('recorrer nunca lleva a una pista que no es reproducible', () => {
    for (const key of ['mood:gratitude', 'mood:sadness', 'intent:rest'] as ArrivalKey[]) {
      let flow = chooseArrival(key, NIGHT);
      for (let i = 0; i < 9; i += 1) {
        const audio = currentAlternative(flow);
        expect(audio && isPlayable(audio), key).toBe(true);
        flow = stepAlternative(flow, 1);
      }
    }
  });

  it('«elegir otra opción» pasa a otra atmósfera sin tocar la entrada ni la alternativa', () => {
    const chosen = chooseArrival('mood:calm', DAY);
    const indexed = stepAlternative(chosen, 1);

    expect(nextAtmosphere(indexed.response!, indexed.response!.atmosphere)).not.toBe(
      indexed.response!.atmosphere,
    );
    expect(indexed.key).toBe('mood:calm');
    expect(indexed.index).toBe(1);
  });

  it('«otra opción» recorre todas las atmósferas y vuelve a la de la entrada', () => {
    const response = chooseArrival('mood:calm', NIGHT).response!;
    const offered = [response.atmosphere, ...response.otherAtmospheres];

    const seen: string[] = [];
    let current: AtmosphereId = response.atmosphere;
    for (let i = 0; i < offered.length; i += 1) {
      seen.push(current);
      current = nextAtmosphere(response, current);
    }

    expect(seen).toEqual(offered);
    expect(current).toBe(response.atmosphere);
  });

  it('desde una atmósfera que no está en la lista, «otra opción» empieza por la de la entrada', () => {
    const response = chooseArrival('mood:calm', DAY).response!;
    expect(nextAtmosphere(response, 'night')).toBe(response.atmosphere);
  });

  it('de noche «otra opción» ofrece la luna primero; de día, la luz del amanecer o el bosque', () => {
    const night = chooseArrival('mood:calm', NIGHT).response!;
    expect(nextAtmosphere(night, night.atmosphere)).toBe('moon');

    const day = chooseArrival('mood:calm', DAY).response!;
    expect(day.otherAtmospheres[0]).toBe('forest');
    expect(day.otherAtmospheres).toContain('moon');
  });
});

describe('fundido de arranque de una pista de llegada (M3)', () => {
  it('desde el silencio (sin pista o parada) entra con fundido', () => {
    expect(arrivalFadeIn({ audioId: null, engineState: 'idle' })).toBe(ARRIVAL_FADE_IN_SECONDS);
    expect(arrivalFadeIn({ audioId: 'a1', engineState: 'paused' })).toBe(ARRIVAL_FADE_IN_SECONDS);
    expect(arrivalFadeIn({ audioId: 'a1', engineState: 'idle' })).toBe(ARRIVAL_FADE_IN_SECONDS);
  });

  it('si ya suena algo, el cambio de pista no vuelve a fundir', () => {
    expect(arrivalFadeIn({ audioId: 'a1', engineState: 'playing' })).toBeUndefined();
  });

  it('el fundido dura unos 2,5 s', () => {
    expect(ARRIVAL_FADE_IN_SECONDS).toBe(2.5);
  });
});

describe('restaurar una llegada guardada (sin sonar)', () => {
  it('restaura la misma respuesta y primera alternativa que elegirla', () => {
    const restored = restoreArrival('mood:nostalgia', DAY);

    expect(restored).toEqual(chooseArrival('mood:nostalgia', DAY));
    expect(restored.key).toBe('mood:nostalgia');
    expect(restored.index).toBe(0);
    expect(currentAlternative(restored)).toBe(restored.response!.alternatives[0]);
  });

  it('restaurar una intención conserva su respuesta', () => {
    const restored = restoreArrival('intent:grounding', DAY);

    expect(restored.response!.atmosphere).toBe('forest');
  });
});
