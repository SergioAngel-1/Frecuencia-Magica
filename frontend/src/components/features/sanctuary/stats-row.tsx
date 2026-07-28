import { getTranslations } from 'next-intl/server';

import { GlassPanel, Stat } from '@/components/ui';

export async function StatsRow() {
  const t = await getTranslations('sanctuary');

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      <GlassPanel className="flex items-center justify-center p-5 text-center">
        <Stat
          value={t('stats.days.value')}
          label={t('stats.days.label')}
          tone="gold"
          size="sanctuary"
        />
      </GlassPanel>
      <GlassPanel className="flex items-center justify-center p-5 text-center">
        <Stat
          value={t('stats.frequencies.value')}
          label={t('stats.frequencies.label')}
          tone="teal"
          size="sanctuary"
        />
      </GlassPanel>
      <GlassPanel className="flex items-center justify-center p-5 text-center">
        <Stat
          value={t('stats.courses.value')}
          label={t('stats.courses.label')}
          tone="lav"
          size="sanctuary"
        />
      </GlassPanel>
      <GlassPanel className="flex items-center justify-center p-5 text-center">
        <Stat
          value={t('stats.entries.value')}
          label={t('stats.entries.label')}
          tone="ivory"
          size="sanctuary"
        />
      </GlassPanel>
    </div>
  );
}
