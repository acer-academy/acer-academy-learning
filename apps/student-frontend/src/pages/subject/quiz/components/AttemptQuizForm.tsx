import {
  GenericButton,
  WarningModal,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import {
  LEX_DEFAULT_JSON_STRING,
  QuizData,
  QuizQuestionTypeEnum,
  createTakeSchema,
} from '@acer-academy-learning/data-access';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FieldErrors, FormProvider } from 'react-hook-form';
import { QuizQuestionCard } from './QuizQuestionCard';
import { AttemptQuizSideNav } from './AttemptQuizSideNav';
import {
  AttemptQuizContextProvider,
  AttemptQuizContextState,
} from '../context/AttemptQuizContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreateTakeSchema } from 'libs/data-access/src/lib/types/take';
import { GenericModal } from '../../../profile/components/GenericModal';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MS_IN_SECOND } from './QuizTimer';

const COUNTDOWN_DURATION = 5000;

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
          studentAnswer:
            question.quizQuestion.questionType ===
            QuizQuestionTypeEnum.SHORT_ANSWER
              ? [LEX_DEFAULT_JSON_STRING]
              : [],
          timeTaken: 0,
        })),
      }),
      [quiz],
    ),
  });

  // Pre-mature submit states
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);

  // Countdown timer states
  const [isCardShowing, setIsCardShowing] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const lastTickTiming = useRef<number | null>(null);
  const timerIdRef = useRef<NodeJS.Timer | null>(null);
  const [currentCountDownDuration, setCurrentCountDownDuration] =
    useState(COUNTDOWN_DURATION);
  const timeAllowedInMS = useMemo(() => {
    const timeAllowedInSec = quiz.timeAllowed;
    if (timeAllowedInSec) {
      return timeAllowedInSec * MS_IN_SECOND;
    }
  }, [quiz.timeAllowed]);

  // Question number states
  const currentQuestionIndex = useMemo(
    () => parseInt(location.hash.slice(1)),
    [location],
  );
  const canNavigatePrevious = useMemo(
    () => currentQuestionIndex !== 1,
    [currentQuestionIndex],
  );
  const canNavigateNext = useMemo(
    () => currentQuestionIndex !== quiz.quizQuestions.length,
    [currentQuestionIndex, quiz],
  );

  // Context
  const contextState: AttemptQuizContextState = useMemo(
    () => ({
      quiz: quiz,
      timeAllowedInMS: timeAllowedInMS,
    }),
    [quiz, timeAllowedInMS],
  );

  const {
    quizQuestion: currentQuestion,
    quizQuestionIndex: questionNumber,
    quizQuestionMarks,
  } = useMemo(() => {
    setIsCardShowing(false);
    setTimeout(() => setIsCardShowing(true), 100);
    return quiz.quizQuestions[currentQuestionIndex - 1];
  }, [currentQuestionIndex, quiz]);

  const onError = useCallback(
    (errors: FieldErrors<CreateTakeSchema>) => {
      const msg = Object.entries(errors).map(([type, errorObj]) => (
        <p key={type} className="space-y-1">
          <strong>
            {type.charAt(0).toLocaleUpperCase() +
              type
                .substring(1)
                .split(/(?=[A-Z])/)
                .join(' ')}{' '}
            Error{' '}
          </strong>
          {errorObj.message ?? errorObj.root?.message}
        </p>
      ));
      console.error(errors);
      displayToast(<div key={'quiz-error-msg'}>{msg}</div>, ToastType.ERROR);
    },
    [ToastType.ERROR, displayToast],
  );
  const watchTimeTaken = formMethods.watch('timeTaken');

  useEffect(() => {
    if (!timeAllowedInMS) return;
    if (watchTimeTaken >= timeAllowedInMS && !isTimeUp) {
      setIsTimeUp(true);
      lastTickTiming.current = Date.now();
      timerIdRef.current = setInterval(() => {
        const now = Date.now();
        const prev = lastTickTiming.current ?? now;
        const timePassed = now - prev;
        setCurrentCountDownDuration((curr) => {
          const newCurr = curr - timePassed;
          if (newCurr <= 0) {
            if (timerIdRef.current) {
              clearInterval(timerIdRef.current);
            }
            return 0;
          } else {
            return newCurr;
          }
        });
        lastTickTiming.current = now;
      }, 1);
    }
  }, [
    watchTimeTaken,
    setIsTimeUp,
    isTimeUp,
    timeAllowedInMS,
    currentCountDownDuration,
  ]);

  useEffect(() => {
    if (currentCountDownDuration === 0) {
      formMethods.handleSubmit(onSubmitForm, onError)();
    }
    // Can't include deps because it will infinitely render
  }, [currentCountDownDuration]);

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

  const validateSubmitForm = async (values: CreateTakeSchema) => {
    const allHasBeenFilled = values.studentAnswers.reduce((curr, answer) => {
      const ans = answer.studentAnswer.reduce(
        (currVal, ans) =>
          (typeof ans === 'string' && ans !== LEX_DEFAULT_JSON_STRING) ||
          currVal,
        false,
      );
      return curr && typeof ans === 'boolean' && ans;
    }, true);
    console.log(allHasBeenFilled);
    if (!allHasBeenFilled) {
      setShowSubmitWarning(true);
      return;
    }
    onSubmitForm(values);
  };

  return (
    <AttemptQuizContextProvider value={contextState}>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(validateSubmitForm, onError)}
          className="flex space-x-1 h-full"
        >
          <section className="relative w-full flex flex-col flex-[4] justify-center">
            <QuizQuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={questionNumber}
              marks={quizQuestionMarks}
              className={`${
                isCardShowing ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300`}
              bannerClassName={`bg-student-primary-600 text-white `}
            />
            <nav className="flex space-x-4 justify-end">
              {canNavigatePrevious && (
                <GenericButton
                  text="Previous"
                  onClick={handlePrevPage}
                  type="button"
                  className="bg-student-primary-600 hover:bg-student-primary-700 text-white self-center w-24"
                />
              )}
              {canNavigateNext && (
                <GenericButton
                  text="Next"
                  type="button"
                  onClick={handleNextPage}
                  className="bg-student-primary-600 hover:bg-student-primary-700 text-white self-center w-24"
                />
              )}
            </nav>
            <nav className="rounded bg-white border border-gray-200 absolute bottom-0 space-x-4 w-full p-2 flex justify-end">
              <GenericButton
                type="submit"
                className="bg-student-primary-600 hover:bg-student-primary-700 text-white self-center w-24"
              />
            </nav>
          </section>
          <AttemptQuizSideNav className="flex-1" />
          <GenericModal
            title="Quiz Over"
            isOpen={isTimeUp}
            setIsOpen={setIsTimeUp}
          >
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                className="rounded-md bg-white text-student-primary-500 hover:text-student-primary-600 focus:outline-none focus:ring-2 focus:ring-student-primary-600 focus:ring-offset-2"
                onClick={() => setIsTimeUp(false)}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <p>Time's Up! Submitting your answer in ...</p>
            <p className="text-3xl text-center">
              {Math.floor(currentCountDownDuration / MS_IN_SECOND)}
            </p>
            <GenericButton
              onClick={() => {
                if (timerIdRef.current) {
                  clearInterval(timerIdRef.current);
                }
                formMethods.handleSubmit(onSubmitForm, onError)();
              }}
              type="submit"
              text="Ok"
              className={`bg-student-primary-600 hover:bg-student-primary-700 w-24 self-center mt-4`}
            />
          </GenericModal>
          <WarningModal
            open={showSubmitWarning}
            setOpen={setShowSubmitWarning}
            title="Submit Quiz Confirmation"
            description="You have questions which are not answered. Are you sure you want to submit?"
            confirmContent={'Submit'}
            dismissContent={'Cancel'}
            onConfirm={formMethods.handleSubmit(onSubmitForm, onError)}
          />
        </form>
      </FormProvider>
    </AttemptQuizContextProvider>
  );
};
