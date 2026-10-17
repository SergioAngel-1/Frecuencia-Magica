import { useEffect, useRef, useState } from 'react'
import { Section, Specimen, Mono } from '../../components/showcase/Section'

// Las nueve atmósferas (DESIGN.md § Atmósferas). Sólo el id y el carácter: los valores
// viven en frontend/src/app/tokens.css y se leen en vivo del bloque de cada muestra.
const ATMOSPHERES = [
  ['night', 'Noche cósmica', 'oscuro', 'La v1, sin cambios. Portal, acceso y 404.'],
  ['dusk', 'Atardecer · Descanso', 'oscuro cálido', 'Terracota, coral oscuro y ámbar suave. Sin rojo intenso.'],
  ['dawn', 'Amanecer · Calma de día', 'claro', 'Azul cielo, marfil y dorado tenue sobre agua.'],
  ['moon', 'Luna · Escucha nocturna', 'oscuro profundo', 'Azul noche y plata. Pocas estrellas.'],
  ['forest', 'Bosque · Raíz y agua', 'oscuro, verde', 'Verde natural y luz filtrada. Cascada y helechos.'],
  ['study', 'Estudio · Academia', 'claro', 'Luz para leer, junto a una ventana.'],
  ['store', 'Taller · Tienda', 'claro cálido', 'Arena, crema y verde suave.'],
  ['gathering', 'Encuentro · Experiencias', 'cálido, texto claro', 'Humano y cercano, en un espacio cálido.'],
  ['marisol', 'Luz de Marisol', 'claro cálido', 'Personal, cálido y luminoso.'],
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
    <Section id="atmosferas" kicker="Fundamentos · atmósferas" title="Nueve ambientes, un mismo lenguaje" tone="teal" lead="Cada atmósfera redefine la escalera de texto, los acentos, el vidrio, las líneas y el fondo. Las muestras son bloques data-atmosphere: el valor que ves es el del token, leído en vivo.">
      <Specimen title="Las nueve" note="El fondo es el degradado de cada atmósfera; el acento de texto y los tres halos vienen del mismo bloque. Ninguna muestra declara un color propio.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ATMOSPHERES.map(([id, name, scheme, use]) => (
            <AtmosphereSample key={id} id={id} name={name} scheme={scheme} use={use} />
          ))}
        </div>
      </Specimen>
    </Section>
  )
}
