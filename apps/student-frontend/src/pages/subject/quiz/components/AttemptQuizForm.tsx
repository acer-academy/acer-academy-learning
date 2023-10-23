import { GenericButton, useZodForm } from '@acer-academy-learning/common-ui';
import { QuizData, createTakeSchema } from '@acer-academy-learning/data-access';
import React, { useMemo, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { QuizQuestionCard } from './QuizQuestionCard';
import { AttemptQuizSideNav } from './AttemptQuizSideNav';
import { AttemptQuizContextProvider } from '../context/AttemptQuizContext';
import { useLocation, useNavigate } from 'react-router-dom';

export type AttemptQuizFormProps = {
  quiz: QuizData;
};

export const AttemptQuizForm = ({ quiz }: AttemptQuizFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const [isShowing, setIsShowing] = useState(false);
  const currentQuestionIndex = useMemo(
    () => parseInt(location.hash.slice(1)),
    [location],
  );
  const contextState = useMemo(
    () => ({
      quiz: quiz,
    }),
    [quiz],
  );

  const {
    quizQuestion: currentQuestion,
    quizQuestionIndex: questionNumber,
    quizQuestionMarks,
  } = useMemo(() => {
    setIsShowing(false);
    setTimeout(() => setIsShowing(true), 100);
    return quiz.quizQuestions[currentQuestionIndex - 1];
  }, [currentQuestionIndex, quiz]);

  const handlePrevPage = () => {
    if (currentQuestionIndex === 1) {
      return;
    }
    const newIndex = currentQuestionIndex - 1;
    navigate('#' + newIndex);
  };

  const handleNextPage = () => {
    if (currentQuestionIndex === quiz.quizQuestions.length) {
      return;
    }
    const newIndex = currentQuestionIndex + 1;
    navigate('#' + newIndex);
  };

  return (
    <AttemptQuizContextProvider value={contextState}>
      <FormProvider {...formMethods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(formMethods.getValues());
          }}
          className="flex space-x-1 h-full"
        >
          <section className="relative w-full flex flex-col flex-[4] justify-center">
            <QuizQuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={questionNumber}
              marks={quizQuestionMarks}
              className={`${
                isShowing ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300`}
              bannerClassName={`bg-student-primary-600 text-white `}
            />
            <nav className="absolute bottom-0 space-x-4">
              <GenericButton
                text="prev"
                onClick={handlePrevPage}
                type="button"
                className="bg-student-primary-600 text-white self-center"
              />
              <GenericButton
                text="next"
                type="button"
                onClick={handleNextPage}
                className="bg-student-primary-600 text-white self-center"
              />
              <GenericButton
                type="submit"
                className="bg-student-primary-600 text-white self-center"
              />
            </nav>
          </section>
          <AttemptQuizSideNav className="flex-1" />
        </form>
      </FormProvider>
    </AttemptQuizContextProvider>
  );
};
