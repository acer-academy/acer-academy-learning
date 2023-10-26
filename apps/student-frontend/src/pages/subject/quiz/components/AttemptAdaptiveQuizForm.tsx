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

export type AttemptAdaptiveQuizFormProps = {
  questions: QuizQuestionData[];
};

export const AttemptAdaptiveQuizForm = ({
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

  const numOfCorrectQuestions = useMemo(
    () =>
      Object.entries(answers).reduce(
        (curr, [key, answer]) => (answer.isCorrect ? ++curr : curr),
        0,
      ),
    [answers],
  );
  const questionNumber = useMemo(
    () => Object.entries(answers).length + 1,
    [answers],
  );

  const currentDifficulty = useMemo(
    () => getDifficultyBasedOn(numOfCorrectQuestions),
    [numOfCorrectQuestions],
  );
  const currentStage = useMemo(
    () =>
      Object.values(QuizQuestionDifficultyEnum).findIndex(
        (difficulty) => difficulty === currentDifficulty,
      ) + 1,
    [currentDifficulty],
  );

  const currentQuestion = useMemo(() => {
    const currQuestion = wrangledQuestions[currentDifficulty].pop();
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
      return currQuestion;
    }
  }, [numOfCorrectQuestions, questionNumber, wrangledQuestions, formMethods]);

  const onSubmit = async (values: CreateAdaptiveTakeSchema) => {
    console.log(values);
    // Validate and push to answer
    if (currentQuestion) {
      let isCorrect = false;
      const answersForCurrQuestion = currentQuestion?.answers
        .filter((answer) => answer.isCorrect)
        .map((answer) => answer.answer);
      const currStudentAnswer = values.studentAnswer.studentAnswer.filter(
        (answer): answer is string => typeof answer === 'string',
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
        className="h-full space-y-1 flex flex-col w-full relative justify-center items-center"
      >
        <div className="absolute top-0 w-full flex flex-col items-center">
          <p className="my-4 text-xl font-semibold">
            Stage {currentStage}: {currentDifficulty}
          </p>
          <ProgressBar
            width={50}
            rounded
            unfinishedClassName="w-[60%] box-content border border-black border-2"
          />
        </div>
        {/* To remove or change */}
        <p className="flex-start">Num of correct: {numOfCorrectQuestions}</p>
        {currentQuestion && (
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
        )}
        <nav className="rounded bg-white border border-gray-200 absolute bottom-0 space-x-4 w-full p-2 flex justify-end">
          <GenericButton
            type="submit"
            className="bg-student-primary-600 hover:bg-student-primary-700 text-white self-center w-24"
          />
        </nav>
      </form>
    </FormProvider>
  );
};
