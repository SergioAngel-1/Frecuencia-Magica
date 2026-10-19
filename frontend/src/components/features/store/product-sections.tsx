'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Collapse } from '@/components/ui';
import { cn } from '@/lib/cn';

const SECTION_KEYS = ['benefits', 'usage', 'ritual'] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

/**
 * Product information stays readable and layout-safe: panels open and close
 * through a grid row (0fr to 1fr) instead of animating height, and their ids
 * remain stable for the aria-controls contract.
 */
export function ProductSections() {
  const t = useTranslations('store');
  const [openKey, setOpenKey] = useState<SectionKey | null>(null);

  return (
    <div className="border-line border-t" data-editorial-accordion="product">
      {SECTION_KEYS.map((key) => {
        const isOpen = openKey === key;
        const bodyId = `product-section-${key}`;

        return (
          <div key={key} className="border-line border-b">
            <button
              type="button"
              onClick={() => setOpenKey(isOpen ? null : key)}
              aria-expanded={isOpen}
              aria-controls={bodyId}
              className="flex min-h-11 w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-fg text-serif-sm font-serif">
                {t(`productSections.${key}.title`)}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'text-accent text-serif-lg shrink-0 font-serif leading-none transition-transform duration-300 motion-reduce:transition-none',
                  isOpen && 'rotate-45',
                )}
              >
                +
              </span>
            </button>

            {/* La fila de rejilla pasa de 0fr a 1fr: el panel se abre y se
                cierra gradualmente sin animar `height`. Cerrado queda `inert`
                y fuera del árbol de accesibilidad. */}
            <Collapse id={bodyId} open={isOpen} data-editorial-accordion-panel={key}>
              <p className="text-fg-soft text-body pb-5 font-sans leading-[1.9]">
                {t(`productSections.${key}.body`)}
              </p>
            </Collapse>
          </div>
        );
      })}
    </div>
  );
}
