import { Minus, Plus, Trash2 } from 'lucide-react';

export function QuantityCounter({ value = 1, min = 1, max = 99, onChange, onRemove, size = 'md', className = '' }) {
  const sizeStyles = {
    sm: { button: 'w-9 h-9',  icon: 'w-3.5 h-3.5', text: 'text-[13px]' },
    md: { button: 'w-10 h-10', icon: 'w-4 h-4',    text: 'text-[14px]' },
    lg: { button: 'w-11 h-11', icon: 'w-5 h-5',    text: 'text-[15px]' },
  };
  const styles = sizeStyles[size] || sizeStyles.md;
  const isMin = value <= min;

  return (
    <div className={`flex items-center gap-0 border border-fm-border rounded-lg overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => isMin ? onRemove?.() : onChange?.(value - 1)}
        className={`${styles.button} flex items-center justify-center transition-colors cursor-pointer
          ${isMin ? 'bg-white/5 hover:bg-white/10 text-white/40 hover:text-white' : 'bg-fm-surface hover:bg-fm-border text-white'}
        `}
      >
        {isMin ? <Trash2 className={styles.icon} /> : <Minus className={styles.icon} />}
      </button>
      <span className={`${styles.text} flex-1 text-center font-body font-medium text-white`}>{value}</span>
      <button
        type="button"
        onClick={() => value < max && onChange?.(value + 1)}
        disabled={value >= max}
        className={`${styles.button} flex items-center justify-center bg-fm-surface hover:bg-fm-border text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        <Plus className={styles.icon} />
      </button>
    </div>
  );
}

export default QuantityCounter;
