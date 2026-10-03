/** Une clases descartando lo falsy. Branding no necesita resolver conflictos de Tailwind. */
export function cn(...parts) {
  return parts.flat(Infinity).filter(Boolean).join(' ')
}
