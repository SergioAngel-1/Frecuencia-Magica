import { getTranslations } from 'next-intl/server';

import { CartButton } from '@/components/features/store/cart-button';
import {
  ProductGrid,
  type StoreMedia,
  type StoreProductMedia,
} from '@/components/features/store/product-grid';
import { PageShell } from '@/components/layout';
import { Display, EditorialBanner, FullBleedSection, Kicker, Prose } from '@/components/ui';
import { PRODUCTS } from '@/data';
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
      <FullBleedSection
        media={storeMedia.hero}
        mode="banner"
        overlay="left"
        className="fm-editorial-full-bleed"
        contentClassName="flex min-h-full items-center"
        minHeight="clamp(420px, 52vw, 680px)"
      >
        <div className="fm-container flex w-full flex-col justify-center py-20">
          <div className="flex items-start justify-between gap-6">
            <div>
              <Kicker tone="teal" spacing="wide">
                {t('kicker')}
              </Kicker>
              <Display size="xl" level="h1" className="mt-4 max-w-[12ch]">
                {t('title')}
              </Display>
            </div>
            <CartButton className="mt-1 shrink-0" />
          </div>
          <Prose maxWidth={54} className="text-fg-body mt-6 max-w-[52ch]">
            {t('description')}
          </Prose>
        </div>
      </FullBleedSection>

      <div className="fm-editorial-full-bleed fm-container pt-[clamp(30px,5vw,76px)] pb-[220px]">
        <ProductGrid media={storeMedia} />
        <EditorialBanner
          media={storeMedia.ritualBanner}
          eyebrow={t('ritualBanner.kicker')}
          title={t('ritualBanner.title')}
          body={t('ritualBanner.body')}
          className="fm-editorial-full-bleed mt-[clamp(60px,10vw,140px)]"
        />
      </div>
    </PageShell>
  );
}
