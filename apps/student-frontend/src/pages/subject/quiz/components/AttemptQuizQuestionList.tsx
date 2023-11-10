import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  CreateTakeSchema,
  LEX_DEFAULT_JSON_STRING,
} from '@acer-academy-learning/data-access';
import { Link } from 'react-router-dom';

type QuestionRowProps = {
  answer: {
    timeTaken: number;
    questionId: string;
  } & {
    studentAnswer: (string | boolean)[];
  };
  questionNumber: number;
};

const QuestionRow = ({ answer, questionNumber }: QuestionRowProps) => {
  const hasFilledInAnswer = useMemo(
    () =>
      answer.studentAnswer.reduce(
        (curr, ans) =>
          (typeof ans === 'string' && ans !== LEX_DEFAULT_JSON_STRING) || curr,
        false,
      ),
    [answer],
  );
  return (
    <Link
      to={`#${questionNumber}`}
      className="underline text-student-primary-900 hover:no-underline hover:text-student-secondary-900"
    >
      {hasFilledInAnswer ? '✅ ' : '❌ '}
      Question {questionNumber}
    </Link>
  );
};

export const AttemptQuizQuestionList = () => {
  const { control } = useFormContext<CreateTakeSchema>();
  const answers = useWatch({
    control: control,
    name: 'studentAnswers',
  });
  return (
    <>
      <p className="text-xl font-bold">Questions: </p>
      {answers.map((answer, index) => (
        <QuestionRow key={index} answer={answer} questionNumber={index + 1} />
      ))}
    </>
  );
};
