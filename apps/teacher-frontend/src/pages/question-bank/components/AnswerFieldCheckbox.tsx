import { CreateQuizQuestionType } from '@acer-academy-learning/data-access';
import React, { useEffect } from 'react';
import { UseFormRegister, useFormContext } from 'react-hook-form';

export type AnswerFieldCheckboxProps = {
  index: number;
  register: UseFormRegister<CreateQuizQuestionType>;
} & Partial<HTMLInputElement>;

export const AnswerFieldCheckbox = ({
  id,
  register,
  index,
}: AnswerFieldCheckboxProps) => {
  const { setValue } = useFormContext<CreateQuizQuestionType>();
  useEffect(() => {
    setValue(`answers.${index}.isCorrect`, false);
  }, [setValue, index]);
  return (
    <input
      id={id}
      aria-label="Is Correct Answer checkbox"
      type="checkbox"
      className="h-5 w-5 rounded border-gray-300 text-teacher-primary-600 focus:ring-teacher-primary-600"
      {...register(`answers.${index}.isCorrect`)}
    />
  );
};
