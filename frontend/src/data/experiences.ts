import type { Experience } from '@/types/content';

/** Las cuatro experiencias en vivo. La primera es la destacada. */
export const EXPERIENCES: readonly Experience[] = [
  {
    id: 'e1',
    titleKey: 'experiences.items.e1.title',
    modeKey: 'experiences.modes.online',
    mode: 'online',
    dur: '60 min',
    price: 45,
    band: 'linear-gradient(150deg,#4a7d8a,#1c2f36)',
  },
  {
    id: 'e2',
    titleKey: 'experiences.items.e2.title',
    modeKey: 'experiences.modes.inPerson',
    mode: 'inPerson',
    dur: '90 min',
    price: 60,
    band: 'linear-gradient(150deg,#6a5a8c,#221d38)',
  },
  {
    id: 'e3',
    titleKey: 'experiences.items.e3.title',
    modeKey: 'experiences.modes.inPerson',
    mode: 'inPerson',
    dur: '75 min',
    price: 55,
    band: 'linear-gradient(150deg,#8a7150,#2c2418)',
  },
  {
    id: 'e4',
    titleKey: 'experiences.items.e4.title',
    modeKey: 'experiences.modes.online',
    mode: 'online',
    dur: '45 min',
    price: 35,
    band: 'linear-gradient(150deg,#4f6b5e,#1e2e28)',
  },
] as const;
