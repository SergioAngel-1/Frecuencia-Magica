'use client';

import { EditorialImage } from '@/components/ui';
import { FrequencyDisc } from '@/components/ui/frequency-disc';
import type { Audio } from '@/types/content';
import type { EditorialMedia } from '@/types/editorial-media';

type LibrarySecondaryDiscProps = {
  audio: Audio;
  media: EditorialMedia;
  title: string;
  meta: string;
  active: boolean;
  floatDuration: string;
  floatDelay?: string;
  onOpen: (audioId: string) => void;
};

export function LibrarySecondaryDisc({
  audio,
  media,
  title,
  meta,
  active,
  floatDuration,
  floatDelay,
  onOpen,
}: LibrarySecondaryDiscProps) {
  return (
    <div className="relative isolate w-full max-w-[150px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 aspect-square">
        <EditorialImage
          aspect="1:1"
          className="h-full"
          focalPoint={media.position}
          media={media}
          overlay="bottom"
          scrim={false}
        />
      </div>
      <div className="relative z-10">
        <FrequencyDisc
          size="sm"
          hz={audio.hz}
          band={audio.band}
          title={title}
          meta={meta}
          active={active}
          floatDuration={floatDuration}
          floatDelay={floatDelay}
          onClick={() => onOpen(audio.id)}
          ariaLabel={title}
        />
      </div>
    </div>
  );
}
