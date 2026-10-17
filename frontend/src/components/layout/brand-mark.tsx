import { Isotype } from '@/components/world';
import { Link } from '@/i18n/navigation';

/**
 * Isotipo y wordmark, enlazando a la home.
 *
 * El wordmark desaparece por debajo de 768px: en móvil el isotipo solo ya
 * identifica la marca y el espacio hace falta para los controles.
 */
export function BrandMark({ label }: { label: string }) {
  return (
    <Link
      href="/inicio"
      data-magnetic
      aria-label={label}
      className="text-fg hover:text-fg pointer-events-auto flex min-h-11 items-center gap-[13px]"
    >
      {/* Quieto y con su círculo: en el header el isotipo es la firma completa.
          El halo es decorativo y queda crudo a propósito (T0.7 decide su visibilidad). */}
      <Isotype
        spin={false}
        ringed
        className="size-[46px] drop-shadow-[0_0_10px_rgba(216,185,120,0.35)]"
      />
      <span className="tracking-label hidden font-serif text-[19px] font-medium uppercase md:inline">
        {label}
      </span>
    </Link>
  );
}
