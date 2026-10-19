import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChangeEvent, FormEvent } from 'react';

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('@/i18n/navigation', () => ({ useRouter: () => router }));

import { useAuthForm } from '@/hooks/use-auth-form';

type Field = 'name' | 'email' | 'password';

function changeEvent(value: string): ChangeEvent<HTMLInputElement> {
  return { target: { value } } as unknown as ChangeEvent<HTMLInputElement>;
}

function submitEvent(): FormEvent<HTMLFormElement> {
  return { preventDefault: vi.fn() } as unknown as FormEvent<HTMLFormElement>;
}

type Form = ReturnType<typeof useAuthForm>;

function type(form: Form, field: Field, value: string) {
  act(() => form.change(field)(changeEvent(value)));
}

function fillValid(form: Form) {
  type(form, 'email', 'marisol@frecuencia.mx');
  type(form, 'password', 'resonancia');
}

describe('useAuthForm', () => {
  beforeEach(() => router.push.mockClear());

  it('empieza en login, sin errores visibles aunque los valores no sean válidos', () => {
    const { result } = renderHook(() => useAuthForm());

    expect(result.current.mode).toBe('login');
    expect(result.current.fieldError('email')).toBeUndefined();
  });

  it('revela el error de un campo al desenfocarlo y lo limpia al corregirlo', () => {
    const { result } = renderHook(() => useAuthForm());

    act(() => result.current.blur('email')());
    expect(result.current.fieldError('email')).toBe('auth.errors.emailInvalid');

    type(result.current, 'email', 'marisol@frecuencia.mx');
    expect(result.current.fieldError('email')).toBeUndefined();
  });

  it('sólo exige el nombre en el modo registro', () => {
    const { result } = renderHook(() => useAuthForm());

    act(() => result.current.setMode('register'));
    act(() => result.current.blur('name')());
    expect(result.current.fieldError('name')).toBe('auth.errors.nameRequired');

    act(() => result.current.setMode('login'));
    expect(result.current.fieldError('name')).toBeUndefined();
  });

  it('un envío inválido revela todos los errores y no navega', () => {
    const { result } = renderHook(() => useAuthForm());

    act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldError('email')).toBe('auth.errors.emailInvalid');
    expect(result.current.fieldError('password')).toBe('auth.errors.passwordShort');
    expect(router.push).not.toHaveBeenCalled();
    expect(result.current.submitting).toBe(false);
  });

  it('un envío válido marca el envío y navega al santuario', () => {
    const { result } = renderHook(() => useAuthForm());

    fillValid(result.current);
    act(() => result.current.submit(submitEvent()));

    expect(router.push).toHaveBeenCalledWith({ pathname: '/mi-santuario' });
    expect(result.current.submitting).toBe(true);
  });

  it('la recuperación recorre off → asking → sent → off', () => {
    const { result } = renderHook(() => useAuthForm());

    expect(result.current.recovery).toBe('off');
    expect(result.current.recovering).toBe(false);

    act(() => result.current.startRecovery());
    expect(result.current.recovery).toBe('asking');
    expect(result.current.recovering).toBe(true);

    act(() => result.current.recoverySent());
    expect(result.current.recovery).toBe('sent');

    act(() => result.current.recoveryBack());
    expect(result.current.recovery).toBe('off');
    expect(result.current.recovering).toBe(false);
  });
});
