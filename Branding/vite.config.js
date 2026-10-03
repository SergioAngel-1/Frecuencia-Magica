import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Branding importa tokens, portadas, catálogo y copy de `../frontend` (fuente única).
// El alias `@` replica el de la web para que sus módulos de `config/` y `data/` resuelvan igual.
// El dev server necesita permiso para leer fuera de su raíz.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('../frontend/src', import.meta.url)) } },
  server: { fs: { allow: ['..'] } },
})
