import { getTranslations } from 'next-intl/server';

import { PageShell } from '@/components/layout';
import { OrbitalRings } from '@/components/world';

import { NotFoundActions } from './not-found-actions';

/**
 * 404 localizado.
 *
 * Se alcanza cuando `notFound()` se lanza dentro de un `[locale]` ya
 * resuelto: un `notFound()` explícito de una página de detalle (curso,
 * producto, experiencia…) o el catch-all `[...rest]/page.tsx`, que atrapa
 * cualquier ruta sin página propia. No recibe `params` —Next no se los pasa
 * a ningún `not-found.tsx`— así que el locale activo es el que ya dejó
 * fijado `resolveLocale` en el layout padre.
 *
 * La geometría sagrada aparece incompleta —un aro con un arco partido, el
 * mismo lenguaje que `ErrorState`— en vez de un "404" grande o una
 * ilustración genérica.
 */
export default async function NotFound() {
  const t = await getTranslations('states');

  return (
    <PageShell width="result" padding="centered" className="flex flex-col items-center text-center">
      <OrbitalRings
        size={140}
        spin={220}
        direction="ccw"
        rings={[
          // Mismo hueco que `ErrorState`: la circunferencia de r=96 es ~603,
          // así que este dash deja abierto algo menos de un cuarto — se lee
          // como interrupción, no como línea de puntos.
          { r: 96, stroke: 'rgba(216,185,120,0.4)', width: 1, dash: '470 133' },
          { r: 62, stroke: 'rgba(247,244,234,0.12)', width: 0.7 },
        ]}
      >
        <OrbitalRings.Node angle={-90} radius={96} color="rgba(216,185,120,0.55)" size={6} />
      </OrbitalRings>

      <h1 className="text-ivory/75 mt-[30px] max-w-[34ch] font-serif text-[clamp(22px,2.8vw,28px)] leading-[1.4]">
        {t('notFoundTitle')}
      </h1>
      <p className="text-ivory/55 mt-[12px] max-w-[42ch] font-sans text-[15px] leading-[1.7]">
        {t('notFoundBody')}
      </p>

      <NotFoundActions homeLabel={t('notFoundCta')} realmsLabel={t('notFoundRealmsCta')} />
    </PageShell>
  );
}
