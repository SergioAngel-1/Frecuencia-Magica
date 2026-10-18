'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';

import { useMounted } from '@/hooks/use-mounted';
import { upcomingDates, type DateOption } from '@/lib/booking/dates';

/**
 * Próximas fechas de reserva, ya en el cliente.
 *
 * Las páginas de experiencias son estáticas: calcularlas durante el render
 * dejaría en el HTML las fechas del día del build —viejas al cabo de días— y
 * el cliente pintaría otras, con desajuste de hidratación. Devuelve `null`
 * hasta montar para que el primer render coincida con el servidor; después se
 * memoiza sobre `count` y el idioma, así el formulario no las recalcula a cada
 * tecla. La fecha base entra por parámetro para poder fijarla en los tests.
 */
export function useUpcomingDates(count: number, base?: Date): DateOption[] | null {
  const mounted = useMounted();
  const locale = useLocale();

  return useMemo(
    () => (mounted ? upcomingDates(base ?? new Date(), count, locale) : null),
    [mounted, count, locale, base],
  );
}
