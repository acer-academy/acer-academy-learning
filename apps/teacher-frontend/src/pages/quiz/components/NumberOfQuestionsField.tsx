import { GenericInput } from '@acer-academy-learning/common-ui';
import React from 'react';

interface NumberOfQuestionsFieldProps {
  initialNumQuestions: number;
  onChange: (numberOfQuestions: number) => void;
}

export const NumberOfQuestionsField: React.FC<NumberOfQuestionsFieldProps> = (
  props: NumberOfQuestionsFieldProps,
) => {
  const { initialNumQuestions, onChange } = props;

  return (
    <>
      <label
        htmlFor="number-of-questions"
        className="text-base flex items-center font-semibold leading-6 text-gray-900"
      >
        Number of Questions:
      </label>
      <div className="flex space-x-4 items-center">
        <GenericInput
          onChange={(e) => onChange(parseInt(e.target.value))}
          onBlur={() => {
            if (!initialNumQuestions) {
              onChange(1);
            }
          }}
          value={initialNumQuestions}
          type="number"
          id="number-of-questions"
          name="number-of-questions"
          inputClassName="w-20"
          hasError={!initialNumQuestions || initialNumQuestions < 1}
        />
        {initialNumQuestions < 1 && (
          <div className="text-red-600 text-xs mt-2">
            Number of questions must be at least 1.
          </div>
        )}
      </div>
    </>
  );
};
