import { Button } from './Button'

const BAG = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M5 8h14l-1 12H6L5 8zM9 8a3 3 0 0 1 6 0" />
  </svg>
)

/** Acción de tienda: outline en reposo, acento dorado al añadir. */
export function AddToCartButton({ children = 'Añadir', added = false, onClick }) {
  return (
    <Button variant={added ? 'accent' : 'outline'} size="sm" onClick={onClick} iconRight={BAG}>
      {added ? '✓' : children}
    </Button>
  )
}
