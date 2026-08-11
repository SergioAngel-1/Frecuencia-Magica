import type { CSSProperties } from 'react';

/** Un blob circular difuminado a la deriva. */
type Blob = {
  style: CSSProperties;
  gradient: string;
  blur: number;
  animation: string;
};

const BLOBS: readonly Blob[] = [
  {
    style: { top: '-18%', left: '-10%', width: '60vw', height: '60vw' },
    gradient: 'radial-gradient(circle, rgba(150,198,188,0.10), transparent 62%)',
    blur: 30,
    animation: 'fm-drift 34s ease-in-out infinite',
  },
  {
    style: { bottom: '-22%', right: '-8%', width: '55vw', height: '55vw' },
    gradient: 'radial-gradient(circle, rgba(185,176,214,0.10), transparent 62%)',
    blur: 30,
    animation: 'fm-drift 42s ease-in-out infinite reverse',
  },
  {
    style: { top: '30%', left: '55%', width: '40vw', height: '40vw' },
    gradient: 'radial-gradient(circle, rgba(216,185,120,0.08), transparent 60%)',
    blur: 26,
    animation: 'fm-drift 50s ease-in-out infinite',
  },
];

/**
 * Capa de nebulosas: tres blobs difuminados a la deriva bajo una viñeta que
 * oscurece el borde inferior. Decorativa y sin interacción.
 */
export function NebulaLayer() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
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
      <div
        className="absolute inset-0"
        style={{
          // Viñeta que oscurece toda la pantalla. Port del prototipo (líneas
          // 64–69), corregido: con `at 50% 120%` el borde superior de la elipse
          // (el stop oscuro al 100%) caía al 75% de la altura y dejaba el
          // borde inferior sin oscurecer — la oscuridad "se cortaba" y la base
          // del body (void-2 plano) quedaba a la vista como una banda más
          // clara. Con `at 50% 145%` el borde de la elipse coincide con el
          // borde inferior de la pantalla y la viñeta cubre todo el viewport.
          background:
            'radial-gradient(120% 90% at 50% 145%, rgba(15,27,46,0) 40%, rgba(10,18,32,0.85) 100%)',
        }}
      />
    </div>
  );
}
