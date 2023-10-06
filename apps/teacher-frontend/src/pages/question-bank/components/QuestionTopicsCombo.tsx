import {
  ErrorField,
  GenericBadges,
  GenericComboBox,
  screamingSnakeToTitleCase,
} from '@acer-academy-learning/common-ui';
import {
  CreateQuizQuestionType,
  QuizQuestionTopicEnum,
} from '@acer-academy-learning/data-access';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const topicEnums = Object.values(QuizQuestionTopicEnum);
export const QuestionTopicsCombo = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateQuizQuestionType>();
  return (
    <>
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Topic(s):
      </h3>
      <Controller
        control={control}
        name={'topics'}
        render={({ field: { onChange, value } }) => (
          <>
            <GenericBadges
              onChange={onChange}
              badges={value}
              getDisplayValue={(badge) => screamingSnakeToTitleCase(badge)}
            />
            <ErrorField message={errors.topics?.message} />
            <GenericComboBox
              options={topicEnums}
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
