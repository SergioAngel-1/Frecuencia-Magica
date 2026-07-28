import { Skeleton } from './Skeleton';

const colorMap = {
  gold:  { bg: 'rgba(255,170,205,0.18)', ring: 'rgba(255,170,205,0.40)', text: '#FFAACD' },
  teal:  { bg: 'rgba(220,208,255,0.18)', ring: 'rgba(220,208,255,0.40)', text: '#DCD0FF' },
  white: { bg: 'rgba(255,255,255,0.08)', ring: 'rgba(255,255,255,0.20)', text: '#FFFFFF' },
  warm:  { bg: 'rgba(255,218,137,0.10)', ring: 'rgba(255,218,137,0.25)', text: 'rgba(255,218,137,0.80)' },
  cool:  { bg: 'rgba(162,207,254,0.10)', ring: 'rgba(162,207,254,0.25)', text: 'rgba(162,207,254,0.80)' },
};

function LotusIcon({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />
      <circle cx="50" cy="50" r="28" stroke={color} strokeWidth="0.8" strokeOpacity="0.2" />
      <circle cx="50" cy="50" r="7" fill={color} fillOpacity="0.25" />
      {[0, 60, 120, 180, 240, 300].map(angle => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          <ellipse cx="50" cy="22" rx="5" ry="13" stroke={color} strokeWidth="0.8" strokeOpacity="0.5" />
        </g>
      ))}
      {[30, 90, 150, 210, 270, 330].map(angle => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          <ellipse cx="50" cy="30" rx="3.5" ry="9" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />
        </g>
      ))}
    </svg>
  );
}

const sizes = {
  sm: { outer: 'w-20 h-20', inner: 'inset-2',  icon: 56,  text: 'text-[9px]' },
  md: { outer: 'w-28 h-28', inner: 'inset-3',  icon: 72,  text: 'text-[11px]' },
  lg: { outer: 'w-36 h-36', inner: 'inset-3.5',icon: 92,  text: 'text-[13px]' },
};

export function IntenciónCircle({ label, color = 'gold', size = 'md', loading = false, className = '' }) {
  const s = sizes[size] || sizes.md;

  if (loading) {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <Skeleton variant="circle" className={s.outer} />
        <Skeleton variant="text" className="w-16 h-2" />
      </div>
    );
  }

  const { bg, ring, text } = colorMap[color] || colorMap.gold;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className={`${s.outer} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden`}
        style={{ backgroundColor: bg, border: `1.5px solid ${ring}` }}
      >
        <div className={`absolute ${s.inner} rounded-full`} style={{ border: `1px solid ${ring}` }} />
        <LotusIcon color={text} size={s.icon} />
      </div>
      <span className={`${s.text} font-heading text-white/80 text-center leading-tight`}>{label}</span>
    </div>
  );
}

export function IntenciónGrid({ intenciones = [], loading = false, columns = 6, className = '' }) {
  const gridCols = { 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6', 7: 'grid-cols-7' };
  return (
    <div className={`grid ${gridCols[columns] || 'grid-cols-6'} gap-6 justify-items-center ${className}`}>
      {loading
        ? [...Array(columns)].map((_, i) => <IntenciónCircle key={i} loading />)
        : intenciones.map((int, i) => <IntenciónCircle key={i} {...int} />)
      }
    </div>
  );
}

export default IntenciónCircle;
