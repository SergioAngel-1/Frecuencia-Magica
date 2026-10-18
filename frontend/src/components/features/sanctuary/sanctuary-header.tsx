import { Display, Kicker } from '@/components/ui';
import { Isotype } from '@/components/world';

type SanctuaryHeaderProps = {
  kicker: string;
  /** Saludo ya traducido y con el nombre resuelto. */
  title: string;
};

/**
 * Cabecera de Mi Santuario: el isotipo de quien vuelve y su saludo.
 *
 * El isotipo gira despacio sobre un resplandor dorado que respira
 * (`fm-breathe`, sólo transform/opacity): es el «avatar» del plan sin retrato,
 * que hasta que haya cuentas sería un rostro inventado. `aria-hidden`; el
 * saludo lo dice el `h1`.
 */
export function SanctuaryHeader({ kicker, title }: SanctuaryHeaderProps) {
  return (
    // El isotipo va encima del saludo: así el saludo arranca en el eje de página,
    // la misma arista que las tarjetas de la vista.
    <div className="flex flex-col items-start gap-4">
      <div aria-hidden="true" className="relative size-[72px] shrink-0 sm:size-[88px]">
        {/* Resplandor sin borde: más ancho que el isotipo y difuminado hasta desaparecer. */}
        <div
          className="pointer-events-none absolute inset-[-35%] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgb(var(--halo) / 0.2), transparent 66%)',
            filter: 'blur(10px)',
            animation: 'fm-breathe 6s ease-in-out infinite',
          }}
        />
        <Isotype className="size-full" />
      </div>
      <div>
        <Kicker tone="gold" spacing="widest">
          {kicker}
        </Kicker>
        <Display size="lg" level="h1" className="mt-2">
          {title}
        </Display>
      </div>
    </div>
  );
}
