import { useState } from 'react'
import { Section, Specimen } from '../../components/showcase/Section'
import { AddToCartButton, ArrowLink, Badge, Button, Checkbox, Field, Input, Pill, QuantityCounter, SegmentedControl, Select, Textarea } from '../../components/ui'

const VARIANTS = ['primary', 'outline', 'glass', 'ghost']

export function Controls() {
  const [pill, setPill] = useState('todo')
  const [mode, setMode] = useState('in')
  const [qty, setQty] = useState(2)
  const [added, setAdded] = useState(false)

  return (
    <Section id="controles" kicker="Componentes · controles" title="Acciones y formularios" lead="Hit target mínimo de 44 px, foco dorado visible y un estado de error que vira a terracota sin gritar.">
      <div className="grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-2">
        <Specimen title="Botones" note="Cinco variantes en tres tamaños. `primary` es marfil con tinta; `accent` toma el tono del realm. Con `loading` mantiene el aspecto y bloquea el click.">
          <div className="flex flex-wrap items-center gap-3">
            {VARIANTS.map((variant) => <Button key={variant} variant={variant}>{variant}</Button>)}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="accent" tone="gold">accent · gold</Button>
            <Button variant="accent" tone="teal">accent · teal</Button>
            <Button variant="accent" tone="lav">accent · lav</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">sm</Button>
            <Button size="md">md</Button>
            <Button size="lg">lg</Button>
            <Button loading>Cargando</Button>
            <Button disabled>Deshabilitado</Button>
          </div>
        </Specimen>

        <Specimen title="Píldoras y enlaces" note="Filtros en marfil tenue, oro al activarse. La flecha del enlace es decorativa: el destino lo dice la etiqueta.">
          <div className="flex flex-wrap gap-3">
            {['todo', 'meditación', 'frecuencia', 'descanso'].map((label) => <Pill key={label} active={pill === label} onClick={() => setPill(label)}>{label}</Pill>)}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Meditación</Badge>
            <Badge tone="teal">Fundamentos</Badge>
            <Badge tone="lav">Presencial</Badge>
            <Badge solid>Destacado</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <ArrowLink>Ver todo</ArrowLink>
            <ArrowLink tone="teal">Entrar a la Academia</ArrowLink>
            <ArrowLink tone="lav">Reservar</ArrowLink>
          </div>
        </Specimen>

        <Specimen title="Campos" note="Cristal, borde glass-brd, radio 14 px y 44 px de alto. La etiqueta es un kicker; el error gana sobre la ayuda.">
          <div className="flex flex-col gap-5">
            <Field label="Correo" htmlFor="demo-email" hint="Nunca lo compartimos."><Input type="email" placeholder="tu@correo.com" /></Field>
            <Field label="Contraseña" htmlFor="demo-pass" error="Usa al menos 8 caracteres."><Input type="password" defaultValue="1234" /></Field>
            <Field label="Intención" htmlFor="demo-select"><Select placeholder="Elige un momento" options={[{ value: 'm', label: 'Mañana' }, { value: 'n', label: 'Noche' }]} /></Field>
            <Field label="Diario" htmlFor="demo-journal"><Textarea variant="journal" rows={3} placeholder="Escribe lo que sientes…" /></Field>
          </div>
        </Specimen>

        <Specimen title="Selección y cantidad" note="Conmutador de acceso, casilla con ✓ (único carácter decorativo permitido) y contador con targets de 44 px.">
          <SegmentedControl ariaLabel="Modo" value={mode} onChange={setMode} options={[{ value: 'in', label: 'Entrar' }, { value: 'up', label: 'Crear cuenta' }]} />
          <Checkbox label="Recordarme en este dispositivo" defaultChecked />
          <div className="flex flex-wrap items-center gap-6">
            <QuantityCounter value={qty} onChange={setQty} onRemove={() => setQty(1)} />
            <AddToCartButton added={added} onClick={() => setAdded((value) => !value)} />
          </div>
        </Specimen>
      </div>
    </Section>
  )
}
