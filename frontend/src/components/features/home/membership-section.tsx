import { EditorialBanner } from '@/components/ui';
import { ButtonLink } from '@/components/layout';
import type { EditorialMedia } from '@/types/editorial-media';

type MembershipSectionProps = {
  media: EditorialMedia;
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
  const membershipMedia = media;

  return (
    <section className="w-full">
      <EditorialBanner
        media={membershipMedia}
        eyebrow={kicker}
        title={title}
        body={<p className="text-fg-body text-lead max-w-[54ch] leading-[1.75]">{description}</p>}
        align="center"
        tone="gold"
        action={
          <ButtonLink variant="primary" href="/acceso">
            {cta}
          </ButtonLink>
        }
        heightClassName="min-h-[clamp(380px,48vw,680px)]"
      />
    </section>
  );
}
