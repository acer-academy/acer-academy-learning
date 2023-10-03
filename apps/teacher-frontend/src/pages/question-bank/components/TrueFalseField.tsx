import { CreateQuizQuestionType } from '@acer-academy-learning/data-access';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { AnswerFieldRadio } from './AnswerFieldRadio';

const TRUE_FALSE_VALUES = [
  {
    id: 'true',
    label: 'True',
  },
  {
    id: 'false',
    label: 'False',
  },
];

export const TrueFalseField = () => {
  const { setValue, register } = useFormContext<CreateQuizQuestionType>();
  useEffect(() => {
    setValue(`answers.0`, { answer: 'True', isCorrect: true });
    setValue(`answers.1`, { answer: 'False', isCorrect: false });
  }, []);
  return (
    <>
      {TRUE_FALSE_VALUES.map((current, index) => (
        <div key={current.id} className="flex items-center">
          <AnswerFieldRadio
            id={current.id}
            register={register}
            name="true-false-selection"
            index={index}
          />
          <label
            htmlFor={current.id}
            className="ml-3 block text-md font-medium leading-6 text-gray-900"
          >
            {current.label}
          </label>
        </div>
      ))}
    </>
  );
};
