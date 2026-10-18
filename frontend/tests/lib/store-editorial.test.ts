import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { EDITORIAL_ASSETS } from '@/config/editorial-assets.generated';
import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { PRODUCTS } from '@/data';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const readSource = (relativePath: string) =>
  readFileSync(resolve(SOURCE_ROOT, relativePath), 'utf8');

const storePageSource = readSource('app/[locale]/tienda/(catalogo)/page.tsx');
const productPageSource = readSource('app/[locale]/tienda/[productId]/page.tsx');
const cartPageSource = readSource('app/[locale]/tienda/carrito/page.tsx');
const gridSource = readSource('components/features/store/product-grid.tsx');
const cardSource = readSource('components/features/store/product-card.tsx');
const detailSource = readSource('components/features/store/product-detail.tsx');
const gallerySource = readSource('components/features/store/product-gallery.tsx');
const sectionsSource = readSource('components/features/store/product-sections.tsx');
const cartButtonSource = readSource('components/features/store/cart-button.tsx');
const cartSource = readSource('components/features/store/cart-view.tsx');
const emptyStateSource = readSource('components/ui/empty-state.tsx');
const summarySource = readSource('components/features/store/order-summary.tsx');
const confirmationSource = readSource('components/features/store/order-confirmation.tsx');
const checkoutSource = readSource('components/features/store/checkout.tsx');
const heroSource = readSource('components/layout/realm-hero.tsx');
const loadingSource = readSource('app/[locale]/tienda/(catalogo)/loading.tsx');

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
  it('resolves every store slot to its published photo or a fallback, never invented media', () => {
    for (const { slot, aspect } of STORE_SLOTS) {
      const media = resolveEditorialMedia(slot, { alt: `Editorial ${slot}` });
      // La única fuente legítima es la publicada en el manifiesto; nada se inventa.
      const published = EDITORIAL_ASSETS[slot];

      expect(media).toMatchObject({ kind: published ? 'photo' : 'fallback', slot, aspect });
      expect(media.src).toBe(published);
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
    // La cabecera de la Tienda pinta el paisaje de su atmósfera (`store`), no la zebra de la noche.
    expect(storePageSource).toContain("resolveEditorialMedia('store.hero'");
    expect(storePageSource).toContain("resolveEditorialMedia('store-product-visual'");
    expect(storePageSource).toContain("resolveEditorialMedia('store.ritual-banner'");
    expect(storePageSource).toContain('<RealmHero');
    expect(heroSource).toContain('<FullBleedSection');
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
    expect(cardSource).toContain('ASPECT_FIELD[media.aspect]');
    expect(cardSource).toContain('onClick={() => add(product.id)}');
    expect(cardSource).toContain("pathname: '/tienda/[productId]'");
    expect(cardSource).not.toContain('<Band');
    expect(cardSource).not.toMatch(/unsplash|https?:\/\//i);
    expect(PRODUCTS).toHaveLength(8);
  });

  it('resolves every product visual per product, so each published instance paints itself', () => {
    // Sin `instance`, `store-product-visual:p3` nunca se vería.
    const sources = [
      { source: storePageSource, instance: 'instance: product.id' },
      { source: cartSource, instance: 'instance: product.id' },
      // Un solo resolvedor para el objeto de la ficha y el de cada relacionado.
      { source: productPageSource, instance: 'instance: item.id' },
    ];
    for (const { source, instance } of sources) {
      const resolutions = source.split("resolveEditorialMedia('store-product-visual'").slice(1);
      expect(resolutions.length).toBeGreaterThan(0);
      for (const call of resolutions) {
        expect(call.slice(0, call.indexOf('})'))).toContain(instance);
      }
    }
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
    // La imagen vive en la galería (T2.10): el detalle le pasa el visual propio primero.
    expect(detailSource).toContain('<ProductGallery items={galleryItems}');
    expect(detailSource).toContain("{ kind: 'cover', media: media.detail }");
    expect(gallerySource).toContain('<EditorialImage');
    expect(gallerySource).toContain('media={current.media}');
    // La ficha abre con la imagen de la tarjeta elegida, a su ratio y sin
    // velo; la atmósfera de `product.detail` sólo cubre al producto sin foto.
    expect(productPageSource).toContain(
      "const detail = ownVisual(product, t('media.alt.detail', { title }), detailSizes);",
    );
    expect(productPageSource).toContain('detail: detail.src');
    expect(gallerySource).toContain('DETAIL_ASPECT[items[0]!.media.aspect]');
    expect(gallerySource).toContain('data-editorial-media={current.media.slot}');
    expect(detailSource).toContain('media={media.related[relatedProduct.id]!}');
    expect(detailSource).not.toMatch(/<OrbitalRings\s+aria-hidden/);
    expect(detailSource).toContain('onClick={() => add(product.id)}');
    expect(detailSource).toContain("router.push('/tienda/carrito')");
    // La frecuencia asociada comparte estado con el reproductor: conmuta la
    // misma acción que el disco grande y refleja si suena.
    expect(detailSource).toContain('useAudioPlayback(product.relatedAudioId)');
    expect(detailSource).toContain('onClick={() => toggleAudio(product.relatedAudioId)}');
    expect(detailSource).toContain('<PlayPauseIcon playing={frequency.playing}');
    expect(detailSource).not.toContain('<Band');
  });

  it('keeps accordions fluid both ways and accessible', () => {
    expect(sectionsSource).toContain('aria-expanded={isOpen}');
    expect(sectionsSource).toContain('aria-controls={bodyId}');
    // Closed panels leave the tab order and the accessibility tree, and the
    // close is as gradual as the open: a grid row, never an animated height.
    expect(sectionsSource).toContain('inert={!isOpen}');
    expect(sectionsSource).toContain('aria-hidden={!isOpen}');
    expect(sectionsSource).toContain('grid-rows-[1fr]');
    expect(sectionsSource).toContain('grid-rows-[0fr]');
    expect(sectionsSource).toContain('data-editorial-accordion="product"');
    expect(sectionsSource).not.toMatch(/transition-(?:height|\[height\])/);
  });

  it('keeps cart controls, totals and quiet editorial empty state', () => {
    expect(cartPageSource).toContain("resolveEditorialMedia('cart.empty'");
    expect(cartPageSource).toContain("resolveEditorialMedia('checkout.confirmation'");
    expect(cartPageSource).toContain('<CheckoutView media={checkoutMedia}');
    expect(cartSource).toContain('media: CheckoutMedia');
    expect(cartSource).toContain('<EditorialImage');
    expect(cartSource).toContain('media={media.empty}');
    expect(emptyStateSource).toContain('data-editorial-media={media.slot}');
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
    expect(checkoutSource).toContain('simulatePayment(Math.random)');
    expect(checkoutSource).not.toContain('paymentFailed');
    expect(checkoutSource).toContain('<OrderConfirmation media={media.confirmation}');
    expect(checkoutSource).toContain('TODO(backend)');
    expect(checkoutSource).not.toContain('onClick={handlePlaceOrder}');
    expect(confirmationSource).toContain('<EditorialImage');
    expect(confirmationSource).toContain('data-editorial-media="checkout.confirmation"');
    expect(confirmationSource).toContain('href="/tienda"');
  });

  it('waits with the shared loading scene, like every other view', () => {
    // Una sola espera en todo el sitio: la esfera de `states.loading` (ver `loading-flow`).
    expect(loadingSource.trim()).toBe(
      "export { RealmLoading as default } from '@/components/layout';",
    );
  });
  it('paints every product visual at its 1:1, the featured one included', () => {
    // Ninguna resolución de `store-product-visual` fuerza otro ratio.
    for (const source of [storePageSource, productPageSource, cartSource]) {
      const resolutions = source.split("resolveEditorialMedia('store-product-visual'").slice(1);
      for (const call of resolutions) {
        expect(call.slice(0, call.indexOf('})'))).not.toMatch(/aspect:\s*(?!'1:1')/);
      }
    }
    // La tarjeta pinta la caja con el ratio del slot: `store-product-visual` es `aspect-square`.
    expect(cardSource).toContain("'1:1': 'aspect-square'");
    expect(cardSource).not.toContain('h-[clamp(190px,22vw,260px)]');
    expect(cardSource).not.toContain('min-h-[clamp(210px,26vw,340px)]');
    // El destacado se compone en columnas: imagen cuadrada y texto.
    expect(cardSource).toContain('md:flex-row');
    expect(cardSource).toContain('md:w-1/2');
  });
  it('covers the whole height of the featured card with its image, without a veil', () => {
    // La columna del destacado se estira a todo el alto de la ficha…
    expect(cardSource).toContain("featured && 'md:w-1/2 md:self-stretch'");
    expect(cardSource).not.toContain('md:self-center');
    // …y desde `md` la imagen deja su caja 1:1 y la cubre entera: ni objeto
    // centrado con huecos ni la misma materia difuminada por detrás.
    expect(cardSource).toContain("featured && 'md:absolute md:inset-0 md:aspect-auto'");
    expect(cardSource).not.toContain('data-featured-backdrop');
    expect(cardSource).not.toMatch(/\bblur-/);
    // Apilada, y en el resto de tarjetas, conserva la caja del slot a su 1:1.
    expect(cardSource).toContain("'relative w-full',\n              ASPECT_FIELD[media.aspect]");
    // El texto va debajo de la foto: sin velo, el objeto no queda opaco.
    expect(cardSource).toContain('overlay={false}');
    expect(cardSource).toContain('scrim={false}');
    expect(cardSource).not.toContain('scrim="bottom"');
  });
  it('keeps the cart on the page axis and the related products readable at 768', () => {
    expect(cartPageSource).toContain('px-[var(--page-inset)]');
    expect(cartPageSource).not.toContain('md:px-0');
    // Dos líneas antes que truncar el nombre a una palabra.
    expect(cartSource).toContain('line-clamp-2');
    expect(cartSource).not.toMatch(/text-lead truncate/);
    expect(detailSource).toContain('md:grid-cols-2 lg:grid-cols-3');
  });
});

export {};
