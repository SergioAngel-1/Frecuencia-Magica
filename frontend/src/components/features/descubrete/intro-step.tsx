'use client';

import { Button, Display, Kicker } from '@/components/ui';

type IntroStepProps = {
  kicker: string;
  title: string;
  intro: string;
  begin: string;
  onStart: () => void;
};

export function IntroStep({ kicker, title, intro, begin, onStart }: IntroStepProps) {
  return (
    <>
      <Kicker tone="lav" spacing="widest">
        {kicker}
      </Kicker>
      <Display size="lg" level="h1" className="mt-2">
        {title}
      </Display>
      <p className="text-fg-soft mx-auto mt-5 mb-10 max-w-[52ch] text-[16px] leading-[1.85]">
        {intro}
      </p>
      <Button variant="primary" size="lg" onClick={onStart}>
        {begin}
      </Button>
    </>
  );
}
