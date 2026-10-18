import type { ReactNode } from 'react';

import { EditorialBanner } from '@/components/ui';
import type { EditorialMedia } from '@/types/editorial-media';

export type AngelExperience = {
  id: string;
  title: string;
  body: string;
};

type AngelExperiencesProps = {
  media: EditorialMedia;
  kicker: string;
  title: string;
  intro: string;
  items: readonly AngelExperience[];
  /** Enlace que lleva de leerlo a vivirlo (las experiencias en vivo). */
  action: ReactNode;
};

/**
 * Experiencias con Ángeles: una banda a sangre en lavanda, el acento de lo
 * introspectivo, y debajo tres maneras de sentir esa compañía. Son columnas
 * de texto sobre un filo de luz, no tarjetas: aquí no hay nada que comprar.
 */
export function AngelExperiences({
  media,
  kicker,
  title,
  intro,
  items,
  action,
}: AngelExperiencesProps) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="bg-accent-3/10 pointer-events-none absolute top-1/2 right-[-12%] h-[420px] w-[420px] rounded-full blur-3xl"
      />
      <EditorialBanner
        media={media}
        eyebrow={kicker}
        title={title}
        body={<p className="max-w-measure-full leading-[1.75]">{intro}</p>}
        tone="lav"
        heightClassName="min-h-[clamp(420px,46vw,640px)]"
      />
      <div className="fm-editorial-full-bleed fm-container mt-block">
        <ul className="grid grid-cols-1 gap-x-[clamp(28px,5vw,72px)] gap-y-10 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="border-accent-3/35 border-t pt-6">
              <h3 className="text-fg font-serif text-[clamp(26px,3vw,34px)] leading-[1.05] italic">
                {item.title}
              </h3>
              <p className="text-fg-body text-body max-w-measure-base mt-4 leading-[1.75]">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-block">{action}</div>
      </div>
    </div>
  );
}
