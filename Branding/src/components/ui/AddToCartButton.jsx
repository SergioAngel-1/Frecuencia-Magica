import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { QuantityCounter } from './QuantityCounter';

export function AddToCartButton({ onAdd, onChangeQuantity, onRemove, size = 'md', className = '' }) {
  const [quantity, setQuantity] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAdd = () => { setQuantity(1); setAdded(true); onAdd?.(1); };
  const handleChangeQuantity = (q) => { setQuantity(q); onChangeQuantity?.(q); };
  const handleRemove = () => { setQuantity(0); setAdded(false); onRemove?.(); };

  const sizeStyles = {
    sm: { button: 'h-8 px-3 text-[11px] gap-1.5', icon: 'w-3.5 h-3.5' },
    md: { button: 'h-9 px-4 text-[12px] gap-2',   icon: 'w-4 h-4' },
    lg: { button: 'h-10 px-5 text-[13px] gap-2',  icon: 'w-4 h-4' },
  };
  const styles = sizeStyles[size] || sizeStyles.md;

  if (added && quantity > 0) {
    return (
      <QuantityCounter
        value={quantity} min={1} max={99}
        onChange={handleChangeQuantity}
        onRemove={handleRemove}
        size={size === 'lg' ? 'md' : 'sm'}
        className={`w-full ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`flex items-center justify-center rounded-lg font-body font-medium bg-fm-primary text-fm-carbon hover:bg-fm-primary-hover transition-all duration-200 cursor-pointer ${styles.button} ${className}`}
    >
      <ShoppingBag className={styles.icon} />
      Añadir al carrito
    </button>
  );
}

export default AddToCartButton;
