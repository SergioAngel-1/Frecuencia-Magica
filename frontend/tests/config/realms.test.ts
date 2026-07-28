import { describe, expect, it } from 'vitest';

import { getRealm, NAV_REALMS, REALMS } from '@/config/realms';

describe('configuración de realms', () => {
  it('expone los nueve realms', () => {
    expect(REALMS).toHaveLength(9);
  });

  it('la navegación de constelación muestra seis realms', () => {
    expect(NAV_REALMS.map((r) => r.id)).toEqual([
      'descubrete',
      'biblioteca',
      'academia',
      'experiencias',
      'tienda',
      'sanctuario',
    ]);
  });

  it('portal y auth quedan fuera de la navegación', () => {
    const ids = NAV_REALMS.map((r) => r.id);

    expect(ids).not.toContain('portal');
    expect(ids).not.toContain('auth');
    expect(ids).not.toContain('home');
  });

  it('cada realm tiene un acento de la paleta', () => {
    const paleta = new Set(['#D8B978', '#96C6BC', '#B9B0D6']);

    for (const realm of REALMS) {
      expect(paleta.has(realm.accent)).toBe(true);
    }
  });

  it('los acentos coinciden con el prototipo', () => {
    const esperado: Record<string, string> = {
      portal: '#D8B978',
      home: '#D8B978',
      auth: '#D8B978',
      descubrete: '#B9B0D6',
      biblioteca: '#D8B978',
      academia: '#96C6BC',
      experiencias: '#B9B0D6',
      tienda: '#D8B978',
      sanctuario: '#D8B978',
    };

    for (const realm of REALMS) {
      expect(realm.accent).toBe(esperado[realm.id]);
    }
  });

  it('cada realm tiene una nota base distinta para el drone', () => {
    const esperado: Record<string, number> = {
      portal: 110,
      home: 110,
      auth: 110,
      descubrete: 98,
      biblioteca: 130.8,
      academia: 146.8,
      experiencias: 123.4,
      tienda: 116.5,
      sanctuario: 103.8,
    };

    for (const realm of REALMS) {
      expect(realm.baseNote).toBe(esperado[realm.id]);
    }
  });

  it('getRealm devuelve el realm pedido', () => {
    expect(getRealm('academia').accent).toBe('#96C6BC');
  });

  it('cada realm declara su ruta', () => {
    const esperado: Record<string, string> = {
      portal: '/',
      home: '/inicio',
      auth: '/acceso',
      descubrete: '/descubrete',
      biblioteca: '/biblioteca',
      academia: '/academia',
      experiencias: '/experiencias',
      tienda: '/tienda',
      sanctuario: '/mi-santuario',
    };

    for (const realm of REALMS) {
      expect(realm.href).toBe(esperado[realm.id]);
    }
  });

  it('la ruta de cada realm resuelve de vuelta a ese realm', async () => {
    // Invariante que impide que el mapa de rutas y el mapeo inverso que usa
    // el contexto de realm se desincronicen: si alguien cambia un segmento
    // en un sitio y no en el otro, este test cae.
    const { realmFromPathname } = await import('@/lib/realm-from-pathname');

    for (const realm of REALMS) {
      expect(realmFromPathname(realm.href), `ida y vuelta rota en ${realm.id}`).toBe(realm.id);
    }
  });
});
