import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './components/ui'
import { DesignSystem } from './pages/DesignSystem'
import { Fotografia } from './pages/Fotografia'
import { Home } from './pages/Home'

const LINKS = [
  ['/sistema', 'Sistema'],
  ['/fotografia', 'Fotografía'],
]

/** Al cambiar de ruta vuelve arriba; con un ancla (`#color`) deja que el navegador la resuelva. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

function Nav() {
  return (
    <nav aria-label="Principal" className="flex items-center gap-1">
      {LINKS.map(([to, label]) => (
        <NavLink key={to} to={to} className={({ isActive }) => `text-label tracking-caps inline-flex min-h-11 items-center px-3 font-sans uppercase ${isActive ? 'text-ivory' : 'text-fg-meta hover:text-fg-body'}`}>{label}</NavLink>
      ))}
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header right={<Nav />} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sistema" element={<DesignSystem />} />
        <Route path="/fotografia" element={<Fotografia />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
