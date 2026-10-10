'use client';

import { useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Swap } from '@/components/ui';
import { QUESTIONS } from '@/data/questions';
import { useDiscoverResult } from '@/hooks/use-discover-result';
import { usePortalReveal } from '@/hooks/use-portal-reveal';
import { useQuiz } from '@/hooks/use-quiz';
import { selectDiscoverMedia, type DiscoverMedia } from '@/lib/discover/media';
import type { DiscoverCatalog } from '@/lib/discover/recommend';
import { usePlayerStore } from '@/stores/player-store';

import { IntroStep } from './intro-step';
import { PhaseScene } from './phase-scene';
import { QuizLayout } from './quiz-layout';
import { QuizStep } from './quiz-step';
import { ResultStep } from './result-step';
import { TuningStep } from './tuning-step';

type QuizContainerProps = {
  catalog: DiscoverCatalog;
  media: DiscoverMedia;
};

export function QuizContainer({ catalog, media }: QuizContainerProps) {
  const t = useTranslations('discover');
  const quiz = useQuiz(QUESTIONS);
  const open = usePlayerStore((s) => s.open);
  const result = useDiscoverResult(quiz.answers, QUESTIONS, catalog, quiz.step === 'result');

  const portal = usePortalReveal();
  const { finishTune } = quiz;
  const { cover, arrive } = portal;

  // Al terminar de escuchar, el iris del portal cubre la pantalla; bajo la
  // noche se pasa al resultado, y la noche se abre cuando ya está montado.
  const revealResult = useCallback(() => cover(finishTune), [cover, finishTune]);
  const showingResult = quiz.step === 'result';

  useEffect(() => {
    if (showingResult) arrive();
  }, [showingResult, arrive]);

  const question = QUESTIONS[quiz.currentQuestion];

  return (
    // Cada fase es una escena: la anterior se funde a la noche y la nueva
    // amanece despacio (también de la última pregunta a la sintonía).
    <PhaseScene phase={quiz.step}>
      <QuizLayout phase={quiz.step} media={selectDiscoverMedia(quiz.step, media)}>
        {/* Cada paso —y cada pregunta— sale antes de que entre el siguiente. */}
        <Swap
          id={quiz.step === 'questions' ? `question-${quiz.currentQuestion}` : quiz.step}
          pace="calm"
        >
          {quiz.step === 'intro' && (
            <IntroStep
              kicker={t('kicker')}
              title={t('title')}
              intro={t('intro')}
              begin={t('begin')}
              onStart={quiz.start}
            />
          )}

          {quiz.step === 'questions' && question && (
            <QuizStep
              prompt={t(`questions.${question.id}.prompt` as 'questions.q1.prompt')}
              options={question.options.map(({ key }) => t(key as 'questions.q1.options.0'))}
              currentIndex={quiz.currentQuestion}
              total={quiz.totalQuestions}
              progressLabel={t('questionCount', {
                current: quiz.currentQuestion + 1,
                total: quiz.totalQuestions,
              })}
              backLabel={t('back')}
              onAnswer={quiz.answer}
              onBack={quiz.goBack}
            />
          )}

          {quiz.step === 'tuning' && (
            <TuningStep tuningLabel={t('tuning')} onFinish={revealResult} />
          )}

          {quiz.step === 'result' && result && (
            <ResultStep {...result} onListen={() => open(result.audio.id)} onRestart={quiz.reset} />
          )}
        </Swap>
      </QuizLayout>
    </PhaseScene>
  );
}
