import type { CSSProperties } from 'react';

/**
 * Glifo circular de realm: dos círculos concéntricos y un punto superior. La
 * variante grande se obtiene con `size={72}`.
 */
export function RealmGlyph({
  color,
  size = 40,
  className,
  style,
}: {
  color: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      className={className}
      style={{ width: size, height: size, opacity: 0.8, ...style }}
    >
      <circle cx="20" cy="20" r="15" fill="none" stroke={color} strokeWidth="0.9" />
      <circle cx="20" cy="20" r="7" fill="none" stroke={color} strokeWidth="0.7" />
      <circle cx="20" cy="5" r="1.6" fill={color} />
    </svg>
  );
}
