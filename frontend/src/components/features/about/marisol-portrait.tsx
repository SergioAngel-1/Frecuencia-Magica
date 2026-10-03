import { EditorialImage } from '@/components/ui';
import { OrbitalRings } from '@/components/world';
import { cn } from '@/lib/cn';
import type { EditorialMedia } from '@/types/editorial-media';

type MarisolPortraitProps = {
  media: EditorialMedia;
  className?: string;
};

/**
 * Retrato de Marisol en arco de nicho: la máscara, el óvalo y los aros son
 * parte del retrato, no de la vista. Lo comparten el home y su vista interna
 * para que la fundadora se reconozca igual en los dos sitios.
 */
export function MarisolPortrait({ media, className }: MarisolPortraitProps) {
  return (
    <div
      className={cn('relative w-full max-w-[420px]', className)}
      data-editorial-zone="human-focus"
    >
      <div className="border-gold/35 relative aspect-[3/4] overflow-hidden rounded-[200px_200px_8px_8px] border">
        <EditorialImage
          media={media}
          aspect="3:4"
          className="h-full"
          focalPoint="50% 30%"
          scrim="bottom"
          overlay={false}
        />
        <div
          aria-hidden="true"
          className="border-gold/30 pointer-events-none absolute inset-[8%] rounded-[45%] border opacity-75"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[13%] left-1/2 -translate-x-1/2 opacity-75"
        >
          <OrbitalRings
            size={150}
            spin={90}
            rings={[
              { r: 74, stroke: 'rgba(216,185,120,0.24)' },
              { r: 58, stroke: 'rgba(150,198,188,0.18)' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
