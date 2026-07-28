import { useState } from 'react';
import { Skeleton } from './Skeleton';
import { AddToCartButton } from './AddToCartButton';

function StarRating({ rating = 4.5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(star => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.floor(rating) ? 'text-fm-durazno' : star <= rating ? 'text-fm-durazno/50' : 'text-white/15'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="text-[10px] text-white/35 font-body ml-1">{rating}</span>
    </div>
  );
}

const badgeColors = {
  ARTESANAL: 'bg-fm-secondary text-fm-carbon',
  NUEVO:     'bg-fm-primary text-fm-carbon',
  DESTACADO: 'bg-fm-primary/90 text-fm-carbon',
  PREMIUM:   'bg-white/10 text-white border border-white/20',
  OFERTA:    'bg-fm-durazno text-fm-carbon',
  NATURAL:   'bg-fm-menta text-fm-carbon',
};

export function ProductCard({ image, badge, name, price, originalPrice, rating = 4.5, reviews = 128, loading = false, onAddToCart, onChangeQuantity, className = '' }) {
  const [isHovered, setIsHovered] = useState(false);

  if (loading) {
    return (
      <div className={`bg-fm-surface rounded-xl overflow-hidden border border-fm-border ${className}`}>
        <Skeleton variant="rect" className="w-full h-[180px]" />
        <div className="p-4">
          <Skeleton variant="text" className="w-1/3 h-2 mb-2" />
          <Skeleton variant="title" className="mb-2" />
          <div className="flex items-center gap-2 mt-3">
            <Skeleton variant="text" className="w-16 h-4" />
            <Skeleton variant="text" className="w-12 h-3" />
          </div>
          <Skeleton variant="text" className="w-20 h-2 mt-2 mb-3" />
          <Skeleton variant="rect" className="w-full h-8" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-fm-surface rounded-xl overflow-hidden border border-fm-border hover:border-fm-primary/50 hover:shadow-[0_8px_30px_rgba(255,170,205,0.12)] transition-all duration-300 group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[180px] overflow-hidden">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        {badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-body font-medium tracking-wide ${badgeColors[badge] || 'bg-fm-primary text-fm-carbon'}`}>
            {badge}
          </span>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-fm-carbon/70 hover:bg-fm-carbon/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm">
          <svg className="w-4 h-4 text-white/60 hover:text-fm-rosa" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        {badge && <span className="text-[9px] tracking-[0.15em] text-white/30 font-body uppercase">{badge}</span>}
        <h4 className="font-heading text-[16px] text-white mt-1 mb-1 leading-tight">{name}</h4>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-heading text-[18px] text-fm-primary">${price}</span>
          {originalPrice && <span className="text-[12px] text-white/30 font-body line-through">${originalPrice}</span>}
        </div>
        <StarRating rating={rating} />
        <p className="text-[10px] text-white/30 font-body mt-1 mb-3">{reviews} reseñas</p>
        <AddToCartButton onAdd={onAddToCart} onChangeQuantity={onChangeQuantity} size="sm" className="w-full" />
      </div>
    </div>
  );
}

export function ProductGrid({ products = [], loading = false, columns = 4 }) {
  const gridCols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };
  const count = loading ? columns : products.length;
  return (
    <div className={`grid ${gridCols[columns] || 'grid-cols-4'} gap-4`}>
      {loading
        ? [...Array(count)].map((_, i) => <ProductCard key={i} loading />)
        : products.map(p => <ProductCard key={p.id} {...p} />)
      }
    </div>
  );
}

export default ProductCard;
