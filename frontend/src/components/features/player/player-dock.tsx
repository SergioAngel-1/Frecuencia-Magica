'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import { IconButton, SeekBar } from '@/components/ui';
import { getAudio } from '@/data';
import { formatDuration, parseDuration } from '@/lib/format';
import { progressPercent } from '@/lib/player/progress';
import { usePlayerStore } from '@/stores/player-store';

import { CloseIcon, MinimizeIcon, NextIcon, PlayPauseIcon, PreviousIcon } from './player-icons';
import { PlayerMini } from './player-mini';
import { PlayerOrb } from './player-orb';

/**
 * Reproductor persistente, al pie de todas las vistas.
 *
 * Tres estados: cerrado (no existe), desplegado (la barra) y recogido (un
 * disco flotante que sigue sonando). Ocultar no es cerrar: recoge el dock
 * para leer sin él delante y conserva la escucha; cerrar la termina. Elegir
 * un audio en cualquier vista vuelve a desplegarlo.
 */
export function PlayerDock() {
  const t = useTranslations('player');
  const lib = useTranslations('library');
  const audioId = usePlayerStore((s) => s.audioId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const elapsed = usePlayerStore((s) => s.elapsed);
  const minimized = usePlayerStore((s) => s.minimized);
  const { setElapsed, toggle, close, next, previous, minimize, expand } = usePlayerStore.getState();

  const rootRef = useRef<HTMLElement>(null);
  const wasMinimized = useRef(minimized);

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

  // Al recoger o desplegar, el control pulsado desaparece: el foco pasa al
  // que lo deshace, para que el teclado no se quede sin sitio.
  useEffect(() => {
    if (wasMinimized.current === minimized) return;

    wasMinimized.current = minimized;
    rootRef.current?.querySelector<HTMLElement>('[data-player-focus]')?.focus();
  }, [minimized]);

  if (!audio) return null;

  const title = lib(`audios.${audio.id}.title` as 'audios.a1.title');
  const tag = lib(`tags.${audio.tagId}` as 'tags.meditation');
  const elapsedLabel = formatDuration(Math.min(elapsed, total));

  return (
    <section
      ref={rootRef}
      aria-label={t('label')}
      data-layout-layer="player"
      data-player-state={minimized ? 'minimized' : 'expanded'}
      className="z-player pointer-events-none fixed inset-x-0 bottom-0 px-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-6 sm:pb-6"
    >
      {minimized ? (
        <PlayerMini
          hz={audio.hz}
          band={audio.band}
          progress={pct}
          label={`${t('expand')} — ${title}, ${audio.hz} Hz`}
          onExpand={expand}
        />
      ) : (
        <div className="fm-surface-strong animate-fm-fade-up rounded-card shadow-glow-card pointer-events-auto relative mx-auto flex w-full max-w-[980px] items-center gap-3 overflow-hidden px-3 py-2 sm:gap-4 sm:px-4 sm:py-3">
          {/* En móvil no cabe la barra de posición: el avance es el filo superior. */}
          <div
            aria-hidden="true"
            className="bg-ivory/10 absolute inset-x-0 top-0 h-[2px] md:hidden"
          >
            <div
              className="bg-gold h-full origin-left"
              style={{ transform: `scaleX(${pct / 100})` }}
            />
          </div>

          <PlayerOrb band={audio.band} className="size-11 sm:size-[52px]" />

          <div className="min-w-0 flex-1 md:w-[210px] md:flex-none">
            <p className="text-ivory text-lead truncate font-serif leading-tight">{title}</p>
            <p className="text-fg-meta text-meta tracking-ui truncate font-sans tabular-nums">
              {audio.hz} Hz
              <span className="max-md:hidden"> · {tag}</span>
              <span className="md:hidden"> · {elapsedLabel}</span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <IconButton
              variant="ghost"
              label={t('previous')}
              onClick={previous}
              className="max-md:hidden"
            >
              <PreviousIcon />
            </IconButton>
            <button
              type="button"
              aria-label={isPlaying ? t('pause') : t('play')}
              onClick={toggle}
              className="border-gold/55 bg-gold/12 text-ivory hover:bg-gold/20 hover:shadow-glow-gold flex size-11 items-center justify-center rounded-full border transition-[background-color,box-shadow] duration-300 sm:size-[52px]"
            >
              <PlayPauseIcon playing={isPlaying} />
            </button>
            <IconButton variant="ghost" label={t('next')} onClick={next} className="max-md:hidden">
              <NextIcon />
            </IconButton>
          </div>

          <div className="text-fg-meta text-meta flex min-w-0 flex-1 items-center gap-3 font-sans tabular-nums max-md:hidden">
            <span>{elapsedLabel}</span>
            <SeekBar
              value={elapsed}
              max={total}
              onChange={setElapsed}
              label={t('seek')}
              valueText={`${elapsedLabel} / ${audio.duration}`}
              className="flex-1"
            />
            <span>{audio.duration}</span>
          </div>

          <div className="flex shrink-0 items-center">
            <IconButton
              variant="ghost"
              label={t('minimize')}
              onClick={minimize}
              data-player-focus
              data-player-action="minimize"
            >
              <MinimizeIcon />
            </IconButton>
            <IconButton variant="ghost" label={t('close')} onClick={close}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      )}
    </section>
  );
}
