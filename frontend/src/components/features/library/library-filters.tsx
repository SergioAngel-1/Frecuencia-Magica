'use client';

import { useTranslations } from 'next-intl';

import { Pill } from '@/components/ui';

type LibraryFiltersProps = {
  active: string | null;
  onChange: (key: string | null) => void;
};

const FILTERS = ['all', 'meditation', 'frequency', 'rest', 'ritual'] as const;

export function LibraryFilters({ active, onChange }: LibraryFiltersProps) {
  const t = useTranslations('library');

  return (
    <div
      className="mb-[38px] flex flex-wrap gap-[10px]"
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
