import type { CSSProperties } from 'react';

import type { VisualMode } from '@/config/realms';
import { useEngineProfile } from '@/hooks/use-engine-profile';
import { useThemeCrossfade, slotStyle } from '@/hooks/use-theme-crossfade';
import { useThemeFade } from '@/hooks/use-theme-fade';

/** Un blob circular difuminado a la deriva. Su color es `--nebula-a|b|c` del tema activo y su fuerza, `--nebula-boost`. */
type Blob = {
  style: CSSProperties;
  gradient: string;
  blur: number;
  animation: string;
};

const BLOBS: readonly Blob[] = [
  {
    style: { top: '-18%', left: '-10%', width: '60vw', height: '60vw' },
    gradient:
      'radial-gradient(circle, rgb(var(--nebula-a) / calc(0.1 * var(--nebula-boost))), transparent 62%)',
    blur: 30,
    animation: 'fm-drift 34s ease-in-out infinite',
  },
  {
    style: { bottom: '-22%', right: '-8%', width: '55vw', height: '55vw' },
    gradient:
      'radial-gradient(circle, rgb(var(--nebula-b) / calc(0.1 * var(--nebula-boost))), transparent 62%)',
    blur: 30,
    animation: 'fm-drift 42s ease-in-out infinite reverse',
  },
  {
    style: { top: '30%', left: '55%', width: '40vw', height: '40vw' },
    gradient:
      'radial-gradient(circle, rgb(var(--nebula-c) / calc(0.08 * var(--nebula-boost))), transparent 60%)',
    blur: 26,
    animation: 'fm-drift 50s ease-in-out infinite',
  },
];

/**
 * Capa de nebulosas: tres blobs difuminados a la deriva bajo una viñeta que
 * oscurece el borde inferior. Decorativa y sin interacción.
 */
export function NebulaLayer({ visualMode = 'cosmic' }: { visualMode?: VisualMode }) {
  const { nebula } = useEngineProfile(visualMode);
  const fade = useThemeFade('engine');

  return (
    <div
      aria-hidden="true"
      className="z-atmosphere pointer-events-none fixed inset-0 overflow-hidden"
      style={{ opacity: nebula, transition: `opacity ${fade}s ease-in-out` }}
    >
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            ...blob.style,
            background: blob.gradient,
            filter: `blur(${blob.blur}px)`,
            animation: blob.animation,
          }}
        />
      ))}
      <Vignette />
    </div>
  );
}

/**
 * Viñeta que oscurece toda la pantalla. Se pinta con `--scrim` y `--scrim-deep`, que
 * cambian de golpe con el tema de `<html>`: sobre una sola capa, la viñeta (85 % de
 * opacidad en el borde) saltaría al color del tema nuevo antes de que fundiera nada, como
 * una pantalla entera del tema final. Va en dos capas (`useThemeCrossfade`), cada una con
 * los tokens de su tema, y funde con el resto.
 */
function Vignette() {
  const vignette = useThemeCrossfade('vignette');

  return (
    <>
      {vignette.slots.map((slot, index) => (
        <div
          key={`${index}-${slot.key}`}
          data-atmosphere={slot.id}
          className="absolute inset-0"
          style={{
            // Viñeta que oscurece toda la pantalla. Port del prototipo (líneas
            // 64–69), corregido: con `at 50% 120%` el borde superior de la elipse
            // (el stop oscuro al 100%) caía al 75% de la altura y dejaba el
            // borde inferior sin oscurecer — la oscuridad "se cortaba" y la base
            // del body (void-2 plano) quedaba a la vista como una banda más
            // clara. Con `at 50% 145%` el borde de la elipse coincide con el
            // borde inferior de la pantalla y la viñeta cubre todo el viewport.
            // El velo es el de la atmósfera: en la noche, el navy de siempre
            // (`--scrim` y `--scrim-deep`); en una clara, el velo claro, que no
            // ensucia el fondo a gris.
            background:
              'radial-gradient(120% 90% at 50% 145%, rgb(var(--scrim) / 0) 40%, rgb(var(--scrim-deep) / 0.85) 100%)',
            ...slotStyle(slot, index === vignette.top),
          }}
        />
      ))}
    </>
  );
}
