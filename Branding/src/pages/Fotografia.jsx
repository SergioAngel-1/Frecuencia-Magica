import { useMemo, useState } from 'react'
import { Section, Specimen, Mono } from '../components/showcase/Section'
import { Badge, Button, Display, GlassPanel, Kicker, MediaSkeleton, Pill } from '../components/ui'
import { DELIVERY, GLOBAL, PRESETS, SAFE, expandAll, formatSize, negativeFor, summarize } from '../data/photography'
import { renderBrief } from '../data/photography-brief'

const PRIORITY_TONE = { P0: 'gold', P1: 'teal', P2: 'lav' }
const FILTERS = ['Todas', 'P0', 'P1', 'P2']

/** Copia al portapapeles; si el navegador lo impide, el texto sigue seleccionable en pantalla. */
function CopyButton({ text, children }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return <Button variant="outline" size="sm" onClick={copy}>{copied ? '✓ Copiado' : children}</Button>
}

function downloadBrief() {
  const url = URL.createObjectURL(new Blob([renderBrief()], { type: 'text/markdown' }))
  const link = Object.assign(document.createElement('a'), { href: url, download: 'brief-fotografico.md' })
  link.click()
  URL.revokeObjectURL(url)
}

function PhotoRow({ row }) {
  const preset = row.preset ? PRESETS[row.preset] : null

  return (
    <GlassPanel as="article" radius={22} className="grid gap-5 p-5 md:grid-cols-[200px_minmax(0,1fr)] md:p-6">
      <div className="flex flex-col gap-3">
        <MediaSkeleton slot={row.slotId.replace('.*', '')} label={row.file} aspect={preset?.ratio ?? '16:9'} animated={false} className="rounded-[14px]" />
        <Mono>{row.file}</Mono>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={PRIORITY_TONE[row.priority]} solid={row.priority === 'P0'}>{row.priority}</Badge>
          {row.realShoot ? <Badge tone="lav">Sesión real</Badge> : null}
          {row.unregistered ? <Badge tone="teal">Sin cablear</Badge> : null}
          <Kicker tone="muted" spacing="tight">{row.view}</Kicker>
        </div>
        <h3 className="text-ivory font-serif text-[clamp(22px,2.6vw,28px)] leading-tight">{row.title ?? row.slotId}</h3>
        <p className="text-fg-body text-body font-sans leading-[1.65]">{row.role}</p>

        <dl className="text-meta tracking-soft grid gap-x-6 gap-y-2 font-sans sm:grid-cols-2">
          <div><dt className="text-fg-meta text-label tracking-label uppercase">Medidas</dt><dd className="text-fg-body">{formatSize(row.size)}{preset ? ` · ${preset.ratio}` : ` · ${row.ratio}`}</dd></div>
          <div><dt className="text-fg-meta text-label tracking-label uppercase">Generar a</dt><dd className="text-fg-body">{preset ? `${preset.generate} y reescalar` : formatSize(row.size)}</dd></div>
          <div><dt className="text-fg-meta text-label tracking-label uppercase">Foco</dt><dd className="text-fg-body">{row.focal}</dd></div>
          <div><dt className="text-fg-meta text-label tracking-label uppercase">Zona de texto</dt><dd className="text-fg-body">{SAFE[row.safe]}</dd></div>
        </dl>

        {row.notes ? <p className="text-fg-soft text-meta border-gold/30 border-l pl-3 font-sans leading-[1.6]">{row.notes}</p> : null}

        <div className="flex flex-col gap-3">
          <p className="bg-void/50 border-ivory/10 text-fg-soft text-meta rounded-[14px] border p-4 font-sans leading-[1.7] select-all">{row.prompt}</p>
          <div className="flex flex-wrap gap-3">
            <CopyButton text={row.prompt}>Copiar prompt</CopyButton>
            <CopyButton text={negativeFor(row)}>Copiar negativo</CopyButton>
          </div>
        </div>
      </div>
    </GlassPanel>
  )
}

export function Fotografia() {
  const [priority, setPriority] = useState('Todas')
  const rows = useMemo(() => expandAll(), [])
  const summary = useMemo(() => summarize(), [])
  const visible = priority === 'Todas' ? rows : rows.filter((row) => row.priority === priority)

  return (
    <main>
      <header className="fm-container pt-[clamp(48px,8vw,104px)] pb-4">
        <Kicker tone="gold" spacing="widest">Dirección fotográfica</Kicker>
        <Display level="h1" size="xl" className="mt-4 max-w-[14ch]">Las imágenes que <em className="text-gold">faltan</em></Display>
        <p className="text-fg-body text-lead mt-6 max-w-[60ch] leading-[1.7]">
          {summary.total} imágenes para los nueve realms, con su medida, su contenido y un prompt para un agente de imágenes. La fotografía es la materia; el motor del mundo, la energía.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Mono>P0 · {summary.byPriority.P0}</Mono><Mono>P1 · {summary.byPriority.P1}</Mono><Mono>P2 · {summary.byPriority.P2}</Mono>
          <Button variant="accent" size="sm" onClick={downloadBrief}>Descargar brief (.md)</Button>
        </div>
      </header>

      <Section id="estilo" kicker="Estilo común" title="Una sola luz" lead="Cada prompt ya termina con este bloque. Se repite aquí para ajustarlo en un solo sitio.">
        <div className="grid gap-6 lg:grid-cols-2">
          <Specimen title="Prompt base">
            <p className="bg-void/50 border-ivory/10 text-fg-soft text-meta rounded-[14px] border p-4 font-sans leading-[1.7] select-all">{GLOBAL.base}</p>
            <div><CopyButton text={GLOBAL.base}>Copiar base</CopyButton></div>
          </Specimen>
          <Specimen title="Prompt negativo">
            <p className="bg-void/50 border-ivory/10 text-fg-soft text-meta rounded-[14px] border p-4 font-sans leading-[1.7] select-all">{GLOBAL.negative}</p>
            <div><CopyButton text={GLOBAL.negative}>Copiar negativo</CopyButton></div>
          </Specimen>
        </div>
        <ul className="text-fg-body text-body mt-8 grid list-disc gap-x-10 gap-y-2 pl-5 font-sans leading-[1.65] lg:grid-cols-2">
          {GLOBAL.rules.map((rule) => <li key={rule}>{rule}</li>)}
        </ul>
      </Section>

      <Section id="medidas" kicker="Medidas" title="Cuatro formatos" tone="teal" lead={`${DELIVERY.formats} Master a 2× el ancho de render máximo (DPR capado a 2); tablet y móvil son derivados para srcset.`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(PRESETS).map((preset) => (
            <GlassPanel key={preset.label} radius={22} className="flex flex-col gap-3 p-5">
              <MediaSkeleton slot={`preset.${preset.ratio}`} label={preset.label} aspect={preset.ratio} animated={false} className="rounded-[12px]" />
              <h3 className="text-ivory font-serif text-[22px] leading-tight">{preset.label}</h3>
              <p className="text-gold font-serif text-[26px] leading-none">{formatSize(preset.master)}</p>
              <p className="text-fg-muted text-meta tracking-soft font-sans leading-[1.6]">Tablet {formatSize(preset.tablet)} · móvil {formatSize(preset.mobile)}<br />Generar a {preset.generate}<br />{preset.budget}</p>
              <p className="text-fg-soft text-meta font-sans leading-[1.5]">{preset.use}</p>
            </GlassPanel>
          ))}
        </div>
      </Section>

      <Section id="imagenes" kicker="Imágenes" title="Una por una" tone="lav" lead="Filtra por prioridad: P0 es marca, P1 conversión e inmersión, P2 atmósfera. Cada fila incluye el prompt completo, listo para pegar.">
        <div className="mb-8 flex flex-wrap gap-3">
          {FILTERS.map((filter) => <Pill key={filter} active={priority === filter} onClick={() => setPriority(filter)}>{filter}</Pill>)}
        </div>
        <div className="flex flex-col gap-5">
          {visible.map((row) => <PhotoRow key={row.id} row={row} />)}
        </div>
      </Section>
    </main>
  )
}
