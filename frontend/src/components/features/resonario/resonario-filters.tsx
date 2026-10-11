'use client';

import { useTranslations } from 'next-intl';

import { Pill } from '@/components/ui';

type ResonarioFiltersProps = {
  active: string | null;
  onChange: (key: string | null) => void;
};

const FILTERS = ['all', 'meditation', 'frequency', 'rest', 'ritual'] as const;

export function ResonarioFilters({ active, onChange }: ResonarioFiltersProps) {
  const t = useTranslations('resonario');

  return (
    <div
      // Mismo eje que el sistema orbital de debajo: las píldoras se centran
      // sobre el disco destacado.
      className="mx-auto mb-[38px] flex max-w-[1040px] flex-wrap justify-center gap-[10px]"
      role="group"
      aria-label={t('filtersLabel')}
    >
      {FILTERS.map((key) => (
        <Pill
          key={key}
          active={active === key || (!active && key === 'all')}
          onClick={() => onChange(key === 'all' ? null : key)}
        >
          {t(`filters.${key}` as 'filters.all')}
        </Pill>
      ))}
    </div>
  );
}
