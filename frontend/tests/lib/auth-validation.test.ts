import { describe, expect, it } from 'vitest';

import { authErrors, isAuthValid } from '@/lib/auth/validation';

describe('authErrors', () => {
  it('marca un correo con forma inválida y acepta uno válido', () => {
    expect(
      authErrors('login', { name: '', email: 'no-es-un-correo', password: 'password123' }).email,
    ).toBe('auth.errors.emailInvalid');

    expect(
      authErrors('login', { name: '', email: 'ana@ejemplo.com', password: 'password123' }).email,
    ).toBeUndefined();
  });

  it('marca una contraseña de menos de 8 caracteres y acepta una de 8 o más', () => {
    expect(
      authErrors('login', { name: '', email: 'ana@ejemplo.com', password: '1234567' }).password,
    ).toBe('auth.errors.passwordShort');

    expect(
      authErrors('login', { name: '', email: 'ana@ejemplo.com', password: '12345678' }).password,
    ).toBeUndefined();
  });

  it('exige nombre no vacío sólo en registro', () => {
    expect(
      authErrors('register', { name: '', email: 'ana@ejemplo.com', password: 'password123' })
        .name,
    ).toBe('auth.errors.nameRequired');

    expect(
      authErrors('register', { name: '   ', email: 'ana@ejemplo.com', password: 'password123' })
        .name,
    ).toBe('auth.errors.nameRequired');

    expect(
      authErrors('register', { name: 'Ana', email: 'ana@ejemplo.com', password: 'password123' })
        .name,
    ).toBeUndefined();
  });

  it('ignora el nombre vacío en modo login', () => {
    expect(
      authErrors('login', { name: '', email: 'ana@ejemplo.com', password: 'password123' }).name,
    ).toBeUndefined();
  });
});

describe('isAuthValid', () => {
  it('es falso si algún campo tiene error', () => {
    expect(isAuthValid('register', { name: '', email: 'x', password: '123' })).toBe(false);
    expect(
      isAuthValid('login', { name: '', email: 'no-es-un-correo', password: 'password123' }),
    ).toBe(false);
  });

  it('es verdadero cuando todos los campos aplicables son válidos', () => {
    expect(
      isAuthValid('register', { name: 'Ana', email: 'ana@ejemplo.com', password: 'password123' }),
    ).toBe(true);
    expect(
      isAuthValid('login', { name: '', email: 'ana@ejemplo.com', password: 'password123' }),
    ).toBe(true);
  });
});
