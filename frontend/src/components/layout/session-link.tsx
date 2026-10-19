import { Link } from '@/i18n/navigation';
import { dockSegmentClasses } from './control-dock';

/**
 * Acceso a la sesión.
 *
 * Es un enlace, no un botón: navega a `/acceso`, así que debe permitir
 * abrir en otra pestaña y anunciarse como destino. Por eso no reutiliza
 * `IconButton`, que emite `aria-pressed` — correcto para un conmutador como
 * el de audio, engañoso para una navegación. Aquí "estás aquí" se comunica
 * con `aria-current`.
 *
 * Vive en la cápsula de navegación del header (`ControlDock`): 44px de hit target.
 */
export function SessionLink({ label, active }: { label: string; active: boolean }) {
  return (
    <Link
      href="/acceso"
      data-magnetic
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={dockSegmentClasses({ active })}
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
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      </svg>
    </Link>
  );
}
