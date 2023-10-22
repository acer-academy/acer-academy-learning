import { useZodForm } from '@acer-academy-learning/common-ui';
import { QuizData, createTakeSchema } from '@acer-academy-learning/data-access';
import React, { useMemo } from 'react';
import { FormProvider } from 'react-hook-form';
import { QuizQuestionCard } from './QuizQuestionCard';

export type AttemptQuizFormProps = {
  quiz: QuizData;
};

export const AttemptQuizForm = ({ quiz }: AttemptQuizFormProps) => {
  const formMethods = useZodForm({
    schema: createTakeSchema,
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: useMemo(
      () => ({
        quizId: quiz.id,
        timeTaken: 0,
        attemptedAt: new Date(),
        studentAnswers: quiz.quizQuestions.map((question) => ({
          questionId: question.quizQuestionId,
          studentAnswer: [],
          timeTaken: 0,
        })),
      }),
      [quiz],
    ),
  });
  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(formMethods.getValues());
        }}
        className="flex flex-col space-y-4"
      >
        {quiz.quizQuestions.map(
          ({ quizQuestion, quizQuestionIndex, quizQuestionMarks }, index) => (
            <QuizQuestionCard
              key={quizQuestionIndex}
              question={quizQuestion}
              questionNumber={quizQuestionIndex}
              marks={quizQuestionMarks}
              className="bg-student-primary-600 text-white"
            />
          ),
        )}
        <button>Hi</button>
      </form>
    </FormProvider>
  );
};
