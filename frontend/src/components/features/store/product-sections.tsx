'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

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
              <span className="text-fg font-serif text-[19px]">
                {t(`productSections.${key}.title`)}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'text-accent shrink-0 font-serif text-[22px] leading-none transition-transform duration-300 motion-reduce:transition-none',
                  isOpen && 'rotate-45',
                )}
              >
                +
              </span>
            </button>

            {/* La fila de rejilla pasa de 0fr a 1fr: el panel se abre y se
                cierra gradualmente sin animar `height`. Cerrado queda `inert`
                y fuera del árbol de accesibilidad. */}
            <div
              id={bodyId}
              aria-hidden={!isOpen}
              inert={!isOpen}
              data-editorial-accordion-panel={key}
              className={cn(
                'grid transition-[grid-template-rows,opacity] duration-[350ms] ease-[cubic-bezier(.2,.85,.25,1)]',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="text-fg-soft text-body pb-5 font-sans leading-[1.9]">
                  {t(`productSections.${key}.body`)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
