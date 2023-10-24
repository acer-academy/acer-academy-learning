import {
  QuizQuestionData,
  QuizQuestionDifficultyEnum,
} from '@acer-academy-learning/data-access';
import React, { useEffect, useMemo } from 'react';
import { QuizQuestionCard } from './QuizQuestionCard';

export type AttemptAdaptiveQuizFormProps = {
  questions: QuizQuestionData[];
};

export const AttemptAdaptiveQuizForm = ({
  questions,
}: AttemptAdaptiveQuizFormProps) => {
  const wrangledQuestions = useMemo(
    () =>
      questions.reduce(
        (curr, question) => {
          if (question.difficulty === QuizQuestionDifficultyEnum.BASIC) {
            curr.basic.push(question);
          } else if (
            question.difficulty === QuizQuestionDifficultyEnum.INTERMEDIATE
          ) {
            curr.intermediate.push(question);
          } else {
            curr.advanced.push(question);
          }
          return curr;
        },
        {
          basic: [] as QuizQuestionData[],
          intermediate: [] as QuizQuestionData[],
          advanced: [] as QuizQuestionData[],
        },
      ),
    [questions],
  );
  useEffect(() => {
    console.log('QNS');
    console.log(wrangledQuestions);
  }, [wrangledQuestions]);

  return (
    <div>
      {/* <QuizQuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={questionNumber}
              marks={quizQuestionMarks}
              className={`${
                isCardShowing ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300`}
              bannerClassName={`bg-student-primary-600 text-white `}
            /> */}
    </div>
  );
};
