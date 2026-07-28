import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // Resolución nativa de los `paths` de tsconfig: da el alias `@/` en los tests.
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // Sólo testeamos lógica: stores, reducers, hooks y utilidades puras.
    // Restringir el include evita que Vitest recoja ficheros de src/.
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
});
