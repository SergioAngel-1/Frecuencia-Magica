'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Collapse } from '@/components/ui';

type TrackGuideProps = {
  /** Postura y para qué momento sirve, ya traducido. */
  guide: string;
};

/**
 * La guía de escucha de una pista: postura y para qué momento sirve. Se abre
 * antes de reproducir. La composición y el aviso de auriculares van siempre en
 * la tarjeta. El panel se pliega con la fila de rejilla 0fr→1fr.
 */
export function TrackGuide({ guide }: TrackGuideProps) {
  const t = useTranslations('resonario');
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="text-fg-soft text-meta tracking-ui focus-visible:ring-accent flex min-h-11 items-center self-start font-sans underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
      >
        {t('guide.toggle')}
      </button>
      <Collapse id={panelId} open={open} fade={false} className="duration-300 ease-[ease]">
        <div className="text-fg-body text-body flex flex-col gap-3 pt-3 font-light">
          <p>{guide}</p>
        </div>
      </Collapse>
    </div>
  );
}
