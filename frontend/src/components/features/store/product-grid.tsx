import { PRODUCTS } from '@/data';
import { cn } from '@/lib/cn';

import { ProductCard } from './product-card';

type ProductGridProps = {
  className?: string;
};

export function ProductGrid({ className }: ProductGridProps) {
  const p1 = PRODUCTS.find((p) => p.id === 'p1');
  const p2 = PRODUCTS.find((p) => p.id === 'p2');
  const p3 = PRODUCTS.find((p) => p.id === 'p3');
  const p4 = PRODUCTS.find((p) => p.id === 'p4');
  const p5 = PRODUCTS.find((p) => p.id === 'p5');
  const p6 = PRODUCTS.find((p) => p.id === 'p6');
  const p7 = PRODUCTS.find((p) => p.id === 'p7');
  const p8 = PRODUCTS.find((p) => p.id === 'p8');

  if (!p1 || !p2 || !p3 || !p4 || !p5 || !p6 || !p7 || !p8) return null;

  return (
    <div className={cn('grid gap-4 md:gap-5', className)}>
      {/* Row 1: 3 columns */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
        <ProductCard product={p2} />
        <ProductCard product={p3} />
        <ProductCard product={p4} />
      </div>

      {/* Row 2: Featured (2fr) + side (1fr) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2">
          <ProductCard product={p1} featured />
        </div>
        <ProductCard product={p5} className="md:mt-auto" />
      </div>

      {/* Row 3: 3 columns */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
        <ProductCard product={p6} />
        <ProductCard product={p7} />
        <ProductCard product={p8} />
      </div>
    </div>
  );
}
