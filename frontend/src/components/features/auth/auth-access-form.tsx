'use client';

import { useTranslations } from 'next-intl';

import { Button, Collapse, Field, Input, SegmentedControl } from '@/components/ui';
import type { AuthFormState } from '@/hooks/use-auth-form';
import type { AuthMode } from '@/lib/auth/validation';

import { GuestEntry } from './guest-entry';

type AuthAccessFormProps = {
  /** Estado y acciones del acceso, resueltos por `useAuthForm`. */
  form: AuthFormState;
  /** Abre la recuperación de contraseña dentro del mismo panel. */
  onForgot: () => void;
};

/**
 * El formulario de acceso con conmutador, campos y entrada sin cuenta. No
 * tiene estado propio: recibe el de `useAuthForm` y sólo lo compone.
 */
export function AuthAccessForm({ form, onForgot }: AuthAccessFormProps) {
  const t = useTranslations();
  const { mode, setMode, values, change, blur, fieldError, submitting, submit } = form;

  // El hook devuelve la clave del error; aquí se resuelve al idioma activo.
  const errorText = (field: 'name' | 'email' | 'password'): string | undefined => {
    const key = fieldError(field);
    return key ? t(key) : undefined;
  };

  const tabs = [
    { value: 'login' as AuthMode, label: t('auth.login.tab') },
    { value: 'register' as AuthMode, label: t('auth.register.tab') },
  ];

  const cta = mode === 'login' ? t('auth.login.cta') : t('auth.register.cta');

  const nameField = (
    <Field htmlFor="name" label={t('auth.fields.name.label')} error={errorText('name')}>
      <Input
        placeholder={t('auth.fields.name.placeholder')}
        value={values.name}
        onChange={change('name')}
        onBlur={blur('name')}
      />
    </Field>
  );

  return (
    <>
      <SegmentedControl<AuthMode>
        options={tabs}
        value={mode}
        onChange={(v) => setMode(v)}
        ariaLabel={t('auth.kicker')}
        className="mb-6 max-w-none"
      />

      <form onSubmit={submit} className="space-y-4" noValidate>
        {/* Apertura tipo "pergamino" sin animar altura: el campo nombre se pliega
          con `Collapse` (grid-rows 0fr→1fr) al compás del enlace de recuperación. */}
        <Collapse open={mode === 'register'}>{nameField}</Collapse>

        <Field htmlFor="email" label={t('auth.fields.email.label')} error={errorText('email')}>
          <Input
            type="email"
            placeholder={t('auth.fields.email.placeholder')}
            value={values.email}
            onChange={change('email')}
            onBlur={blur('email')}
          />
        </Field>

        <Field
          htmlFor="password"
          label={t('auth.fields.password.label')}
          error={errorText('password')}
        >
          <Input
            type="password"
            placeholder={t('auth.fields.password.placeholder')}
            value={values.password}
            onChange={change('password')}
            onBlur={blur('password')}
          />
        </Field>

        {/* Se pliega al compás del campo nombre: si apareciera de golpe al
          volver a «Entrar», durante un instante convivirían los dos, el
          panel crecería y la imagen del umbral daría un salto. El
          `-mt-4` anula su hueco de `space-y-4` cuando está plegado. */}
        <Collapse open={mode === 'login'} className="-mt-4">
          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={onForgot}
              className="rounded-pill hover:text-fg text-meta tracking-soft text-fg-muted min-h-11 px-3 font-sans transition-colors"
            >
              {t('auth.forgot')}
            </button>
          </div>
        </Collapse>

        <Button type="submit" variant="primary" className="mt-2 w-full" disabled={submitting}>
          {cta}
        </Button>
      </form>

      <GuestEntry />
    </>
  );
}
