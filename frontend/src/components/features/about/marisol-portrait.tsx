import { EditorialImage, Float } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { EditorialMedia } from '@/types/editorial-media';

type MarisolPortraitProps = {
  media: EditorialMedia;
  className?: string;
};

/**
 * Retrato de Marisol en arco de nicho: el marco (el arco) y el submarco (el
 * óvalo) son parte del retrato, no de la vista. Nada se dibuja sobre el
 * rostro. Lo comparten el home y su vista interna para que la fundadora se
 * reconozca igual en los dos sitios.
 */
export function MarisolPortrait({ media, className }: MarisolPortraitProps) {
  return (
    <div
      className={cn('relative w-full max-w-[420px]', className)}
      data-editorial-zone="human-focus"
    >
      {/* El retrato flota como el resto de la materia viva del sitio. */}
      <Float className="border-accent/35 relative aspect-[3/4] overflow-hidden rounded-[200px_200px_8px_8px] border">
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
          className="border-accent/30 pointer-events-none absolute inset-[8%] rounded-[45%] border opacity-75"
        />
      </Float>
    </div>
  );
}
