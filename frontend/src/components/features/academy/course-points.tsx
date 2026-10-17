import { useTranslations } from 'next-intl';

import { Display } from '@/components/ui';

type CoursePointsProps = {
  title: string;
  /** Claves de mensaje (`academy.…`), una por punto. */
  keys: readonly string[];
};

/** Una lista corta con título («Qué aprenderás», «Qué incluye»): puntos con luz, sin viñetas de lista. */
export function CoursePoints({ title, keys }: CoursePointsProps) {
  const t = useTranslations('academy');

  return (
    <section>
      <Display level="h2" size="md" className="max-w-[16ch]">
        {title}
      </Display>
      <ul className="mt-6 flex flex-col gap-4">
        {keys.map((key) => (
          <li key={key} className="text-fg-body text-body flex gap-3 leading-[1.7]">
            <span
              aria-hidden="true"
              className="bg-accent mt-[0.7em] size-[6px] shrink-0 rounded-full"
            />
            {t(key.replace(/^academy\./, '') as 'courses.c1.title')}
          </li>
        ))}
      </ul>
    </section>
  );
}
