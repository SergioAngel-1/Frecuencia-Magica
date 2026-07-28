/** Los nueve espacios del universo. Ocho son destino; `home` es el eje. */
export type RealmId =
  | 'portal'
  | 'home'
  | 'auth'
  | 'descubrete'
  | 'biblioteca'
  | 'academia'
  | 'experiencias'
  | 'tienda'
  | 'sanctuario';

export type Realm = {
  id: RealmId;
  /** Acento en hexadecimal. Recolorea el canvas cósmico y la nebulosa. */
  accent: string;
  /** Variable CSS equivalente al acento, para usarlo desde estilos. */
  accentVar: string;
  /** Nota base del drone ambiental, en hercios. */
  baseNote: number;
  /** Si aparece en la navegación de constelación. */
  inNav: boolean;
};
