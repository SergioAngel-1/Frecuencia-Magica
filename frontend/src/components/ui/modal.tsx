'use client';

import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react';

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
  center: 'my-auto',
  top: 'mt-[calc(76px+env(safe-area-inset-top))] mb-auto',
};

/**
 * Tarjeta modal: una superficie de cristal denso sobre la noche, que pide
 * atención sin sacar a la persona de la vista.
 *
 * Se apoya en el `<dialog>` nativo abierto con `showModal()`: de ahí salen el
 * foco atrapado, Escape, el resto de la página inerte y la capa superior del
 * navegador (no compite con la escala `z-*`). Aquí sólo se añaden el cierre
 * al pulsar fuera, el bloqueo del scroll de la página y la superficie.
 *
 * El contenido se monta sólo mientras está abierta, así que su entrada
 * escalonada se repite en cada apertura.
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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
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

  // El fondo es el propio `<dialog>` (la tarjeta lo llena): un clic cuyo
  // destino es el diálogo ha caído fuera de la tarjeta.
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      data-lenis-prevent
      onClose={onClose}
      onClick={handleBackdropClick}
      className={cn(
        'text-ivory fixed inset-0 mx-auto h-fit max-h-[calc(100dvh-24px)] w-[min(calc(100%-24px),440px)] max-w-none overflow-visible bg-transparent p-0',
        'backdrop:bg-void-2/72 backdrop:backdrop-blur-[10px]',
        PLACEMENT_CLASSES[placement],
      )}
    >
      {open ? (
        <div
          className={cn(
            'fm-surface-strong rounded-card-lg shadow-glow-card animate-fm-fade-up flex max-h-[calc(100dvh-24px)] flex-col overflow-hidden motion-reduce:animate-none',
            className,
          )}
        >
          <header className="border-ivory/10 flex items-center justify-between gap-4 border-b py-2 pr-2 pl-6">
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
        </div>
      ) : null}
    </dialog>
  );
}
