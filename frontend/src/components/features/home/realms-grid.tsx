import { Badge, Button, Kicker, Display } from '@/components/ui';
import { WaveSeparator } from '@/components/world';
import { Link } from '@/i18n/navigation';

import { RealmCard } from './realm-card';

type RealmDescription = {
  id: string;
  href: string;
  band: string;
  emotion: string;
  title: string;
  description: string;
};

type RealmsGridProps = {
  kicker: string;
  title: string;
  academia: RealmDescription & { featuredCta: string };
  realms: RealmDescription[];
  storeCta: string;
  featuredBadge: string;
};

export function RealmsGrid({
  kicker,
  title,
  academia,
  realms,
  storeCta,
  featuredBadge,
}: RealmsGridProps) {
  const descubrete = realms[0];
  const biblioteca = realms[1];
  const tienda = realms[2];
  const experiencias = realms[3];
  const sanctuario = realms[4];

  if (!descubrete || !biblioteca || !tienda || !experiencias || !sanctuario) return null;

  return (
    <section className="px-[8vw]">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-11 flex flex-col items-center gap-2 text-center">
          <Kicker tone="lav" spacing="widest">
            {kicker}
          </Kicker>
          <Display size="sm">{title}</Display>
        </div>

        <RealmCard
          href={academia.href}
          band={academia.band}
          emotion={academia.emotion}
          title={academia.title}
          description={academia.description}
          featured
          className="mb-6"
        >
          <Button variant="accent" tone="teal" size="md" iconRight={<span aria-hidden="true">→</span>} asChild>
            <Link href={academia.href as '/academia'}>{academia.featuredCta}</Link>
          </Button>
        </RealmCard>

        <div className="grid gap-6 sm:grid-cols-3">
          <RealmCard
            href={descubrete.href}
            band={descubrete.band}
            emotion={descubrete.emotion}
            title={descubrete.title}
            description={descubrete.description}
          />

          <RealmCard
            href={biblioteca.href}
            band={biblioteca.band}
            emotion={biblioteca.emotion}
            title={biblioteca.title}
            description={biblioteca.description}
          />

          <RealmCard
            href={tienda.href}
            band={tienda.band}
            emotion={tienda.emotion}
            title={tienda.title}
            description={tienda.description}
            store
          >
            <Badge solid className="mb-3">
              {featuredBadge}
            </Badge>
            <Button variant="accent" tone="gold" size="md" iconRight={<span aria-hidden="true">→</span>} asChild>
              <Link href={tienda.href as '/tienda'}>{storeCta}</Link>
            </Button>
          </RealmCard>

          <RealmCard
            href={experiencias.href}
            band={experiencias.band}
            emotion={experiencias.emotion}
            title={experiencias.title}
            description={experiencias.description}
          />

          <RealmCard
            href={sanctuario.href}
            band={sanctuario.band}
            emotion={sanctuario.emotion}
            title={sanctuario.title}
            description={sanctuario.description}
          />
        </div>

        <WaveSeparator className="mx-auto mt-[44px] max-w-[1000px]" />
      </div>
    </section>
  );
}
