/** Los nueve espacios del universo. Ocho son destino; `home` es el eje. */
export type RealmId =
  | 'portal'
  | 'home'
  | 'auth'
  | 'descubrete'
  | 'resonario'
  | 'academia'
  | 'experiencias'
  | 'tienda'
  | 'sanctuario';

/** Clave del acento de la paleta, para elegir banda o nebulosa sin comparar hex. */
export type RealmAccentKey = 'gold' | 'teal' | 'lav';

export type Realm = {
  id: RealmId;
  /**
   * Pathname interno del realm. Es una clave del mapa `pathnames` de
   * next-intl, así que el `Link` lo traduce al segmento de cada idioma.
   */
  href: string;
  /** Acento en hexadecimal. Recolorea el canvas cósmico y la nebulosa. */
  accent: string;
  /** Clave de paleta del acento: la banda y la nebulosa se eligen con ella. */
  accentKey: RealmAccentKey;
  /** Variable CSS equivalente al acento, para usarlo desde estilos. */
  accentVar: string;
  /** Nota base del drone ambiental, en hercios. */
  baseNote: number;
  /** Si aparece en la navegación de constelación. */
  inNav: boolean;
};
