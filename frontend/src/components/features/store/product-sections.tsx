'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/cn';

const SECTION_KEYS = ['benefits', 'usage', 'ritual'] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

/**
 * Tres bloques colapsables bajo el detalle de producto: Beneficios, Modo de
 * uso y Ritual asociado (brief 12.3, paso 2).
 *
 * El patrón busca sentirse como un pergamino que se abre, no un acordeón
 * genérico. El contenido entra con un fade-up breve y el layout cambia de
 * forma inmediata: no se anima `height` ni ninguna propiedad de layout.
 *
 * El panel de cada sección permanece siempre en el DOM y usa `hidden` cuando
 * está cerrado: así el `id` que referencia el `aria-controls` del disparador
 * siempre existe, sin mantener espacio vacío en el layout.
 */
export function ProductSections() {
  const t = useTranslations('store');
  const [openKey, setOpenKey] = useState<SectionKey | null>(null);

  return (
    <div className="border-t border-glass-brd">
      {SECTION_KEYS.map((key) => {
        const isOpen = openKey === key;
        const bodyId = `product-section-${key}`;

        return (
          <div key={key} className="border-b border-glass-brd">
            <button
              type="button"
              onClick={() => setOpenKey(isOpen ? null : key)}
              aria-expanded={isOpen}
              aria-controls={bodyId}
              className="flex min-h-11 w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="font-serif text-[19px] text-ivory">
                {t(`productSections.${key}.title`)}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'shrink-0 font-serif text-[22px] leading-none text-gold transition-transform duration-300',
                  isOpen && 'rotate-45',
                )}
              >
                +
              </span>
            </button>

            <div
              id={bodyId}
              aria-hidden={!isOpen}
              hidden={!isOpen}
              className={cn(isOpen && 'animate-fm-fade-up')}
            >
              <p className="pb-5 font-sans text-[14px] leading-[1.9] text-ivory/72">
                {t(`productSections.${key}.body`)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
