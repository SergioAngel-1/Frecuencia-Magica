import { Skeleton } from './Skeleton';

const colorMap = {
  gold:   { bg: 'rgba(255,170,205,0.12)',  border: 'rgba(255,170,205,0.25)' },
  teal:   { bg: 'rgba(220,208,255,0.12)',  border: 'rgba(220,208,255,0.25)' },
  carbon: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.12)' },
  warm:   { bg: 'rgba(255,218,137,0.08)',  border: 'rgba(255,218,137,0.18)' },
  cool:   { bg: 'rgba(162,207,254,0.08)',  border: 'rgba(162,207,254,0.18)' },
};

export function CategoryCard({ image, label, color = 'gold', loading = false, className = '' }) {
  if (loading) {
    return <div className={`rounded-2xl overflow-hidden ${className}`}><Skeleton variant="rect" className="w-full h-[220px] rounded-2xl" /></div>;
  }
  const { bg, border } = colorMap[color] || colorMap.gold;

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
    >
      <div className="p-3 pb-0">
        <div className="rounded-xl overflow-hidden h-[170px]">
          <img src={image} alt={label} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="px-5 py-4 text-center">
        <span className="font-heading text-[15px] text-white">{label}</span>
      </div>
    </div>
  );
}

export function CategoryGrid({ categories = [], loading = false, columns = 2, className = '' }) {
  const gridCols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };
  const skeletonCount = columns === 2 ? 4 : columns;
  return (
    <div className={`grid ${gridCols[columns] || 'grid-cols-2'} gap-5 max-w-2xl mx-auto ${className}`}>
      {loading
        ? [...Array(skeletonCount)].map((_, i) => <CategoryCard key={i} loading />)
        : categories.map((cat, i) => <CategoryCard key={i} {...cat} />)
      }
    </div>
  );
}

export default CategoryCard;
