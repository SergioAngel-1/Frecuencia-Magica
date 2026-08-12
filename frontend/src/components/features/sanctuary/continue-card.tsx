import { getTranslations } from 'next-intl/server';

import { Button, GlassPanel, Kicker } from '@/components/ui';
import { Link } from '@/i18n/navigation';

export async function ContinueCard() {
  const t = await getTranslations('sanctuary');

  return (
    <GlassPanel className="flex flex-col gap-3 p-5" glow>
      <Kicker tone="teal" spacing="widest">
        {t('continue.kicker')}
      </Kicker>
      <p className="font-serif text-[21px] leading-tight text-ivory">
        {t('continue.subtitle')}
      </p>
      <Button variant="accent" size="sm" tone="teal" className="self-start" asChild>
        <Link
          href={{
            pathname: '/academia/[courseId]/[lessonId]',
            params: { courseId: 'c1', lessonId: '5' },
          }}
        >
          {t('continue.cta')}
        </Link>
      </Button>
    </GlassPanel>
  );
}
