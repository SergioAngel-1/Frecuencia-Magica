import { Link } from 'react-router-dom'
import { Display, GlassPanel, GradientText, Kicker, OrbitalRings } from '../components/ui'

const DOORS = [
  ['/sistema', 'Sistema de diseño', 'Color, tipografía, superficies, movimiento y los componentes que los usan, leídos en vivo de los tokens de la web.', 'gold'],
  ['/fotografia', 'Dirección fotográfica', 'Las imágenes que faltan: medidas, contenido y un prompt para cada una, listo para un agente de imágenes.', 'teal'],
]

const SOURCES = [
  ['Tokens', 'frontend/src/app/tokens.css'],
  ['Reglas de uso', 'DESIGN.md'],
  ['Realms y bandas', 'frontend/src/config/'],
  ['Slots fotográficos', 'frontend/src/config/editorial-media.ts'],
]

export function Home() {
  return (
    <main className="fm-container relative overflow-hidden py-[clamp(56px,10vw,128px)]">
      <div aria-hidden="true" className="pointer-events-none absolute top-[6%] -right-[8%] opacity-70">
        <OrbitalRings size={520} spin={140} rings={[{ r: 240, stroke: 'rgba(216,185,120,0.14)' }, { r: 190, stroke: 'rgba(185,176,214,0.14)', dash: '1 8' }, { r: 130, stroke: 'rgba(150,198,188,0.14)' }]} />
      </div>

      <div className="relative">
        <Kicker tone="gold" spacing="widest" className="animate-fm-fade-up">Marisol · Frecuencia Mágica</Kicker>
        <Display level="h1" size="hero" className="animate-fm-fade-up mt-5 max-w-[12ch] [animation-delay:.1s]">Una frecuencia, un mismo <GradientText>universo</GradientText></Display>
        <p className="text-fg-body text-lead animate-fm-fade-up mt-7 max-w-[56ch] leading-[1.75] [animation-delay:.25s]">
          Este showcase no tiene un sistema propio: importa los tokens reales de la web y los muestra. Lo que cambie allí, cambia aquí.
        </p>

        <div className="mt-[clamp(40px,7vw,80px)] grid gap-5 md:grid-cols-2">
          {DOORS.map(([to, title, body, tone]) => (
            <Link key={to} to={to} className="group focus-visible:rounded-card-lg">
              <GlassPanel radius={26} className="hover:border-gold/45 flex h-full flex-col gap-4 p-[clamp(24px,3vw,40px)] transition-colors">
                <Kicker tone={tone}>Entrar</Kicker>
                <h2 className="text-ivory group-hover:text-gold font-serif text-[clamp(28px,3.4vw,40px)] leading-[1.05] font-light transition-colors">{title}</h2>
                <p className="text-fg-soft text-body font-sans leading-[1.7]">{body}</p>
              </GlassPanel>
            </Link>
          ))}
        </div>

        <dl className="mt-[clamp(40px,7vw,80px)] grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {SOURCES.map(([label, path]) => (
            <div key={label} className="border-ivory/10 border-t pt-4">
              <dt className="text-fg-meta text-label tracking-label font-sans uppercase">{label}</dt>
              <dd className="text-fg-body text-meta tracking-soft mt-1 font-sans">{path}</dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  )
}
