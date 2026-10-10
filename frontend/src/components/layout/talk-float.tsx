'use client';

import { useTranslations } from 'next-intl';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import { div as Mdiv } from 'motion/react-m';

import { WHATSAPP_NUMBER } from '@/config/contact';
import { DURATION, EASE } from '@/config/motion';
import { useRealm } from '@/hooks/use-realm';
import { cn } from '@/lib/cn';
import { whatsappLink } from '@/lib/contact/whatsapp-link';
import { usePlayerStore } from '@/stores/player-store';

/**
 * «Hablar ahora»: la puerta directa a una conversación por WhatsApp, flotando
 * en la esquina inferior izquierda de todas las vistas (la derecha es del
 * reproductor recogido). Habla el idioma del sitio: vidrio denso, trazo fino
 * y una luz que respira, sin el verde ni el logotipo de la aplicación.
 *
 * Por debajo de 640 px se queda en el disco con su icono; el nombre completo
 * sigue en el árbol de accesibilidad. Cuando el reproductor está desplegado
 * sube para no quedar debajo de la barra.
 *
 * No aparece en el portal: es el umbral, una sola pantalla sin más salida
 * que entrar.
 */
export function TalkFloat() {
  const t = useTranslations('talk');
  const { realmId } = useRealm();
  const dockOpen = usePlayerStore((s) => s.audioId !== null && !s.minimized);
  const reduced = useReducedMotion();

  return (
    <aside
      aria-label={t('region')}
      data-layout-layer="talk"
      className={cn(
        // `will-change` fuera del condicional: la capa propia no depende de
        // que el reproductor esté abierto (ver `fm-float-start`).
        'fm-float-start z-player pointer-events-none fixed transition-transform duration-500 ease-out will-change-transform',
        dockOpen && '-translate-y-[76px] sm:-translate-y-[92px]',
      )}
    >
      <AnimatePresence>
        {realmId === 'portal' ? null : (
          <Mdiv
            key="talk"
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: reduced ? 0 : DURATION.entrance, ease: EASE.soft },
            }}
            exit={{
              opacity: 0,
              y: reduced ? 0 : 14,
              transition: { duration: reduced ? 0 : DURATION.fast * 0.7, ease: EASE.soft },
            }}
          >
            <a
              href={whatsappLink(WHATSAPP_NUMBER, t('message'))}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              aria-label={t('aria')}
              className="group fm-surface-strong shadow-glow-card rounded-pill hover:border-gold/45 text-ivory pointer-events-auto flex h-14 min-w-14 items-center justify-center gap-3 transition-colors duration-300 sm:px-5"
            >
              <span className="relative flex size-6 items-center justify-center">
                <span
                  aria-hidden="true"
                  className="animate-fm-glow bg-gold/25 absolute -inset-2 rounded-full blur-[8px]"
                />
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="text-gold relative"
                >
                  <path d="M12 4.2a7.8 7.8 0 0 0-6.7 11.8L4.2 19.8l3.9-1A7.8 7.8 0 1 0 12 4.2z" />
                  <path d="M8.6 12c.85-1.5 1.7-1.5 2.55 0s1.7 1.5 2.55 0 1.3-1.2 1.7-.6" />
                </svg>
              </span>
              <span className="text-label tracking-caps group-hover:text-ivory text-fg-body font-sans uppercase transition-colors duration-300 max-sm:hidden">
                {t('label')}
              </span>
            </a>
          </Mdiv>
        )}
      </AnimatePresence>
    </aside>
  );
}
