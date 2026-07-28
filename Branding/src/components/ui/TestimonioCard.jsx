import { Skeleton } from './Skeleton';

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={i < count ? '#FFDA89' : 'rgba(255,255,255,0.12)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonioCard({ name, role, avatar, quote, rating = 5, program, loading = false, className = '' }) {
  if (loading) {
    return (
      <div className={`bg-fm-surface rounded-xl p-5 border border-fm-border ${className}`}>
        <Skeleton variant="text" className="w-24 h-2 mb-4" />
        <Skeleton variant="text" className="w-full mb-1" />
        <Skeleton variant="text" className="w-full mb-1" />
        <Skeleton variant="text" className="w-3/4 mb-5" />
        <div className="flex items-center gap-3">
          <Skeleton variant="circle" className="w-10 h-10" />
          <div>
            <Skeleton variant="text" className="w-20 h-2 mb-1" />
            <Skeleton variant="text" className="w-16 h-1.5" />
          </div>
        </div>
      </div>
    );
  }

  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div       className={`bg-fm-surface rounded-xl p-5 border border-fm-border hover:border-fm-primary/30 hover:shadow-[0_4px_20px_rgba(255,170,205,0.08)] transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <Stars count={rating} />
        {program && <span className="text-[9px] tracking-[0.15em] text-fm-azul font-body">{program.toUpperCase()}</span>}
      </div>

      <blockquote className="text-[14px] text-white/70 font-body leading-relaxed italic mb-5">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <div className="flex items-center gap-3 pt-3 border-t border-fm-border">
        {avatar ? (
          <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-fm-primary/30" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fm-rosa/60 to-fm-lila/60 flex items-center justify-center text-white font-heading text-sm shrink-0">
            {initials}
          </div>
        )}
        <div>
          <p className="text-[13px] text-white font-body font-medium">{name}</p>
          {role && <p className="text-[11px] text-white/40 font-body">{role}</p>}
        </div>
      </div>
    </div>
  );
}

export function TestimonioGrid({ testimonios = [], loading = false, columns = 3, className = '' }) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  return (
    <div className={`grid ${gridCols[columns] || gridCols[3]} gap-5 ${className}`}>
      {loading
        ? [...Array(columns)].map((_, i) => <TestimonioCard key={i} loading />)
        : testimonios.map((t, i) => <TestimonioCard key={i} {...t} />)
      }
    </div>
  );
}

export default TestimonioCard;
