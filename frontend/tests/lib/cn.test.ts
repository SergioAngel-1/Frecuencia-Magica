import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/cn';

describe('cn with the design tokens', () => {
  it('keeps a size token and a colour token side by side', () => {
    expect(cn('text-label', 'text-fg-muted')).toBe('text-label text-fg-muted');
    expect(cn('text-body', 'text-gold')).toBe('text-body text-gold');
  });

  it('keeps the atmosphere tokens apart from sizes and resolves their conflicts', () => {
    expect(cn('text-label', 'text-accent')).toBe('text-label text-accent');
    expect(cn('text-fg-body', 'text-fg-meta')).toBe('text-fg-meta');
    expect(cn('text-fg', 'text-accent-2')).toBe('text-accent-2');
    expect(cn('border-line', 'border-line-strong')).toBe('border-line-strong');
    expect(cn('bg-surface', 'bg-surface-strong')).toBe('bg-surface-strong');
  });

  it('still resolves real conflicts inside the same group', () => {
    expect(cn('text-fg-muted', 'text-fg-body')).toBe('text-fg-body');
    expect(cn('text-label', 'text-meta')).toBe('text-meta');
    expect(cn('tracking-ui', 'tracking-kicker')).toBe('tracking-kicker');
    expect(cn('shadow-glow-gold', 'shadow-glow-teal')).toBe('shadow-glow-teal');
  });

  it('registers the serif size scale as sizes, apart from colours', () => {
    expect(cn('text-serif-md', 'text-fg')).toBe('text-serif-md text-fg');
    expect(cn('text-serif-md', 'text-accent')).toBe('text-serif-md text-accent');
    expect(cn('text-serif-md', 'text-meta')).toBe('text-meta');
    expect(cn('text-serif-sm', 'text-serif-3xl')).toBe('text-serif-3xl');
    expect(cn('text-label', 'text-serif-xl')).toBe('text-serif-xl');
  });

  it('keeps tokens and arbitrary values coherent', () => {
    expect(cn('text-label', 'text-[13px]')).toBe('text-[13px]');
    expect(cn('tracking-label', 'tracking-[.3em]')).toBe('tracking-[.3em]');
  });
});
