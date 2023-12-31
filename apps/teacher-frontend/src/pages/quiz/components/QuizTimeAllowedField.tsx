import { ErrorField, GenericInput } from '@acer-academy-learning/common-ui';
import { CreateQuizType } from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export const QuizTimeAllowedField = () => {
  const { control, getValues, setValue } = useFormContext<CreateQuizType>();
  const [isChecked, setIsChecked] = useState(!!getValues('timeAllowed'));
  const onCheckboxClick = () => {
    if (isChecked) {
      setValue('timeAllowed', null);
    }
    setIsChecked((prev) => !prev);
  };
  return (
    <>
      <div className="flex space-x-1 items-center">
        <GenericInput
          onChange={onCheckboxClick}
          type="checkbox"
          name="time-allowed-checkbox"
          id="time-allowed-checkbox"
          checked={isChecked}
          inputClassName="w-5 h-5"
        />
        <label htmlFor="time-allowed-checkbox" className="text-base">
          Time Limit
        </label>
      </div>
      <div className="flex space-x-1 items-center">
        <Controller
          control={control}
          name="timeAllowed"
          render={({ field: { onChange, value, onBlur } }) => (
            <GenericInput
              type="number"
              id="quiz-time-allowed"
              name="quiz-time-allowed"
              onChange={(e) => {
                const val = e.target.value;
                onChange(parseInt(val) * 60);
              }}
              value={value ? value / 60 : ''}
              onBlur={onBlur}
              disabled={!isChecked}
              inputClassName="w-20"
            />
          )}
        />
        <label
          htmlFor="time-allowed-checkbox"
          className={`text-base ${!isChecked && 'text-gray-300'}`}
        >
          Minutes
        </label>
        <ErrorMessage
          name="timeAllowed"
          render={({ message }) => <ErrorField message={message} />}
        />
      </div>
    </>
  );
};
