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
          El halo es decorativo y sigue el halo del tema (T0.7 decide su visibilidad). */}
      <Isotype
        spin={false}
        ringed
        className="size-[46px] drop-shadow-[0_0_10px_rgb(var(--halo)/0.35)]"
      />
      <span className="tracking-label text-serif-sm hidden shrink-0 font-serif font-medium whitespace-nowrap uppercase md:inline">
        {label}
      </span>
    </Link>
  );
}
