'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Button, Field, Input, Kicker, SegmentedControl } from '@/components/ui';

type AuthMode = 'login' | 'register';

export function AuthForm() {
  const t = useTranslations();
  const [mode, setMode] = useState<AuthMode>('login');

  const tabs = [
    { value: 'login' as AuthMode, label: t('auth.login.tab') },
    { value: 'register' as AuthMode, label: t('auth.register.tab') },
  ];

  const cta = mode === 'login' ? t('auth.login.cta') : t('auth.register.cta');

  return (
    <div>
      <Kicker tone="gold" spacing="widest" className="mb-2">
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

      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-5"
        noValidate
      >
        {mode === 'register' ? (
          <Field
            htmlFor="name"
            label={t('auth.fields.name.label')}
          >
            <Input placeholder={t('auth.fields.name.placeholder')} />
          </Field>
        ) : null}

        <Field
          htmlFor="email"
          label={t('auth.fields.email.label')}
        >
          <Input type="email" placeholder={t('auth.fields.email.placeholder')} />
        </Field>

        <Field
          htmlFor="password"
          label={t('auth.fields.password.label')}
        >
          <Input type="password" placeholder={t('auth.fields.password.placeholder')} />
        </Field>

        <Button variant="primary" size="lg" className="w-full">
          {cta}
        </Button>
      </form>

      {mode === 'login' ? (
        <p className="mt-4 text-center font-sans text-[12px] tracking-[.1em] text-ivory/40">
          {t('auth.forgot')}
        </p>
      ) : null}

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-ivory/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[var(--void)] px-4 font-sans text-[11px] uppercase tracking-[.2em] text-ivory/30">
            {t('auth.or')}
          </span>
        </div>
      </div>

      <Button variant="outline" size="lg" className="w-full">
        {t('auth.sso')}
      </Button>
    </div>
  );
}
