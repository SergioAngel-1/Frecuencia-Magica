import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/cn';

describe('cn with the design tokens', () => {
  it('keeps a size token and a colour token side by side', () => {
    expect(cn('text-label', 'text-fg-muted')).toBe('text-label text-fg-muted');
    expect(cn('text-body', 'text-gold')).toBe('text-body text-gold');
  });

  it('still resolves real conflicts inside the same group', () => {
    expect(cn('text-fg-muted', 'text-fg-body')).toBe('text-fg-body');
    expect(cn('text-label', 'text-meta')).toBe('text-meta');
    expect(cn('tracking-ui', 'tracking-kicker')).toBe('tracking-kicker');
    expect(cn('shadow-glow-gold', 'shadow-glow-teal')).toBe('shadow-glow-teal');
  });

  it('keeps tokens and arbitrary values coherent', () => {
    expect(cn('text-label', 'text-[13px]')).toBe('text-[13px]');
    expect(cn('tracking-label', 'tracking-[.3em]')).toBe('tracking-[.3em]');
  });
});
