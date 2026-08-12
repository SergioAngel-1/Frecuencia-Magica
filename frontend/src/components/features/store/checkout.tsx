'use client';

import { AnimatePresence } from 'motion/react';
import { div as Mdiv } from 'motion/react-m';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button, ErrorState } from '@/components/ui';
import { DURATION, EASE } from '@/config/motion';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useCartStore } from '@/stores/cart-store';

import { CartView, type CheckoutMedia } from './cart-view';
import { OrderConfirmation } from './order-confirmation';

type CheckoutViewProps = {
  media: CheckoutMedia;
};

type CheckoutState = 'cart' | 'error' | 'success';

/** Simulated checkout: no payment provider is introduced in this task. */
export function CheckoutView({ media }: CheckoutViewProps) {
  const t = useTranslations('states');
  const reducedMotion = useReducedMotionSafe();
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('cart');

  // TODO(backend): a real payment response will drive this state when payments exist.
  const paymentFailed = false;

  function handlePlaceOrder() {
    if (paymentFailed) {
      setCheckoutState('error');
      return;
    }

    useCartStore.getState().clear();
    setCheckoutState('success');
  }

  function handleRetry() {
    setCheckoutState('cart');
  }

  const content =
    checkoutState === 'error' ? (
      <ErrorState
        tone="warn"
        title={t('payFailedTitle')}
        body={t('payFailedBody')}
        action={
          <Button variant="outline" onClick={handleRetry}>
            {t('payFailedCta')}
          </Button>
        }
      />
    ) : checkoutState === 'success' ? (
      <OrderConfirmation media={media.confirmation} />
    ) : (
      <CartView media={media} onPlaceOrder={handlePlaceOrder} />
    );

  if (reducedMotion) return content;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Mdiv
        key={checkoutState}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: DURATION.base, ease: EASE.soft } }}
        exit={{ opacity: 0, transition: { duration: DURATION.fast, ease: EASE.soft } }}
      >
        {content}
      </Mdiv>
    </AnimatePresence>
  );
}
