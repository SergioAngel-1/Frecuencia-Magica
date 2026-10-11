import { EditorialImage } from '@/components/ui';
import type { EditorialOverlayDirection } from '@/types/editorial-media';
import { editorialVisual } from '@/lib/editorial/visual';
import type { EditorialMedia } from '@/types/editorial-media';

/**
 * La foto de un audio dentro de su esfera: la pintan el disco de frecuencia y
 * la carátula del reproductor. Sólo pinta si hay foto: sin ella, la esfera ya
 * es su banda y no hace falta repetirla.
 */
type AudioCoverProps = {
  media: EditorialMedia;
  /**
   * Velo inferior bajo la cifra, el play y el ecualizador del disco. La
   * carátula del reproductor, a escala de control, lo quita: tapaba la foto.
   */
  scrim?: EditorialOverlayDirection | false;
};

export function AudioCover({ media, scrim = 'bottom' }: AudioCoverProps) {
  if (editorialVisual(media) !== 'photo') return null;

  return (
    <EditorialImage
      aspect="1:1"
      className="h-full"
      focalPoint={media.position}
      media={media}
      overlay={false}
      scrim={scrim}
    />
  );
}
