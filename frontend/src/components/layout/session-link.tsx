import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

/**
 * Acceso a la sesión.
 *
 * Es un enlace, no un botón: navega a `/acceso`, así que debe permitir
 * abrir en otra pestaña y anunciarse como destino. Por eso no reutiliza
 * `IconButton`, que emite `aria-pressed` — correcto para un conmutador como
 * el de audio, engañoso para una navegación. Aquí "estás aquí" se comunica
 * con `aria-current`.
 *
 * La superficie replica la de `IconButton` a propósito: mismo hit target de
 * 44px con el disco visible de 40px centrado dentro.
 */
export function SessionLink({ label, active }: { label: string; active: boolean }) {
  return (
    <Link
      href="/acceso"
      data-magnetic
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className="group pointer-events-auto relative inline-flex h-11 w-11 items-center justify-center"
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-[10px]',
          'transition-[color,background-color,border-color,box-shadow] duration-300 ease-out',
          active
            ? 'text-gold border-[rgba(216,185,120,0.6)] bg-[rgba(216,185,120,0.18)]'
            : 'border-glass-brd bg-glass text-ivory group-hover:border-[rgba(216,185,120,0.4)] group-hover:bg-[rgba(247,244,234,0.09)]',
        )}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="3.4" />
          <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
        </svg>
      </span>
    </Link>
  );
}
