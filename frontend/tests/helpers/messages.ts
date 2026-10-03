import en from '../../messages/en.json';
import es from '../../messages/es.json';

type Json = string | Json[] | { [key: string]: Json };

/** Aplana el diccionario a rutas de clave tipo `home.heroKicker`. */
export function flatten(value: Json, prefix = ''): Record<string, string> {
  if (typeof value === 'string') return { [prefix]: value };

  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value);

  return entries.reduce<Record<string, string>>((acc, [key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return { ...acc, ...flatten(child as Json, path) };
  }, {});
}

export const flatEs = flatten(es as Json);
export const flatEn = flatten(en as Json);

/** Variables ICU de un mensaje (`{title}`, `{count, plural, …}` → `title`, `count`). */
export function icuArguments(message: string): string[] {
  return [...new Set([...message.matchAll(/\{(\w+)\s*[},]/g)].map((match) => match[1]!))];
}
