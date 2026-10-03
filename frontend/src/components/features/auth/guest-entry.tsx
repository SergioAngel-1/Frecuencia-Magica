'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui';
import { Link } from '@/i18n/navigation';

/**
 * Entrada alternativa al formulario: el separador «o» y el acceso sin cuenta.
 *
 * TODO(backend): acceso con proveedor externo. Sin autenticación real es la
 * entrada sin cuenta y lleva al mismo sitio que el formulario.
 */
export function GuestEntry() {
  const t = useTranslations('auth');

  return (
    <>
      {/* Dos líneas a los lados del texto: un parche de fondo tras la «o» no
          casaba con el degradado del panel. */}
      <div className="my-7 flex items-center gap-4">
        <span aria-hidden="true" className="bg-ivory/10 h-px flex-1" />
        <span className="text-fg-meta text-label tracking-caps font-sans uppercase">{t('or')}</span>
        <span aria-hidden="true" className="bg-ivory/10 h-px flex-1" />
      </div>

      <Button
        variant="outline"
        className="w-full"
        iconLeft={
          <span
            className="bg-gold block size-2 rounded-full"
            style={{ boxShadow: '0 0 8px 1px var(--color-gold)' }}
          />
        }
        asChild
      >
        <Link href="/mi-santuario">{t('sso')}</Link>
      </Button>
    </>
  );
}
