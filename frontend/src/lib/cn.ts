import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases resolviendo los conflictos de Tailwind.
 *
 * Es la única forma permitida de concatenar clases en el proyecto: la
 * concatenación manual deja utilidades duplicadas que ganan por orden de
 * declaración en lugar de por intención.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
