import { CreateQuizQuestionType } from '@acer-academy-learning/data-access';
import React, { useEffect } from 'react';
import { UseFormRegister, useFormContext } from 'react-hook-form';

export type AnswerFieldRadioProps = {
  register: UseFormRegister<CreateQuizQuestionType>;
  index: number;
} & Partial<HTMLInputElement>;

export const AnswerFieldRadio = ({
  id,
  name,
  register,
  index,
}: AnswerFieldRadioProps) => {
  const { setValue } = useFormContext<CreateQuizQuestionType>();
  useEffect(() => {
    setValue(`answers.${index}.isCorrect`, false);
  }, [setValue, index]);
  return (
    <input
      id={id}
      aria-label="Radio button to indicate correct answer"
      type="radio"
      className="h-4 w-4 border-gray-300 text-teacher-primary-600 focus:ring-teacher-primary-600"
      {...register(`answers.${index}.isCorrect`)}
      name={name}
    />
  );
};
