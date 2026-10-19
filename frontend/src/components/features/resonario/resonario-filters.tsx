import { useTranslations } from 'next-intl';

import { Pill } from '@/components/ui';
import { AUDIO_KINDS } from '@/config/audio-kinds';

type ResonarioFiltersProps = {
  /** Tipo activo, o `null` para todo. */
  active: string | null;
  onChange: (key: string | null) => void;
};

/** «Todo» y un filtro por cada tipo de escucha. Filtran por `kind`, no por texto. */
const FILTERS = ['all', ...AUDIO_KINDS.map((entry) => entry.kind)] as const;

export function ResonarioFilters({ active, onChange }: ResonarioFiltersProps) {
  const t = useTranslations('resonario');

  return (
    <div
      // Mismo eje que las secciones de debajo: las píldoras se centran sobre ellas.
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
          {key === 'all' ? t('filters.all') : t(`kinds.${key}.title`)}
        </Pill>
      ))}
    </div>
  );
}
