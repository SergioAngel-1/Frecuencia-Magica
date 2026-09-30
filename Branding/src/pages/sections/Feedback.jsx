import { Section, Specimen } from '../../components/showcase/Section'
import { Button, EmptyState, OrbitalRings, ProgressBar, Skeleton, SkeletonCard, Stat, StepProgress } from '../../components/ui'

export function Feedback() {
  return (
    <Section id="estado" kicker="Componentes · estado" title="Progreso, carga y vacío" tone="teal" lead="Un estado nunca es un castigo: la carga respira, el vacío invita y el progreso avanza sólo con transform.">
      <div className="grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-2">
        <Specimen title="Progreso" note="Pista translúcida con relleno teal → oro (scaleX). Los pasos completados y el actual van en lavanda.">
          <ProgressBar value={42} ariaLabel="Progreso del curso" />
          <ProgressBar value={78} height={5} ariaLabel="Lección" />
          <StepProgress steps={5} current={2} ariaLabel="Pregunta 3 de 5" />
          <StepProgress variant="labeled" steps={['Fecha', 'Datos', 'Confirmar']} current={1} ariaLabel="Reserva" />
        </Specimen>

        <Specimen title="Cifras" note="Serif con etiqueta en kicker. `hero` (34 px) para la portada; `sanctuary` (40 px) para Mi Santuario.">
          <div className="grid grid-cols-3 gap-6">
            <Stat value="12" label="Días de práctica" />
            <Stat value="34" label="Frecuencias" tone="teal" />
            <Stat value="3" label="Cursos" tone="lav" />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <Stat size="sanctuary" value="12" label="Días de práctica" />
            <Stat size="sanctuary" value="34" label="Frecuencias" tone="teal" />
            <Stat size="sanctuary" value="3" label="Cursos" tone="lav" />
          </div>
        </Specimen>

        <Specimen title="Carga" note="Siluetas con barrido de luz. Nunca un spinner como carga principal.">
          <div className="grid grid-cols-2 gap-6">
            <SkeletonCard />
            <div className="flex flex-col gap-3">
              <Skeleton variant="disc" className="mx-auto w-[120px]" />
              <Skeleton className="h-4 w-2/3 self-center" />
              <Skeleton className="h-3 w-1/2 self-center" />
            </div>
          </div>
        </Specimen>

        <Specimen title="Vacío" note="Una constelación dormida y una invitación, nunca un lamento.">
          <div className="fm-surface rounded-card">
            <EmptyState title="Aún no hay frecuencias guardadas" body="Cuando escuches una, aparecerá aquí." action={<Button variant="accent" size="sm">Explorar la biblioteca</Button>} />
          </div>
        </Specimen>

        <Specimen title="Geometría sagrada" note="Aros concéntricos que giran despacio; `reverse` contrarrota. Decorativa: siempre aria-hidden.">
          <div className="flex flex-wrap items-center gap-8">
            <OrbitalRings size={140} spin={90} rings={[{ r: 98, stroke: 'rgba(216,185,120,0.55)', width: 0.7 }, { r: 76, stroke: 'rgba(185,176,214,0.35)', width: 0.6, dash: '1 7' }]} nodes={[{ angle: -90, radius: 98, color: 'var(--color-gold)', size: 6 }]} />
            <OrbitalRings size={140} spin={70} reverse rings={[{ r: 98, stroke: 'rgba(150,198,188,0.45)', width: 0.7, dash: '2 10' }, { r: 66, stroke: 'rgba(247,244,234,0.2)', width: 0.6 }]} />
          </div>
        </Specimen>
      </div>
    </Section>
  )
}
