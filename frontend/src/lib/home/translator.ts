import type { getTranslations } from 'next-intl/server';

/**
 * Traductor del servidor. Los builders de la Home lo reciben por parámetro:
 * así no leen i18n por su cuenta y se prueban con un traductor de mentira.
 */
export type Translator = Awaited<ReturnType<typeof getTranslations>>;
