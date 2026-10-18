/** Trozos de lo que la respuesta anuncia a un lector de pantalla. Todo ya traducido. */
export type ArrivalAnnouncementParts = {
  /** La frase que explica la entrada. */
  explanation: string;
  /** Tipo de escucha y título de la pista en curso; si falta, no se anuncia pista. */
  kind?: string;
  title?: string;
  /** Posición en el recorrido, p. ej. «1 de 2». */
  position?: string;
};

/**
 * Lo que se lee al elegir o recorrer: «{explicación}. {tipo}: {título}. {n} de
 * {total}». Cada trozo termina en signo (si no, se añade un punto) y se une con
 * un espacio. Vacío si no hay nada que decir.
 */
export function arrivalAnnouncement({
  explanation,
  kind,
  title,
  position,
}: ArrivalAnnouncementParts): string {
  const pieces = [explanation, kind && title ? `${kind}: ${title}` : '', position ?? '']
    .map((piece) => piece.trim())
    .filter((piece) => piece.length > 0)
    .map((piece) => (/[.!?…]$/u.test(piece) ? piece : `${piece}.`));

  return pieces.join(' ');
}
