'use client';

import { useTranslations } from 'next-intl';

import { EditorialBanner, Kicker, ArrowGlyph, arrowLinkClasses } from '@/components/ui';
import { useRealm } from '@/hooks/use-realm';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { Link } from '@/i18n/navigation';

import { NewsletterForm } from './newsletter-form';

/** Columnas del footer. El orden refleja el recorrido: descubrir, reunirse, la marca. */
const COLUMNS = [
  {
    title: 'explore',
    links: [
      { key: 'descubrete', href: '/descubrete' },
      { key: 'biblioteca', href: '/biblioteca' },
      { key: 'academia', href: '/academia' },
    ],
  },
  {
    title: 'community',
    links: [
      { key: 'experiencias', href: '/experiencias' },
      { key: 'tienda', href: '/tienda' },
      { key: 'sanctuario', href: '/mi-santuario' },
    ],
  },
] as const;

export function SiteFooter() {
  const { realmId } = useRealm();
  const t = useTranslations('footer');
  const tHome = useTranslations('home');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const footerMedia = resolveEditorialMedia('home.footer-banner', {
    alt: tHome('media.alt.footerBanner'),
  });

  return (
    <footer
      data-layout-layer="footer"
      className="fm-safe-area-bottom fm-container pb-[calc(150px+env(safe-area-inset-bottom))] md:pb-[46px]"
    >
      <div className="border-ivory/10 border-t pt-[60px]">
        {realmId === 'home' ? (
          <div className="mb-[clamp(42px,7vw,88px)]">
            {/* Cierre distinto de la oferta de membresía que lo precede: la
              despedida invita a volver, no repite la llamada a inscribirse. */}
            <EditorialBanner
              media={footerMedia}
              eyebrow={t('closing.kicker')}
              title={t('closing.title')}
              action={
                <Link href="/" className={arrowLinkClasses('gold')}>
                  {t('closing.cta')}
                  <ArrowGlyph />
                </Link>
              }
              tone="gold"
              align="left"
              className="min-h-[clamp(300px,34vw,520px)]"
            />
          </div>
        ) : null}

        <div className="mb-11 flex flex-wrap items-start justify-between gap-10">
          <div className="max-w-[36ch]">
            <p className="tracking-ui mb-[10px] font-serif text-[26px]">{tCommon('brand')}</p>
            <p className="text-fg-muted text-body mb-5 leading-[1.7]">{t('tagline')}</p>
            <NewsletterForm />
          </div>

          <div className="flex flex-wrap gap-x-[52px] gap-y-8">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <Kicker tone="muted" spacing="tight" className="mb-[14px]">
                  {t(`columns.${column.title}`)}
                </Kicker>
                {column.links.map((link) => (
                  <p key={link.key} className="mb-[10px]">
                    <Link
                      href={link.href as '/biblioteca'}
                      data-magnetic
                      className="text-fg-soft hover:text-ivory text-lead inline-flex min-h-11 items-center font-serif transition-colors duration-300"
                    >
                      {tNav(`realms.${link.key}` as 'realms.biblioteca')}
                    </Link>
                  </p>
                ))}
              </div>
            ))}

            <div>
              <Kicker tone="muted" spacing="tight" className="mb-[14px]">
                {t('columns.brand')}
              </Kicker>
              {/* TODO(backend): «Sobre Marisol» apunta a la sección de la home;
                contacto y membresía no tienen página propia todavía. */}
              <p className="mb-[10px]">
                <Link
                  href="/inicio"
                  data-magnetic
                  className="text-fg-soft hover:text-ivory text-lead inline-flex min-h-11 items-center font-serif transition-colors duration-300"
                >
                  {t('links.about')}
                </Link>
              </p>
              <p className="mb-[10px]">
                <Link
                  href="/mi-santuario"
                  data-magnetic
                  className="text-fg-soft hover:text-ivory text-lead inline-flex min-h-11 items-center font-serif transition-colors duration-300"
                >
                  {t('links.membership')}
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-fg-meta text-label tracking-ui font-sans">
          © 2026 {tCommon('brand')} · {t('rights')}
        </p>
      </div>
    </footer>
  );
}
