import { Button, Display, Kicker } from '@/components/ui';
import { Link } from '@/i18n/navigation';

type MembershipSectionProps = {
  kicker: string;
  title: string;
  description: string;
  cta: string;
};

export function MembershipSection({ kicker, title, description, cta }: MembershipSectionProps) {
  return (
    <section className="mx-auto max-w-[1080px] px-[8vw] pb-[90px]">
      <div
        className="relative overflow-hidden rounded-[26px] border border-[rgba(216,185,120,0.32)] p-[clamp(34px,5vw,64px)] text-center backdrop-blur-[14px]"
        style={{
          background:
            'linear-gradient(135deg, rgba(216,185,120,0.14), rgba(15,27,46,0.4))',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 120% at 50% 0%, rgba(216,185,120,0.22), transparent 60%)',
          }}
        />
        <div className="relative">
          <Kicker tone="gold" spacing="widest">
            {kicker}
          </Kicker>
          <Display size="md" className="mt-[10px]">
            {title}
          </Display>
          <p className="text-ivory/74 mx-auto mt-[14px] mb-[32px] max-w-[52ch] text-[15px] leading-[1.75]">
            {description}
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link href="/acceso">{cta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
