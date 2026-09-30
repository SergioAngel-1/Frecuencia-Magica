import { Section, Specimen } from '../../components/showcase/Section'
import { Button, CourseCard, EditorialBanner, ExperienceRow, ProductCard, RealmCard, RealmNav } from '../../components/ui'
import { BANDS, courses, experiences, navRealms, price, products, realmCopy } from '../../data/sample'

export function Patterns() {
  const [course] = courses
  const [product, secondProduct] = products
  const [featuredExp, exp] = experiences
  const academy = realmCopy('academia')
  const store = realmCopy('tienda')
  const library = realmCopy('biblioteca')

  return (
    <Section id="patrones" kicker="Patrones · composición" title="Cómo se combinan" tone="lav" lead="Las tarjetas por realm, la banda editorial y la navegación de constelación. Todas viven sobre un placeholder deliberado —gradiente, geometría o zebra—, nunca una caja gris.">
      <div className="flex flex-col gap-[clamp(40px,6vw,72px)]">
        <Specimen title="Realm · destacado, tienda y secundario" note="Academia lleva el panel principal; Tienda conserva el tratamiento de conversión; el resto, una tarjeta con glifo.">
          <div className="flex flex-col gap-5">
            <RealmCard featured band={BANDS.teal} emotion={academy.emotion} title={academy.name} description={academy.description} actionLabel="Entrar a la Academia" />
            <div className="grid gap-5 md:grid-cols-2">
              <RealmCard store band={BANDS.gold} emotion={store.emotion} title={store.name} description={store.description} actionLabel="Ver productos" />
              <RealmCard band={BANDS.mix} emotion={library.emotion} title={library.name} description={library.description} />
            </div>
          </div>
        </Specimen>

        <Specimen title="Tienda · producto" note="Materia arriba, título serif, precio en oro y la acción separada del enlace al detalle.">
          <div className="grid items-start gap-5 md:grid-cols-[1.2fr_1fr]">
            <ProductCard featured slot="store-product-visual" title={product.title} category={product.category} price={price(product.price)} />
            <ProductCard slot="store-product-visual" title={secondProduct.title} category={secondProduct.category} price={price(secondProduct.price)} />
          </div>
        </Specimen>

        <Specimen title="Academia · curso" note="Destacado a todo el ancho y tarjeta cuadrada estándar.">
          <div className="flex flex-col gap-5">
            <CourseCard featured slot="academy.featured-course" title={course.title} level={course.level} lessonsLabel={`${course.lessons} lecciones · ${course.hours}`} description="Cursos que acompañan procesos reales de transformación, a tu propio ritmo." cta="Empezar el curso" />
            <div className="grid gap-5 sm:grid-cols-3">
              {courses.map((item) => <CourseCard key={item.id} slot="academy-course-cover" title={item.title} level={item.level} lessonsLabel={`${item.lessons} lecciones · ${item.hours}`} />)}
            </div>
          </div>
        </Specimen>

        <Specimen title="Experiencias · fila" note="Atmósfera del lugar a la derecha, scrim a la izquierda para el texto; fecha, duración y precio en una columna propia.">
          <div className="flex flex-col gap-5">
            <ExperienceRow featured slot="experiences.featured" title={featuredExp.title} mode={featuredExp.modeLabel} modeLabel="Destacado" date="Sáb 14 Oct" duration={featuredExp.dur} price={price(featuredExp.price)} bookLabel="Reservar" description="Un encuentro en vivo para dejar que el sonido haga su trabajo." />
            <ExperienceRow slot="experiences-visual" title={exp.title} mode={exp.modeLabel} modeLabel={exp.modeLabel} dateLabel="Fecha" date="Sáb 21 Oct" durationLabel="Duración" duration={exp.dur} price={price(exp.price)} bookLabel="Reservar" />
          </div>
        </Specimen>

        <Specimen title="Banda editorial" note="En la web es siempre a sangre de viewport y su texto arranca en el eje de página. Aquí ocupa el ancho del marco.">
          <EditorialBanner slot="home.realms-banner" label="Banda de ejemplo" eyebrow="Los nueve reinos" title="Elige por dónde entrar" body="Cada reino es un lugar, y cada lugar tiene su propia luz." action={<Button variant="glass">Explorar</Button>} />
        </Specimen>

        <Specimen title="Navegación de constelación" note="Un punto de luz por realm. En desktop es una columna cuyo nombre aparece al acercarse; en móvil, una barra con los nombres siempre visibles.">
          <div className="flex flex-wrap items-start gap-10">
            <div className="fm-surface rounded-card p-3"><RealmNav realms={navRealms} current="biblioteca" /></div>
            <RealmNav realms={navRealms} current="academia" layout="bar" />
          </div>
        </Specimen>
      </div>
    </Section>
  )
}
