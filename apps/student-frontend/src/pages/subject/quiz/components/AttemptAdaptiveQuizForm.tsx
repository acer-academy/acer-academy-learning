import {
  CreateAdaptiveTakeSchema,
  LEX_DEFAULT_JSON_STRING,
  QuizQuestionData,
  QuizQuestionDifficultyEnum,
  QuizQuestionTypeEnum,
  createAdaptiveQuizTakeSchema,
} from '@acer-academy-learning/data-access';
import { useMemo, useState } from 'react';
import {
  GenericButton,
  ProgressBar,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import { getDifficultyBasedOn } from '../utils/getDifficultyBasedOn';
import { FormProvider } from 'react-hook-form';
import { AdaptiveQuizQuestionCard } from './AdaptiveQuizQuestionCard';
import { AdaptiveQuizResults } from './AdaptiveQuizResults';
import { MS_IN_SECOND } from './QuizTimer';

export type AttemptAdaptiveQuizFormProps = {
  thresholds: {
    [key in QuizQuestionDifficultyEnum]: number;
  };
  questions: QuizQuestionData[];
};

export const AttemptAdaptiveQuizForm = ({
  thresholds,
  questions,
}: AttemptAdaptiveQuizFormProps) => {
  const formMethods = useZodForm({
    schema: createAdaptiveQuizTakeSchema,
    defaultValues: {
      timeTaken: 0,
    },
  });

  const [isCardShowing, setIsCardShowing] = useState(false);
  const [answers, setAnswers] = useState<{
    [key: string]: {
      isCorrect: boolean;
      studentAnswer: CreateAdaptiveTakeSchema['studentAnswer'];
    };
  }>({});

  const wrangledQuestions = useMemo(
    () =>
      questions.reduce(
        (curr, question) => {
          if (question.difficulty === QuizQuestionDifficultyEnum.BASIC) {
            curr[QuizQuestionDifficultyEnum.BASIC].push(question);
          } else if (
            question.difficulty === QuizQuestionDifficultyEnum.INTERMEDIATE
          ) {
            curr[QuizQuestionDifficultyEnum.INTERMEDIATE].push(question);
          } else {
            curr[QuizQuestionDifficultyEnum.ADVANCED].push(question);
          }
          return curr;
        },
        {
          [QuizQuestionDifficultyEnum.BASIC]: [] as QuizQuestionData[],
          [QuizQuestionDifficultyEnum.INTERMEDIATE]: [] as QuizQuestionData[],
          [QuizQuestionDifficultyEnum.ADVANCED]: [] as QuizQuestionData[],
        },
      ),
    [questions],
  );

  const {
    numOfCorrectQuestions,
    currentDifficulty,
    currentPercentage,
    nextIndex,
    currStageCorrectQuestions,
    currStageTotalNumberOfQuestionsToClear,
  } = useMemo(() => {
    const numOfCorrectQuestions = Object.entries(answers).reduce(
      (curr, [key, answer]) => (answer.isCorrect ? ++curr : curr),
      0,
    );
    const currentDifficulty = getDifficultyBasedOn(
      numOfCorrectQuestions,
      thresholds,
    );

    const totalNumberOfQuestionsBuffer =
      currentDifficulty === QuizQuestionDifficultyEnum.BASIC
        ? thresholds.BASIC
        : currentDifficulty === QuizQuestionDifficultyEnum.INTERMEDIATE
        ? thresholds.INTERMEDIATE - thresholds.BASIC
        : thresholds.ADVANCED - thresholds.INTERMEDIATE;
    const currStageCorrectQuestions =
      currentDifficulty !== QuizQuestionDifficultyEnum.BASIC
        ? currentDifficulty === QuizQuestionDifficultyEnum.INTERMEDIATE
          ? numOfCorrectQuestions - thresholds.BASIC
          : numOfCorrectQuestions - thresholds.INTERMEDIATE
        : numOfCorrectQuestions;
    const currStageTotalNumberOfQuestionsToClear =
      totalNumberOfQuestionsBuffer === 0
        ? currStageCorrectQuestions
        : totalNumberOfQuestionsBuffer;
    const currentPercentage = Math.ceil(
      (currStageCorrectQuestions / currStageTotalNumberOfQuestionsToClear) *
        100,
    );

    const offSet =
      currentDifficulty !== QuizQuestionDifficultyEnum.BASIC
        ? currentDifficulty === QuizQuestionDifficultyEnum.INTERMEDIATE
          ? thresholds.BASIC
          : thresholds.INTERMEDIATE
        : 0;
    const nextIndex = Object.entries(answers).length - offSet;

    return {
      nextIndex,
      numOfCorrectQuestions,
      currentDifficulty,
      currentPercentage,
      currStageCorrectQuestions,
      currStageTotalNumberOfQuestionsToClear,
    };
  }, [answers, thresholds]);
  const questionNumber = useMemo(
    () => Object.entries(answers).length + 1,
    [answers],
  );

  const currentStage = useMemo(
    () =>
      Object.values(QuizQuestionDifficultyEnum).findIndex(
        (difficulty) => difficulty === currentDifficulty,
      ) + 1,
    [currentDifficulty],
  );

  const currentQuestion = useMemo(() => {
    const currQuestion = wrangledQuestions[currentDifficulty][nextIndex];
    if (currQuestion && questionNumber <= 10) {
      setIsCardShowing(false);
      setTimeout(() => setIsCardShowing(true), 100);
      formMethods.setValue('studentAnswer.questionId', currQuestion.id);
      formMethods.setValue(
        'studentAnswer.studentAnswer',
        currQuestion.questionType === QuizQuestionTypeEnum.SHORT_ANSWER
          ? [LEX_DEFAULT_JSON_STRING]
          : [],
      );
      formMethods.setValue('studentAnswer.timeTaken', 0);
      formMethods.setValue('studentAnswer.question', currQuestion);
      return currQuestion;
    }
  }, [
    questionNumber,
    wrangledQuestions,
    currentDifficulty,
    formMethods,
    nextIndex,
  ]);

  const onSubmit = async (values: CreateAdaptiveTakeSchema) => {
    // Validate and push to answer
    if (currentQuestion) {
      let isCorrect = false;
      const answersForCurrQuestion = currentQuestion?.answers
        .filter((answer) => answer.isCorrect)
        .map((answer) => answer.answer);
      const currStudentAnswer = values.studentAnswer.studentAnswer.filter(
        (answer): answer is string => typeof answer === 'string',
      );
      values.studentAnswer.timeTaken = Math.floor(
        values.studentAnswer.timeTaken / MS_IN_SECOND,
      );
      if (
        currStudentAnswer.length === answersForCurrQuestion.length ||
        currentQuestion.questionType === QuizQuestionTypeEnum.SHORT_ANSWER
      ) {
        isCorrect = currStudentAnswer.reduce(
          (curr, answer) => curr && answersForCurrQuestion.includes(answer),
          true,
        );
      }
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          isCorrect: isCorrect,
          studentAnswer: values.studentAnswer,
        },
      }));
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="h-full space-y-1 flex flex-col w-full relative justify-between items-center"
      >
        {(currentQuestion && (
          <>
            <div className="w-full flex flex-col items-center">
              <p className="my-4 text-xl font-semibold">
                Stage {currentStage}: {currentDifficulty}
              </p>
              <ProgressBar
                width={currentPercentage}
                rounded
                unfinishedClassName="w-[60%] box-content border border-black border-2"
              />
              <p className="font-semibold space-x-1">
                Answer{' '}
                {currStageTotalNumberOfQuestionsToClear -
                  currStageCorrectQuestions}{' '}
                Questions Correctly to Advance to the Next Stage!
              </p>
            </div>
            {/* To remove or change */}
            {/* <p className="flex-start">
              Num of correct: {numOfCorrectQuestions}, Thresholds: Basic -{' '}
              {thresholds.BASIC}, Intermediate - {thresholds.INTERMEDIATE}
            </p> */}
            <AdaptiveQuizQuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={questionNumber}
              marks={1}
              className={`${
                isCardShowing ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300 self-center w-full`}
              bannerClassName={`bg-student-primary-600 text-white `}
            />
            <nav
              className={`rounded bg-white border border-gray-200 space-x-4 w-full p-2 flex justify-end`}
            >
              <GenericButton
                type="submit"
                className="bg-student-primary-900 hover:bg-student-secondary-700 text-white self-center w-24"
              />
            </nav>
          </>
        )) || (
          <AdaptiveQuizResults
            currentDifficulty={currentDifficulty}
            currentStageNumberOfCorrect={currStageCorrectQuestions}
            currentStageTotalNumberOfQuestions={
              currStageTotalNumberOfQuestionsToClear
            }
            answers={answers}
          />
        )}
      </form>
    </FormProvider>
  );
};
