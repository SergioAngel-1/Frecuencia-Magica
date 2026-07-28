'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { DURATION, EASE } from '@/config/motion';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/cn';

const SECTION_KEYS = ['benefits', 'usage', 'ritual'] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

/**
 * Tres bloques colapsables bajo el detalle de producto: Beneficios, Modo de
 * uso y Ritual asociado (brief 12.3, paso 2).
 *
 * El patrón busca sentirse como un pergamino que se abre, no un acordeón
 * genérico: la altura se anima en 0.4s (`DURATION.scroll`) junto a un ligero
 * desvanecido del contenido, nunca un simple show/hide. Con movimiento
 * reducido se respeta el contenido pero se retira la animación de altura:
 * el bloque aparece/desaparece al instante.
 */
export function ProductSections() {
  const t = useTranslations('store');
  const reducedMotion = useReducedMotionSafe();
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
              <span className="font-serif text-[19px] text-ivory">{t(`productSections.${key}.title`)}</span>
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

            {reducedMotion ? (
              isOpen ? (
                <p id={bodyId} className="pb-5 font-sans text-[14px] leading-[1.9] text-ivory/72">
                  {t(`productSections.${key}.body`)}
                </p>
              ) : null
            ) : (
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={bodyId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                      transition: {
                        height: { duration: DURATION.scroll, ease: EASE.soft },
                        opacity: { duration: DURATION.scroll, delay: 0.08 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: { duration: DURATION.scroll, ease: EASE.soft },
                    }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="pb-5 font-sans text-[14px] leading-[1.9] text-ivory/72">
                      {t(`productSections.${key}.body`)}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </div>
  );
}
