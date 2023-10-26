import { screamingSnakeToTitleCase } from '@acer-academy-learning/common-ui';
import {
  CreateAdaptiveTakeSchema,
  QuizQuestionDifficultyEnum,
} from '@acer-academy-learning/data-access';
import React from 'react';
import SpiderChart from '../../quizResults/SpiderChart';
import { AdaptiveQuizQuestionRow } from './AdaptiveQuizQuestionRow';

export type AdaptiveQuizResultsProps = {
  currentDifficulty: QuizQuestionDifficultyEnum;
  currentStageNumberOfCorrect: number;
  currentStageTotalNumberOfQuestions: number;
  answers: {
    [key: string]: {
      isCorrect: boolean;
      studentAnswer: CreateAdaptiveTakeSchema['studentAnswer'];
    };
  };
};

export const AdaptiveQuizResults = ({
  answers,
  currentStageNumberOfCorrect,
  currentStageTotalNumberOfQuestions,
  currentDifficulty,
}: AdaptiveQuizResultsProps) => {
  return (
    <div className="h-full">
      <div className="flex min-h-full flex-col gap-7 align-middle">
        <div className="flex align-middle justify-between">
          <div className="flex align-middle gap-4">
            <div className="px-3 py-3 sm:px-3 space-y-2 flex flex-col">
              <span className="text-2xl py-1 font-bold tracking-tight">
                {`Adaptive Quiz Results`}
              </span>
              <div className="flex align-left gap-4">
                {currentStageNumberOfCorrect !==
                  currentStageTotalNumberOfQuestions && (
                  <span className="text-2xl py-1 font-bold tracking-tight">
                    Quiz Results:{' '}
                    {`${currentStageNumberOfCorrect}/ ${currentStageTotalNumberOfQuestions} for ${screamingSnakeToTitleCase(
                      currentDifficulty,
                    )} Stage.`}
                  </span>
                )}
                <span className="text-2xl py-1 font-bold tracking-tight">
                  {currentStageTotalNumberOfQuestions ===
                  currentStageNumberOfCorrect
                    ? 'Well done! You scored full marks!'
                    : 'You can do better!'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-fit">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4">
                {Object.entries(answers).map(([questionId, answer], index) => (
                  <AdaptiveQuizQuestionRow
                    key={questionId}
                    questionId={questionId}
                    take={answer.studentAnswer}
                    questionNumber={index + 1}
                    marks={1}
                    isCorrect={answer.isCorrect}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* <div className="gap-4">
            <div className="bg-white px-2 py-2 align-middle sm:px-2 lg:px-2">
              <span className="text-2xl px-3 py-4 font-bold tracking-tight">
                Spider Chart Analysis
              </span>
              <div className="h-screen	">
                <SpiderChart
                  subjectArr={spiderChart.subjectArr}
                  averageScoreArr={spiderChart.averageScoreArr}
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
