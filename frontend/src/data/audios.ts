import type { Audio } from '@/types/content';
import { COVERS } from '@/config/covers';

/** Las siete frecuencias del catálogo. Portadas 1:1 del prototipo. */
export const AUDIOS: readonly Audio[] = [
  {
    id: 'a1',
    titleKey: 'library.audios.a1.title',
    tagKey: 'library.tags.meditation',
    tagId: 'meditation',
    duration: '18:00',
    hz: 432,
    band: COVERS.tide,
  },
  {
    id: 'a2',
    titleKey: 'library.audios.a2.title',
    tagKey: 'library.tags.frequency',
    tagId: 'frequency',
    duration: '11:20',
    hz: 528,
    band: COVERS.violet,
  },
  {
    id: 'a3',
    titleKey: 'library.audios.a3.title',
    tagKey: 'library.tags.grounding',
    tagId: 'grounding',
    duration: '24:40',
    hz: 396,
    band: COVERS.moss,
  },
  {
    id: 'a4',
    titleKey: 'library.audios.a4.title',
    tagKey: 'library.tags.rest',
    tagId: 'rest',
    duration: '42:00',
    hz: 174,
    band: COVERS.indigo,
  },
  {
    id: 'a5',
    titleKey: 'library.audios.a5.title',
    tagKey: 'library.tags.ritual',
    tagId: 'ritual',
    duration: '09:10',
    hz: 639,
    band: COVERS.amber,
  },
  {
    id: 'a6',
    titleKey: 'library.audios.a6.title',
    tagKey: 'library.tags.breath',
    tagId: 'breath',
    duration: '07:30',
    hz: 417,
    band: COVERS.lagoon,
  },
  {
    id: 'a7',
    titleKey: 'library.audios.a7.title',
    tagKey: 'library.tags.meditation',
    tagId: 'meditation',
    duration: '15:40',
    hz: 528,
    band: COVERS.sage,
  },
] as const;
