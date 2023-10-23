import { LexOutput } from '@acer-academy-learning/common-ui';
import {
  CreateTakeSchema,
  QuizAnswer,
} from '@acer-academy-learning/data-access';
import React from 'react';
import { FieldPath, useFormContext } from 'react-hook-form';

const registerNameForStudentAnswers = (
  questionNumber: number,
  index: number,
  type?: React.HTMLInputTypeAttribute,
): FieldPath<CreateTakeSchema> => {
  return `studentAnswers.${questionNumber - 1}.studentAnswer.${
    type === 'checkbox' ? index : 0
  }`;
};

export type MCQAnswerOptions = {
  questionNumber: number;
  answers: QuizAnswer[];
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const QuizSelectAnswerOptions = ({
  answers,
  questionNumber,
  type,
}: MCQAnswerOptions) => {
  const { register } = useFormContext<CreateTakeSchema>();

  return (
    <>
      {answers.map((answer, index) => (
        <label
          className="border border-gray-400 bg-white p-3 text-base rounded hover:border-student-primary-600 flex items-center space-x-3 cursor-pointer"
          key={answer.id}
        >
          <input
            className="text-student-primary-600 focus:ring-student-primary-600"
            type={type}
            value={answer.answer}
            {...register(
              registerNameForStudentAnswers(questionNumber, index, type),
            )}
            aria-labelledby={
              register(
                registerNameForStudentAnswers(questionNumber, index, type),
              ).name
            }
          />
          <LexOutput editorStateStr={answer.answer} />
        </label>
      ))}
    </>
  );
};
