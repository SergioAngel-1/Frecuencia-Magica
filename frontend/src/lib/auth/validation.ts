export type AuthMode = 'login' | 'register';

export type AuthFormValues = {
  name: string;
  email: string;
  password: string;
};

/**
 * Claves de traducción (namespace `auth.errors`) que devuelve `authErrors`.
 * El componente las resuelve a texto con `useTranslations`; este módulo
 * nunca conoce el idioma.
 */
export type AuthErrorKey =
  | 'auth.errors.nameRequired'
  | 'auth.errors.emailInvalid'
  | 'auth.errors.passwordShort';

export type AuthFieldErrors = Partial<Record<keyof AuthFormValues, AuthErrorKey>>;

/** Forma mínima de correo válido: algo@algo.algo, sin espacios. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sin reglas de complejidad: sólo longitud mínima, como fija el brief. */
const MIN_PASSWORD_LENGTH = 8;

/**
 * Valida los campos del acceso según el modo activo.
 *
 * Pura: no lee el DOM ni el reloj, así que el mismo cálculo sirve para el
 * formulario en vivo y para el test. El nombre sólo se exige en `register`
 * — en `login` se ignora aunque venga vacío.
 */
export function authErrors(mode: AuthMode, values: AuthFormValues): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  if (mode === 'register' && values.name.trim().length === 0) {
    errors.name = 'auth.errors.nameRequired';
  }

  if (!EMAIL_RE.test(values.email)) {
    errors.email = 'auth.errors.emailInvalid';
  }

  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = 'auth.errors.passwordShort';
  }

  return errors;
}

/** `true` si ningún campo aplicable al modo tiene error. */
export function isAuthValid(mode: AuthMode, values: AuthFormValues): boolean {
  return Object.keys(authErrors(mode, values)).length === 0;
}
