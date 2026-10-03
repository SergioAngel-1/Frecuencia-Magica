import { Link } from 'react-router-dom'

/** Cabecera del showcase: logo, marca y metadatos. No es la del sitio. */
export function Header({ subtitle, right }) {
  return (
    <header className="fm-surface-strong sticky top-0 z-40 flex items-center justify-between gap-4 border-x-0 border-t-0 px-4 py-3 md:px-[34px]">
      <Link to="/" aria-label="Frecuencia Mágica" className="text-ivory flex min-h-11 items-center gap-[13px] hover:text-ivory">
        <img src="/logo.png" alt="" width="34" height="34" className="size-[34px]" />
        <span className="tracking-label hidden font-serif text-[20px] uppercase sm:inline">Frecuencia Mágica</span>
      </Link>
      {subtitle ? <p className="text-label tracking-kicker text-fg-meta hidden font-sans uppercase lg:block">{subtitle}</p> : null}
      {right ? <div className="text-label tracking-ui text-fg-meta text-right font-sans uppercase">{right}</div> : null}
    </header>
  )
}
