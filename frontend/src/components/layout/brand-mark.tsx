import { Isotype } from '@/components/world';
import { Link } from '@/i18n/navigation';

/**
 * Isotipo y wordmark, enlazando a la home.
 *
 * El wordmark desaparece por debajo de 768px: en móvil el isotipo solo ya
 * identifica la marca y el espacio hace falta para los controles.
 *
 * La marca lleva su propia superficie de vidrio, hermana de las cápsulas
 * (`ControlDock`): 46 px de alto y forma de píldora (círculo de 46×46 en
 * móvil), para que contraste sobre cualquier foto al hacer scroll igual que
 * el resto de ítems. Desde `md`, cuando entra el wordmark, la misma píldora
 * los contiene a los dos y el isotipo baja a 36 px para que el vidrio respire.
 * El vidrio va en una capa aparte (`isolate` + `-z-10`), como en las cápsulas,
 * para no convertir el enlace en bloque contenedor de futuros paneles `fixed`.
 */
export function BrandMark({ label }: { label: string }) {
  return (
    <Link
      href="/inicio"
      data-magnetic
      aria-label={label}
      className="text-fg hover:text-fg rounded-pill pointer-events-auto relative isolate flex h-[46px] min-h-11 w-[46px] items-center justify-center gap-2 pr-0 pl-0 md:w-auto md:justify-start md:gap-[13px] md:pr-4 md:pl-2"
    >
      <span
        aria-hidden="true"
        className="fm-surface rounded-pill pointer-events-none absolute inset-0 -z-10"
      />
      {/* Quieto y con su círculo: en el header el isotipo es la firma completa.
          El halo es decorativo y sigue el halo del tema (T0.7 decide su visibilidad). */}
      <Isotype
        spin={false}
        ringed
        className="size-9 shrink-0 drop-shadow-[0_0_10px_rgb(var(--halo)/0.35)]"
      />
      <span className="tracking-label text-serif-sm hidden shrink-0 font-serif font-medium whitespace-nowrap uppercase md:inline">
        {label}
      </span>
    </Link>
  );
}
