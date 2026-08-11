import type { ReactNode } from 'react';

import { PageShell } from '@/components/layout';
import { cn } from '@/lib/cn';

type QuizLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function QuizLayout({ children, className }: QuizLayoutProps) {
  return (
    <PageShell
      width="result"
      padding="centered"
      className={cn(
        'flex min-h-dvh flex-col items-center justify-center text-center',
        className,
      )}
    >
      {children}
    </PageShell>
  );
}
