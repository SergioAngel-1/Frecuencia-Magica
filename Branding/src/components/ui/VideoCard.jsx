import { useState } from 'react';
import { Skeleton } from './Skeleton';

export function VideoCard({ thumbnail, title, channel, channelAvatar, views, publishedAt, duration, loading = false, className = '' }) {
  const [isHovered, setIsHovered] = useState(false);

  if (loading) {
    return (
      <div className={`bg-fm-surface rounded-xl overflow-hidden border border-fm-border ${className}`}>
        <div className="relative">
          <Skeleton variant="rect" className="w-full h-[140px]" />
          <Skeleton variant="rect" className="absolute bottom-2 right-2 w-12 h-5 rounded" />
        </div>
        <div className="p-4">
          <div className="flex gap-3">
            <Skeleton variant="circle" className="w-9 h-9 shrink-0" />
            <div className="flex-1">
              <Skeleton variant="title" className="mb-2" />
              <Skeleton variant="text" className="w-3/4 mb-1" />
              <Skeleton variant="text" className="w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const initials = channel?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className={`bg-fm-surface rounded-xl overflow-hidden border border-fm-border hover:border-fm-primary/40 hover:shadow-[0_8px_30px_rgba(255,170,205,0.10)] transition-all duration-200 cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[140px] overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-fm-carbon/0 group-hover:bg-fm-carbon/20 transition-colors duration-300" />
        {duration && (
          <span className="absolute bottom-2 right-2 bg-fm-carbon/90 text-white px-1.5 py-0.5 rounded text-[10px] font-body">
            {duration}
          </span>
        )}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-12 h-12 rounded-full bg-fm-rosa/90 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-fm-carbon ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-3">
          {channelAvatar ? (
            <img src={channelAvatar} alt={channel} className="w-9 h-9 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-fm-lila/30 border border-fm-lila/40 flex items-center justify-center text-fm-lila text-[10px] font-heading shrink-0">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-heading text-[15px] text-white mb-1 leading-tight line-clamp-2 group-hover:text-fm-primary transition-colors duration-200">{title}</h4>
            <p className="text-[11px] text-white/45 font-body">{channel}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-body">
              <span>{views} vistas</span>
              <span>·</span>
              <span>{publishedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VideoGrid({ videos = [], loading = false, columns = 3 }) {
  const gridCols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };
  return (
    <div className={`grid ${gridCols[columns] || 'grid-cols-3'} gap-5`}>
      {loading
        ? [...Array(columns)].map((_, i) => <VideoCard key={i} loading />)
        : videos.map(v => <VideoCard key={v.id} {...v} />)
      }
    </div>
  );
}

export default VideoCard;
