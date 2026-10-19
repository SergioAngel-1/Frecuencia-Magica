import { describe, expect, it } from 'vitest';

import { ARRIVALS } from '@/config/arrivals';
import {
  activeFeeling,
  originFromRect,
  planShift,
  type ShiftContext,
  type ShiftRequest,
} from '@/lib/atmosphere/shift';

const request = (over: Partial<ShiftRequest> = {}): ShiftRequest => ({
  choice: 'dusk',
  resolved: 'dusk',
  source: 'manual',
  feeling: null,
  ...over,
});

const context = (over: Partial<ShiftContext> = {}): ShiftContext => ({
  current: 'night',
  busy: false,
  atPortal: false,
  ...over,
});

describe('planShift', () => {
  it('un cambio manual pide confirmación', () => {
    expect(planShift(request(), context())).toBe('confirm');
  });

  it('un cambio por estado del ánimo fuera del portal pide confirmación', () => {
    expect(planShift(request({ source: 'feeling' }), context())).toBe('confirm');
  });

  it('si el tema visible no cambia, se aplica sin ceremonia', () => {
    expect(planShift(request({ resolved: 'night' }), context())).toBe('apply');
  });

  it('con otro cruce en marcha, se aplica sin pisarlo', () => {
    expect(planShift(request(), context({ busy: true }))).toBe('apply');
    expect(planShift(request({ source: 'feeling' }), context({ busy: true }))).toBe('apply');
  });

  it('en el portal, que ya es el umbral, se aplica sin ceremonia', () => {
    expect(planShift(request({ source: 'feeling' }), context({ atPortal: true }))).toBe('apply');
  });
});

describe('activeFeeling', () => {
  it('nombra la emoción mientras el tema elegido es el que propone', () => {
    expect(activeFeeling(ARRIVALS['mood:tiredness'].atmosphere, 'mood:tiredness')).toBe(
      'mood:tiredness',
    );
  });

  it('calla si el tema elegido no es el que propone la emoción', () => {
    const other = ARRIVALS['mood:tiredness'].atmosphere === 'night' ? 'dawn' : 'night';

    expect(activeFeeling(other, 'mood:tiredness')).toBeNull();
  });

  it('calla en automático, aunque llegue una emoción guardada', () => {
    expect(activeFeeling(null, 'mood:tiredness')).toBeNull();
  });

  it('calla si no hay emoción guardada', () => {
    expect(activeFeeling('night', null)).toBeNull();
  });
});

describe('originFromRect', () => {
  const viewport = { width: 1000, height: 800 };

  it('devuelve el centro del rectángulo como fracción del viewport', () => {
    expect(originFromRect({ left: 100, top: 100, width: 200, height: 100 }, viewport)).toEqual({
      x: 0.2,
      y: 150 / 800,
    });
  });

  it('acota a 0–1 un rectángulo fuera de pantalla', () => {
    expect(originFromRect({ left: -500, top: 2000, width: 10, height: 10 }, viewport)).toEqual({
      x: 0,
      y: 1,
    });
  });
});
