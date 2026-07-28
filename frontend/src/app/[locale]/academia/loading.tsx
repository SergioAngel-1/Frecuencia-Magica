import { PageShell } from '@/components/layout';
import { Skeleton } from '@/components/ui';

/**
 * Silueta de Academia: la card destacada de `CourseList` (min-h-[340px])
 * seguida de las dos secundarias en la misma rejilla de dos columnas.
 */
export default function Loading() {
  return (
    <PageShell width="default">
      <div aria-busy="true">
        <Skeleton variant="card" className="mb-6 min-h-[340px]" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton variant="card" className="min-h-[280px]" />
          <Skeleton variant="card" className="min-h-[280px]" />
        </div>
      </div>
    </PageShell>
  );
}
