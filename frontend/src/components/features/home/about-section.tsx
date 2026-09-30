import { Display, EditorialImage, Kicker } from '@/components/ui';
import { OrbitalRings } from '@/components/world';
import type { EditorialMedia } from '@/types/editorial-media';

type AboutSectionProps = {
  media: EditorialMedia;
  kicker: string;
  title: string;
  p1: string;
  p2: string;
};

export function AboutSection({ media, kicker, title, p1, p2 }: AboutSectionProps) {
  const portraitMedia = media;

  return (
    <section className="fm-editorial-full-bleed relative overflow-hidden py-[clamp(58px,10vw,140px)]">
      <div
        className="pointer-events-none absolute top-[18%] left-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(150,198,188,0.1),transparent_68%)] blur-3xl"
        aria-hidden="true"
      />
      <div className="fm-container relative grid grid-cols-1 items-center gap-[clamp(36px,8vw,120px)] md:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
        <div
          className="relative mx-auto w-full max-w-[420px] md:mx-0"
          data-editorial-zone="human-focus"
        >
          <div className="border-gold/35 relative aspect-[3/4] overflow-hidden rounded-[200px_200px_8px_8px] border">
            <EditorialImage
              media={portraitMedia}
              aspect="3:4"
              className="h-full"
              focalPoint="50% 30%"
              scrim="bottom"
              overlay={false}
            />
            <div
              aria-hidden="true"
              className="border-gold/30 pointer-events-none absolute inset-[8%] rounded-[45%] border opacity-75"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[13%] left-1/2 -translate-x-1/2 opacity-75"
            >
              <OrbitalRings
                size={150}
                spin={90}
                rings={[
                  { r: 74, stroke: 'rgba(216,185,120,0.24)' },
                  { r: 58, stroke: 'rgba(150,198,188,0.18)' },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="max-w-[680px]">
          <Kicker tone="gold" spacing="widest">
            {kicker}
          </Kicker>
          <Display size="md" className="mt-4 max-w-[14ch] leading-[0.98]">
            {title}
          </Display>
          <p className="text-fg-body text-lead mt-7 leading-[1.85]">{p1}</p>
          <p className="text-fg-soft mt-6 max-w-[48ch] font-serif text-[clamp(22px,3vw,34px)] leading-[1.25] font-light italic">
            {p2}
          </p>
        </div>
      </div>
    </section>
  );
}
