import { Display, Kicker } from '@/components/ui';
import { OrbitalRings } from '@/components/world';

type AboutSectionProps = {
  kicker: string;
  title: string;
  p1: string;
  p2: string;
};

export function AboutSection({ kicker, title, p1, p2 }: AboutSectionProps) {
  return (
    <section className="mx-auto max-w-[1080px] px-[8vw] py-[90px]">
      <div className="flex flex-wrap items-start gap-[56px]">
        {/* Retrato placeholder */}
        <div
          className="relative min-w-[240px] flex-1 overflow-hidden"
          style={{
            borderRadius: '200px 200px 22px 22px',
            aspectRatio: '3 / 4',
            background:
              'linear-gradient(160deg, rgba(216,185,120,0.22), rgba(185,176,214,0.16) 55%, rgba(150,198,188,0.14))',
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(80% 60% at 40% 20%, rgba(247,244,234,0.14), transparent 60%)',
            }}
          />
          <div aria-hidden="true" className="absolute left-1/2 top-[15%] -translate-x-1/2">
            <OrbitalRings
              size={140}
              spin={90}
              rings={[
                { r: 70, stroke: 'rgba(216,185,120,0.15)' },
                { r: 56, stroke: 'rgba(150,198,188,0.12)' },
              ]}
            />
          </div>
          {/*
           * TODO: sustituir por la fotografía real de Marisol cuando el
           * cliente la entregue, manteniendo la máscara de arco.
           */}
        </div>

        {/* Texto */}
        <div className="min-w-[280px] flex-[1.3]">
          <Kicker tone="gold" spacing="widest">
            {kicker}
          </Kicker>
          <Display size="sm" className="mt-[10px] leading-[1.15]">
            {title}
          </Display>
          <p className="text-ivory/78 mt-[24px] text-[16px] leading-[1.9]">{p1}</p>
          <p className="text-ivory/66 mt-[18px] font-serif italic leading-[1.8] tracking-[.02em]">
            {p2}
          </p>
        </div>
      </div>
    </section>
  );
}
