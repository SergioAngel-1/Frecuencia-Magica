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

/** Simulated checkout: no payment provider is introduced in this task. */
export function CheckoutView({ media }: CheckoutViewProps) {
  const t = useTranslations('states');
  const reducedMotion = useReducedMotionSafe();
  const [ordered, setOrdered] = useState(false);

  // TODO(backend): a real payment response will drive this state when payments exist.
  const paymentFailed = false;

  function handlePlaceOrder() {
    useCartStore.getState().clear();
    setOrdered(true);
  }

  const content = paymentFailed ? (
    <ErrorState
      tone="warn"
      title={t('payFailedTitle')}
      body={t('payFailedBody')}
      action={
        <Button variant="outline" onClick={handlePlaceOrder}>
          {t('payFailedCta')}
        </Button>
      }
    />
  ) : ordered ? (
    <OrderConfirmation media={media.confirmation} />
  ) : (
    <CartView media={media} onPlaceOrder={handlePlaceOrder} />
  );

  if (reducedMotion) return content;

  const key = paymentFailed ? 'error' : ordered ? 'confirmation' : 'cart';

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Mdiv
        key={key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: DURATION.base, ease: EASE.soft } }}
        exit={{ opacity: 0, transition: { duration: DURATION.fast, ease: EASE.soft } }}
      >
        {content}
      </Mdiv>
    </AnimatePresence>
  );
}
