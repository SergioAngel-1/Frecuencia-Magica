/**
 * Si el drone ambiental debe sonar: sólo con el ambiente activado y ninguna
 * frecuencia del reproductor sonando. Así el drone y una frecuencia nunca se
 * solapan; al pausar o cerrar el reproductor, el ambiente vuelve solo.
 */
export function ambientAudible(ambientEnabled: boolean, playerSounding: boolean): boolean {
  return ambientEnabled && !playerSounding;
}
