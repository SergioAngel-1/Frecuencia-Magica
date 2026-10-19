import { cn } from '@/lib/cn';

type DiscPlayBadgeProps = {
  /** Diámetro de la insignia en px, según la escala. */
  size: number;
  active: boolean;
  /** El disco que suena ofrece la pausa; cualquier otro, el play. */
  pausable: boolean;
};

/** Insignia de play/pausa sobre la esfera. Decorativa: el control es el disco entero. */
export function DiscPlayBadge({ size, active, pausable }: DiscPlayBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className="absolute bottom-[12%] left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full border backdrop-blur-[4px]"
      style={{
        width: size,
        height: size,
        borderColor: active
          ? 'rgb(var(--halo) / 0.7)'
          : 'color-mix(in srgb, var(--color-fg) 70%, transparent)',
        background: active ? 'rgb(var(--halo) / 0.14)' : 'rgb(var(--scrim) / 0.35)',
      }}
    >
      <svg
        width={size * 0.32}
        height={size * 0.32}
        viewBox="0 0 24 24"
        fill="currentColor"
        // El triángulo se centra ópticamente; las barras de pausa ya lo están.
        className={cn('text-fg', !pausable && 'translate-x-[6%]')}
      >
        {pausable ? (
          <>
            <rect x="6.5" y="5" width="3.5" height="14" rx="1" />
            <rect x="14" y="5" width="3.5" height="14" rx="1" />
          </>
        ) : (
          <path d="M8 5v14l11-7z" />
        )}
      </svg>
    </span>
  );
}
