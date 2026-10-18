import type { ReactNode } from 'react';

import { SectionHeading } from '@/components/ui';

export type AboutPath = {
  id: string;
  title: string;
  body: string;
  /** Enlace con flecha al realm, ya con su tono. */
  action: ReactNode;
};

type AboutPathsProps = {
  kicker: string;
  title: string;
  paths: readonly AboutPath[];
};

/**
 * Las salidas de la vista: su trabajo, dicho en tres verbos, cada uno hacia
 * su realm. Filas a lo ancho para que no repitan las columnas de la sección
 * anterior.
 */
export function AboutPaths({ kicker, title, paths }: AboutPathsProps) {
  return (
    <section className="fm-editorial-full-bleed fm-container">
      <SectionHeading kicker={kicker} title={title} kickerTone="teal" className="mb-0" />
      <ul className="border-fg/15 mt-block border-b">
        {paths.map((path) => (
          <li
            key={path.id}
            className="border-fg/15 grid grid-cols-1 items-center gap-x-10 gap-y-3 border-t py-7 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)_minmax(0,0.7fr)] lg:py-9"
          >
            <h3 className="text-fg font-serif text-[clamp(30px,4.4vw,56px)] leading-[1.05] font-light">
              {path.title}
            </h3>
            <p className="text-fg-body text-lead max-w-measure-base leading-[1.7]">{path.body}</p>
            <div className="lg:justify-self-end">{path.action}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
