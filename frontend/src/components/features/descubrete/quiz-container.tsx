'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { QUESTIONS } from '@/data/questions';
import { useQuiz } from '@/hooks/use-quiz';
import type { Audio } from '@/types/content';

import { IntroStep } from './intro-step';
import { QuizLayout } from './quiz-layout';
import { QuizStep } from './quiz-step';
import { ResultStep } from './result-step';
import { TuningStep } from './tuning-step';

type QuizContainerProps = {
  audios: readonly Audio[];
};

export function QuizContainer({ audios }: QuizContainerProps) {
  const t = useTranslations('discover');
  const quiz = useQuiz(QUESTIONS);
  const [resolvedAudio, setResolvedAudio] = useState<Audio | null>(null);

  useEffect(() => {
    if (quiz.resultHz) {
      const found = audios.find((a) => a.hz === quiz.resultHz) ?? null;
      setResolvedAudio(found);
    }
  }, [quiz.resultHz, audios]);

  const question = QUESTIONS[quiz.currentQuestion];

  return (
    <QuizLayout>
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
          options={question.optionKeys.map(
            (k) => t(k as 'questions.q1.options.0'),
          )}
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
        <TuningStep
          tuningLabel={t('tuning')}
          onFinish={quiz.finishTune}
        />
      )}

      {quiz.step === 'result' && quiz.resultHz && resolvedAudio && (
        <ResultStep
          kicker={t('result.kicker')}
          hz={quiz.resultHz}
          band={resolvedAudio.band}
          description={t(`frequencies.${quiz.resultHz}` as 'frequencies.432')}
          ctaLabel={t('result.cta')}
          restartLabel={t('result.restart')}
          onRestart={quiz.reset}
        />
      )}
    </QuizLayout>
  );
}
