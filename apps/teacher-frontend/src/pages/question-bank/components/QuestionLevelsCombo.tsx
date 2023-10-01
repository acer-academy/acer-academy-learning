import {
  GenericBadges,
  GenericComboBox,
  screamingSnakeToTitleCase,
} from '@acer-academy-learning/common-ui';
import {
  CreateQuizQuestionType,
  LevelEnum,
} from '@acer-academy-learning/data-access';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

export type QuestionTopicsComboProps = {
  control: Control<CreateQuizQuestionType>;
};

const levelsEnums = Object.values(LevelEnum);
export const QuestionLevelsCombo = ({ control }: QuestionTopicsComboProps) => {
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
            />
            <GenericComboBox
              options={levelsEnums}
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
