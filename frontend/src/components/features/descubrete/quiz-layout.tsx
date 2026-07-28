import type { ReactNode } from 'react';

import { PageShell } from '@/components/layout';
import { cn } from '@/lib/cn';

type QuizLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function QuizLayout({ children, className }: QuizLayoutProps) {
  return (
    <PageShell width="result" className={cn('flex flex-col items-center text-center', className)}>
      {children}
    </PageShell>
  );
}
