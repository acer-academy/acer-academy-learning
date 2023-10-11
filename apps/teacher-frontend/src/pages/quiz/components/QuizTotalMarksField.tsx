import { ErrorField, GenericInput } from '@acer-academy-learning/common-ui';
import { CreateQuizType } from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const totalMarksId = 'total-marks';

export const QuizTotalMarksField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateQuizType>();
  return (
    <>
      <label htmlFor={totalMarksId} className="text-base flex items-center">
        Total Marks
      </label>
      <Controller
        control={control}
        name="totalMarks"
        render={({ field: { onChange, value, onBlur } }) => (
          <div className="flex space-x-4 items-center">
            <GenericInput
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              type="number"
              id={totalMarksId}
              name={totalMarksId}
              inputClassName="w-20"
              hasError={!!errors?.totalMarks?.message}
            />
            <ErrorMessage
              name="totalMarks"
              render={({ message }) => <ErrorField message={message} />}
            />
          </div>
        )}
      />
    </>
  );
};
