/**
 * Tintes de portada.
 *
 * Los nueve gradientes que visten a cada audio, curso, experiencia y producto
 * mientras no hay fotografía: mezclas desaturadas de la paleta cerrada
 * (`--gold`, `--teal`, `--lav`) con `--void`, a 150° como el resto de bandas.
 * Son materia, no color de marca — por eso quedan fuera de los acentos.
 *
 * Son los únicos hex que no están en la paleta del sistema. Viven aquí, con
 * nombre; ningún archivo de `data/` los escribe a mano. Un tinte nuevo se
 * añade en este archivo y se documenta en `DESIGN.md`.
 */
export const COVERS = {
  /** Teal sobre vacío, el más frío. */
  tide: 'linear-gradient(150deg,#3a5a6e,#1a2c44)',
  lagoon: 'linear-gradient(150deg,#4a7d8a,#1c2f36)',
  /** Lavanda sobre vacío. */
  violet: 'linear-gradient(150deg,#6e5f8a,#241f3a)',
  iris: 'linear-gradient(150deg,#6a5a8c,#221d38)',
  indigo: 'linear-gradient(150deg,#3f4a72,#1b2138)',
  /** Teal verdoso sobre vacío, la tierra. */
  moss: 'linear-gradient(150deg,#4f6b5e,#1e2e28)',
  sage: 'linear-gradient(150deg,#5a6b52,#20281c)',
  /** Oro sobre vacío, el más cálido. */
  amber: 'linear-gradient(150deg,#8a7150,#2c2418)',
  honey: 'linear-gradient(150deg,#a07840,#2c2012)',
} as const;

export type CoverKey = keyof typeof COVERS;
