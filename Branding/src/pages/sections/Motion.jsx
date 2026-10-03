import { Section } from '../../components/showcase/Section'
import { Mono } from '../../components/showcase/Section'

// Clases completas y literales: Tailwind sólo genera lo que ve escrito entero.
const MOTION = [
  ['animate-fm-fade-up', '.8s', 'Entrada de contenido: fade-up escalonado (.1s, .25s, .4s, .55s)'],
  ['animate-fm-fade-in', '1s', 'Aparición de capas'],
  ['animate-fm-breathe', '7s', 'Respiración de halos y orbes'],
  ['animate-fm-float', '8s', 'Flotado de discos y objetos'],
  ['animate-fm-float-s', '7s', 'Flotado corto, en bandas y geometría'],
  ['animate-fm-glow', '4s', 'Pulso de luz en estados de carga'],
  ['animate-fm-shimmer', '2.4s', 'Barrido de los skeletons'],
  ['animate-fm-wave-pulse', '1.6s', 'Barras del ecualizador'],
]

export function Motion() {
  return (
    <Section id="movimiento" kicker="Fundamentos · movimiento" title="Nada es estático" tone="teal" lead="El fondo vive, los elementos respiran, flotan u orbitan y nada aparece de golpe. Sólo se anima transform y opacity; con prefers-reduced-motion todo se congela y se conserva la narrativa.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOTION.map(([name, duration, use]) => (
          <div key={name} className="fm-surface rounded-card flex flex-col gap-4 p-5">
            <div className="flex h-[72px] items-center justify-center">
              <span aria-hidden="true" className={`${name} bg-gold/70 shadow-glow-gold block size-[34px] origin-bottom rounded-full`} />
            </div>
            <div className="flex flex-col gap-1">
              <Mono>{name}</Mono>
              <span className="text-ivory font-serif text-[20px] leading-none">{duration}</span>
              <span className="text-fg-muted text-meta font-sans leading-[1.5]">{use}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
