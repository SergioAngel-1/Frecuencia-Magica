import { PageShell } from '@/components/layout';
import { Skeleton } from '@/components/ui';
import { discSlot } from '@/lib/library/layout-slots';

const SMALL_DISCS = Array.from({ length: 6 }, (_, i) => discSlot(i));

/**
 * Silueta de la Biblioteca: un disco grande centrado (la frecuencia
 * destacada) y seis pequeños en las mismas posiciones orbitales que usa
 * `LibrarySystem` (vía `discSlot`), para que la página no salte al
 * resolverse. Por debajo de `lg` reproduce la rejilla móvil equivalente.
 */
export default function Loading() {
  return (
    <PageShell width="wide" className="pb-[220px] pt-[130px]">
      <div aria-busy="true">
        {/* <lg: rejilla móvil */}
        <div className="mx-auto block max-w-[1040px] lg:hidden">
          <Skeleton variant="disc" className="mx-auto mb-10 w-[280px]" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-5">
            {SMALL_DISCS.map((_, i) => (
              <Skeleton key={i} variant="disc" className="mx-auto w-[140px]" />
            ))}
          </div>
        </div>

        {/* >=lg: sistema orbital */}
        <div className="relative mx-auto hidden min-h-[720px] max-w-[1040px] lg:block">
          <Skeleton
            variant="disc"
            className="absolute left-1/2 top-1/2 z-[4] -translate-x-1/2 -translate-y-1/2"
            style={{ width: 'min(82%, 400px)' }}
          />
          {SMALL_DISCS.map((slot, i) => (
            <Skeleton
              key={i}
              variant="disc"
              className="absolute z-[3]"
              style={{ top: slot.top, left: slot.left, width: slot.size }}
            />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
