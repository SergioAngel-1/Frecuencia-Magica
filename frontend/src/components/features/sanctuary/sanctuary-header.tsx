import { Display, Kicker } from '@/components/ui';

type SanctuaryHeaderProps = {
  kicker: string;
  /** Saludo ya traducido y con el nombre resuelto. */
  title: string;
};

/**
 * Cabecera de Mi Santuario: el orbe de quien vuelve y su saludo.
 *
 * El orbe es decorativo y respira (`fm-breathe`, sólo transform/opacity): es
 * el «avatar» del plan sin retrato, que hasta que haya cuentas sería un rostro
 * inventado. `aria-hidden`; el saludo lo dice el `h1`.
 */
export function SanctuaryHeader({ kicker, title }: SanctuaryHeaderProps) {
  return (
    <div className="flex items-center gap-5 sm:gap-6">
      <div
        aria-hidden="true"
        className="size-[56px] shrink-0 rounded-full sm:size-[70px]"
        style={{
          background:
            'radial-gradient(circle at 40% 35%, rgba(247,244,234,0.85), rgba(216,185,120,0.5) 45%, transparent 72%)',
          boxShadow: '0 0 40px 8px rgba(216,185,120,0.25)',
          animation: 'fm-breathe 6s ease-in-out infinite',
        }}
      />
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
