'use client';

import { useTranslations } from 'next-intl';

import { Kicker } from '@/components/ui';
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
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <footer className="mx-auto max-w-[1280px] border-t border-[rgba(247,244,234,0.1)] px-6 pt-[60px] pb-[46px] md:px-[8vw]">
      <div className="mb-11 flex flex-wrap items-start justify-between gap-10">
        <div className="max-w-[36ch]">
          <p className="mb-[10px] font-serif text-[26px] tracking-[.1em]">{tCommon('brand')}</p>
          <p className="text-ivory/60 mb-5 text-[14px] leading-[1.7]">{t('tagline')}</p>
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
                    className="inline-flex min-h-11 items-center text-ivory/78 hover:text-ivory font-serif text-[17px] transition-colors duration-300"
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
                className="inline-flex min-h-11 items-center text-ivory/78 hover:text-ivory font-serif text-[17px] transition-colors duration-300"
              >
                {t('links.about')}
              </Link>
            </p>
            <p className="mb-[10px]">
              <Link
                href="/mi-santuario"
                data-magnetic
                className="inline-flex min-h-11 items-center text-ivory/78 hover:text-ivory font-serif text-[17px] transition-colors duration-300"
              >
                {t('links.membership')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <p className="text-ivory/55 font-sans text-[11px] tracking-[.1em]">
        © 2026 {tCommon('brand')} · {t('rights')}
      </p>
    </footer>
  );
}
