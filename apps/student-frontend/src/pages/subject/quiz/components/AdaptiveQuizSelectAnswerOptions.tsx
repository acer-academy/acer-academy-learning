import { LexOutput } from '@acer-academy-learning/common-ui';
import {
  CreateAdaptiveTakeSchema,
  QuizAnswer,
} from '@acer-academy-learning/data-access';
import React from 'react';
import { FieldPath, useFormContext } from 'react-hook-form';

const registerNameForStudentAnswers = (
  index: number,
  type?: React.HTMLInputTypeAttribute,
): FieldPath<CreateAdaptiveTakeSchema> => {
  return `studentAnswer.studentAnswer.${type === 'checkbox' ? index : 0}`;
};

export type AdaptiveQuizSelectAnswerOptions = {
  answers: QuizAnswer[];
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const AdaptiveQuizSelectAnswerOptions = ({
  answers,
  type,
}: AdaptiveQuizSelectAnswerOptions) => {
  const { register } = useFormContext<CreateAdaptiveTakeSchema>();

  return (
    <>
      {answers.map((answer, index) => (
        <label
          className="border border-gray-400 bg-white p-3 text-base rounded hover:border-student-secondary-700 flex items-center space-x-3 cursor-pointer"
          key={answer.id}
        >
          <input
            className="text-student-secondary-700 focus:ring-student-secondary-700"
            type={type}
            value={answer.answer}
            {...register(registerNameForStudentAnswers(index, type))}
            aria-labelledby={
              register(registerNameForStudentAnswers(index, type)).name
            }
          />
          <LexOutput editorStateStr={answer.answer} />
        </label>
      ))}
    </>
  );
};
