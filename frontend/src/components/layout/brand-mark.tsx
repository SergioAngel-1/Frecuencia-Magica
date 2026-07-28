import Image from 'next/image';

import { Link } from '@/i18n/navigation';

/**
 * Logo y wordmark, enlazando a la home.
 *
 * El wordmark desaparece por debajo de 768px: en móvil el logo solo ya
 * identifica la marca y el espacio hace falta para los controles.
 */
export function BrandMark({ label }: { label: string }) {
  return (
    <Link
      href="/inicio"
      data-magnetic
      className="text-ivory pointer-events-auto flex items-center gap-[13px] hover:text-[color:var(--color-ivory)]"
    >
      <Image
        src="/logo.png"
        alt={label}
        width={46}
        height={46}
        priority
        className="h-[46px] w-[46px] object-contain drop-shadow-[0_0_10px_rgba(216,185,120,0.35)]"
      />
      <span className="hidden font-serif text-[19px] font-medium tracking-[.14em] uppercase md:inline">
        {label}
      </span>
    </Link>
  );
}
