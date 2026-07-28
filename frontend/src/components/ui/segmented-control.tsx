'use client';

import { useRef, type KeyboardEvent } from 'react';

import { cn } from '@/lib/cn';

export interface SegmentedControlOption<Value extends string = string> {
  value: Value;
  /** Texto ya traducido de la opción (p. ej. "Entrar" / "Crear cuenta"). */
  label: string;
}

interface SegmentedControlProps<Value extends string = string> {
  options: SegmentedControlOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
  /** Nombre accesible del `tablist` completo (p. ej. "Acceso a tu cuenta"). */
  ariaLabel: string;
  className?: string;
}

/**
 * Conmutador login/registro del prototipo: pill contenedor con padding 5px
 * y `backdrop-filter: blur(10px)`, opciones flexibles en serif 18px. La
 * opción activa lleva fondo dorado tenue; el resto, texto ivory atenuado.
 *
 * Se modela como un `tablist` de un solo nivel (no hay paneles asociados,
 * sólo cambia qué formulario se muestra) con **roving tabindex**: sólo la
 * pestaña activa es alcanzable por Tab; ←/→ (y Home/End) mueven el foco
 * *y* seleccionan la opción a la vez, que es el comportamiento esperado de
 * un conmutador de dos estados según el patrón APG de tabs.
 *
 * Necesita `"use client"` por los listeners de teclado y el manejo de foco
 * imperativo (`ref` a cada botón) — no por tener estado propio: `value`/
 * `onChange` viven en el padre.
 */
export function SegmentedControl<Value extends string = string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<Value>) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectAndFocus = (index: number): void => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number): void => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        selectAndFocus((index + 1) % options.length);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        selectAndFocus((index - 1 + options.length) % options.length);
        break;
      case 'Home':
        event.preventDefault();
        selectAndFocus(0);
        break;
      case 'End':
        event.preventDefault();
        selectAndFocus(options.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'flex max-w-[340px] gap-[6px] rounded-pill border border-glass-brd bg-glass p-[5px] backdrop-blur-[10px]',
        className,
      )}
    >
      {options.map((option, index) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'min-h-11 flex-1 rounded-pill py-[11px] font-serif text-[18px] tracking-[.04em]',
              'transition-colors duration-300 ease-out',
              active ? 'bg-[rgba(216,185,120,0.16)] text-ivory' : 'bg-transparent text-[rgba(247,244,234,0.55)]',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
