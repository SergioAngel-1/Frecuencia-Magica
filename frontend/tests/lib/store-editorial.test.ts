import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { PRODUCTS } from '@/data';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const readSource = (relativePath: string) =>
  readFileSync(resolve(SOURCE_ROOT, relativePath), 'utf8');

const storePageSource = readSource('app/[locale]/tienda/page.tsx');
const productPageSource = readSource('app/[locale]/tienda/[productId]/page.tsx');
const cartPageSource = readSource('app/[locale]/tienda/carrito/page.tsx');
const gridSource = readSource('components/features/store/product-grid.tsx');
const cardSource = readSource('components/features/store/product-card.tsx');
const detailSource = readSource('components/features/store/product-detail.tsx');
const sectionsSource = readSource('components/features/store/product-sections.tsx');
const cartButtonSource = readSource('components/features/store/cart-button.tsx');
const cartSource = readSource('components/features/store/cart-view.tsx');
const summarySource = readSource('components/features/store/order-summary.tsx');
const confirmationSource = readSource('components/features/store/order-confirmation.tsx');
const checkoutSource = readSource('components/features/store/checkout.tsx');
const loadingSource = readSource('app/[locale]/tienda/loading.tsx');

const STORE_SLOTS = [
  { slot: 'store.hero' as const, aspect: '16:9' as const, alt: 'hero' },
  { slot: 'store-product-visual' as const, aspect: '1:1' as const, alt: 'product' },
  { slot: 'store.ritual-banner' as const, aspect: '16:9' as const, alt: 'ritualBanner' },
  { slot: 'product.detail' as const, aspect: '16:8' as const, alt: 'detail' },
  { slot: 'product.related' as const, aspect: '16:8' as const, alt: 'related' },
  { slot: 'cart.empty' as const, aspect: '16:9' as const, alt: 'cartEmpty' },
  { slot: 'checkout.confirmation' as const, aspect: '16:8' as const, alt: 'confirmation' },
];

type MediaMessages = { media: { alt: Record<string, string> } };
const esStore = esMessages.store as unknown as MediaMessages;
const enStore = enMessages.store as unknown as MediaMessages;
const esCart = esMessages.cart as unknown as MediaMessages;
const enCart = enMessages.cart as unknown as MediaMessages;

describe('store editorial composition contracts', () => {
  it('resolves every store slot to a zebra fallback without inventing media', () => {
    for (const { slot, aspect } of STORE_SLOTS) {
      const media = resolveEditorialMedia(slot, { alt: `Editorial ${slot}` });

      expect(media).toMatchObject({ kind: 'fallback', slot, aspect });
      expect(media.src).toBeUndefined();
      expect(EDITORIAL_MEDIA_REGISTRY[slot]).toBeDefined();
    }
  });

  it('provides distinct bilingual alt copy for store and checkout media', () => {
    const storeAltKeys = ['hero', 'product', 'ritualBanner', 'detail', 'related'];
    const cartAltKeys = ['empty', 'confirmation'];

    for (const key of storeAltKeys) {
      expect(esStore.media.alt[key]).toBeTruthy();
      expect(enStore.media.alt[key]).toBeTruthy();
      expect(enStore.media.alt[key]).not.toBe(esStore.media.alt[key]);
    }

    expect(esStore.media.alt.related).toContain('{title}');
    expect(enStore.media.alt.related).toContain('{title}');

    for (const key of cartAltKeys) {
      expect(esCart.media.alt[key]).toBeTruthy();
      expect(enCart.media.alt[key]).toBeTruthy();
      expect(enCart.media.alt[key]).not.toBe(esCart.media.alt[key]);
    }
  });

  it('composes a localized full-bleed store hero and ritual banner', () => {
    expect(storePageSource).toContain('const locale = await resolveLocale(params);');
    expect(storePageSource).toContain("getTranslations({ locale, namespace: 'store' })");
    expect(storePageSource).toContain("resolveEditorialMedia('store.hero'");
    expect(storePageSource).toContain("resolveEditorialMedia('store-product-visual'");
    expect(storePageSource).toContain("resolveEditorialMedia('store.ritual-banner'");
    expect(storePageSource).toContain('<FullBleedSection');
    expect(storePageSource).toContain('fm-editorial-full-bleed');
    expect(storePageSource).toContain('<ProductGrid media={storeMedia}');
    expect(storePageSource).toContain('<EditorialBanner');
    expect(storePageSource).not.toMatch(/unsplash|https?:\/\//i);
  });

  it('keeps the catalog image-led while preserving product actions and localized relations', () => {
    expect(storePageSource).toContain('const products = Object.fromEntries');
    expect(gridSource).toContain('type StoreProductMedia');
    expect(gridSource).toContain("Record<(typeof PRODUCTS)[number]['id'], EditorialMedia>");
    expect(gridSource).toContain('media.products[product.id]');
    expect(gridSource).not.toContain('media.productFeatured');
    expect(gridSource).toContain('data-editorial-archive="true"');
    expect(cardSource).toContain('<EditorialImage');
    expect(cardSource).toContain('media={media}');
    expect(cardSource).toContain('aspect={media.aspect}');
    expect(cardSource).toContain('data-editorial-media={media.slot}');
    expect(cardSource).toContain("baseMedia.slot === 'product.related'");
    expect(cardSource).toContain('onClick={() => add(product.id)}');
    expect(cardSource).toContain("pathname: '/tienda/[productId]'");
    expect(cardSource).not.toContain('<Band');
    expect(cardSource).not.toMatch(/unsplash|https?:\/\//i);
    expect(PRODUCTS).toHaveLength(8);
  });

  it('recomposes detail around dominant media and keeps purchase and frequency seams', () => {
    expect(productPageSource).toContain('const locale = await resolveLocale(params);');
    expect(productPageSource).toContain("getTranslations({ locale, namespace: 'store' })");
    expect(productPageSource).toContain("resolveEditorialMedia('product.detail'");
    expect(productPageSource).toContain("resolveEditorialMedia('product.related'");
    expect(productPageSource).toContain("alt: t('media.alt.related', { title: relatedTitle })");
    expect(productPageSource).toContain("aspect: '16:8'");
    expect(productPageSource).toContain('const related = Object.fromEntries');
    expect(productPageSource).toContain('<ProductDetail product={product} media={productMedia}');
    expect(detailSource).toContain('media: ProductMedia');
    expect(detailSource).toContain(
      "related: Record<(typeof PRODUCTS)[number]['id'], EditorialMedia>",
    );
    expect(detailSource).toContain('<EditorialImage');
    expect(detailSource).toContain('media={media.detail}');
    expect(detailSource).toContain('media={media.related[relatedProduct.id]!}');
    expect(detailSource).not.toMatch(/<OrbitalRings\s+aria-hidden/);
    expect(detailSource).toContain('onClick={() => add(product.id)}');
    expect(detailSource).toContain("router.push('/tienda/carrito')");
    expect(detailSource).toContain('relatedAudioId');
    expect(detailSource).not.toContain('<Band');
  });

  it('keeps accordions instant and accessible', () => {
    expect(sectionsSource).toContain('aria-expanded={isOpen}');
    expect(sectionsSource).toContain('aria-controls={bodyId}');
    expect(sectionsSource).toContain('hidden={!isOpen}');
    expect(sectionsSource).toContain('data-editorial-accordion="product"');
    expect(sectionsSource).not.toMatch(/transition-(?:height|\[height\])/);
  });

  it('keeps cart controls, totals and quiet editorial empty state', () => {
    expect(cartPageSource).toContain("resolveEditorialMedia('cart.empty'");
    expect(cartPageSource).toContain("resolveEditorialMedia('checkout.confirmation'");
    expect(cartPageSource).toContain('<CheckoutView media={checkoutMedia}');
    expect(cartSource).toContain('media: CheckoutMedia');
    expect(cartSource).toContain('<EditorialImage');
    expect(cartSource).toContain('data-editorial-media="cart.empty"');
    expect(cartSource).toContain('cartLines(items, PRODUCTS)');
    expect(cartSource).toContain('const count = lines.reduce');
    expect(cartSource).toContain('sm:contents');
    expect(cartSource).not.toContain('cartCount(items)');
    expect(cartSource).toContain('setQuantity(product.id, quantity - 1)');
    expect(cartSource).toContain('setQuantity(product.id, quantity + 1)');
    expect(cartSource).toContain('min-h-11');
    expect(summarySource).toContain('lines: readonly CartLine[]');
    expect(summarySource).toContain('lines.reduce');
    expect(summarySource).toContain('cartTotal(subtotal)');
    expect(summarySource).toContain('shippingCost(subtotal)');
    expect(cartButtonSource).toContain('const items = useCartStore((state) => state.items);');
    expect(cartButtonSource).toContain('cartLines(items, PRODUCTS)');
    expect(cartButtonSource).toContain('href="/tienda/carrito"');
    expect(cartButtonSource).toContain('min-h-11');
  });

  it('keeps simulated checkout motion, payment error and confirmation media', () => {
    expect(checkoutSource).toContain("type CheckoutState = 'cart' | 'error' | 'success';");
    expect(checkoutSource).toContain("useState<CheckoutState>('cart')");
    expect(checkoutSource).toContain("setCheckoutState('cart')");
    expect(checkoutSource).toContain('ErrorState');
    expect(checkoutSource).toContain('AnimatePresence');
    expect(checkoutSource).toContain('useReducedMotionSafe');
    expect(checkoutSource).toContain('media: CheckoutMedia');
    expect(checkoutSource).toContain('<OrderConfirmation media={media.confirmation}');
    expect(checkoutSource).toContain('TODO(backend)');
    expect(checkoutSource).not.toContain('onClick={handlePlaceOrder}');
    expect(confirmationSource).toContain('<EditorialImage');
    expect(confirmationSource).toContain('data-editorial-media="checkout.confirmation"');
    expect(confirmationSource).toContain('href="/tienda"');
  });

  it('mirrors the image-led bento rhythm in loading with zebra slots', () => {
    expect(loadingSource).toContain('aria-busy="true"');
    expect(loadingSource).toContain('<MediaSkeleton');
    expect(loadingSource).toContain('slot="store.hero"');
    expect(loadingSource).toContain('slot="store-product-visual"');
    expect(loadingSource).toContain('slot="store.ritual-banner"');
    expect(loadingSource).toContain('h-[clamp(190px,22vw,260px)]');
    expect(loadingSource).toContain('h-[clamp(210px,26vw,340px)]');
    expect(loadingSource).not.toContain('min-h-[390px]');
    expect(loadingSource).not.toContain('min-h-[520px]');
    expect(loadingSource).toContain('motion-safe:');
    expect(loadingSource).not.toContain('bg-gray');
  });
});

export {};
