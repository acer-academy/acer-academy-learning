import { CreateQuizQuestionType } from '@acer-academy-learning/data-access';
import React, { useEffect } from 'react';
import { Controller, UseFormRegister, useFormContext } from 'react-hook-form';

export type AnswerFieldCheckboxProps = {
  index: number;
  register: UseFormRegister<CreateQuizQuestionType>;
  className?: string;
} & Partial<HTMLInputElement>;

export const AnswerFieldCheckbox = ({
  id,
  register,
  index,
  className,
}: AnswerFieldCheckboxProps) => {
  const { getValues, control } = useFormContext<CreateQuizQuestionType>();
  return (
    <Controller
      control={control}
      name={`answers.${index}.isCorrect`}
      render={({ field: { onChange, value, onBlur } }) => (
        <input
          id={id}
          defaultChecked={getValues(`answers.${index}.isCorrect`)}
          onChange={(e) => onChange(e.target.checked)}
          aria-label="Is Correct Answer checkbox"
          type="checkbox"
          className={`h-5 w-5 rounded border-gray-300 text-teacher-primary-600 focus:ring-teacher-primary-600 ${className}`}
        />
      )}
    />
  );
};
