import { renderToString } from 'react-dom/server';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useMounted } from '@/hooks/use-mounted';

function Probe() {
  return <span>{String(useMounted())}</span>;
}

describe('useMounted', () => {
  it('es falso al renderizar en el servidor, para no desajustar la hidratación', () => {
    expect(renderToString(<Probe />)).toContain('false');
  });

  it('es verdadero una vez que el cliente ha pintado', () => {
    const { result } = renderHook(() => useMounted());

    expect(result.current).toBe(true);
  });
});
