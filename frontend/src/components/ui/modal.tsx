'use client';

import { useEffect, useId, useRef, type ReactNode, type SyntheticEvent } from 'react';
import { AnimatePresence } from 'motion/react';
import { div as Mdiv } from 'motion/react-m';

import { DURATION, EASE } from '@/config/motion';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/cn';

import { IconButton } from './icon-button';

export type ModalPlacement = 'center' | 'top';

interface ModalProps {
  open: boolean;
  /** Se llama al cerrar por el botón, por Escape o al pulsar fuera de la tarjeta. */
  onClose: () => void;
  /** Título visible de la tarjeta y nombre accesible del diálogo. Ya traducido. */
  title: string;
  /** Nombre accesible del botón de cerrar. Ya traducido. */
  closeLabel: string;
  /** `top` la cuelga bajo el header: es de donde sale un menú abierto desde allí. */
  placement?: ModalPlacement;
  children: ReactNode;
  className?: string;
}

const PLACEMENT_CLASSES: Record<ModalPlacement, string> = {
  center: 'items-center',
  top: 'items-start pt-[calc(76px+env(safe-area-inset-top))]',
};

/**
 * Tarjeta modal: una superficie de cristal denso sobre la noche, que pide
 * atención sin sacar a la persona de la vista.
 *
 * Se apoya en el `<dialog>` nativo abierto con `showModal()`: de ahí salen el
 * foco atrapado, Escape, el resto de la página inerte y la capa superior del
 * navegador (no compite con la escala `z-*`). Aquí se añaden el cierre al
 * pulsar fuera, el bloqueo del scroll de la página y la superficie.
 *
 * Abre y cierra sin salto: la noche del fondo funde y la tarjeta emerge; al
 * cerrar hacen el camino inverso y sólo entonces se cierra el `<dialog>`. Por
 * eso el fondo es una capa propia y no el `::backdrop` nativo, que desaparece
 * de golpe. Escape se intercepta para que pase por la misma salida.
 */
export function Modal({
  open,
  onClose,
  title,
  closeLabel,
  placement = 'center',
  children,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const reduced = useReducedMotionSafe();
  const enter = reduced ? 0 : DURATION.reveal;
  const exit = reduced ? 0 : DURATION.fast * 0.7;

  // Abrir es inmediato; cerrar espera a que termine la salida (`onExitComplete`).
  useEffect(() => {
    const dialog = dialogRef.current;

    if (!open || !dialog || dialog.open) return;

    dialog.showModal();
    // `showModal()` entrega el foco al primer control, el botón de cerrar, y
    // iOS lo pinta con el aro de foco aunque se haya abierto con el dedo. El
    // foco se queda en el propio diálogo: el lector anuncia su título y el
    // primer Tab llega al botón de cerrar.
    dialog.focus({ preventScroll: true });
  }, [open]);

  // La página no debe desplazarse por debajo mientras la tarjeta está abierta.
  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';

    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  // Escape cerraría el `<dialog>` en el acto: se cancela y se pide el cierre
  // normal, que sí pasa por la animación de salida.
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      tabIndex={-1}
      data-lenis-prevent
      onCancel={handleCancel}
      onClose={onClose}
      className="text-fg fixed inset-0 size-full max-h-none max-w-none overflow-visible bg-transparent p-0 outline-none backdrop:bg-transparent"
    >
      <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
        {open ? (
          <div
            key="modal"
            className={cn('flex size-full justify-center px-3 pb-3', PLACEMENT_CLASSES[placement])}
          >
            <Mdiv
              aria-hidden="true"
              onClick={onClose}
              className="bg-scrim-deep/72 absolute inset-0 backdrop-blur-[10px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: enter, ease: EASE.soft } }}
              exit={{ opacity: 0, transition: { duration: exit, ease: EASE.soft } }}
            />
            <Mdiv
              className={cn(
                'fm-surface-strong rounded-card-lg shadow-glow-card relative flex max-h-full w-full max-w-[440px] flex-col overflow-hidden',
                className,
              )}
              initial={{ opacity: 0, y: reduced ? 0 : 18, scale: reduced ? 1 : 0.98 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: enter, ease: EASE.soft },
              }}
              exit={{
                opacity: 0,
                y: reduced ? 0 : 10,
                scale: reduced ? 1 : 0.98,
                transition: { duration: exit, ease: EASE.soft },
              }}
            >
              <header className="border-fg/10 flex items-center justify-between gap-4 border-b py-2 pr-2 pl-6">
                <h2
                  id={titleId}
                  className="text-fg-meta text-label tracking-kicker font-sans uppercase"
                >
                  {title}
                </h2>
                <IconButton variant="ghost" label={closeLabel} onClick={onClose}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
                  </svg>
                </IconButton>
              </header>
              <div className="overflow-y-auto overscroll-contain">{children}</div>
            </Mdiv>
          </div>
        ) : null}
      </AnimatePresence>
    </dialog>
  );
}
