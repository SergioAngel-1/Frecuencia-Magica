import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // El ruido de depuración no llega a producción; los avisos y errores sí.
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // Los imports sólo-de-tipo se marcan para que el bundler pueda eliminarlos.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      // Lo no usado es un error, salvo que se marque deliberadamente con _.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts'],
  },
  // Debe ir el último: desactiva las reglas de formato que chocan con Prettier.
  prettier,
];

export default eslintConfig;
