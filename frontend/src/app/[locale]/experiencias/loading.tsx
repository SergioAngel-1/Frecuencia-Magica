import { PageShell } from '@/components/layout';
import { Skeleton } from '@/components/ui';

/**
 * Silueta de Experiencias: la card destacada de `ExperienceList`
 * (min-h-[340px]) seguida de tres filas horizontales.
 */
export default function Loading() {
  return (
    <PageShell width="default">
      <div aria-busy="true">
        <Skeleton variant="card" className="mb-8 min-h-[340px]" />
        <div className="flex flex-col gap-5">
          <Skeleton variant="band" className="h-[150px]" />
          <Skeleton variant="band" className="h-[150px]" />
          <Skeleton variant="band" className="h-[150px]" />
        </div>
      </div>
    </PageShell>
  );
}
