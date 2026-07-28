import { getTranslations } from 'next-intl/server';

import { GlassPanel, Kicker, FrequencyDisc } from '@/components/ui';

export async function DailyCard() {
  const t = await getTranslations('sanctuary');

  return (
    <GlassPanel className="flex flex-col items-center gap-3 p-5 text-center" glow>
      <Kicker tone="gold" spacing="widest">
        {t('daily.kicker')}
      </Kicker>
      <p className="font-sans text-[13px] tracking-[.08em] text-ivory/60">
        {t('daily.subtitle')}
      </p>
      <FrequencyDisc
        size="sm"
        hz={432}
        band="linear-gradient(150deg,#16273f,#0a1220)"
        title="432 Hz"
      />
    </GlassPanel>
  );
}
