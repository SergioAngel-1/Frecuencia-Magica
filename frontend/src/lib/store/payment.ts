export type PaymentVerdict = 'ok' | 'declined';

const DECLINE_PROBABILITY = 0.15;

/**
 * Simulated payment gateway for the still backend-less checkout.
 *
 * The random source is injected so the failure path is both reachable in the
 * UI and deterministic in tests. A real provider verdict will replace this
 * seam when payments exist (see the `TODO(backend)` in `checkout.tsx`).
 */
export function simulatePayment(random: () => number = Math.random): PaymentVerdict {
  return random() < DECLINE_PROBABILITY ? 'declined' : 'ok';
}
