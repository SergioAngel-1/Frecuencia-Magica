'use client';

import { useTranslations } from 'next-intl';

import { Button, Display, EditorialImage, Kicker, Swap } from '@/components/ui';
import { useAuthForm } from '@/hooks/use-auth-form';
import { Link } from '@/i18n/navigation';
import type { EditorialMedia } from '@/types/editorial-media';

import { AuthAccessForm } from './auth-access-form';
import { RecoverForm } from './recover-form';

export interface AuthFormProps {
  media: EditorialMedia;
}

export function AuthForm({ media }: AuthFormProps) {
  const t = useTranslations();
  const form = useAuthForm();
  const { mode, values, recovery, recovering } = form;

  return (
    <div
      data-auth-layout="form"
      // En móvil el panel continúa la banda del héroe: sin filete ni fondo
      // propio, su atmósfera y su velo funden el borde superior en la noche.
      className="border-accent/15 min-[900px]:bg-scrim-deep/84 relative isolate min-h-[clamp(620px,100svh,980px)] overflow-hidden min-[900px]:min-h-[100svh] min-[900px]:border-l"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30">
        <EditorialImage
          media={media}
          aspect="3:4"
          bandMedia
          className="h-full"
          overlay={false}
          scrim={false}
        />
      </div>
      <div
        aria-hidden="true"
        className="fm-fade-top pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--scrim)_/_0.68),rgb(var(--scrim-deep)_/_0.94))]"
      />

      {/* Una sola columna: conmutador, campos y botones comparten ancho. Antes
          el formulario medía 400px y lo de alrededor el ancho del panel, así
          que los botones se veían de otro tamaño que los campos. */}
      <div className="relative z-10 mx-auto flex w-full max-w-[calc(420px+3rem)] flex-col px-6 pt-14 pb-16 min-[900px]:min-h-[100svh] min-[900px]:justify-center min-[900px]:pt-[112px] min-[900px]:pb-16">
        <Button variant="ghost" iconLeft="←" asChild className="mb-10 self-start">
          <Link href="/">{t('auth.backHome')}</Link>
        </Button>

        <Kicker tone="teal" spacing="widest" className="mb-2">
          {t('auth.kicker')}
        </Kicker>

        <Display level="h1" size="xs" className="mb-2">
          {recovery === 'sent'
            ? t('auth.recover.sentTitle')
            : recovering
              ? t('auth.recover.title')
              : mode === 'login'
                ? t('auth.login.title')
                : t('auth.register.title')}
        </Display>

        {recovery === 'sent' ? null : (
          <p className="text-fg-muted text-body mb-8 font-sans leading-relaxed">
            {recovering
              ? t('auth.recover.subtitle')
              : mode === 'login'
                ? t('auth.login.subtitle')
                : t('auth.register.subtitle')}
          </p>
        )}

        <Swap id={recovering ? 'recover' : 'access'}>
          {recovering ? (
            <RecoverForm
              initialEmail={values.email}
              onSent={form.recoverySent}
              onBack={form.recoveryBack}
            />
          ) : (
            <AuthAccessForm form={form} onForgot={form.startRecovery} />
          )}
        </Swap>
      </div>
    </div>
  );
}
