import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, Input, Checkbox, Select, Textarea, Badge, Header,
  Skeleton, SkeletonCard,
  BannerCarousel, ProductCard, ProductGrid,
  BlogCard, BlogGrid, VideoCard, VideoGrid,
  CategoryCard, CategoryGrid,
  MentoriaCard, MentoriaGrid,
  TestimonioCard, TestimonioGrid,
  IntenciónCircle, IntenciónGrid,
  QuantityCounter, AddToCartButton,
} from '../components/ui';

const products = [
  { id: 1, name: 'Jabón de Lavanda', price: '24.000', badge: 'ARTESANAL', rating: 4.8, reviews: 214, image: 'https://picsum.photos/seed/lavender-soap/400/300' },
  { id: 2, name: 'Esencia de Rosa Mosqueta', price: '38.000', originalPrice: '45.000', badge: 'OFERTA', rating: 4.9, reviews: 187, image: 'https://picsum.photos/seed/rosehip-oil/400/300' },
  { id: 3, name: 'Kit Ritual Mensual', price: '89.000', badge: 'PREMIUM', rating: 5.0, reviews: 93, image: 'https://picsum.photos/seed/ritual-kit/400/300' },
  { id: 4, name: 'Jabón de Menta y Cacao', price: '22.000', badge: 'NATURAL', rating: 4.7, reviews: 156, image: 'https://picsum.photos/seed/mint-cacao-soap/400/300' },
];

const posts = [
  { id: 1, title: 'El poder de las intenciones conscientes', excerpt: 'Cada ritual comienza con una intención clara. Aprende a establecer tu campo energético antes de tu práctica diaria de bienestar.', category: 'Consciencia', author: 'Marisol Núñez', date: '15 Jun 2026', readTime: '5 min', image: 'https://picsum.photos/seed/intention-ritual/600/400' },
  { id: 2, title: 'Jabones artesanales: más que limpieza', excerpt: 'Los ingredientes naturales en nuestros jabones van más allá del cuerpo. Cada fórmula lleva una intención de sanación incorporada.', category: 'Ritual', author: 'Marisol Núñez', date: '8 Jun 2026', readTime: '4 min', image: 'https://picsum.photos/seed/artisan-soap-ritual/600/400' },
  { id: 3, title: 'Transforma tu relación con el tiempo libre', excerpt: 'El descanso no es inactividad. Es el espacio donde el alma procesa, integra y se prepara para el siguiente ciclo de expansión.', category: 'Transformación', author: 'Marisol Núñez', date: '1 Jun 2026', readTime: '6 min', image: 'https://picsum.photos/seed/rest-transformation/600/400' },
];

const videos = [
  { id: 1, title: 'Meditación de 10 minutos para iniciar tu día', channel: 'Frecuencia Mágica', views: '12.4K', publishedAt: 'hace 3 días', duration: '10:24', thumbnail: 'https://picsum.photos/seed/meditation-fm/600/400' },
  { id: 2, title: 'Cómo hacer tu jabón artesanal en casa', channel: 'Frecuencia Mágica', views: '8.7K', publishedAt: 'hace 1 semana', duration: '22:15', thumbnail: 'https://picsum.photos/seed/soap-making/600/400' },
  { id: 3, title: 'Ritual de luna llena: limpieza energética', channel: 'Frecuencia Mágica', views: '21.3K', publishedAt: 'hace 2 semanas', duration: '35:48', thumbnail: 'https://picsum.photos/seed/full-moon-ritual/600/400' },
];

const testimonios = [
  { name: 'Carolina Vásquez', role: 'Emprendedora', quote: 'La mentoría con Marisol transformó por completo mi relación con el trabajo. No solo crecí profesionalmente, sino que encontré un equilibrio que no sabía que era posible.', rating: 5, program: 'Programa 8 Sesiones' },
  { name: 'Daniela Moreno', role: 'Artista visual', quote: 'Los jabones de Frecuencia Mágica son una experiencia sensorial completa. Cada vez que los uso siento que estoy haciendo algo sagrado por mí misma.', rating: 5, program: 'Tienda' },
  { name: 'Valentina Cruz', role: 'Psicóloga', quote: 'El programa de 4 sesiones me dio herramientas concretas y al mismo tiempo un espacio de profunda exploración personal. 100% recomendado.', rating: 5, program: 'Programa 4 Sesiones' },
];

const intenciones = [
  { label: 'Amor propio', color: 'gold' },
  { label: 'Claridad', color: 'teal' },
  { label: 'Sanación', color: 'warm' },
  { label: 'Abundancia', color: 'gold' },
  { label: 'Paz interior', color: 'cool' },
  { label: 'Gratitud', color: 'teal' },
];

const categorias = [
  { label: 'Jabones', color: 'gold',   image: 'https://picsum.photos/seed/soaps-category/400/300' },
  { label: 'Esencias', color: 'teal',  image: 'https://picsum.photos/seed/essences-category/400/300' },
  { label: 'Kits', color: 'warm',      image: 'https://picsum.photos/seed/kits-category/400/300' },
  { label: 'Rituales', color: 'cool',  image: 'https://picsum.photos/seed/rituals-category/400/300' },
];

const programas = [
  {
    title: 'Sesión Única',
    subtitle: 'Para empezar',
    price: '$180.000',
    priceLabel: 'por sesión',
    duration: '1 sesión · 90 minutos',
    type: 'sesion',
    features: ['Diagnóstico inicial profundo', 'Plan de acción personalizado', 'Grabación de la sesión', 'Material de apoyo digital'],
  },
  {
    title: '4 Sesiones',
    subtitle: 'Más popular',
    price: '$640.000',
    priceLabel: 'por programa',
    duration: '4 sesiones · 90 min c/u',
    type: 'programa4',
    featured: true,
    features: ['Todo de Sesión Única', 'Seguimiento entre sesiones', 'Acceso a recursos exclusivos', 'Comunidad de acompañamiento', 'Sesión de cierre y proyección'],
  },
  {
    title: '8 Sesiones',
    subtitle: 'Transformación profunda',
    price: '$1.200.000',
    priceLabel: 'por programa',
    duration: '8 sesiones · 90 min c/u',
    type: 'programa8',
    features: ['Todo de 4 Sesiones', 'Acceso ilimitado por WhatsApp', 'Kit de bienvenida físico', '2 sesiones de emergencia', 'Certificado de proceso'],
  },
];

function ColorCard({ name, hex, usage }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const lightHexes = ['#FFFFFF', '#FFD6E0', '#C8F0E0', '#F0E8FF', '#FFF0B5', '#FFE5C8', '#E5D9F2', '#D0E8F0'];
  const isLight = lightHexes.includes(hex);
  return (
    <div className="rounded-xl overflow-hidden border border-fm-border hover:border-fm-primary/40 transition-all duration-200 cursor-pointer group" onClick={handleCopy}>
      <div className="h-24 flex items-end p-3" style={{ backgroundColor: hex }}>
        <span className={`text-[9px] font-body tracking-widest transition-opacity ${copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ color: isLight ? '#4A4A55' : '#4A4A55' }}>
          {copied ? '✓ COPIADO' : 'COPIAR HEX'}
        </span>
      </div>
      <div className="p-3 bg-fm-surface">
        <p className="font-heading text-[15px] text-white">{name}</p>
        <p className="text-[11px] text-white/50 font-body">{hex}</p>
        {usage && <p className="text-[10px] text-fm-primary/70 font-body mt-1">{usage}</p>}
      </div>
    </div>
  );
}

function Section({ id, number, title, children }) {
  return (
    <section id={id} className="py-10 border-t border-fm-border">
      <div className="flex items-baseline gap-3 mb-8 px-0">
        <span className="text-[11px] tracking-[0.2em] text-white/25 font-body">{number}</span>
        <h3 className="font-heading text-[22px] text-white">{title}</h3>
        <div className="flex-1 h-px bg-fm-border ml-2" />
      </div>
      {children}
    </section>
  );
}

function Label({ children }) {
  return <p className="text-[9px] tracking-[0.15em] text-white/30 font-body uppercase mb-2">{children}</p>;
}

function TemplateTable({ rows }) {
  return (
    <div className="bg-fm-surface rounded-xl border border-fm-border overflow-hidden">
      {rows.map((r, i) => (
        <div key={i} className={`flex items-center gap-4 px-5 py-3 ${i < rows.length - 1 ? 'border-b border-fm-border/50' : ''}`}>
          <span className="text-[10px] text-white/25 font-body w-12 shrink-0">{r.size}</span>
          <span className="text-white/60 font-body text-[11px] w-24 shrink-0">{r.weight}</span>
          <span className="text-white/40 font-body text-[11px] w-28 shrink-0">{r.leading}</span>
          <span className="text-white/80 font-body text-[11px] w-20 shrink-0">{r.tracking}</span>
          <span className="text-[11px] text-white/50 font-body">{r.usage}</span>
        </div>
      ))}
    </div>
  );
}

export default function PaletaTipografia() {
  const [qtyValue, setQtyValue] = useState(1);
  const [checkA, setCheckA] = useState(false);
  const [checkB, setCheckB] = useState(true);
  const [toggle, setToggle] = useState(true);

  return (
    <div className="min-h-screen bg-fm-fondo text-white">
      <Header subtitle="DESIGN SYSTEM" rightLabel="BRAND GUIDELINES" rightDate="JUNIO 2026" rightAuthor="SERGIOJA" />

      <div className="px-10 pt-5">
        <Link to="/" className="inline-flex items-center gap-2 text-[11px] text-white/40 hover:text-fm-primary font-body transition-colors duration-200">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Volver al inicio
        </Link>
      </div>

      <div className="px-10 pt-6 pb-10">
        <p className="text-[10px] tracking-[0.25em] text-white/25 font-body mb-2">FRECUENCIA MÁGICA</p>
        <h1 className="font-heading text-[48px] leading-tight mb-3">
          Identidad <em className="text-fm-primary">visual</em>
        </h1>
        <p className="text-[14px] text-white/45 font-body max-w-xl leading-relaxed">
          Elegancia espiritual contemporánea. Sistema de diseño que refleja la profundidad, la transformación y la belleza consciente de la marca.
        </p>
      </div>

      <div className="px-10 grid grid-cols-2 gap-16 pb-10">

        <div>
          <Section number="01" title="Paleta de color">
            <p className="text-[11px] text-white/30 font-body mb-4 leading-relaxed">
              Paleta pastel — colores suaves que transmiten calidez, luminosidad y serenidad.
              Amarillo y azul como principales, complementados con tonos pastel secundarios.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <ColorCard name="Rosa pálido" hex="#FFCDDC" usage="Fondo suave / tarjetas" />
              <ColorCard name="Rosa" hex="#FFAACD" usage="Acento principal" />
              <ColorCard name="Lila" hex="#DCD0FF" usage="Acento secundario" />
              <ColorCard name="Lavanda" hex="#E3E4FA" usage="Fondo / overlays" />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <ColorCard name="Durazno" hex="#FFDA89" usage="Estrellas / badges" />
              <ColorCard name="Menta" hex="#AAF0D1" usage="Badges / naturales" />
              <ColorCard name="Azul pastel" hex="#A2CFFE" usage="Enlaces / etiquetas" />
              <ColorCard name="Celeste" hex="#B0E0E6" usage="Acento frío" />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="rounded-lg h-8" style={{ background: '#2A2A2E' }} title="Fondo #2A2A2E" />
              <div className="rounded-lg h-8" style={{ background: '#353539' }} title="Surface #353539" />
              <div className="rounded-lg h-8" style={{ background: '#404046' }} title="Border #404046" />
              <div className="rounded-lg h-8" style={{ background: 'rgba(255,170,205,0.15)' }} title="Rosa/15%" />
            </div>
            <p className="text-[10px] text-white/25 font-body mt-2">Fondo · Surface · Border · Énfasis rosa</p>

            <div className="mt-6 bg-fm-surface rounded-xl p-4 border border-fm-border">
              <p className="text-[9px] tracking-[0.15em] text-fm-rosa/70 font-body uppercase mb-2">Uso recomendado</p>
              <ul className="space-y-1 text-[11px] text-white/50 font-body leading-relaxed">
                <li><span className="text-fm-rosa">●</span> Rosa (<code className="text-white/70">#FFAACD</code>) — Botones principales, enlaces, acentos hero</li>
                <li><span className="text-fm-lila">●</span> Lila (<code className="text-white/70">#DCD0FF</code>) — Botones secundarios, backgrounds sutiles</li>
                <li><span className="text-fm-durazno">●</span> Durazno (<code className="text-white/70">#FFDA89</code>) — Estrellas, badges de oferta, iconos cálidos</li>
                <li><span className="text-fm-azul">●</span> Azul (<code className="text-white/70">#A2CFFE</code>) — Badges fríos, etiquetas de categoría, hover links</li>
                <li><span className="text-fm-menta">●</span> Menta (<code className="text-white/70">#AAF0D1</code>) — Badges natural/artesanal, acentos frescos</li>
              </ul>
            </div>
          </Section>

          <Section number="02" title="Tipografía">
            <p className="text-[11px] text-white/30 font-body mb-4 leading-relaxed">
              Combinación de tres familias tipográficas que equilibran elegancia clásica, legibilidad moderna y
              un toque decorativo sofisticado.
            </p>

            {/* ── Cormorant Garamond (Headings) ── */}
            <div className="mb-8">
              <Label>Heading — Cormorant Garamond</Label>
              <div className="bg-fm-surface rounded-xl p-5 border border-fm-border">
                <div className="space-y-1">
                  <p className="font-heading text-[44px] text-white leading-none">Frecuencia Mágica</p>
                  <p className="font-heading text-[36px] italic text-fm-rosa leading-none">Rosa pastel</p>
                </div>
                <div className="mt-4 pt-4 border-t border-fm-border">
                  <p className="text-[11px] text-white/35 font-body mb-3">Jerarquía completa de titulares</p>
                  <div className="space-y-2">
                    <div><span className="text-[9px] text-white/20 font-body mr-3">48px</span><span className="font-heading text-[48px] text-white leading-tight">H1 — Título principal</span></div>
                    <div><span className="text-[9px] text-white/20 font-body mr-3">36px</span><span className="font-heading text-[36px] text-white/90 leading-tight">H2 — Secciones grandes</span></div>
                    <div><span className="text-[9px] text-white/20 font-body mr-3">28px</span><span className="font-heading text-[28px] text-white/80 leading-snug">H3 — Bloques de contenido</span></div>
                    <div><span className="text-[9px] text-white/20 font-body mr-3">22px</span><span className="font-heading text-[22px] text-white/70 leading-snug">H4 — Tarjetas y módulos</span></div>
                    <div><span className="text-[9px] text-white/20 font-body mr-3">18px</span><span className="font-heading text-[18px] text-white/60 leading-normal">H5 — Subtítulos de componente</span></div>
                    <div><span className="text-[9px] text-white/20 font-body mr-3">15px</span><span className="font-heading text-[15px] text-white/50 leading-normal">H6 — Métricas y etiquetas</span></div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-fm-border">
                  <p className="text-[11px] text-white/35 font-body mb-2">Variantes itálicas y decorativas</p>
                  <p className="font-heading text-[28px] italic text-fm-rosa/80">Eleva tu consciencia</p>
                  <p className="font-heading text-[20px] italic text-white/60">Rituales de bienestar</p>
                  <p className="font-heading text-[16px] text-white/50">Jabones · Esencias · Mentorías</p>
                  <p className="font-heading text-[13px] text-white/35 tracking-[0.15em]">TRANSFORMACIÓN PERSONAL</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {[300, 400, 500, 600, 700].map(w => (
                  <span key={w} className="text-[10px] text-white/30 font-body bg-fm-surface px-2 py-1 rounded border border-fm-border" style={{ fontFamily: 'Cormorant Garamond', fontWeight: w }}>
                    {w}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Inter (Body) ── */}
            <div className="mb-8">
              <Label>Body — Inter</Label>
              <div className="bg-fm-surface rounded-xl p-5 border border-fm-border">
                <div className="space-y-1.5">
                  <p className="font-body text-[18px] text-white/90">Cuerpo principal — 18px Regular</p>
                  <p className="font-body text-[16px] text-white/80">Lectura general — 16px Regular</p>
                  <p className="font-body text-[14px] text-white/70">Párrafo y descripciones — 14px Regular</p>
                  <p className="font-body text-[13px] text-white/60">Texto de interfaz — 13px Medium</p>
                  <p className="font-body text-[12px] text-white/50">Metadatos, fechas — 12px Regular</p>
                  <p className="font-body text-[11px] text-white/40">Cuerpo legal, notas — 11px Regular</p>
                  <p className="font-body text-[10px] tracking-[0.15em] text-white/30">ETIQUETAS · CATEGORÍAS · 10px Tracking</p>
                  <p className="font-body text-[9px] tracking-[0.2em] text-white/25">MICRO · BADGES · 9px Tracking</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {[300, 400, 500, 600, 700].map(w => (
                  <span key={w} className="text-[10px] text-white/30 font-body bg-fm-surface px-2 py-1 rounded border border-fm-border" style={{ fontWeight: w }}>
                    {w}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Playfair Display (Acento) ── */}
            <div className="mb-8">
              <Label>Acento decorativo — Playfair Display</Label>
              <div className="bg-fm-surface rounded-xl p-5 border border-fm-border">
                <p className="font-accent text-[32px] text-fm-rosa/90 leading-tight italic">Espiritualidad consciente</p>
                <p className="font-accent text-[22px] text-fm-lila/80 leading-snug">Transformación personal</p>
                <p className="font-accent text-[18px] text-white/60 leading-normal">Rituales de bienestar integral</p>
                <p className="font-accent text-[14px] text-white/40 leading-relaxed tracking-wider uppercase">EL ARTE DE SANAR</p>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {[400, 600, 700].map(w => (
                  <span key={w} className="text-[10px] text-white/30 font-body bg-fm-surface px-2 py-1 rounded border border-fm-border" style={{ fontFamily: 'Playfair Display', fontWeight: w }}>
                    {w} {w === 400 ? 'Regular' : w === 600 ? 'Semibold' : 'Bold'}
                  </span>
                ))}
                <span className="text-[10px] text-white/30 font-body bg-fm-surface px-2 py-1 rounded border border-fm-border" style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 400 }}>
                  Italic
                </span>
              </div>
            </div>

            {/* ── Tabla de especificaciones ── */}
            <div>
              <Label>Especificaciones técnicas</Label>
              <TemplateTable
                rows={[
                  { size: '48/52', weight: 'Heading 700', leading: '1.08', tracking: '-0.02em', usage: 'Hero principal — una sola línea' },
                  { size: '36/40', weight: 'Heading 600', leading: '1.11', tracking: '-0.01em', usage: 'Títulos de sección' },
                  { size: '28/34', weight: 'Heading 600', leading: '1.21', tracking: '0', usage: 'Bloques de contenido' },
                  { size: '22/28', weight: 'Heading 500', leading: '1.27', tracking: '0', usage: 'Tarjetas, módulos' },
                  { size: '18/26', weight: 'Body 400', leading: '1.44', tracking: '0', usage: 'Cuerpo grande / lectura' },
                  { size: '16/24', weight: 'Body 400', leading: '1.50', tracking: '0', usage: 'Lectura general' },
                  { size: '14/22', weight: 'Body 400', leading: '1.57', tracking: '0', usage: 'Párrafo / descripciones' },
                  { size: '12/18', weight: 'Body 400', leading: '1.50', tracking: '+0.01em', usage: 'Metadatos / fechas' },
                  { size: '10/14', weight: 'Body 500', leading: '1.40', tracking: '+0.08em', usage: 'Badges / etiquetas' },
                  { size: '9/12', weight: 'Body 600', leading: '1.33', tracking: '+0.15em', usage: 'Micro / tracking alto' },
                ]}
              />
            </div>

            {/* ── Guía de uso ── */}
            <div className="mt-6 bg-fm-surface rounded-xl p-4 border border-fm-border">
              <p className="text-[9px] tracking-[0.15em] text-fm-rosa/70 font-body uppercase mb-2">Guía de uso tipográfico</p>
              <ul className="space-y-1.5 text-[11px] text-white/50 font-body leading-relaxed">
                <li><span className="text-fm-rosa">◆</span> <strong className="text-white/70">Cormorant Garamond</strong> — Titulares, números destacados, citas grandes, nav. Transmite elegancia atemporal y espiritualidad.</li>
                <li><span className="text-fm-lila">◆</span> <strong className="text-white/70">Inter</strong> — Cuerpo, formularios, botones, etiquetas, precios. Garantiza legibilidad en pantalla y neutralidad funcional.</li>
                <li><span className="text-fm-durazno">◆</span> <strong className="text-white/70">Playfair Display</strong> — Acentos decorativos, citas en blog, títulos de testimonio, elementos de marca. Uso moderado y solo en italic o regular decorativo.</li>
                <li><span className="text-fm-azul">◆</span> <strong className="text-white/70">Regla de jerarquía</strong> — Un titular + cuerpo + acento decorativo. No mezclar más de dos fuentes en un mismo bloque.</li>
                <li><span className="text-fm-menta">◆</span> <strong className="text-white/70">Tracking</strong> — Usar tracking positivo (+0.08em a +0.2em) solo en textos muy pequeños (&le;10px) y mayúsculas.</li>
              </ul>
            </div>
          </Section>
        </div>

        <div id="componentes">
          <Section number="03" title="Componentes UI">

            <div className="mb-8">
              <Label>Botones</Label>
              <div className="flex flex-wrap gap-3 mb-3">
                <Button variant="primary">Reservar sesión</Button>
                <Button variant="secondary">Explorar</Button>
                <Button variant="outline">Ver más</Button>
                <Button variant="ghost">Cancelar</Button>
                <Button variant="surface">Compartir</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm">Pequeño</Button>
                <Button variant="primary" size="md">Mediano</Button>
                <Button variant="primary" size="lg">Grande</Button>
                <Button variant="primary" disabled>Deshabilitado</Button>
              </div>
            </div>

            <div className="mb-8">
              <Label>Etiquetas</Label>
              <div className="flex flex-wrap gap-2">
                {['RITUAL','ARTESANAL','CONSCIENCIA','BIENESTAR','TRANSFORMACIÓN','PREMIUM'].map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-[9px] font-body font-medium tracking-wide bg-fm-surface border border-fm-border text-white/70 hover:border-fm-primary/40 transition-colors cursor-default">
                    {t}
                  </span>
                ))}
                <span className="px-3 py-1 rounded-full text-[9px] font-body font-medium bg-fm-primary text-fm-carbon">NUEVO</span>
                <span className="px-3 py-1 rounded-full text-[9px] font-body font-medium bg-fm-secondary text-fm-carbon">ARTESANAL</span>
              </div>
            </div>

            <div className="mb-8">
              <Label>Badges avatar</Label>
              <div className="flex gap-3 flex-wrap items-end">
                <Badge text="FM" variant="primary" size="sm" />
                <Badge text="MN" variant="secondary" size="md" />
                <Badge text="R" variant="outline" size="lg" />
                <Badge text="K" variant="surface" size="xl" />
                <Badge text="✦" variant="dark" size="xl" />
              </div>
            </div>

            <div className="mb-8">
              <Label>Callouts</Label>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,170,205,0.08)', border: '1px solid rgba(255,170,205,0.20)' }}>
                  <span className="text-fm-rosa text-[16px] leading-none mt-0.5">✦</span>
                  <p className="text-[12px] text-white/70 font-body leading-relaxed">Tu sesión de mentoría incluye grabación y material de apoyo exclusivo.</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(220,208,255,0.08)', border: '1px solid rgba(220,208,255,0.20)' }}>
                  <span className="text-fm-lila text-[16px] leading-none mt-0.5">◎</span>
                  <p className="text-[12px] text-white/70 font-body leading-relaxed">Los jabones artesanales están elaborados con ingredientes 100% naturales.</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-fm-surface border border-fm-border">
                  <span className="text-white/30 text-[16px] leading-none mt-0.5">◇</span>
                  <p className="text-[12px] text-white/50 font-body leading-relaxed">Los envíos se procesan dentro de 3-5 días hábiles.</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <Label>Divisores</Label>
              <div className="space-y-4">
                <hr className="border-fm-border" />
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-fm-border" />
                  <span className="font-heading italic text-[16px] text-fm-rosa">FM</span>
                  <div className="flex-1 h-px bg-fm-border" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-fm-border" />
                  <span className="text-[9px] tracking-[0.2em] text-white/25 font-body">FRECUENCIA MÁGICA</span>
                  <div className="flex-1 h-px bg-fm-border" />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <Label>Formularios</Label>
              <div className="space-y-3">
                <Input label="Correo electrónico" placeholder="hola@frecuenciamagica.co" />
                <Input label="Teléfono" placeholder="+57 300 000 0000" helperText="Formato internacional" />
                <Input label="Campo con error" placeholder="nombre@correo.co" value="usuario@@invalido" error="Ingresa un correo válido" onChange={() => {}} />
                <Input label="Campo deshabilitado" placeholder="No disponible" disabled value="campo bloqueado" onChange={() => {}} />
                <Select
                  label="Servicio de interés"
                  options={[
                    { value: 'jabones', label: 'Jabones artesanales' },
                    { value: 'esencias', label: 'Esencias florales' },
                    { value: 'mentoria', label: 'Mentoría personal' },
                    { value: 'newsletter', label: 'Newsletter' },
                  ]}
                  placeholder="Selecciona un servicio..."
                />
                <Textarea label="Mensaje" placeholder="¿En qué puedo acompañarte?" rows={3} />
              </div>
            </div>

            <div className="mb-8">
              <Label>Selección</Label>
              <div className="space-y-3">
                <Checkbox label="Acepto recibir información sobre productos y servicios" checked={checkA} onChange={e => setCheckA(e.target.checked)} />
                <Checkbox label="Quiero suscribirme al newsletter mensual de Marisol" checked={checkB} onChange={e => setCheckB(e.target.checked)} />
                <Checkbox label="Opción deshabilitada" disabled />
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => setToggle(!toggle)}
                    className={`w-11 h-6 rounded-full transition-all duration-300 relative ${toggle ? 'bg-fm-primary' : 'bg-fm-border'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${toggle ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                  </button>
                  <span className="text-[13px] text-white/70 font-body">Notificaciones de reserva</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <Label>Skeleton loading</Label>
              <SkeletonCard />
            </div>

            <div className="mb-8">
              <Label>Carrito</Label>
              <div className="flex items-center gap-4 flex-wrap">
                <QuantityCounter value={qtyValue} onChange={setQtyValue} onRemove={() => setQtyValue(1)} />
                <AddToCartButton size="md" />
              </div>
            </div>

          </Section>
        </div>
      </div>

      <div id="reales" className="border-t border-fm-border">
        <div className="px-10 py-10">
          <div className="flex items-baseline gap-3 mb-10">
            <span className="text-[11px] tracking-[0.2em] text-white/25 font-body">04</span>
            <h3 className="font-heading text-[22px] text-white">Componentes reales</h3>
            <div className="flex-1 h-px bg-fm-border ml-2" />
          </div>

          <div className="mb-14">
            <Label>Banner carousel</Label>
            <BannerCarousel />
          </div>

          <div className="mb-14">
            <Label>Productos — Loading skeleton</Label>
            <ProductGrid loading columns={4} />
            <p className="text-[10px] text-white/25 font-body mt-3 mb-6">↑ Estado de carga</p>
            <Label>Productos — Datos reales</Label>
            <ProductGrid products={products} columns={4} />
          </div>

          <div className="mb-14">
            <Label>Programas de mentoría</Label>
            <MentoriaGrid programas={programas} />
          </div>

          <div className="mb-14">
            <Label>Reflexiones — Loading skeleton</Label>
            <BlogGrid loading columns={3} />
            <p className="text-[10px] text-white/25 font-body mt-3 mb-6">↑ Estado de carga</p>
            <Label>Reflexiones — Datos reales</Label>
            <BlogGrid posts={posts} columns={3} />
          </div>

          <div className="mb-14">
            <Label>Videos</Label>
            <VideoGrid videos={videos} columns={3} />
          </div>

          <div className="mb-14">
            <Label>Testimonios — Loading skeleton</Label>
            <TestimonioGrid loading columns={3} />
            <p className="text-[10px] text-white/25 font-body mt-3 mb-6">↑ Estado de carga</p>
            <Label>Testimonios — Datos reales</Label>
            <TestimonioGrid testimonios={testimonios} columns={3} />
          </div>

          <div className="mb-14">
            <Label>Intenciones espirituales</Label>
            <IntenciónGrid intenciones={intenciones} columns={6} />
          </div>

          <div className="mb-14">
            <Label>Categorías</Label>
            <CategoryGrid categories={categorias} columns={4} className="max-w-none" />
          </div>

          <div className="mb-10">
            <Label>Tarjetas individuales</Label>
            <div className="grid grid-cols-3 gap-5">
              <ProductCard {...products[0]} />
              <BlogCard {...posts[0]} />
              <TestimonioCard {...testimonios[0]} />
            </div>
          </div>
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
