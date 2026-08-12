import { Button, EditorialBanner } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import type { EditorialMedia } from '@/types/editorial-media';

type MembershipSectionProps = {
  media?: EditorialMedia;
  kicker: string;
  title: string;
  description: string;
  cta: string;
};

export function MembershipSection({
  media,
  kicker,
  title,
  description,
  cta,
}: MembershipSectionProps) {
  const membershipMedia = media ?? resolveEditorialMedia('home-membership');

  return (
    <section className="w-full py-[clamp(28px,6vw,84px)]">
      <EditorialBanner
        media={membershipMedia}
        eyebrow={kicker}
        title={title}
        body={
          <p className="text-ivory/84 max-w-[54ch] text-[17px] leading-[1.75]">{description}</p>
        }
        align="center"
        tone="gold"
        action={
          <Button variant="primary" size="lg" asChild>
            <Link href="/acceso">{cta}</Link>
          </Button>
        }
        className="min-h-[clamp(380px,48vw,680px)]"
      />
    </section>
  );
}
