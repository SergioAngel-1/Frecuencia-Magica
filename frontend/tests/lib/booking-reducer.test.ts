import { describe, expect, it } from 'vitest';

import {
  INITIAL_BOOKING,
  bookingReducer,
  canContinue,
  canConfirm,
} from '@/lib/booking/booking-reducer';

describe('canContinue', () => {
  it('no se puede continuar sin fecha y hora', () => {
    expect(canContinue({ ...INITIAL_BOOKING, date: '2026-08-01', time: null })).toBe(false);
    expect(canContinue({ ...INITIAL_BOOKING, date: null, time: '09:00' })).toBe(false);
    expect(canContinue(INITIAL_BOOKING)).toBe(false);
  });

  it('se puede continuar con fecha y hora', () => {
    expect(canContinue({ ...INITIAL_BOOKING, date: '2026-08-01', time: '09:00' })).toBe(true);
  });
});

describe('canConfirm', () => {
  it('no se puede confirmar sin nombre y correo', () => {
    expect(canConfirm({ ...INITIAL_BOOKING, name: '', email: 'a@b.com' })).toBe(false);
    expect(canConfirm({ ...INITIAL_BOOKING, name: 'Ana', email: '' })).toBe(false);
  });

  it('el correo debe tener forma de correo', () => {
    expect(canConfirm({ ...INITIAL_BOOKING, name: 'Ana', email: 'hola' })).toBe(false);
    expect(canConfirm({ ...INITIAL_BOOKING, name: 'Ana', email: 'hola@ejemplo.com' })).toBe(true);
  });
});

describe('bookingReducer', () => {
  it('empieza en el paso de fecha sin selección', () => {
    expect(INITIAL_BOOKING.step).toBe(0);
    expect(INITIAL_BOOKING.date).toBeNull();
    expect(INITIAL_BOOKING.time).toBeNull();
  });

  it('continuar avanza al paso de datos', () => {
    const state = bookingReducer(
      { ...INITIAL_BOOKING, date: '2026-08-01', time: '09:00' },
      { type: 'CONTINUE' },
    );
    expect(state.step).toBe(1);
  });

  it('continuar sin selección no avanza', () => {
    const state = bookingReducer(INITIAL_BOOKING, { type: 'CONTINUE' });
    expect(state.step).toBe(0);
  });

  it('cambiar la fecha conserva la hora', () => {
    const state = bookingReducer(
      { ...INITIAL_BOOKING, date: '2026-08-01', time: '09:00' },
      { type: 'PICK_DATE', date: '2026-08-05' },
    );
    expect(state.date).toBe('2026-08-05');
    expect(state.time).toBe('09:00');
  });

  it('confirmar avanza al paso final', () => {
    const state = bookingReducer(
      { ...INITIAL_BOOKING, step: 1, name: 'Ana', email: 'ana@ejemplo.com' },
      { type: 'CONFIRM' },
    );
    expect(state.step).toBe(2);
  });

  it('volver desde datos regresa a fecha conservando la selección', () => {
    const state = bookingReducer(
      { ...INITIAL_BOOKING, step: 1, date: '2026-08-01', time: '09:00' },
      { type: 'BACK' },
    );
    expect(state.step).toBe(0);
    expect(state.date).toBe('2026-08-01');
    expect(state.time).toBe('09:00');
  });

  it('reiniciar limpia todo', () => {
    const state = bookingReducer(
      { step: 2, date: '2026-08-01', time: '09:00', name: 'Ana', email: 'a@b.com', note: 'ok' },
      { type: 'RESET' },
    );
    expect(state).toEqual(INITIAL_BOOKING);
  });
});
