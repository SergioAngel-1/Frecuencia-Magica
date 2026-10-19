import { renderToString } from 'react-dom/server';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({ useLocale: () => 'es' }));

import { useUpcomingDates } from '@/hooks/use-upcoming-dates';

function Probe() {
  const dates = useUpcomingDates(3);
  return <span>{dates === null ? 'null' : dates.length}</span>;
}

describe('useUpcomingDates', () => {
  it('es null en el servidor, para no dejar fechas del build en el HTML', () => {
    expect(renderToString(<Probe />)).toContain('null');
  });

  it('devuelve la cantidad de fechas pedida tras montar', () => {
    const { result } = renderHook(() => useUpcomingDates(3));

    expect(result.current).toHaveLength(3);
  });

  it('es estable entre renders mientras no cambien sus entradas', () => {
    const { result, rerender } = renderHook(() => useUpcomingDates(3));
    const first = result.current;
    rerender();

    expect(result.current).toBe(first);
  });
});
