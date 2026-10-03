import { Colors } from './sections/Colors'
import { Controls } from './sections/Controls'
import { Feedback } from './sections/Feedback'
import { Motion } from './sections/Motion'
import { Patterns } from './sections/Patterns'
import { Signature } from './sections/Signature'
import { Surfaces } from './sections/Surfaces'
import { Typography } from './sections/Typography'
import { Display } from '../components/ui/Display'
import { Kicker } from '../components/ui/Kicker'

const INDEX = [
  ['color', 'Color'],
  ['tipografia', 'Tipografía'],
  ['superficies', 'Superficies'],
  ['movimiento', 'Movimiento'],
  ['controles', 'Controles'],
  ['estado', 'Estado'],
  ['firma', 'Disco'],
  ['patrones', 'Patrones'],
]

export function DesignSystem() {
  return (
    <main>
      <header className="fm-container pt-[clamp(48px,8vw,104px)] pb-4">
        <Kicker tone="gold" spacing="widest">Sistema de diseño</Kicker>
        <Display level="h1" size="xl" className="mt-4 max-w-[16ch]">Un mismo <em className="text-gold">lenguaje</em></Display>
        <p className="text-fg-body text-lead mt-6 max-w-[58ch] leading-[1.7]">
          Todo lo que ves importa los tokens de la web: el color, la escala, los radios y las animaciones se leen en vivo de <span className="text-fg-soft">frontend/src/app/tokens.css</span>. Si el token cambia allí, cambia aquí.
        </p>
        <nav aria-label="Secciones" className="mt-8 flex flex-wrap gap-x-6 gap-y-1">
          {INDEX.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="text-label tracking-caps text-fg-soft hover:text-ivory inline-flex min-h-11 items-center font-sans uppercase">{label}</a>
          ))}
        </nav>
      </header>
      <Colors />
      <Typography />
      <Surfaces />
      <Motion />
      <Controls />
      <Feedback />
      <Signature />
      <Patterns />
    </main>
  )
}
