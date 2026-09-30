/**
 * Datos de muestra del showcase. Nada se escribe aquí a mano: los realms, bandas, portadas y el
 * catálogo salen de los módulos de la web, y el copy de `messages/es.json`. Si la web cambia,
 * Branding cambia con ella.
 */
import es from '../../../frontend/messages/es.json'
import { NAV_REALMS, REALMS } from '../../../frontend/src/config/realms.ts'
import { BANDS } from '../../../frontend/src/config/bands.ts'
import { COVERS } from '../../../frontend/src/config/covers.ts'
import { AUDIOS } from '../../../frontend/src/data/audios.ts'
import { COURSES } from '../../../frontend/src/data/courses.ts'
import { EXPERIENCES } from '../../../frontend/src/data/experiences.ts'
import { PRODUCTS } from '../../../frontend/src/data/products.ts'

export { BANDS, COVERS, REALMS, NAV_REALMS }

/** Resuelve una clave de traducción con puntos (`library.audios.a1.title`). */
export function t(key) {
  return key.split('.').reduce((node, part) => node?.[part], es) ?? key
}

export const audios = AUDIOS.map((audio) => ({ ...audio, title: t(audio.titleKey), tag: t(audio.tagKey) }))
export const courses = COURSES.map((course) => ({ ...course, title: t(course.titleKey), level: t(course.levelKey) }))
export const experiences = EXPERIENCES.map((item) => ({ ...item, title: t(item.titleKey), modeLabel: t(item.modeKey) }))
export const products = PRODUCTS.map((product) => ({
  ...product,
  title: t(product.titleKey),
  category: t(product.catKey),
}))

/** Los seis realms de la navegación de constelación, con su nombre traducido. */
export const navRealms = NAV_REALMS.map((realm) => ({ ...realm, name: t(`nav.realms.${realm.id}`) }))

export const realmCopy = (id) => ({
  emotion: t(`nav.emotions.${id}`),
  name: t(`nav.realms.${id}`),
  description: t(`home.realms.descriptions.${id}`),
})

export const price = (amount) => `$${amount}`
