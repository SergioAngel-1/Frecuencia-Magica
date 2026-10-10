import type { ReactNode } from 'react';

import { Display, FullBleedSection, Kicker, Prose } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { EditorialMedia } from '@/types/editorial-media';

/**
 * Alto del héroe de catálogo. Lo comparten el héroe y la silueta de su
 * `loading.tsx`, para que la espera ocupe exactamente el mismo hueco.
 */
export const REALM_HERO_HEIGHT = 'min-h-[clamp(420px,52vw,680px)]';

export interface RealmHeroProps {
  media: EditorialMedia;
  kicker: string;
  title: string;
  description: string;
  /** Control que acompaña al título (el carrito de la tienda). */
  action?: ReactNode;
  className?: string;
}

/**
 * Héroe de los realms de catálogo (resonario, academia, experiencias,
 * tienda): foto a sangre con el kicker, el título y la entrada centrados en
 * vertical sobre el eje de página. Presentacional: recibe el texto traducido.
 */
export function RealmHero({
  media,
  kicker,
  title,
  description,
  action,
  className,
}: RealmHeroProps) {
  const heading = (
    <>
      <Kicker tone="teal" spacing="wide">
        {kicker}
      </Kicker>
      <Display size="xl" level="h1" className="mt-4 max-w-[16ch]">
        {title}
      </Display>
    </>
  );

  return (
    <FullBleedSection
      media={media}
      mode="banner"
      overlay="left"
      fade="bottom"
      className={cn(REALM_HERO_HEIGHT, className)}
      contentClassName="flex items-center"
    >
      <div className="fm-container flex w-full flex-col py-20">
        {action ? (
          <div className="flex items-start justify-between gap-6">
            <div>{heading}</div>
            {action}
          </div>
        ) : (
          heading
        )}
        <Prose maxWidth={52} className="text-fg-body mt-6">
          {description}
        </Prose>
      </div>
    </FullBleedSection>
  );
}
