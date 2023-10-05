import { CreateQuizQuestionType } from '@acer-academy-learning/data-access';
import React from 'react';
import { Controller, UseFormRegister, useFormContext } from 'react-hook-form';

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
  const { setValue, watch, control, getValues } =
    useFormContext<CreateQuizQuestionType>();
  const watchAllAnswers = watch(`answers`);

  const onRadioChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void,
  ) => {
    // Check this one
    onChange(e.target.checked);
    // Uncheck all other radio buttons
    watchAllAnswers.forEach((_, currIdx) => {
      if (currIdx !== index) {
        setValue(`answers.${currIdx}.isCorrect`, false);
      }
    });
  };

  return (
    <Controller
      control={control}
      name={`answers.${index}.isCorrect`}
      render={({ field: { onChange, value, onBlur } }) => (
        <input
          id={id}
          aria-label="Radio button to indicate correct answer"
          type="radio"
          onChange={(e) => onRadioChange(e, onChange)}
          checked={getValues(`answers.${index}.isCorrect`)}
          className="h-4 w-4 border-gray-300 text-teacher-primary-600 focus:ring-teacher-primary-600"
          name={name}
        />
      )}
    />
  );
};
