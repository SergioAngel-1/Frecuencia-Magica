import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import type { VideoEntry } from '@/config/videos';
import type { EditorialMedia } from '@/types/editorial-media';

/** El póster de un video: su slot editorial ya resuelto, con el alt y el `sizes` de quien lo pinta. */
export function videoPosterMedia(
  video: VideoEntry,
  input: { alt: string; sizes?: string; band?: string },
): EditorialMedia {
  return resolveEditorialMedia(video.poster.slot, {
    instance: video.poster.instance,
    alt: input.alt,
    sizes: input.sizes,
    band: input.band,
  });
}
