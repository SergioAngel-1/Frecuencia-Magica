import { useState } from 'react';

const variants = {
  primary:   { base: 'bg-fm-primary text-fm-carbon',   hover: 'hover:bg-fm-primary-hover',   active: 'active:bg-[#d47ba0]' },
  secondary: { base: 'bg-fm-secondary text-fm-carbon',  hover: 'hover:bg-fm-secondary-hover', active: 'active:bg-[#a99fd4]' },
  outline:   { base: 'bg-transparent text-fm-primary border-2 border-fm-primary', hover: 'hover:bg-fm-primary/10', active: 'active:bg-fm-primary/15' },
  ghost:     { base: 'bg-transparent text-fm-primary',  hover: 'hover:bg-white/5',            active: 'active:bg-white/10' },
  surface:   { base: 'bg-white/8 text-white border border-fm-border', hover: 'hover:bg-white/12', active: 'active:bg-white/15' },
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function Button({ children, variant = 'primary', size = 'md', disabled = false, fullWidth = false, onClick, className = '', ...props }) {
  const [isPressed, setIsPressed] = useState(false);
  const v = variants[variant] || variants.primary;

  return (
    <button
      className={`
        font-heading font-medium rounded-lg
        transition-all duration-200 ease-in-out
        ${v.base} ${v.hover}
        ${isPressed ? v.active : ''}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        shadow-md hover:shadow-lg
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
