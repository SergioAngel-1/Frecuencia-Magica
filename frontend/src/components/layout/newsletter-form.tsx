'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type SubmitEvent } from 'react';

import { Input } from '@/components/ui';

/** Cuánto permanece visible la confirmación antes de devolver el formulario. */
const CONFIRMATION_MS = 3000;

/**
 * Suscripción al boletín.
 *
 * TODO(backend): no hay envío real. Al enviar se muestra la confirmación y
 * el formulario vuelve a su estado inicial; cuando exista API, sustituir el
 * `setSent` por la llamada y conservar la región `aria-live`.
 */
export function NewsletterForm() {
  const t = useTranslations('footer');
  const [sent, setSent] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => void (timeout.current && clearTimeout(timeout.current)), []);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    timeout.current = setTimeout(() => setSent(false), CONFIRMATION_MS);
  };

  return (
    <div>
      {sent ? (
        <p className="text-teal text-lead max-w-[34ch] font-serif leading-[1.5] italic">
          {t('newsletterSuccess')}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex max-w-[340px] gap-[10px]">
          <label htmlFor="newsletter-email" className="sr-only">
            {t('newsletterLabel')}
          </label>
          <Input
            id="newsletter-email"
            type="email"
            name="email"
            required
            placeholder={t('newsletterPlaceholder')}
            className="rounded-pill text-body flex-1 px-[18px] py-3"
          />
          <button
            type="submit"
            data-magnetic
            aria-label={t('newsletterSubmit')}
            className="rounded-pill bg-gold text-meta tracking-soft text-ink min-h-11 px-[22px] font-sans font-medium transition-[background-color,box-shadow] duration-300 hover:shadow-[0_0_20px_rgba(216,185,120,0.35)]"
          >
            →
          </button>
        </form>
      )}

      <p aria-live="polite" className="sr-only">
        {sent ? t('newsletterSuccess') : ''}
      </p>
    </div>
  );
}
