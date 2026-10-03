import { getTranslations } from 'next-intl/server';

import { CartButton } from '@/components/features/store/cart-button';
import {
  ProductGrid,
  type StoreMedia,
  type StoreProductMedia,
} from '@/components/features/store/product-grid';
import { PageShell, RealmHero } from '@/components/layout';
import { ArrowGlyph, arrowLinkClasses, EditorialBanner } from '@/components/ui';
import { PRODUCTS } from '@/data';
import { Link } from '@/i18n/navigation';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'store' });

  return { title: t('title') };
}

export default async function StorePage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'store' });
  const featuredId = PRODUCTS[0]!.id;
  const products = Object.fromEntries(
    PRODUCTS.map((product) => {
      const title = t(`products.${product.id}.title`);
      const featured = product.id === featuredId;

      return [
        product.id,
        resolveEditorialMedia('store-product-visual', {
          alt: t('media.alt.product', { title }),
          aspect: featured ? '16:8' : '1:1',
          sizes: featured
            ? '(min-width: 1280px) 820px, (min-width: 768px) 56vw, calc(100vw - 48px)'
            : '(min-width: 1280px) 380px, (min-width: 768px) 28vw, calc(100vw - 48px)',
          band: product.band,
        }),
      ];
    }),
  ) as StoreProductMedia;
  const storeMedia: StoreMedia = {
    hero: resolveEditorialMedia('store.hero', { alt: t('media.alt.hero'), sizes: '100vw' }),
    products,
    ritualBanner: resolveEditorialMedia('store.ritual-banner', {
      alt: t('media.alt.ritualBanner'),
      sizes: '100vw',
    }),
  };

  return (
    <PageShell width="store" padding="none" fullBleed editorial>
      <RealmHero
        media={storeMedia.hero}
        kicker={t('kicker')}
        title={t('title')}
        description={t('description')}
        action={<CartButton className="mt-1 shrink-0" />}
      />

      <div className="fm-editorial-full-bleed fm-container pt-block pb-section">
        <ProductGrid media={storeMedia} />
        <EditorialBanner
          media={storeMedia.ritualBanner}
          eyebrow={t('ritualBanner.kicker')}
          title={t('ritualBanner.title')}
          body={t('ritualBanner.body')}
          align="center"
          action={
            <Link href="/resonario" className={arrowLinkClasses('gold')}>
              {t('ritualBanner.cta')}
              <ArrowGlyph />
            </Link>
          }
          className="mt-section"
        />
      </div>
    </PageShell>
  );
}
