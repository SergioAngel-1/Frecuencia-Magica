'use client';

import { useTranslations } from 'next-intl';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { div as Mdiv } from 'motion/react-m';

import { WHATSAPP_NUMBER } from '@/config/contact';
import { DURATION, EASE } from '@/config/motion';
import { useRealm } from '@/hooks/use-realm';
import { cn } from '@/lib/cn';
import { whatsappLink } from '@/lib/contact/whatsapp-link';
import { usePlayerStore } from '@/stores/player-store';

/**
 * «Hablar ahora»: la puerta directa a una conversación por WhatsApp, flotando
 * en la esquina inferior derecha de todas las vistas. Habla el idioma del sitio: vidrio denso, trazo fino
 * y una luz que respira, sin el verde ni el logotipo de la aplicación.
 *
 * Por debajo de 640 px se queda en el disco con su icono; el nombre completo
 * sigue en el árbol de accesibilidad. Comparte la fila fija del pie con el
 * reproductor (`layout.tsx`): va en línea con la barra desplegada y, al
 * recogerse, con el disco, que queda a su izquierda.
 *
 * No aparece en el portal: es el umbral, una sola pantalla sin más salida
 * que entrar.
 */
/**
 * La barra desplegada mide más que el botón (62 px, 78 desde 640 px, contra
 * 56): sube la mitad de la diferencia para quedar centrado con ella. Con el
 * disco recogido, de 56, ya lo está.
 */
const PLAYER_ALIGN = {
  closed: '',
  expanded: '-translate-y-[3px] sm:-translate-y-[11px]',
  minimized: '',
} as const;

export function TalkFloat() {
  const t = useTranslations('talk');
  const { realmId } = useRealm();
  const player = usePlayerStore((s) =>
    s.audioId === null ? 'closed' : s.minimized ? 'minimized' : 'expanded',
  );

  return (
    <aside
      aria-label={t('region')}
      data-layout-layer="talk"
      className={cn(
        'pointer-events-none shrink-0 transition-transform duration-500 ease-out',
        PLAYER_ALIGN[player],
      )}
    >
      {/* Movimiento reducido: Motion lo consulta al animar, no al renderizar, así
          que el HTML del servidor y la hidratación coinciden; salta el `y` y
          deja sólo el fundido. */}
      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {realmId === 'portal' ? null : (
            <Mdiv
              key="talk"
              className="pl-3"
              initial={{ opacity: 0, y: 18 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: DURATION.entrance, ease: EASE.soft },
              }}
              exit={{
                opacity: 0,
                y: 14,
                transition: { duration: DURATION.fast * 0.7, ease: EASE.soft },
              }}
            >
              <a
                href={whatsappLink(WHATSAPP_NUMBER, t('message'))}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                aria-label={t('aria')}
                className="group fm-surface-strong shadow-glow-card rounded-pill hover:border-accent/45 text-fg pointer-events-auto flex h-14 min-w-14 items-center justify-center gap-3 transition-colors duration-300 sm:px-5"
              >
                <span className="relative flex size-6 items-center justify-center">
                  {/* Aura decorativa: queda cruda a propósito (T0.7). */}
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
                    className="text-accent relative"
                  >
                    <path d="M12 4.2a7.8 7.8 0 0 0-6.7 11.8L4.2 19.8l3.9-1A7.8 7.8 0 1 0 12 4.2z" />
                    <path d="M8.6 12c.85-1.5 1.7-1.5 2.55 0s1.7 1.5 2.55 0 1.3-1.2 1.7-.6" />
                  </svg>
                </span>
                <span className="text-label tracking-caps group-hover:text-fg text-fg-body font-sans uppercase transition-colors duration-300 max-sm:hidden">
                  {t('label')}
                </span>
              </a>
            </Mdiv>
          )}
        </AnimatePresence>
      </MotionConfig>
    </aside>
  );
}
