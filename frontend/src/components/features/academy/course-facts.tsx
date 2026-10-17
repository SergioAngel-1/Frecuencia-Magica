import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/lib/format';
import type { Course } from '@/types/content';

type CourseFactsProps = {
  course: Course;
  className?: string;
};

/**
 * Lo que la persona necesita saber antes de entrar: si es gratuito o de pago y
 * cómo se cursa. Se muestra siempre, en la tarjeta y en la ficha.
 */
export function CourseFacts({ course, className }: CourseFactsProps) {
  const t = useTranslations('academy');

  return (
    <ul
      aria-label={t('facts.label')}
      className={cn('flex flex-wrap items-center gap-2', className)}
      data-course-facts
    >
      <li>
        <Badge tone="gold">
          {course.access.type === 'free'
            ? t('facts.free')
            : `${t('facts.paid')} · ${formatPrice(course.access.price)}`}
        </Badge>
      </li>
      <li>
        <Badge tone="teal">{t(`facts.modality.${course.modality}`)}</Badge>
      </li>
      <li>
        <Badge tone="lav">{t('facts.hours', { hours: course.hours })}</Badge>
      </li>
    </ul>
  );
}
