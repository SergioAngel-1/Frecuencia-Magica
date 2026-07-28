import { useState } from 'react';
import { Skeleton } from './Skeleton';

const categoryColors = {
  'Bienestar':      'bg-fm-azul/80 text-fm-carbon',
  'Consciencia':    'bg-fm-primary text-fm-carbon',
  'Ritual':         'bg-white/10 text-white border border-white/20',
  'Transformación': 'bg-fm-secondary text-fm-carbon',
  'Reflexión':      'bg-fm-durazno text-fm-carbon',
};

export function BlogCard({ image, category, title, excerpt, author, authorAvatar, date, readTime, loading = false, className = '' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (loading) {
    return (
      <div className={`bg-fm-surface rounded-xl overflow-hidden border border-fm-border ${className}`}>
        <Skeleton variant="rect" className="w-full h-[180px]" />
        <div className="p-5">
          <Skeleton variant="text" className="w-20 h-2 mb-3" />
          <Skeleton variant="title" className="mb-2" />
          <Skeleton variant="title" className="w-4/5 mb-3" />
          <Skeleton variant="text" className="w-full mb-1" />
          <Skeleton variant="text" className="w-3/4 mb-4" />
          <div className="flex items-center gap-3">
            <Skeleton variant="circle" className="w-8 h-8" />
            <div><Skeleton variant="text" className="w-16 h-2 mb-1" /><Skeleton variant="text" className="w-24 h-1.5" /></div>
          </div>
        </div>
      </div>
    );
  }

  const initials = author?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <article
      className={`bg-fm-surface rounded-xl overflow-hidden border border-fm-border hover:border-fm-primary/40 hover:shadow-[0_8px_30px_rgba(255,170,205,0.10)] transition-all duration-300 cursor-pointer group ${isHovered ? '-translate-y-1' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[180px] overflow-hidden bg-fm-fondo">
        {!imageLoaded && <Skeleton variant="rect" className="w-full h-full absolute inset-0" />}
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fm-carbon/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {category && (
          <div className="absolute top-3 left-3">
            <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-body font-medium tracking-wide shadow-sm ${categoryColors[category] || 'bg-fm-primary/80 text-fm-carbon'}`}>
              {category}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h4 className="font-heading text-[18px] text-white mb-2.5 leading-tight group-hover:text-fm-primary transition-colors duration-300 line-clamp-2">{title}</h4>
        <p className="text-[13px] text-white/50 font-body leading-relaxed mb-4 line-clamp-3">{excerpt}</p>

        <div className="flex items-center justify-between pt-3 border-t border-fm-border">
          <div className="flex items-center gap-2.5">
            {authorAvatar ? (
              <img src={authorAvatar} alt={author} className="w-8 h-8 rounded-full object-cover border-2 border-fm-primary/30" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fm-rosa/80 to-fm-lila flex items-center justify-center text-fm-carbon text-[10px] font-heading shadow-sm">
                {initials}
              </div>
            )}
            <div>
              <p className="text-[11px] text-white/75 font-body font-medium">{author}</p>
              <p className="text-[10px] text-white/35 font-body">{date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {readTime && (
              <span className="text-[10px] text-white/40 font-body flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {readTime}
              </span>
            )}
            <button className="bg-fm-rosa hover:bg-fm-primary-hover text-fm-carbon px-3 py-1.5 rounded-lg font-heading text-[10px] transition-all duration-200 shadow-sm flex items-center gap-1.5">
              Leer
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function BlogGrid({ posts = [], loading = false, columns = 3 }) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };
  const col = gridCols[columns] || gridCols[3];
  return (
    <div className={`grid ${col} gap-6`}>
      {loading
        ? [...Array(columns)].map((_, i) => <BlogCard key={i} loading />)
        : posts.map(p => <BlogCard key={p.id} {...p} />)
      }
    </div>
  );
}

export default BlogCard;
