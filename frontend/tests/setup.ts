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

// happy-dom no expone `localStorage` como global en este entorno; los stores
// persistidos (audio ambiental, carrito, diario) lo necesitan al hacer `set`.
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  const localStorageStub: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key) => store.get(key) ?? null,
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => void store.delete(key),
    setItem: (key, value) => void store.set(key, String(value)),
  };
  Object.defineProperty(globalThis, 'localStorage', {
    writable: true,
    value: localStorageStub,
  });
}

afterEach(() => {
  cleanup();
});
