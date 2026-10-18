import { useEffect, useRef, useState } from 'react'
import { Section, Specimen, Mono } from '../../components/showcase/Section'

// Los cinco temas (DESIGN.md § Atmósferas). Sólo el id y el carácter: los valores
// viven en frontend/src/app/tokens.css y se leen en vivo del bloque de cada muestra.
const ATMOSPHERES = [
  ['night', 'Noche', 'oscuro', 'La v1, sin cambios: estrellas marfil y polen dorado. Portal, Home, Resonario y Santuario la sugieren.'],
  ['dusk', 'Atardecer', 'oscuro cálido', 'Terracota, coral oscuro y ámbar. Brasas que ascienden y titilan. Experiencias lo sugiere.'],
  ['dawn', 'Amanecer', 'claro', 'Azul cielo, marfil y dorado tenue. Motas de luz que derivan. Academia, Tienda y Sobre Marisol lo sugieren.'],
  ['moon', 'Luna', 'oscuro profundo', 'Azul noche y plata. Estrellas plateadas que parpadean y polvo de plata.'],
  ['forest', 'Bosque', 'oscuro, verde', 'Verde natural y luz filtrada. Luciérnagas que pulsan y esporas que caen.'],
]

const ACCENTS = ['--color-accent', '--color-accent-2', '--color-accent-3']

function AtmosphereSample({ id, name, scheme, use }) {
  const ref = useRef(null)
  const [accent, setAccent] = useState('')

  useEffect(() => {
    if (ref.current) setAccent(getComputedStyle(ref.current).getPropertyValue('--color-accent').trim())
  }, [])

  return (
    <div ref={ref} data-atmosphere={id} className="rounded-card-lg border-line flex min-h-[248px] flex-col justify-between gap-6 border p-6" style={{ backgroundImage: 'var(--atmo-bg)' }}>
      <div className="flex flex-col gap-2">
        <Mono>{id}</Mono>
        <h3 className="text-fg font-serif text-[24px] leading-tight">{name}</h3>
        <p className="text-fg-meta text-label tracking-kicker font-sans uppercase">{scheme}</p>
      </div>
      <p className="text-fg-body text-meta font-sans leading-[1.6]">{use}</p>
      <div className="bg-surface border-line rounded-card flex items-center justify-between gap-4 border p-3">
        <span className="text-accent text-meta font-sans">Acento de texto</span>
        <div className="flex items-center gap-2">
          {ACCENTS.map((variable) => (
            <span key={variable} aria-hidden="true" className="size-[14px] rounded-full" style={{ background: `var(${variable})`, boxShadow: `0 0 14px color-mix(in srgb, var(${variable}) 45%, transparent)` }} />
          ))}
        </div>
      </div>
      <Mono>{accent || '--color-accent'}</Mono>
    </div>
  )
}

export function Atmospheres() {
  return (
    <Section id="atmosferas" kicker="Fundamentos · atmósferas" title="Cinco temas, un mismo lenguaje" tone="teal" lead="Un tema es global: cambia la escalera de texto, los acentos, el vidrio, las líneas, el fondo y la escena viva del lienzo en todo el sitio. Las muestras son bloques data-atmosphere: el valor que ves es el del token, leído en vivo.">
      <Specimen title="Los cinco" note="El fondo es el degradado de cada tema; el acento de texto y los tres halos vienen del mismo bloque. Ninguna muestra declara un color propio.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ATMOSPHERES.map(([id, name, scheme, use]) => (
            <AtmosphereSample key={id} id={id} name={name} scheme={scheme} use={use} />
          ))}
        </div>
      </Specimen>
    </Section>
  )
}
