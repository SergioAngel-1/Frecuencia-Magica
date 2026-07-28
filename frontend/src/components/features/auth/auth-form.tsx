'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';

import { Button, Field, Input, Kicker, SegmentedControl } from '@/components/ui';
import { DURATION, EASE } from '@/config/motion';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { Link, useRouter } from '@/i18n/navigation';
import { authErrors, type AuthFormValues, type AuthMode } from '@/lib/auth/validation';

type AuthField = keyof AuthFormValues;

const INITIAL_VALUES: AuthFormValues = { name: '', email: '', password: '' };
const INITIAL_TOUCHED: Record<AuthField, boolean> = {
  name: false,
  email: false,
  password: false,
};

export function AuthForm() {
  const t = useTranslations();
  const router = useRouter();
  const reducedMotion = useReducedMotionSafe();

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
    <div className="mx-auto w-full max-w-[620px] px-6 pt-16 pb-16 min-[900px]:px-[7vw] min-[900px]:pt-[120px] min-[900px]:pb-[70px]">
      <Button variant="ghost" size="sm" iconLeft="←" asChild className="mb-10 self-start">
        <Link href="/">{t('auth.backHome')}</Link>
      </Button>

      <Kicker tone="teal" spacing="widest" className="mb-2">
        {t('auth.kicker')}
      </Kicker>

      <h1 className="mb-2 font-serif text-[clamp(26px,4vw,38px)] leading-tight text-ivory">
        {mode === 'login' ? t('auth.login.title') : t('auth.register.title')}
      </h1>

      <p className="mb-8 font-sans text-[14px] leading-relaxed text-ivory/60">
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
        {reducedMotion ? (
          mode === 'register' ? (
            nameField
          ) : null
        ) : (
          <AnimatePresence initial={false}>
            {mode === 'register' && (
              <motion.div
                key="name-field"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: DURATION.reveal, ease: EASE.soft }}
                style={{ overflow: 'hidden' }}
              >
                {nameField}
              </motion.div>
            )}
          </AnimatePresence>
        )}

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
              className="min-h-11 rounded-pill px-3 font-sans text-[12.5px] tracking-[.04em] text-[rgba(247,244,234,0.6)] transition-colors hover:text-ivory"
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
          <div className="w-full border-t border-ivory/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[var(--void)] px-4 font-sans text-[11px] tracking-[.2em] text-ivory/30 uppercase">
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
            className="block size-2 rounded-full bg-gold"
            style={{ boxShadow: '0 0 8px 1px var(--color-gold)' }}
          />
        }
      >
        {t('auth.sso')}
      </Button>
    </div>
  );
}
