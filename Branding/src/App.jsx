import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PaletaTipografia from './pages/PaletaTipografia';
import { Header } from './components/ui';

const deliverables = [
  { id: 1, title: 'Design System',       description: 'Paleta de colores, tipografía, tokens y guía del sistema de diseño.',             status: 'Completado',    icon: '✦', path: '/design-system' },
  { id: 2, title: 'Componentes UI',      description: 'Botones, inputs, checkboxes, selects y elementos primitivos reutilizables.',      status: 'Completado',    icon: '◈', path: '/design-system' },
  { id: 3, title: 'Componentes Reales',  description: 'Tarjetas de producto, blog, mentorías, testimonios e intenciones.',               status: 'Completado',    icon: '◎', path: '/design-system' },
  { id: 4, title: 'Logo & Gráficos',     description: 'Versiones del logo, iconografía y elementos decorativos de la marca.',            status: 'Próximamente',  icon: '◇', path: '#' },
  { id: 5, title: 'Fotografía',          description: 'Guía de estilo visual, paleta de filtros y dirección artística.',                 status: 'Próximamente',  icon: '⬡', path: '#' },
  { id: 6, title: 'Componentes Complejos', description: 'Navbar, sistema de reservas, buscador y componentes de alta complejidad.',      status: 'Próximamente',  icon: '⬢', path: '#' },
];

function Home() {
  return (
    <div className="min-h-screen bg-fm-fondo">
      <Header subtitle="JABONES · ESENCIAS · MENTORÍAS" rightLabel="BRAND GUIDELINES" rightDate="JUNIO 2026" />

      <div className="px-10 pt-12 pb-8">
        <p className="text-[11px] tracking-[0.15em] text-white/30 font-body mb-1">ENTREGABLES</p>
        <h2 className="font-heading text-[32px] text-white leading-tight mb-3">
          Kit de <em className="text-fm-primary">branding</em>
        </h2>
        <p className="text-[13px] text-white/45 font-body max-w-2xl leading-relaxed">
          Sistema de diseño completo para Frecuencia Mágica. Colores, tipografía, componentes y guías
          visuales para mantener la identidad de marca a través de todas las plataformas.
        </p>
      </div>

      <div className="px-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {deliverables.map(item => {
            const done = item.status === 'Completado';
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={e => !done && e.preventDefault()}
                className={`bg-fm-surface rounded-xl p-5 border border-fm-border transition-all duration-200 ${done ? 'hover:border-fm-primary/40 hover:shadow-[0_4px_20px_rgba(255,170,205,0.08)] cursor-pointer' : 'opacity-40 cursor-default'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[20px] text-fm-primary font-heading">{item.icon}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-body font-medium tracking-wide text-white/70 ${done ? 'bg-fm-lila/70' : 'bg-fm-border'}`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-base font-heading text-white mb-1.5">{item.title}</h3>
                <p className="text-[12px] text-white/40 font-body leading-relaxed">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      <footer className="px-10 py-8 border-t border-fm-border">
        <p className="text-[11px] text-white/25 font-body text-center">
          Frecuencia Mágica Design System · SERGIOJA · 2026
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/design-system" element={<PaletaTipografia />} />
      </Routes>
    </Router>
  );
}
