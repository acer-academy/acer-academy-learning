import {
  GenericButton,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import { QuizData, createTakeSchema } from '@acer-academy-learning/data-access';
import { useMemo, useState } from 'react';
import { FieldErrors, FormProvider } from 'react-hook-form';
import { QuizQuestionCard } from './QuizQuestionCard';
import { AttemptQuizSideNav } from './AttemptQuizSideNav';
import { AttemptQuizContextProvider } from '../context/AttemptQuizContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreateTakeSchema } from 'libs/data-access/src/lib/types/take';

export type AttemptQuizFormProps = {
  quiz: QuizData;
  onSubmitForm: (values: CreateTakeSchema) => Promise<void>;
};

export const AttemptQuizForm = ({
  quiz,
  onSubmitForm,
}: AttemptQuizFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { displayToast, ToastType } = useToast();
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
  const canNavigatePrevious = useMemo(
    () => currentQuestionIndex !== 1,
    [currentQuestionIndex],
  );
  const canNavigateNext = useMemo(
    () => currentQuestionIndex !== quiz.quizQuestions.length,
    [currentQuestionIndex, quiz],
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
    if (!canNavigatePrevious) {
      return;
    }
    const newIndex = currentQuestionIndex - 1;
    navigate('#' + newIndex);
  };

  const handleNextPage = () => {
    if (!canNavigateNext) {
      return;
    }
    const newIndex = currentQuestionIndex + 1;
    navigate('#' + newIndex);
  };

  const onError = (errors: FieldErrors<CreateTakeSchema>) => {
    const msg = Object.entries(errors).map(([type, errorObj]) => (
      <p key={type} className="space-y-1">
        <strong>
          {type.charAt(0).toLocaleUpperCase() +
            type
              .substring(1)
              .split(/(?=[A-Z])/)
              .join(' ')}{' '}
          Error:{' '}
        </strong>
        {errorObj.message ?? errorObj.root?.message}
      </p>
    ));
    console.error(errors);
    displayToast(<div key={'quiz-error-msg'}>{msg}</div>, ToastType.ERROR);
  };

  return (
    <AttemptQuizContextProvider value={contextState}>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmitForm, onError)}
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
            <nav className="flex space-x-4 justify-end">
              {canNavigatePrevious && (
                <GenericButton
                  text="Previous"
                  onClick={handlePrevPage}
                  type="button"
                  className="bg-student-primary-600 text-white self-center w-24"
                />
              )}
              {canNavigateNext && (
                <GenericButton
                  text="Next"
                  type="button"
                  onClick={handleNextPage}
                  className="bg-student-primary-600 text-white self-center w-24"
                />
              )}
            </nav>
            <nav className="rounded bg-white border border-gray-200 absolute bottom-0 space-x-4 w-full p-2 flex justify-end">
              <GenericButton
                type="submit"
                className="bg-student-primary-600 text-white self-center w-24"
              />
            </nav>
          </section>
          <AttemptQuizSideNav className="flex-1" />
        </form>
      </FormProvider>
    </AttemptQuizContextProvider>
  );
};
