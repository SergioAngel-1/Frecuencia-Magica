import { Section, Specimen, Mono } from '../../components/showcase/Section'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { MediaSkeleton } from '../../components/ui/MediaSkeleton'
import { useToken } from '../../hooks/useToken'

// Clases completas y literales, para que Tailwind las genere.
const RADII = [
  ['rounded-field', '--radius-field', 'Campos de formulario', 'rounded-field'],
  ['rounded-card', '--radius-card', 'Tarjetas estándar', 'rounded-card'],
  ['rounded-card-lg', '--radius-card-lg', 'Tarjetas destacadas y paneles', 'rounded-card-lg'],
  ['rounded-pill', '--radius-pill', 'Botones, pills, badges', 'rounded-pill'],
]

const GLOWS = [
  ['shadow-glow-gold', 'shadow-glow-gold'],
  ['shadow-glow-teal', 'shadow-glow-teal'],
  ['shadow-glow-lav', 'shadow-glow-lav'],
  ['shadow-glow-card', 'shadow-glow-card'],
]

function Radius({ name, variable, use, className }) {
  const value = useToken(variable)
  return (
    <div className="flex items-center gap-4">
      <div className={`fm-surface size-[72px] shrink-0 ${className}`} />
      <div className="flex flex-col gap-[2px]">
        <span className="text-ivory font-serif text-[20px] leading-none">{name}</span>
        <Mono>{value}</Mono>
        <span className="text-fg-muted text-meta font-sans">{use}</span>
      </div>
    </div>
  )
}

function PageAxis() {
  const inset = useToken('--page-inset')
  const max = useToken('--container-max')
  return (
    <div className="border-ivory/15 relative overflow-hidden rounded-[14px] border">
      <div className="bg-void-2/60 flex h-[110px] items-stretch px-[8%]">
        <div className="border-gold/40 bg-gold/8 flex flex-1 items-center justify-center border-x border-dashed">
          <span className="text-gold text-label tracking-label font-sans uppercase">fm-container</span>
        </div>
      </div>
      <p className="text-fg-muted text-meta tracking-soft px-4 py-3 font-sans">
        Margen <Mono>--page-inset</Mono>: {inset || '…'} (24 px → 8vw → 10vw) · ancho máximo <Mono>{max || '…'}</Mono>. Héroes, bandas y contenido arrancan en el mismo eje.
      </p>
    </div>
  )
}

export function Surfaces() {
  return (
    <Section id="superficies" kicker="Fundamentos · superficies" title="Cristal, luz y eje" tone="lav" lead="Las formas son suaves y las superficies translúcidas. El acento nunca rellena: brilla. Todo arranca en el mismo margen de página.">
      <div className="grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-2">
        <Specimen title="Radios" note="Cuatro radios con nombre; los 16/18/20 de GlassPanel son ajustes de componente.">
          <div className="flex flex-col gap-5">
            {RADII.map(([name, variable, use, className]) => <Radius key={name} name={name} variable={variable} use={use} className={className} />)}
          </div>
        </Specimen>

        <Specimen title="Halos" note="El oro, el teal y la lavanda como luz: sombras de 24 px al 25 %, y un halo de tarjeta de 60 px al 18 %.">
          <div className="grid grid-cols-2 gap-6">
            {GLOWS.map(([name, className]) => (
              <GlassPanel key={name} radius={22} className={`${className} flex h-[88px] items-center justify-center`}>
                <Mono>{name}</Mono>
              </GlassPanel>
            ))}
          </div>
        </Specimen>

        <Specimen title="Eje de página" note="`--page-inset` + `fm-container`. FullBleedSection y EditorialBanner son siempre a sangre; su texto vuelve al eje.">
          <PageAxis />
        </Specimen>

        <Specimen title="Skeleton editorial «zebra»" note="Todo slot sin fotografía muestra bandas de la paleta y un barrido de luz. Ángulo y fase salen del id del slot: dos bandas nunca son la misma textura. Nunca cajas grises.">
          <div className="grid grid-cols-3 gap-3">
            <MediaSkeleton slot="home.hero" label="Zebra 16:9" aspect="16:9" className="rounded-card" />
            <MediaSkeleton slot="library.featured" label="Zebra 16:8" aspect="16:8" tone="teal" className="rounded-card" />
            <MediaSkeleton slot="home-marisol-portrait" label="Zebra 3:4" aspect="3:4" tone="lav" className="rounded-card" />
          </div>
        </Specimen>
      </div>
    </Section>
  )
}
