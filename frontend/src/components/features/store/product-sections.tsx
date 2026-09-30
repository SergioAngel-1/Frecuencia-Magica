'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/cn';

const SECTION_KEYS = ['benefits', 'usage', 'ritual'] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

/**
 * Product information stays readable and layout-safe: panels are hidden in
 * the closed state instead of animating height, while their ids remain stable
 * for the aria-controls contract.
 */
export function ProductSections() {
  const t = useTranslations('store');
  const [openKey, setOpenKey] = useState<SectionKey | null>(null);

  return (
    <div className="border-glass-brd border-t" data-editorial-accordion="product">
      {SECTION_KEYS.map((key) => {
        const isOpen = openKey === key;
        const bodyId = `product-section-${key}`;

        return (
          <div key={key} className="border-glass-brd border-b">
            <button
              type="button"
              onClick={() => setOpenKey(isOpen ? null : key)}
              aria-expanded={isOpen}
              aria-controls={bodyId}
              className="flex min-h-11 w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-ivory font-serif text-[19px]">
                {t(`productSections.${key}.title`)}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'text-gold shrink-0 font-serif text-[22px] leading-none transition-transform duration-300 motion-reduce:transition-none',
                  isOpen && 'rotate-45',
                )}
              >
                +
              </span>
            </button>

            <div
              id={bodyId}
              aria-hidden={!isOpen}
              data-editorial-accordion-panel={key}
              hidden={!isOpen}
              className={cn(isOpen && 'animate-fm-fade-up motion-reduce:animate-none')}
            >
              <p className="text-fg-soft text-body pb-5 font-sans leading-[1.9]">
                {t(`productSections.${key}.body`)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
