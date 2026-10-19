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
 * Va fuera del flujo de la fila fija del pie (`layout.tsx`), anclado a la esquina: así el
 * reproductor se centra en la pantalla sin importar dónde esté el botón. Sin reproductor
 * conserva su nombre completo desde 640 px; con él, el nombre sólo cabe desde 1280 px y por
 * debajo queda el disco con su icono (el nombre sigue en el árbol de accesibilidad), que es lo
 * que reserva `--talk-w` en `globals.css`. El reproductor deja a cada lado esa reserva.
 *
 * No aparece en el portal: es el umbral, una sola pantalla sin más salida
 * que entrar.
 */
/**
 * Con la barra desplegada el botón se alinea con ella. En escritorio (desde 1024 px) comparten
 * línea: la barra mide más que el botón (78 px contra 56), así que éste sube la mitad de la
 * diferencia. Por debajo, la barra ocupa todo el ancho y el botón sube justo encima de ella (su
 * alto, 66 px, más un respiro de 12; 78 desde 640 px, donde el disco y el play crecen). Con el
 * disco recogido, de 56, ya está en línea.
 */
const PLAYER_ALIGN = {
  closed: '',
  expanded: '-translate-y-[78px] sm:-translate-y-[90px] lg:-translate-y-[11px]',
  minimized: '',
} as const;

/** El nombre completo: con el botón solo, desde 640 px; con reproductor, desde 1280 px. */
const LABEL_CLASSES = {
  closed: { link: 'sm:px-5', label: 'max-sm:hidden' },
  withPlayer: { link: 'xl:px-5', label: 'max-xl:hidden' },
} as const;

export function TalkFloat() {
  const t = useTranslations('talk');
  const { realmId } = useRealm();
  const player = usePlayerStore((s) =>
    s.audioId === null ? 'closed' : s.minimized ? 'minimized' : 'expanded',
  );
  const labelClasses = LABEL_CLASSES[player === 'closed' ? 'closed' : 'withPlayer'];

  return (
    <aside
      aria-label={t('region')}
      data-layout-layer="talk"
      className={cn(
        'pointer-events-none absolute right-[max(var(--float-gap),env(safe-area-inset-right))] bottom-[max(var(--float-gap),env(safe-area-inset-bottom))] transition-transform duration-500 ease-out',
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
                className={cn(
                  'group fm-surface-strong shadow-glow-card rounded-pill hover:border-accent/45 text-fg pointer-events-auto flex h-14 min-w-14 items-center justify-center gap-3 transition-colors duration-300',
                  labelClasses.link,
                )}
              >
                <span className="relative flex size-6 items-center justify-center">
                  {/* Aura decorativa: sigue el halo del tema (T0.7). */}
                  <span
                    aria-hidden="true"
                    className="animate-fm-glow bg-halo/25 absolute -inset-2 rounded-full blur-[8px]"
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
                <span
                  className={cn(
                    'text-label tracking-caps group-hover:text-fg text-fg-body font-sans uppercase transition-colors duration-300',
                    labelClasses.label,
                  )}
                >
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
