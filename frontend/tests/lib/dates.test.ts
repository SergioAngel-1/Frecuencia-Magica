import { describe, expect, it } from 'vitest';

import { upcomingDates } from '@/lib/booking/dates';

describe('upcomingDates', () => {
  const base = new Date(2026, 6, 28); // 2026-07-28

  it('genera la cantidad de fechas pedida', () => {
    expect(upcomingDates(base, 6)).toHaveLength(6);
  });

  it('las fechas son consecutivas desde el día siguiente', () => {
    const dates = upcomingDates(base, 3);
    expect(dates[0]!.iso).toBe('2026-07-29');
    expect(dates[1]!.iso).toBe('2026-07-30');
    expect(dates[2]!.iso).toBe('2026-07-31');
  });

  it('cada fecha trae día de la semana, número y mes', () => {
    const dates = upcomingDates(base, 6);
    for (const d of dates) {
      expect(d.dow).toBeTruthy();
      expect(d.day).toBeTruthy();
      expect(d.month).toBeTruthy();
    }
  });

  it('cruza correctamente el cambio de mes', () => {
    const feb28 = new Date(2024, 1, 28); // 2024 es bisiesto
    const dates = upcomingDates(feb28, 3);
    expect(dates[0]!.iso).toBe('2024-02-29');
    expect(dates[1]!.iso).toBe('2024-03-01');
    expect(dates[2]!.iso).toBe('2024-03-02');
  });
});
