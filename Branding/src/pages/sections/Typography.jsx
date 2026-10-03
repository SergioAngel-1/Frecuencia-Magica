import { Section, Specimen, Mono } from '../../components/showcase/Section'
import { Display, GradientText } from '../../components/ui/Display'

const DISPLAY = [
  ['hero', 'clamp(46, 8vw, 104) · 0.98', 'Portal, Home'],
  ['xl', 'clamp(46, 6.2vw, 86) · 1', 'Cabeceras de realm'],
  ['feature', 'clamp(38, 6vw, 78) · 0.92', 'Destacados'],
  ['lg', 'clamp(36, 5.5vw, 72) · 1', 'Bandas editoriales'],
  ['md', 'clamp(30, 4.4vw, 56) · 1.05', 'Secciones'],
  ['sm', 'clamp(28, 3.6vw, 46) · 1.05', 'Subsecciones'],
  ['xs', 'clamp(28, 4vw, 44) · 1.05', 'Estados y resultados'],
]

const SANS = [
  ['text-label', '11 px', 'Sólo kickers y labels, en MAYÚSCULAS y con tracking ≥ .14em', 'uppercase tracking-label'],
  ['text-meta', '13 px', 'Fechas, conteos, apoyo', 'tracking-ui'],
  ['text-body', '15 px', 'Texto corrido y UI', ''],
  ['text-lead', '17 px', 'Entradillas y descripciones destacadas', ''],
]

// Las clases van completas (no `tracking-${name}`): Tailwind sólo genera lo que ve escrito entero.
const TRACKING = [
  ['tracking-soft', '.05em', 'Botones serif, navegación'],
  ['tracking-ui', '.10em', 'Pills, meta sans'],
  ['tracking-label', '.14em', 'Stats y labels de apoyo'],
  ['tracking-caps', '.20em', 'Badges y enlaces con flecha'],
  ['tracking-kicker', '.30em', 'Kicker estándar'],
  ['tracking-eyebrow', '.40em', 'Cabeceras de realm'],
]

export function Typography() {
  return (
    <Section id="tipografia" kicker="Fundamentos · tipografía" title="Dos voces" tone="teal" lead="Cormorant Garamond para lo que se siente —títulos, cifras, precios, lo poético—; Jost para lo que se usa —kickers, etiquetas, interfaz—. El cuerpo va en peso 300.">
      <div className="grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-2">
        <Specimen title="Display (Cormorant Garamond 300)" note="Siete tamaños, todos fluidos. `Display` fija escala e interlineado; el elemento semántico lo elige `level`.">
          <div className="flex flex-col gap-5">
            {DISPLAY.map(([size, spec, use]) => (
              <div key={size} className="border-ivory/10 border-b pb-4">
                <Display level="p" size={size} className="truncate">Vuelve a <GradientText>ti</GradientText></Display>
                <p className="text-fg-meta text-meta tracking-soft mt-2 font-sans"><span className="text-fg-soft">{size}</span> · {spec} · {use}</p>
              </div>
            ))}
          </div>
        </Specimen>

        <div className="flex flex-col gap-[clamp(32px,5vw,56px)]">
          <Specimen title="Sans (Jost 300)" note="Cuatro peldaños con nombre. Nada de `text-[Npx]` suelto.">
            <div>
              {SANS.map(([name, size, use, extra]) => (
                <div key={name} className="border-ivory/10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-3">
                  <p className={`${name} ${extra} text-fg-body font-sans`}>Respira hondo</p>
                  <p className="text-fg-meta text-meta tracking-soft font-sans"><span className="text-fg-soft">{name}</span> · {size} · {use}</p>
                </div>
              ))}
            </div>
          </Specimen>

          <Specimen title="Tracking" note="Seis peldaños. Los kickers usan label, kicker o eyebrow.">
            <div className="flex flex-col gap-3">
              {TRACKING.map(([name, value, use]) => (
                <div key={name} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className={`text-label text-gold font-sans uppercase ${name}`}>Frecuencia</p>
                  <Mono>{name} · {value} · {use}</Mono>
                </div>
              ))}
            </div>
          </Specimen>
        </div>
      </div>
    </Section>
  )
}
