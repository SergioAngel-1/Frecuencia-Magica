'use client';

import { useLocale, useTranslations } from 'next-intl';

import { GlassPanel, Stat } from '@/components/ui';
import { useMounted } from '@/hooks/use-mounted';
import { useJournalStore } from '@/stores/journal-store';

type StatsRowProps = {
  days: number;
  frequencies: number;
  courses: number;
};

/**
 * Las cuatro cifras del santuario.
 *
 * Las entradas de diario son reales (el store local); días, frecuencias y
 * cursos llegan del perfil de demostración (TODO(backend) en
 * `lib/sanctuary/profile.ts`). Cliente porque lee el store; hasta que el
 * cliente ha pintado muestra 0 en vez de los datos de `localStorage`, para no
 * desajustar la hidratación.
 */
export function StatsRow({ days, frequencies, courses }: StatsRowProps) {
  const t = useTranslations('sanctuary.stats');
  const locale = useLocale();
  const mounted = useMounted();
  const entries = useJournalStore((state) => state.entries.length);
  const format = (value: number) => new Intl.NumberFormat(locale).format(value);

  const stats = [
    { id: 'days', value: days, tone: 'gold' },
    { id: 'frequencies', value: frequencies, tone: 'teal' },
    { id: 'courses', value: courses, tone: 'lav' },
    { id: 'entries', value: mounted ? entries : 0, tone: 'ivory' },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {stats.map((stat) => (
        <GlassPanel key={stat.id} className="flex items-center justify-center p-5 text-center">
          <Stat
            value={format(stat.value)}
            label={t(`${stat.id}.label`)}
            tone={stat.tone}
            size="sanctuary"
          />
        </GlassPanel>
      ))}
    </div>
  );
}
