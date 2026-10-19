type BreathIconProps = {
  className?: string;
  size?: number;
};

/**
 * Orbe de la respiración: dos círculos concéntricos. Es el icono de la
 * práctica, no el de una emoción, así que no lleva color propio.
 */
export function BreathIcon({ className, size = 18 }: BreathIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
