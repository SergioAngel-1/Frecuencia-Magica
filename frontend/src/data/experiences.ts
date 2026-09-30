import type { Experience } from '@/types/content';
import { COVERS } from '@/config/covers';

/** Las cuatro experiencias en vivo. La primera es la destacada. */
export const EXPERIENCES: readonly Experience[] = [
  {
    id: 'e1',
    titleKey: 'experiences.items.e1.title',
    modeKey: 'experiences.modes.online',
    mode: 'online',
    dur: '60 min',
    price: 45,
    band: COVERS.lagoon,
  },
  {
    id: 'e2',
    titleKey: 'experiences.items.e2.title',
    modeKey: 'experiences.modes.inPerson',
    mode: 'inPerson',
    dur: '90 min',
    price: 60,
    band: COVERS.iris,
  },
  {
    id: 'e3',
    titleKey: 'experiences.items.e3.title',
    modeKey: 'experiences.modes.inPerson',
    mode: 'inPerson',
    dur: '75 min',
    price: 55,
    band: COVERS.amber,
  },
  {
    id: 'e4',
    titleKey: 'experiences.items.e4.title',
    modeKey: 'experiences.modes.online',
    mode: 'online',
    dur: '45 min',
    price: 35,
    band: COVERS.moss,
  },
] as const;
