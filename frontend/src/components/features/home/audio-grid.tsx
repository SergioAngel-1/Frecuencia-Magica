'use client';

import { usePlayerStore } from '@/stores/player-store';
import { FrequencyDisc } from '@/components/ui';

type AudioItem = {
  id: string;
  hz: number;
  band: string;
  title: string;
  meta: string;
};

type AudioGridProps = {
  audios: AudioItem[];
};

export function AudioGrid({ audios }: AudioGridProps) {
  const open = usePlayerStore((s) => s.open);
  const activeId = usePlayerStore((s) => s.audioId);

  return (
    <div className="grid gap-x-[22px] gap-y-[36px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}>
      {audios.slice(0, 4).map((audio) => (
        <FrequencyDisc
          key={audio.id}
          size="md"
          hz={audio.hz}
          band={audio.band}
          title={audio.title}
          meta={audio.meta}
          active={activeId === audio.id}
          showEqualizer
          showPlay
          ariaLabel={`${audio.title} — ${audio.hz} Hz — ${audio.meta}`}
          onClick={() => open(audio.id)}
        />
      ))}
    </div>
  );
}
