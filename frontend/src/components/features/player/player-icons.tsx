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
