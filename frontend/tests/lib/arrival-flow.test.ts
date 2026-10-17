import { describe, expect, it } from 'vitest';

import type { ArrivalKey } from '@/config/arrivals';
import { AUDIOS, isPlayable } from '@/data/audios';
import {
  ARRIVAL_FADE_IN_SECONDS,
  arrivalFadeIn,
  chooseArrival,
  currentAlternative,
  cycleAtmosphere,
  IDLE_ARRIVAL,
  stepAlternative,
} from '@/lib/arrival/flow';
import { respondToArrival } from '@/lib/arrival/respond';

const DAY = { catalog: AUDIOS, hour: 12 };
const NIGHT = { catalog: AUDIOS, hour: 23 };

describe('flujo de llegada (función pura)', () => {
  it('elegir una entrada fija la atmósfera y devuelve la respuesta', () => {
    const flow = chooseArrival('mood:tiredness', DAY);

    expect(flow.key).toBe('mood:tiredness');
    expect(flow.atmosphere).toBe('dusk');
    expect(flow.response).toEqual(respondToArrival('mood:tiredness', DAY));
    expect(flow.index).toBe(0);
  });

  it('sin entrada no hay alternativa ni se mueve nada', () => {
    expect(currentAlternative(IDLE_ARRIVAL)).toBeNull();
    expect(stepAlternative(IDLE_ARRIVAL, 1)).toBe(IDLE_ARRIVAL);
    expect(cycleAtmosphere(IDLE_ARRIVAL)).toBe(IDLE_ARRIVAL);
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
    for (const key of ['mood:breathe', 'mood:sadness', 'intent:rest'] as ArrivalKey[]) {
      let flow = chooseArrival(key, NIGHT);
      for (let i = 0; i < 9; i += 1) {
        const audio = currentAlternative(flow);
        expect(audio && isPlayable(audio), key).toBe(true);
        flow = stepAlternative(flow, 1);
      }
    }
  });

  it('«elegir otra opción» cambia la atmósfera sin reiniciar el flujo', () => {
    const chosen = chooseArrival('mood:calm', DAY);
    const indexed = stepAlternative(chosen, 1);

    const changed = cycleAtmosphere(indexed);

    expect(changed.atmosphere).not.toBe(indexed.atmosphere);
    expect(changed.key).toBe(indexed.key);
    expect(changed.response).toBe(indexed.response);
    expect(changed.index).toBe(indexed.index);
  });

  it('«otra opción» recorre todas las atmósferas y vuelve a la de la entrada', () => {
    const chosen = chooseArrival('mood:calm', NIGHT);
    const offered = [chosen.response!.atmosphere, ...chosen.response!.otherAtmospheres];

    const seen: string[] = [];
    let flow = chosen;
    for (let i = 0; i < offered.length; i += 1) {
      seen.push(flow.atmosphere!);
      flow = cycleAtmosphere(flow);
    }

    expect(seen).toEqual(offered);
    expect(flow.atmosphere).toBe(chosen.atmosphere);
  });

  it('de noche «otra opción» ofrece la luna primero; de día no aparece', () => {
    const night = chooseArrival('mood:calm', NIGHT);
    expect(cycleAtmosphere(night).atmosphere).toBe('moon');

    const day = chooseArrival('mood:calm', DAY);
    expect(day.response!.otherAtmospheres).not.toContain('moon');
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
