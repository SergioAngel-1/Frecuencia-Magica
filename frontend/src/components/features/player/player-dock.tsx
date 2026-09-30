'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import { usePlayerStore } from '@/stores/player-store';
import { getAudio } from '@/data';
import { progressPercent } from '@/lib/player/progress';
import { parseDuration } from '@/lib/format';
import { cn } from '@/lib/cn';

export function PlayerDock() {
  const t = useTranslations('player');
  const lib = useTranslations('library');
  const audioId = usePlayerStore((s) => s.audioId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const elapsed = usePlayerStore((s) => s.elapsed);
  const setElapsed = usePlayerStore((s) => s.setElapsed);
  const toggle = usePlayerStore((s) => s.toggle);
  const close = usePlayerStore((s) => s.close);
  const next = usePlayerStore((s) => s.next);

  const inputRef = useRef<HTMLInputElement>(null);

  const audio = audioId ? getAudio(audioId) : null;
  const total = audio ? parseDuration(audio.duration) : 0;
  const pct = progressPercent(elapsed, total);

  useEffect(() => {
    if (!isPlaying || !audio) return;

    // TODO(backend): reproducción simulada con un temporizador. Sustituir por
    // un HTMLAudioElement (timeupdate/ended) cuando existan los ficheros de audio.
    const interval = setInterval(() => {
      setElapsed((elapsed) => elapsed + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, audio, setElapsed]);

  useEffect(() => {
    if (audio && elapsed >= total) {
      next();
    }
  }, [elapsed, total, audio, next]);

  if (!audio) return null;

  const title = lib(`audios.${audio.id}.title` as 'audios.a1.title');

  return (
    <div
      data-layout-layer="player"
      className="fixed inset-x-0 bottom-0 z-[180] px-3 pt-0 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-4"
    >
      <div
        className="border-glass-brd mx-auto flex w-full max-w-[920px] items-center gap-3 rounded-[20px] border px-3 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-[22px] sm:gap-5 sm:px-5 sm:py-[14px]"
        style={{ background: 'rgba(15,27,46,0.72)' }}
      >
        {/* Miniatura */}
        <div
          aria-hidden="true"
          className="animate-fm-breathe size-11 shrink-0 rounded-[14px] sm:size-14"
          style={{
            backgroundImage: audio.band,
          }}
        >
          <div
            aria-hidden="true"
            className="size-full"
            style={{
              background:
                'radial-gradient(70% 80% at 32% 22%, rgba(247,244,234,0.24), transparent 62%)',
            }}
          />
        </div>

        {/* Texto */}
        <div className="min-w-0 flex-1">
          <p className="text-ivory text-lead truncate font-serif sm:text-[19px]">{title}</p>
          <p className="text-fg-meta text-label tracking-ui font-sans">{audio.hz} Hz</p>
        </div>

        {/* Play/Pause */}
        <button
          type="button"
          aria-label={isPlaying ? t('pause') : t('play')}
          onClick={toggle}
          className="text-ivory hover:border-gold/70 flex size-[52px] shrink-0 items-center justify-center rounded-full border transition-colors"
          style={{ borderColor: 'rgba(216,185,120,0.55)', background: 'rgba(216,185,120,0.12)' }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="translate-x-[6%]"
          >
            {isPlaying ? (
              <>
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </>
            ) : (
              <path d="M8 5v14l11-7z" />
            )}
          </svg>
        </button>

        {/* Barra de progreso */}
        <div className="hidden min-w-[120px] flex-[1.4] md:block">
          <input
            ref={inputRef}
            type="range"
            min={0}
            max={total}
            value={Math.min(elapsed, total)}
            onChange={(e) => setElapsed(Number(e.target.value))}
            aria-label={t('seek')}
            className={cn(
              'h-11 w-full cursor-pointer touch-pan-y appearance-none rounded-[3px]',
              '[&::-webkit-slider-runnable-track]:bg-ivory/14 [&::-webkit-slider-runnable-track]:h-[5px] [&::-webkit-slider-runnable-track]:rounded-[3px]',
              '[&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:mt-[-5px] [&::-webkit-slider-thumb]:size-[15px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
              '[&::-moz-range-track]:bg-ivory/14 [&::-moz-range-track]:h-[5px] [&::-moz-range-track]:rounded-[3px]',
              '[&::-moz-range-thumb]:bg-gold [&::-moz-range-thumb]:size-[15px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0',
            )}
            style={{
              background: `linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold) ${pct}%, rgba(247,244,234,0.14) ${pct}%, rgba(247,244,234,0.14) 100%)`,
            }}
          />
        </div>

        {/* Cerrar */}
        <button
          type="button"
          aria-label={t('close')}
          onClick={close}
          className="text-fg-meta hover:text-ivory flex size-11 shrink-0 items-center justify-center"
        >
          ×
        </button>
      </div>
    </div>
  );
}
