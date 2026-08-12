'use client';

import { AnimatePresence } from 'motion/react';
import { div as Mdiv } from 'motion/react-m';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button, ErrorState } from '@/components/ui';
import { DURATION, EASE } from '@/config/motion';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useCartStore } from '@/stores/cart-store';

import { CartView } from './cart-view';
import { OrderConfirmation } from './order-confirmation';

/**
 * Orquesta la transición entre el carrito y su confirmación.
 *
 * No hay pasarela de pago: `handlePlaceOrder` vacía el carrito y marca
 * `ordered` directamente. `paymentFailed` queda como constante apagada — el
 * hueco reservado para el día en que un pago real pueda fallar de verdad.
 * Hasta entonces es inalcanzable a propósito.
 */
export function CheckoutView() {
  const t = useTranslations('states');
  const reducedMotion = useReducedMotionSafe();
  const [ordered, setOrdered] = useState(false);

  // `paymentFailed` está preparado para el día en que exista un pago real que
  // pueda fallar; hoy es una constante apagada, nunca se activa.
  const paymentFailed = false;

  function handlePlaceOrder() {
    // TODO(backend): pago real y creación de pedido; aquí se dispararía este estado de error.
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
    <OrderConfirmation />
  ) : (
    <CartView onPlaceOrder={handlePlaceOrder} />
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
