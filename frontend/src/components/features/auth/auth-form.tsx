'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';

import { Button, EditorialImage, Field, Input, Kicker, SegmentedControl } from '@/components/ui';
import { cn } from '@/lib/cn';
import { Link, useRouter } from '@/i18n/navigation';
import { authErrors, type AuthFormValues, type AuthMode } from '@/lib/auth/validation';
import type { EditorialMedia } from '@/types/editorial-media';

type AuthField = keyof AuthFormValues;

const INITIAL_VALUES: AuthFormValues = { name: '', email: '', password: '' };
const INITIAL_TOUCHED: Record<AuthField, boolean> = {
  name: false,
  email: false,
  password: false,
};

export interface AuthFormProps {
  media: EditorialMedia;
}

export function AuthForm({ media }: AuthFormProps) {
  const t = useTranslations();
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>('login');
  const [values, setValues] = useState<AuthFormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);
  const [submitting, setSubmitting] = useState(false);

  // Recalcula en cada tecleo: una vez que un campo está tocado, su error se
  // actualiza en vivo (se limpia en cuanto el usuario lo corrige) sin volver
  // a aparecer nunca antes del primer blur.
  const errors = useMemo(() => authErrors(mode, values), [mode, values]);

  const tabs = [
    { value: 'login' as AuthMode, label: t('auth.login.tab') },
    { value: 'register' as AuthMode, label: t('auth.register.tab') },
  ];

  const cta = mode === 'login' ? t('auth.login.cta') : t('auth.register.cta');

  const fieldError = (field: AuthField): string | undefined => {
    if (!touched[field]) return undefined;
    const key = errors[field];
    return key ? t(key) : undefined;
  };

  const handleChange = (field: AuthField) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleBlur = (field: AuthField) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Un intento de envío también revela los errores de los campos que el
    // usuario nunca llegó a desenfocar.
    setTouched({ name: true, email: true, password: true });

    if (Object.keys(authErrors(mode, values)).length > 0) return;

    // TODO(backend): no hay autenticación real; aquí iría el registro/login.
    setSubmitting(true);
    router.push({ pathname: '/mi-santuario' });
  };

  const nameField = (
    <Field htmlFor="name" label={t('auth.fields.name.label')} error={fieldError('name')}>
      <Input
        placeholder={t('auth.fields.name.placeholder')}
        value={values.name}
        onChange={handleChange('name')}
        onBlur={handleBlur('name')}
      />
    </Field>
  );

  return (
    <div
      data-auth-layout="form"
      className="border-gold/15 bg-void-2/84 relative isolate min-h-[clamp(620px,100svh,980px)] overflow-hidden border-t min-[900px]:min-h-[100svh] min-[900px]:border-t-0 min-[900px]:border-l"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30">
        <EditorialImage
          media={media}
          aspect="3:4"
          className="h-full"
          overlay={false}
          scrim={false}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,27,46,0.68),rgba(10,18,32,0.94))]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[620px] flex-col px-6 pt-14 pb-16 min-[900px]:min-h-[100svh] min-[900px]:justify-center min-[900px]:px-[clamp(36px,5vw,88px)] min-[900px]:pt-16 min-[900px]:pb-16">
        <Button variant="ghost" size="sm" iconLeft="←" asChild className="mb-10 self-start">
          <Link href="/">{t('auth.backHome')}</Link>
        </Button>

        <Kicker tone="teal" spacing="widest" className="mb-2">
          {t('auth.kicker')}
        </Kicker>

        <h1 className="text-ivory mb-2 font-serif text-[clamp(26px,4vw,38px)] leading-tight">
          {mode === 'login' ? t('auth.login.title') : t('auth.register.title')}
        </h1>

        <p className="text-fg-muted text-body mb-8 font-sans leading-relaxed">
          {mode === 'login' ? t('auth.login.subtitle') : t('auth.register.subtitle')}
        </p>

        <SegmentedControl<AuthMode>
          options={tabs}
          value={mode}
          onChange={(v) => setMode(v)}
          ariaLabel={t('auth.kicker')}
          className="mb-8"
        />

        <form onSubmit={handleSubmit} className="max-w-[400px] space-y-[15px]" noValidate>
          {/* Apertura tipo "pergamino" sin animar altura (grid-rows 0fr→1fr,
              transform-free; la regla del proyecto limita a transform/opacity).
              `inert` + `aria-hidden` retiran el campo del tab y del árbol cuando
              está colapsado; con prefers-reduced-motion el kill global de CSS
              hace la transición instantánea. */}
          <div
            className={cn(
              'grid transition-[grid-template-rows,opacity] duration-[350ms] ease-[cubic-bezier(.2,.85,.25,1)]',
              mode === 'register' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            )}
            aria-hidden={mode !== 'register'}
            inert={mode !== 'register'}
          >
            <div className="overflow-hidden">{nameField}</div>
          </div>

          <Field htmlFor="email" label={t('auth.fields.email.label')} error={fieldError('email')}>
            <Input
              type="email"
              placeholder={t('auth.fields.email.placeholder')}
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
            />
          </Field>

          <Field
            htmlFor="password"
            label={t('auth.fields.password.label')}
            error={fieldError('password')}
          >
            <Input
              type="password"
              placeholder={t('auth.fields.password.placeholder')}
              value={values.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
            />
          </Field>

          {mode === 'login' ? (
            <div className="-mt-1 flex justify-end">
              {/* TODO(backend): recuperación de contraseña aplazada; el click
                  es intencionalmente inerte hasta que exista esa pantalla. */}
              <button
                type="button"
                className="rounded-pill hover:text-ivory text-meta tracking-soft text-fg-muted min-h-11 px-3 font-sans transition-colors"
              >
                {t('auth.forgot')}
              </button>
            </div>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-2 w-full"
            disabled={submitting}
          >
            {cta}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="border-ivory/10 w-full border-t" />
          </div>
          <div className="relative flex justify-center">
            <span className="text-fg-meta text-label tracking-caps bg-[var(--void)] px-4 font-sans uppercase">
              {t('auth.or')}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          iconLeft={
            <span
              className="bg-gold block size-2 rounded-full"
              style={{ boxShadow: '0 0 8px 1px var(--color-gold)' }}
            />
          }
        >
          {t('auth.sso')}
        </Button>
      </div>
    </div>
  );
}
