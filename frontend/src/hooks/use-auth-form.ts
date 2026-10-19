'use client';

import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';

import { useRouter } from '@/i18n/navigation';
import {
  authErrors,
  type AuthErrorKey,
  type AuthFormValues,
  type AuthMode,
} from '@/lib/auth/validation';

type AuthField = keyof AuthFormValues;

/** La recuperación sustituye al formulario dentro del mismo panel. */
export type RecoveryStage = 'off' | 'asking' | 'sent';

const INITIAL_VALUES: AuthFormValues = { name: '', email: '', password: '' };
const INITIAL_TOUCHED: Record<AuthField, boolean> = {
  name: false,
  email: false,
  password: false,
};

/**
 * Estado del acceso: modo, valores, campos tocados, envío y recuperación de
 * contraseña. El componente sólo compone con lo que devuelve.
 *
 * Los errores viven como claves de traducción (namespace `auth.errors`); este
 * hook no conoce el idioma, así que quien lo pinta resuelve el texto.
 */
/** Estado y acciones del acceso; lo que devuelve `useAuthForm`. */
export type AuthFormState = ReturnType<typeof useAuthForm>;

export function useAuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [values, setValues] = useState<AuthFormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);
  const [submitting, setSubmitting] = useState(false);
  const [recovery, setRecovery] = useState<RecoveryStage>('off');

  // Recalcula en cada tecleo: una vez que un campo está tocado, su error se
  // actualiza en vivo (se limpia en cuanto el usuario lo corrige) sin volver
  // a aparecer nunca antes del primer blur.
  const errors = useMemo(() => authErrors(mode, values), [mode, values]);

  const change = (field: AuthField) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const blur = (field: AuthField) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  /** El error visible del campo: el del modo actual, sólo si ya se tocó. */
  const fieldError = (field: AuthField): AuthErrorKey | undefined =>
    touched[field] ? errors[field] : undefined;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Un intento de envío también revela los errores de los campos que el
    // usuario nunca llegó a desenfocar.
    setTouched({ name: true, email: true, password: true });

    if (Object.keys(authErrors(mode, values)).length > 0) return;

    // TODO(backend): no hay autenticación real; aquí iría el registro/login.
    setSubmitting(true);
    router.push({ pathname: '/mi-santuario' });
  };

  return {
    mode,
    setMode,
    values,
    change,
    blur,
    fieldError,
    submitting,
    submit,
    recovery,
    recovering: recovery !== 'off',
    startRecovery: () => setRecovery('asking'),
    recoverySent: () => setRecovery('sent'),
    recoveryBack: () => setRecovery('off'),
  };
}
