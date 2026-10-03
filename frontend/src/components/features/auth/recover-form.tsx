'use client';

import { useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';

import { Button, Field, Input, Swap } from '@/components/ui';
import { recoverErrors } from '@/lib/auth/validation';

type RecoverFormProps = {
  /** Correo que la persona ya había escrito en el acceso, para no pedirlo dos veces. */
  initialEmail: string;
  /** El enlace se ha pedido: el panel cambia su titular por la confirmación. */
  onSent: () => void;
  /** Vuelve al formulario de acceso. */
  onBack: () => void;
};

/**
 * Recuperación de contraseña, dentro del propio acceso: se pide el correo y
 * se confirma el envío. La confirmación no dice si la cuenta existe —el mismo
 * mensaje para cualquier correo—, para no revelar quién tiene santuario.
 */
export function RecoverForm({ initialEmail, onSent, onBack }: RecoverFormProps) {
  const t = useTranslations();
  const [email, setEmail] = useState(initialEmail);
  const [touched, setTouched] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const errorKey = touched ? recoverErrors(email).email : undefined;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);

    if (recoverErrors(email).email) return;

    // TODO(backend): aquí se pide el correo de recuperación. Sin backend no
    // se envía nada: sólo se muestra la confirmación.
    setSentTo(email.trim());
    onSent();
  };

  return (
    <Swap id={sentTo ? 'sent' : 'asking'}>
      {sentTo ? (
        <div role="status">
          <p className="text-fg-body text-body mb-8 leading-[1.7]">
            <span aria-hidden="true" className="text-gold mr-2">
              ✓
            </span>
            {t('auth.recover.sentBody', { email: sentTo })}
          </p>
          <Button variant="outline" className="w-full" onClick={onBack}>
            {t('auth.recover.back')}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field
            htmlFor="recover-email"
            label={t('auth.fields.email.label')}
            error={errorKey ? t(errorKey) : undefined}
          >
            <Input
              type="email"
              autoComplete="email"
              placeholder={t('auth.fields.email.placeholder')}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setTouched(true)}
            />
          </Field>

          <Button type="submit" variant="primary" className="mt-2 w-full">
            {t('auth.recover.cta')}
          </Button>
          <Button variant="ghost" className="w-full" onClick={onBack}>
            {t('auth.recover.back')}
          </Button>
        </form>
      )}
    </Swap>
  );
}
