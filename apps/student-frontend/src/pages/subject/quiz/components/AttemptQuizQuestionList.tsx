import React from 'react';
import { FieldArrayWithId, useFieldArray } from 'react-hook-form';
import { CreateTakeSchema } from '@acer-academy-learning/data-access';
import { Link } from 'react-router-dom';

type QuestionRowProps = {
  answer: FieldArrayWithId<
    {
      attemptedAt: Date;
      timeTaken: number;
      studentAnswers: {
        timeTaken: number;
        questionId: string;
        studentAnswer: string[];
      }[];
      quizId: string;
    },
    'studentAnswers',
    'id'
  >;
  questionNumber: number;
};

const QuestionRow = ({ answer, questionNumber }: QuestionRowProps) => {
  return (
    <Link
      to={`#${questionNumber}`}
      className="underline text-student-primary-600 hover:no-underline"
    >
      Question {questionNumber}
    </Link>
  );
};

export const AttemptQuizQuestionList = () => {
  const { fields: answers } = useFieldArray<CreateTakeSchema>({
    name: 'studentAnswers',
  });
  return (
    <>
      <p className="text-xl font-bold">Questions: </p>
      {answers.map((answer, index) => (
        <QuestionRow answer={answer} questionNumber={index + 1} />
      ))}
    </>
  );
};
