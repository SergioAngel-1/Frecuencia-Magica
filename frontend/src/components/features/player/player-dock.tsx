'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence } from 'motion/react';
import { div as Mdiv } from 'motion/react-m';

import { IconButton } from '@/components/ui';
import { DURATION, EASE } from '@/config/motion';
import { getAudio } from '@/data';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { resolveAudioCover } from '@/lib/editorial/audio-cover';
import { formatDuration, parseDuration } from '@/lib/format';
import { progressPercent } from '@/lib/player/progress';
import { usePlayerStore } from '@/stores/player-store';

import { AudioCover } from './audio-cover';
import { PlayerBar } from './player-bar';
import { CloseIcon, MinimizeIcon } from './player-icons';
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
  const tResonario = useTranslations('resonario');
  const audioId = usePlayerStore((s) => s.audioId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const elapsed = usePlayerStore((s) => s.elapsed);
  const minimized = usePlayerStore((s) => s.minimized);
  const { setElapsed, toggle, close, next, previous, minimize, expand } = usePlayerStore.getState();

  const wasMinimized = useRef(minimized);
  const focusPending = useRef(false);
  const reduced = useReducedMotionSafe();

  const audio = audioId ? getAudio(audioId) : null;
  // Una pista `soon` no tiene duración; el dock sólo se abre con pistas reproducibles.
  const total = audio?.duration ? parseDuration(audio.duration) : 0;
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
  // que lo deshace, para que el teclado no se quede sin sitio. Se entrega al
  // montarse la forma nueva, cuando la anterior ya ha terminado de salir.
  useEffect(() => {
    if (wasMinimized.current === minimized) return;

    wasMinimized.current = minimized;
    focusPending.current = true;
  }, [minimized]);

  const takeFocus = (node: HTMLDivElement | null) => {
    if (!node || !focusPending.current) return;

    focusPending.current = false;
    node.querySelector<HTMLElement>('[data-player-focus]')?.focus();
  };

  const title = audio ? tResonario(`audios.${audio.id}.title` as 'audios.a1.title') : '';
  const tag = audio ? tResonario(`tags.${audio.tagId}` as 'tags.meditation') : '';
  const elapsedLabel = formatDuration(Math.min(elapsed, total));
  // La misma portada que el disco del audio en cualquier vista. Decorativa:
  // el título ya está escrito al lado (o en el nombre del disco recogido).
  const cover = audio ? (
    <AudioCover media={resolveAudioCover(audio, { alt: '', sizes: '56px' })} scrim={false} />
  ) : null;
  // Las dos formas del dock entran desde abajo y salen hacia abajo; una espera
  // a que la otra termine (`mode="wait"`), así nunca se pisan ni se cortan.
  const motion = {
    initial: { opacity: 0, y: reduced ? 0 : 18 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : DURATION.reveal, ease: EASE.soft },
    },
    exit: {
      opacity: 0,
      y: reduced ? 0 : 14,
      transition: { duration: reduced ? 0 : DURATION.fast * 0.7, ease: EASE.soft },
    },
  };

  return (
    <div
      data-layout-layer="player"
      data-player-state={!audio ? 'closed' : minimized ? 'minimized' : 'expanded'}
      className="min-w-0 flex-1"
    >
      <AnimatePresence mode="wait">
        {!audio ? null : minimized ? (
          <Mdiv key="mini" ref={takeFocus} {...motion} className="flex justify-end">
            <PlayerMini
              hz={audio.hz}
              band={audio.band}
              cover={cover}
              progress={pct}
              label={`${t('expand')} — ${title}${audio.hz !== null ? `, ${audio.hz} Hz` : ''}`}
              onExpand={expand}
            />
          </Mdiv>
        ) : (
          <Mdiv
            key="bar"
            ref={takeFocus}
            {...motion}
            role="region"
            aria-label={t('label')}
            className="fm-surface-strong rounded-card shadow-glow-card pointer-events-auto relative mx-auto w-full max-w-[980px] overflow-hidden"
          >
            {/* La barra es compartida con el reproductor de video: aquí sólo
                se decide qué lleva. En móvil no cabe la barra de posición y
                el avance es su filo superior. */}
            <PlayerBar
              artwork={
                <PlayerOrb band={audio.band} cover={cover} className="size-11 sm:size-[52px]" />
              }
              title={title}
              meta={
                <>
                  {audio.hz !== null ? `${audio.hz} Hz` : tag}
                  <span className="max-md:hidden">{audio.hz !== null ? ` · ${tag}` : null}</span>
                  <span className="md:hidden"> · {elapsedLabel}</span>
                </>
              }
              playing={isPlaying}
              onToggle={toggle}
              onPrevious={previous}
              onNext={next}
              elapsed={elapsed}
              total={total}
              onSeek={setElapsed}
              labels={{
                play: t('play'),
                pause: t('pause'),
                seek: t('seek'),
                previous: t('previous'),
                next: t('next'),
              }}
              actions={
                <>
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
                </>
              }
            />
          </Mdiv>
        )}
      </AnimatePresence>
    </div>
  );
}
