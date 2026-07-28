const variants = {
  text:   'h-3 rounded',
  title:  'h-5 rounded w-3/4',
  circle: 'rounded-full',
  rect:   'rounded-xl',
};

export function Skeleton({ variant = 'text', width, height, className = '', ...props }) {
  const baseStyle = variants[variant] || variants.text;
  const inlineStyle = {};
  if (width) inlineStyle.width = width;
  if (height) inlineStyle.height = height;

  return (
    <div
      className={`bg-white/8 animate-pulse ${baseStyle} ${className}`}
      style={inlineStyle}
      {...props}
    />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-fm-surface rounded-xl p-5 border border-fm-border ${className}`}>
      <Skeleton variant="rect" className="w-full h-[140px] mb-4" />
      <Skeleton variant="text" className="w-1/3 h-2 mb-2" />
      <Skeleton variant="title" className="mb-2" />
      <Skeleton variant="text" className="w-full mb-1" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
  );
}

export function SkeletonCarousel({ className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Skeleton variant="rect" className="w-full h-[320px] rounded-2xl" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <Skeleton variant="circle" className="w-2 h-2" />
        <Skeleton variant="circle" className="w-2 h-2" />
        <Skeleton variant="circle" className="w-2 h-2" />
      </div>
    </div>
  );
}

export default Skeleton;
