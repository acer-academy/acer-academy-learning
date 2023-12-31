import {
  ErrorField,
  GenericBadges,
  GenericComboBox,
  screamingSnakeToTitleCase,
} from '@acer-academy-learning/common-ui';
import {
  CreateQuizQuestionType,
  LevelEnum,
} from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const levelsEnums = Object.values(LevelEnum);
export const QuestionLevelsCombo = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateQuizQuestionType>();
  return (
    <>
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Level(s):
      </h3>
      <Controller
        control={control}
        name={'levels'}
        render={({ field: { onChange, value } }) => (
          <>
            <GenericBadges
              onChange={onChange}
              badges={value}
              getDisplayValue={(badge) => screamingSnakeToTitleCase(badge)}
              allowRemove
            />
            <ErrorMessage
              errors={errors}
              name="levels"
              render={({ message }) => <ErrorField message={message} />}
            />
            <GenericComboBox
              options={levelsEnums}
              hasError={!!errors.levels?.message}
              onChange={onChange}
              selected={value}
              displayValue={(topic) => screamingSnakeToTitleCase(topic)}
            />
          </>
        )}
      />
    </>
  );
};
