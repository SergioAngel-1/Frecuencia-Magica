/**
 * Iconos del reproductor: un solo trazo y un solo peso, dibujados aquí para
 * que anterior, siguiente, ocultar y cerrar hablen el mismo lenguaje.
 */
const STROKE = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export function PlayPauseIcon({ playing, size = 20 }: { playing: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {playing ? (
        <>
          <rect x="6.5" y="5" width="3.5" height="14" rx="1" />
          <rect x="14" y="5" width="3.5" height="14" rx="1" />
        </>
      ) : (
        <path d="M8.5 5.2v13.6L19 12z" />
      )}
    </svg>
  );
}

export function PreviousIcon() {
  return (
    <svg {...STROKE}>
      <path d="M6 6v12M18 6.5 9.5 12l8.5 5.5z" />
    </svg>
  );
}

export function NextIcon() {
  return (
    <svg {...STROKE}>
      <path d="M18 6v12M6 6.5l8.5 5.5L6 17.5z" />
    </svg>
  );
}

export function MinimizeIcon() {
  return (
    <svg {...STROKE}>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg {...STROKE}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  );
}

/** Altavoz; con `muted`, tachado. */
export function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg {...STROKE}>
      <path d="M4.5 9.5v5h3.2l4.3 3.5v-12L7.7 9.5z" />
      {muted ? (
        <path d="m15.5 9.5 5 5M20.5 9.5l-5 5" />
      ) : (
        <path d="M15.5 9a4.2 4.2 0 0 1 0 6M17.8 6.7a7.5 7.5 0 0 1 0 10.6" />
      )}
    </svg>
  );
}

/** Esquinas que se abren para entrar a pantalla completa y se cierran para salir. */
export function FullscreenIcon({ active }: { active: boolean }) {
  return (
    <svg {...STROKE}>
      {active ? (
        <path d="M9 5v4H5M15 5v4h4M9 19v-4H5M15 19v-4h4" />
      ) : (
        <path d="M5 9V5h4M19 9V5h-4M5 15v4h4M19 15v4h-4" />
      )}
    </svg>
  );
}
