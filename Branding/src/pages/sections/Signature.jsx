import { Section, Specimen } from '../../components/showcase/Section'
import { Equalizer, FrequencyDisc } from '../../components/ui'
import { audios } from '../../data/sample'

export function Signature() {
  const [a1, a2, a3] = audios

  return (
    <Section id="firma" kicker="Componentes · pieza identitaria" title="El disco de frecuencia" tone="gold" lead="Es el objeto del producto. En Biblioteca no hay una rejilla de tarjetas: son discos. Tres escalas, una sola implementación.">
      <div className="grid items-end gap-[clamp(24px,4vw,56px)] md:grid-cols-[150px_190px_minmax(0,1fr)]">
        <Specimen title="sm" note="150 px · flotante">
          <FrequencyDisc size="sm" hz={a3.hz} band={a3.band} title={a3.title} meta={a3.tag} />
        </Specimen>
        <Specimen title="md" note="190 px · rejilla de Home">
          <FrequencyDisc size="md" hz={a2.hz} band={a2.band} title={a2.title} meta={`${a2.tag} · ${a2.duration}`} showPlay />
        </Specimen>
        <Specimen title="lg · activo" note="380 px · destacado; lleva ecualizador. `active` vira aros y borde a oro.">
          <FrequencyDisc size="lg" hz={a1.hz} band={a1.band} title={a1.title} meta={`${a1.tag} · ${a1.duration}`} showPlay showEqualizer active />
        </Specimen>
      </div>
      <Specimen className="mt-[clamp(32px,5vw,56px)]" title="Ecualizador" note="Seis barras con retardos desordenados a propósito: no suben en ola, parecen sonido real. Decorativo; el estado real lo dice el botón de play.">
        <div className="flex items-end gap-10">
          <Equalizer scale="sm" />
          <Equalizer scale="lg" />
          <Equalizer scale="lg" playing={false} />
        </div>
      </Specimen>
    </Section>
  )
}
