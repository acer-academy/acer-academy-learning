import {
  ErrorField,
  GenericInput,
  containsOnlyNumbers,
} from '@acer-academy-learning/common-ui';
import { CreateQuizType } from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const rewardPointsId = 'reward-points';

export const QuizRewardPointsField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateQuizType>();
  return (
    <>
      <label htmlFor={rewardPointsId} className="text-base flex items-center">
        Reward Points
      </label>
      <Controller
        control={control}
        name="rewardPoints"
        render={({ field: { onChange, value, onBlur } }) => (
          <div className="flex space-x-4 items-center">
            <GenericInput
              onChange={(e) =>
                (containsOnlyNumbers(e.target.value) &&
                  onChange(parseInt(e.target.value))) ||
                onChange(undefined)
              }
              onBlur={onBlur}
              value={value ?? ''}
              type="number"
              id={rewardPointsId}
              name={rewardPointsId}
              inputClassName="w-20"
              hasError={!!errors?.rewardPoints?.message}
            />
            <ErrorMessage
              name="rewardPoints"
              render={({ message }) => <ErrorField message={message} />}
            />
          </div>
        )}
      />
    </>
  );
};
