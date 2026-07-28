import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// happy-dom no implementa matchMedia por completo y varios hooks lo consultan
// (movimiento reducido, detección de puntero fino, soporte táctil).
// Por defecto respondemos que ninguna media query casa.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList,
  });
}

afterEach(() => {
  cleanup();
});
