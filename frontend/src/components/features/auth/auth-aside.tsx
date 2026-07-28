import { getTranslations } from 'next-intl/server';

import { Band } from '@/components/ui';

export async function AuthAside() {
  const t = await getTranslations('auth');

  return (
    <aside className="relative hidden md:block" aria-label="auth-decoration">
      <Band
        gradient="linear-gradient(150deg,#16273f,#0a1220)"
        aspect="auto"
        className="sticky top-[130px] flex h-[calc(100vh-200px)] items-center justify-center rounded-card"
      >
        <div className="max-w-[280px] text-center">
          <p className="font-serif text-[20px] leading-relaxed text-gold/80 italic">
            &ldquo;{t('quote')}&rdquo;
          </p>
          <p className="mt-4 font-sans text-[11px] uppercase tracking-[.2em] text-ivory/40">
            — {t('quoteBy')}
          </p>
        </div>
      </Band>
    </aside>
  );
}
