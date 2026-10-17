'use client';

import { useTranslations } from 'next-intl';

import { Kicker } from '@/components/ui';
import { usePathname } from '@/i18n/navigation';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/cn';
import { eligibleAtmospheres, showsPicker } from '@/lib/atmosphere/picker';
import { resolveAtmosphere } from '@/lib/atmosphere/resolve';
import { placeFromPathname } from '@/lib/realm-from-pathname';
import { useAtmosphereStore } from '@/stores/atmosphere-store';

const OPTION_BASE =
  'rounded-pill border min-h-11 px-5 font-sans text-body tracking-ui transition-colors duration-300 ease-out';

/**
 * Selector manual de atmósfera: «Ambiente del sitio» y las atmósferas elegibles.
 * Sólo aparece en los lugares de escucha (Resonario, Descúbrete, Mi Santuario); en
 * el resto devuelve `null`. La opción activa lleva `aria-pressed`; sin elección
 * manual, «Ambiente del sitio» es la pulsada. El cambio se anuncia desde la región
 * aria-live del `AtmosphereProvider`: aquí no hay otra.
 *
 * Los botones no usan `SegmentedControl` a propósito: ese control es un `tablist`
 * con `aria-selected`, y aquí cada botón activa o desactiva un modo.
 *
 * La elección vive en `sessionStorage`, que el servidor no tiene: hasta montar,
 * ninguna opción aparece pulsada, para no desajustar la hidratación.
 */
export function AtmospherePicker() {
  const place = placeFromPathname(usePathname());
  const mounted = useMounted();
  const t = useTranslations('atmospheres');
  const manual = useAtmosphereStore((state) => state.manual);
  const setManual = useAtmosphereStore((state) => state.setManual);
  const clear = useAtmosphereStore((state) => state.clear);

  if (!showsPicker(place)) return null;

  const chosen = mounted ? manual : null;
  const shown = resolveAtmosphere(place, chosen);

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Kicker tone="teal" spacing="wide">
        {t('picker.label')}
      </Kicker>

      <div
        role="group"
        aria-label={t('picker.label')}
        className="flex flex-wrap justify-center gap-2"
      >
        <button
          type="button"
          aria-pressed={mounted && manual === null}
          onClick={clear}
          className={cn(
            OPTION_BASE,
            mounted && manual === null
              ? 'border-line-strong bg-accent/16 text-fg'
              : 'border-line bg-surface text-fg-soft hover:text-fg',
          )}
        >
          {t('picker.site')}
        </button>

        {eligibleAtmospheres().map((id) => {
          const pressed = mounted && manual === id;

          return (
            <button
              key={id}
              type="button"
              aria-pressed={pressed}
              onClick={() => setManual(id)}
              className={cn(
                OPTION_BASE,
                pressed
                  ? 'border-line-strong bg-accent/16 text-fg'
                  : 'border-line bg-surface text-fg-soft hover:text-fg',
              )}
            >
              {t(`${id}.pickerLabel`)}
            </button>
          );
        })}
      </div>

      <p className="text-fg-meta text-meta tracking-ui font-sans">{t(`${shown}.description`)}</p>
    </div>
  );
}
