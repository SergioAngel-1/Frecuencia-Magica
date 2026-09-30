'use client';

import { useState, type ReactNode } from 'react';

import {
  Badge,
  Band,
  Button,
  Display,
  EmptyState,
  Equalizer,
  ErrorState,
  Field,
  FrequencyDisc,
  GlassPanel,
  GradientText,
  IconButton,
  Input,
  Kicker,
  LoadingOrb,
  Pill,
  ProgressBar,
  Prose,
  SectionHeading,
  SegmentedControl,
  Skeleton,
  Stat,
  StepProgress,
  Textarea,
} from '@/components/ui';
import { WaveSeparator } from '@/components/world';
import { BANDS } from '@/config/bands';

/**
 * Catálogo interno del UI Kit. Nunca se sirve en producción, así que su copy
 * va en castellano directamente en el componente: es una herramienta de
 * desarrollo, no una vista de producto.
 */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-ivory/10 border-t py-12">
      <Kicker tone="muted" spacing="tight" className="mb-6">
        {title}
      </Kicker>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-8">
      <p className="text-fg-meta text-label tracking-ui mb-3 font-sans">{label}</p>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

const PLAY_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export function KitCatalog() {
  const [tab, setTab] = useState('login');
  const [filter, setFilter] = useState(true);

  return (
    <div className="mx-auto max-w-[1100px] px-[8vw] py-[130px]">
      <Kicker tone="teal" spacing="widest">
        Referencia interna
      </Kicker>
      <Display size="lg" level="h1">
        UI Kit
      </Display>
      <Prose maxWidth={54} className="mt-4">
        Cada primitiva con sus variantes y sus estados. Si una vista necesita algo que no está aquí,
        se añade aquí primero.
      </Prose>

      <Section title="Tipografía">
        <Row label="Kicker · tonos">
          <Kicker tone="gold">Oro</Kicker>
          <Kicker tone="teal">Verde agua</Kicker>
          <Kicker tone="lav">Lavanda</Kicker>
          <Kicker tone="muted">Atenuado</Kicker>
        </Row>
        <Row label="Display · escala">
          <div className="space-y-2">
            <Display size="hero">Hero</Display>
            <Display size="xl">Extra grande</Display>
            <Display size="lg">Grande</Display>
            <Display size="md">Medio</Display>
            <Display size="sm">Pequeño</Display>
            <Display size="xs">Mínimo</Display>
          </div>
        </Row>
        <Row label="Display · cursiva con gradiente">
          <Display size="md">
            Despierta la luz que nunca <GradientText>desapareció.</GradientText>
          </Display>
        </Row>
        <Row label="SectionHeading">
          <div className="w-full">
            <SectionHeading
              kicker="Biblioteca de Frecuencias"
              title="Sonido para volver a ti"
              kickerTone="teal"
              action={
                <Button variant="ghost" size="sm">
                  Ver todo →
                </Button>
              }
            />
          </div>
        </Row>
      </Section>

      <Section title="Botones">
        <Row label="Variantes">
          <Button variant="primary">Primario</Button>
          <Button variant="outline">Contorno</Button>
          <Button variant="glass">Vidrio</Button>
          <Button variant="accent">Acento oro</Button>
          <Button variant="accent" tone="teal">
            Acento teal
          </Button>
          <Button variant="accent" tone="lav">
            Acento lavanda
          </Button>
          <Button variant="ghost">← Volver</Button>
        </Row>
        <Row label="Tamaños">
          <Button size="sm">Pequeño</Button>
          <Button size="md">Medio</Button>
          <Button size="lg">Grande</Button>
        </Row>
        <Row label="Estados">
          <Button>Normal</Button>
          <Button loading>Cargando</Button>
          <Button disabled>Deshabilitado</Button>
          <Button iconRight={PLAY_ICON}>Con icono</Button>
        </Row>
        <Row label="IconButton">
          <IconButton label="Reproducir">{PLAY_ICON}</IconButton>
          <IconButton label="Reproducir" active>
            {PLAY_ICON}
          </IconButton>
        </Row>
      </Section>

      <Section title="Superficies">
        <Row label="GlassPanel · radios y halo">
          <GlassPanel radius={16} className="p-6">
            radio 16
          </GlassPanel>
          <GlassPanel radius={22} className="p-6">
            radio 22
          </GlassPanel>
          <GlassPanel radius={26} glow className="p-6">
            radio 26 · halo
          </GlassPanel>
        </Row>
        <Row label="Badge">
          <Badge solid>Destacado</Badge>
          <Badge tone="teal">Fundamentos</Badge>
          <Badge tone="lav">Presencial</Badge>
        </Row>
        <Row label="Pill">
          <Pill active={filter} onClick={() => setFilter(true)}>
            Todo
          </Pill>
          <Pill active={!filter} onClick={() => setFilter(false)}>
            Meditación
          </Pill>
        </Row>
        <Row label="Band · placeholder de gradiente">
          <Band gradient={BANDS.gold} aspect="square" className="rounded-card w-[180px]" />
          <Band gradient={BANDS.teal} aspect="4/5" className="rounded-card w-[180px]" />
          <Band
            gradient={BANDS.lav}
            aspect="16/8"
            overlay="bottom"
            className="rounded-card w-[280px]"
          >
            <div className="flex h-full items-end p-5">
              <Display size="xs" level="h3">
                Con degradado
              </Display>
            </div>
          </Band>
        </Row>
      </Section>

      <Section title="Formularios">
        <div className="grid max-w-[420px] gap-4">
          <Field label="Correo" htmlFor="kit-email">
            <Input id="kit-email" type="email" placeholder="tu@correo.com" />
          </Field>
          <Field label="Correo" htmlFor="kit-error" error="Ese correo no parece completo.">
            <Input id="kit-error" type="email" defaultValue="hola@" aria-invalid />
          </Field>
          <Field label="Diario" htmlFor="kit-journal">
            <Textarea
              id="kit-journal"
              variant="journal"
              rows={3}
              placeholder="Escribe lo que hoy quiere ser escuchado…"
            />
          </Field>
          <SegmentedControl
            ariaLabel="Modo de acceso"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'login', label: 'Entrar' },
              { value: 'register', label: 'Crear cuenta' },
            ]}
          />
        </div>
      </Section>

      <Section title="Progreso">
        <Row label="ProgressBar">
          <div className="w-[320px]">
            <ProgressBar value={62} ariaLabel="Progreso del curso" />
          </div>
        </Row>
        <Row label="StepProgress">
          <div className="w-full max-w-[420px] space-y-8">
            <StepProgress variant="dashes" steps={5} current={2} ariaLabel="Pregunta 3 de 5" />
            <StepProgress
              variant="labeled"
              steps={['Fecha', 'Datos', 'Listo']}
              current={1}
              ariaLabel="Paso 2 de 3"
            />
          </div>
        </Row>
        <Row label="Stat">
          <Stat value="432 Hz" label="Frecuencia del día" tone="gold" />
          <Stat value="40+" label="Meditaciones" tone="teal" />
          <Stat value="12" label="días de práctica" tone="lav" size="sanctuary" />
        </Row>
      </Section>

      <Section title="Frecuencia">
        <Row label="FrequencyDisc · tres escalas">
          <div className="flex flex-wrap items-end gap-10">
            <FrequencyDisc
              size="sm"
              hz={396}
              band={BANDS.teal}
              title="Raíces Profundas"
              meta="Grounding"
            />
            <FrequencyDisc
              size="md"
              hz={432}
              band={BANDS.gold}
              title="Regreso a la Calma"
              meta="Meditación · 18:00"
              showPlay
              showEqualizer
              ariaLabel="Reproducir Regreso a la Calma, 432 hercios, 18 minutos"
              onClick={() => undefined}
            />
            <FrequencyDisc
              size="lg"
              hz={528}
              band={BANDS.lav}
              title="Luz Interior"
              meta="Frecuencia · 11:20"
              showPlay
              showEqualizer
              active
              ariaLabel="Reproducir Luz Interior, 528 hercios, 11 minutos"
              onClick={() => undefined}
            />
          </div>
        </Row>
        <Row label="Equalizer">
          <Equalizer scale="sm" />
          <Equalizer scale="lg" />
          <Equalizer scale="lg" playing={false} />
        </Row>
        <Row label="WaveSeparator">
          <div className="w-full">
            <WaveSeparator />
          </div>
        </Row>
      </Section>

      <Section title="Estados">
        <Row label="Skeleton">
          <div className="grid w-full max-w-[600px] gap-4">
            <Skeleton variant="text" className="max-w-[280px]" />
            <div className="flex items-center gap-4">
              <Skeleton variant="disc" className="w-[90px]" />
              <Skeleton variant="band" className="h-[90px] flex-1" />
            </div>
            <Skeleton variant="card" className="h-[120px]" />
          </div>
        </Row>
        <Row label="LoadingOrb">
          <LoadingOrb label="Escuchando tu frecuencia…" />
          <LoadingOrb tone="gold" size={100} loading={false} />
        </Row>
        <Row label="EmptyState y ErrorState">
          <div className="grid w-full gap-6 md:grid-cols-2">
            <GlassPanel>
              <EmptyState
                title="Tu carrito espera en silencio."
                action={<Button variant="accent">Explorar la tienda</Button>}
              />
            </GlassPanel>
            <GlassPanel>
              <ErrorState
                tone="warn"
                title="Algo se desalineó"
                body="La frecuencia se perdió un momento. Respira e inténtalo otra vez."
                action={<Button variant="outline">Reintentar</Button>}
              />
            </GlassPanel>
          </div>
        </Row>
      </Section>
    </div>
  );
}
