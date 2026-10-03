import { Section, Specimen, Mono } from '../../components/showcase/Section'
import { BANDS, COVERS } from '../../data/sample'
import { useToken } from '../../hooks/useToken'

const PALETTE = [
  ['void', '--color-void', 'Fondo de la app y de toda superficie oscura.'],
  ['void-2', '--color-void-2', 'Final del degradado de fondo.'],
  ['gold', '--color-gold', 'Acento cálido: bordes, precios, halos.'],
  ['teal', '--color-teal', 'Acento frío: Academia, progreso.'],
  ['lav', '--color-lav', 'Acento sereno: Descúbrete, Experiencias, pasos.'],
  ['ivory', '--color-ivory', 'Texto principal y botón primario.'],
  ['ink', '--color-ink', 'Texto oscuro sobre marfil u oro.'],
  ['warn', '--color-warn', 'Sólo errores de formulario.'],
]

const TIERS = [
  ['text-ivory', '--color-fg', 'Títulos y énfasis', 'text-ivory'],
  ['text-fg-body', '--color-fg-body', 'Párrafos largos', 'text-fg-body'],
  ['text-fg-soft', '--color-fg-soft', 'Descripciones, meta secundaria', 'text-fg-soft'],
  ['text-fg-muted', '--color-fg-muted', 'Apoyo, etiquetas inactivas', 'text-fg-muted'],
  ['text-fg-meta', '--color-fg-meta', 'Kickers y meta mínima (piso AA)', 'text-fg-meta'],
]

function Swatch({ name, variable, use }) {
  const value = useToken(variable)
  return (
    <div className="flex items-center gap-4">
      <span aria-hidden="true" className="border-ivory/20 size-[64px] shrink-0 rounded-full border" style={{ background: `var(${variable})`, boxShadow: `0 0 26px color-mix(in srgb, var(${variable}) 35%, transparent)` }} />
      <div className="flex flex-col gap-[2px]">
        <span className="text-ivory font-serif text-[22px] leading-none">{name}</span>
        <Mono>{value || variable}</Mono>
        <span className="text-fg-muted text-meta font-sans">{use}</span>
      </div>
    </div>
  )
}

function Tier({ label, variable, use, className }) {
  const value = useToken(variable)
  return (
    <div className="border-ivory/10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-3">
      <p className={`${className} text-body font-sans`}>{use}</p>
      <p className="text-fg-meta text-meta tracking-soft font-sans"><span className="text-fg-soft">{label}</span> · {value}</p>
    </div>
  )
}

export function Colors() {
  return (
    <Section id="color" kicker="Fundamentos · color" title="Una paleta cerrada" lead="Ocho colores y cinco peldaños de marfil. Los acentos entran como luz —halos, bordes, brillos—; nunca como relleno sólido grande.">
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {PALETTE.map(([name, variable, use]) => <Swatch key={name} name={name} variable={variable} use={use} />)}
      </div>

      <div className="mt-[clamp(40px,6vw,72px)] grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-2">
        <Specimen title="Cinco peldaños de marfil" note="El texto sobre fondo oscuro usa estos cinco y ninguno por debajo de 55 %: es el piso de contraste AA contra el punto más claro del fondo.">
          <div>{TIERS.map(([label, variable, use, className]) => <Tier key={label} label={label} variable={variable} use={use} className={className} />)}</div>
        </Specimen>

        <Specimen title="Superficies" note="El vidrio astral es marfil al 4.5 % con borde dorado al 20 %. Sobre él se apoyan todas las tarjetas.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="fm-surface rounded-card p-6"><p className="text-ivory font-serif text-[20px]">fm-surface</p><p className="text-fg-muted text-meta mt-1 font-sans">glass + glass-brd + blur 12</p></div>
            <div className="fm-surface-strong rounded-card p-6"><p className="text-ivory font-serif text-[20px]">fm-surface-strong</p><p className="text-fg-muted text-meta mt-1 font-sans">vacío 72 % + blur 22</p></div>
          </div>
        </Specimen>
      </div>

      <div className="mt-[clamp(40px,6vw,72px)] grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-2">
        <Specimen title="Bandas de realm" note="Los gradientes que sustituyen a una imagen mientras no hay fotografía: 150°, un tono desaturado hacia el vacío.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(BANDS).map(([name, band]) => (
              <div key={name} className="border-glass-brd rounded-card flex aspect-[4/3] items-end border p-3" style={{ backgroundImage: band }}>
                <span className="text-ivory text-label tracking-label font-sans uppercase">{name}</span>
              </div>
            ))}
          </div>
        </Specimen>

        <Specimen title="Tintes de portada" note="Los nueve gradientes que visten a cada audio, curso, experiencia y producto. Los únicos hex fuera de la paleta; viven con nombre en config/covers.ts.">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {Object.entries(COVERS).map(([name, cover]) => (
              <div key={name} className="border-glass-brd rounded-card flex aspect-square items-end border p-2" style={{ backgroundImage: cover }}>
                <span className="text-ivory text-label tracking-label font-sans uppercase">{name}</span>
              </div>
            ))}
          </div>
        </Specimen>
      </div>
    </Section>
  )
}
