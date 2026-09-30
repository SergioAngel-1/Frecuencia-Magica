import { cn } from '../../lib/cn'

/**
 * Navegación de constelación: un punto de luz por realm. Desde 1024px es una columna de
 * puntos cuyo nombre aparece al acercarse; por debajo, una barra de vidrio con los nombres
 * siempre visibles. Aquí se muestra en un marco (en la web es `fixed`).
 */
export function RealmNav({ realms, current, layout = 'column', className }) {
  const bar = layout === 'bar'

  return (
    <nav aria-label="Constelación" className={cn(bar ? 'rounded-pill fm-surface-strong inline-flex max-w-full overflow-x-auto px-2' : 'inline-flex flex-col', className)}>
      <ul className={cn('flex items-center gap-1', !bar && 'flex-col items-stretch')}>
        {realms.map((realm) => {
          const active = realm.id === current
          return (
            <li key={realm.id}>
              <a href={`#${realm.id}`} aria-current={active ? 'page' : undefined} className="group relative flex h-11 min-w-11 items-center justify-center px-3 lg:px-[6px]">
                <span className="sr-only">{realm.name}</span>
                <span
                  aria-hidden="true"
                  className={cn('h-[9px] w-[9px] flex-none rounded-full transition-[transform,opacity] duration-300 group-hover:scale-[1.35] group-hover:opacity-100', !active && 'opacity-60')}
                  style={{ background: realm.accent, boxShadow: active ? `0 0 12px 2px ${realm.accent}` : undefined }}
                />
                {bar ? (
                  <span aria-hidden="true" className={cn('text-body tracking-soft ml-2 font-sans whitespace-nowrap uppercase', active ? 'text-ivory' : 'text-fg-muted')}>
                    {realm.name}
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className="fm-surface-strong rounded-pill pointer-events-none absolute top-1/2 left-[30px] flex -translate-y-1/2 items-center gap-[9px] py-2 pr-[18px] pl-[15px] whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <span className="h-[6px] w-[6px] flex-none rounded-full" style={{ background: realm.accent, boxShadow: `0 0 8px 1px ${realm.accent}` }} />
                    <span className="text-ivory tracking-soft font-serif text-[16px]">{realm.name}</span>
                  </span>
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
