const Badge = ({ icon, image, text, variant = 'primary', size = 'md', className = '' }) => {
  const variants = {
    primary:   'bg-fm-primary text-fm-carbon',
    secondary: 'bg-fm-secondary text-white',
    surface:   'bg-fm-surface text-white border border-fm-border',
    outline:   'bg-transparent text-fm-primary border border-fm-primary',
    dark:      'bg-fm-fondo text-white border border-fm-border',
  };
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-14 h-14 text-lg' };

  return (
    <div className={`rounded-full flex items-center justify-center font-heading overflow-hidden ${variants[variant]} ${sizes[size]} ${className}`}>
      {image && <img src={image} alt="" className="w-full h-full object-contain p-1" />}
      {icon && !image && <span className="shrink-0">{icon}</span>}
      {text && !image && <span className="font-medium">{text}</span>}
    </div>
  );
};

export { Badge };
export default Badge;
