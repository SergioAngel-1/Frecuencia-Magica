import type { SizeSpec } from '@/config/frequency-disc';

type DiscAuraProps = {
  /** Aura de la escala; `null` si el disco no la lleva. */
  aura: NonNullable<SizeSpec['aura']>;
  /** Banda de color del audio, difuminada detrás de la esfera. */
  band: string;
  active: boolean;
};

/**
 * La propia banda del audio, difuminada y respirando detrás del disco. La
 * opacidad va en el envoltorio: `fm-breathe` anima la suya propia.
 */
export function DiscAura({ aura, band, active }: DiscAuraProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute transition-opacity duration-500"
      style={{ inset: aura.inset, opacity: active ? aura.active : aura.rest }}
    >
      <div
        className="animate-fm-breathe size-full rounded-full"
        style={{ backgroundImage: band, filter: `blur(${aura.blur}px)` }}
      />
    </div>
  );
}
