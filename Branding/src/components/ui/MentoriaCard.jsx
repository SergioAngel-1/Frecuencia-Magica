import { Skeleton } from './Skeleton';

const typeColors = {
  sesion:    { accent: '#FFAACD', bg: 'rgba(255,170,205,0.08)',  border: 'rgba(255,170,205,0.20)', textDark: true },
  programa4: { accent: '#DCD0FF', bg: 'rgba(220,208,255,0.08)',  border: 'rgba(220,208,255,0.20)', textDark: true },
  programa8: { accent: '#FFDA89', bg: 'rgba(255,218,137,0.06)',  border: 'rgba(255,218,137,0.15)', textDark: true },
};

function CheckIcon({ color, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function MentoriaCard({ title, subtitle, price, priceLabel, duration, features = [], type = 'sesion', featured = false, loading = false, onBook, className = '' }) {
  if (loading) {
    return (
      <div className={`bg-fm-surface rounded-2xl overflow-hidden border border-fm-border p-6 ${className}`}>
        <Skeleton variant="text" className="w-24 h-2 mb-3" />
        <Skeleton variant="title" className="mb-1" />
        <Skeleton variant="text" className="w-3/4 mb-6" />
        <Skeleton variant="rect" className="w-20 h-8 mb-6" />
        {[0,1,2].map(i => <Skeleton key={i} variant="text" className="w-full mb-2" />)}
        <Skeleton variant="rect" className="w-full h-10 mt-6" />
      </div>
    );
  }

  const { accent, bg, border, textDark } = typeColors[type] || typeColors.sesion;
  const btnTextColor = textDark ? '#2A2A2E' : '#FFFFFF';

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] ${featured ? 'scale-[1.02]' : ''} ${className}`}
      style={{ backgroundColor: bg, borderColor: border }}
    >
      {featured && (
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      )}

      <div className="p-6">
        <p className="text-[9px] tracking-[0.25em] font-body mb-2 uppercase" style={{ color: accent }}>
          {subtitle}
        </p>
        <h3 className="font-heading text-[22px] text-white leading-tight mb-4">{title}</h3>

        <div className="mb-6">
          <span className="font-heading text-[32px] leading-none" style={{ color: accent }}>{price}</span>
          {priceLabel && <span className="text-[11px] text-white/40 font-body ml-2">{priceLabel}</span>}
          {duration   && <p className="text-[11px] text-white/40 font-body mt-1">{duration}</p>}
        </div>

        {features.length > 0 && (
          <ul className="space-y-2.5 mb-6">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-white/70 font-body">
                <span className="shrink-0 mt-0.5"><CheckIcon color={accent} /></span>
                {f}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onBook}
          className="w-full py-3 rounded-xl font-heading text-[13px] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          style={{ backgroundColor: accent, color: btnTextColor }}
        >
          Reservar sesión
        </button>
      </div>
    </div>
  );
}

export function MentoriaGrid({ programas = [], loading = false, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {loading
        ? [0,1,2].map(i => <MentoriaCard key={i} loading />)
        : programas.map((p, i) => <MentoriaCard key={i} {...p} />)
      }
    </div>
  );
}

export default MentoriaCard;
