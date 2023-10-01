import {
  GenericBadges,
  GenericComboBox,
  screamingSnakeToTitleCase,
} from '@acer-academy-learning/common-ui';
import {
  CreateQuizQuestionType,
  QuizQuestionTopicEnum,
} from '@acer-academy-learning/data-access';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

export type QuestionTopicsComboProps = {
  control: Control<CreateQuizQuestionType>;
};

const topicEnums = Object.values(QuizQuestionTopicEnum);
export const QuestionTopicsCombo = ({ control }: QuestionTopicsComboProps) => {
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
