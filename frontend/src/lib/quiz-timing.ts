export type TuningTiming = {
  reveal: number;
  finish: number;
};

const FULL_TIMING: TuningTiming = { reveal: 1800, finish: 3000 };
const REDUCED_TIMING: TuningTiming = { reveal: 0, finish: 250 };

export function getTuningTiming(reducedMotion: boolean): TuningTiming {
  return reducedMotion ? REDUCED_TIMING : FULL_TIMING;
}
