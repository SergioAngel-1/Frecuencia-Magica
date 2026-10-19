import { cn } from '@/lib/cn';

type DiscFaceProps = {
  /** Hz del tono. `null`: la pista no es un tono y no lleva cifra. */
  hz: number | null;
  /** Clases de tamaño de la cifra y de la unidad, según la escala. */
  numClass: string;
  unitClass: string;
};

/**
 * Cifra en Hz de la cara del disco. Marfil fijo sobre la cara: en claro, la
 * cifra va sobre una píldora de tinta (`.fm-disc-face` en globals.css); en la
 * noche no hay píldora. Sólo los tonos la llevan.
 */
export function DiscFace({ hz, numClass, unitClass }: DiscFaceProps) {
  if (hz === null) return null;

  return (
    <span className="fm-disc-face inline-flex flex-col items-center">
      <span className={cn('fm-disc-num text-on-media block font-serif leading-none', numClass)}>
        {hz}
      </span>
      <span className={cn('fm-disc-unit text-on-media/80 block font-sans uppercase', unitClass)}>
        Hz
      </span>
    </span>
  );
}
