import { PageShell } from '@/components/layout';
import { Skeleton } from '@/components/ui';

/**
 * Silueta de la Tienda: la misma rejilla bento que `ProductGrid` — fila de
 * 3, destacado (2fr) + lateral (1fr), fila de 3 — en esqueleto.
 */
export default function Loading() {
  return (
    <PageShell width="store">
      <div aria-busy="true" className="grid gap-4 md:gap-5">
        {/* Fila 1: 3 columnas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
          <Skeleton variant="card" className="min-h-[340px]" />
          <Skeleton variant="card" className="min-h-[340px]" />
          <Skeleton variant="card" className="min-h-[340px]" />
        </div>

        {/* Fila 2: destacado (2fr) + lateral (1fr) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          <Skeleton variant="card" className="min-h-[440px] md:col-span-2" />
          <Skeleton variant="card" className="min-h-[340px]" />
        </div>

        {/* Fila 3: 3 columnas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
          <Skeleton variant="card" className="min-h-[340px]" />
          <Skeleton variant="card" className="min-h-[340px]" />
          <Skeleton variant="card" className="min-h-[340px]" />
        </div>
      </div>
    </PageShell>
  );
}
