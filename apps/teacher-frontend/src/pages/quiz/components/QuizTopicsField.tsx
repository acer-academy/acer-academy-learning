import {
  ErrorField,
  GenericBadges,
  GenericComboBox,
  screamingSnakeToTitleCase,
} from '@acer-academy-learning/common-ui';
import {
  CreateQuizQuestionType,
  CreateQuizType,
  QuizQuestionTopicEnum,
} from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

const topicEnums = Object.values(QuizQuestionTopicEnum);
export const QuizTopicsField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateQuizType>();
  return (
    <>
      <span className="text-base font-semibold leading-6 text-gray-900">
        Topic(s):
      </span>
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
            <ErrorMessage
              errors={errors}
              name="topics"
              render={({ message }) => <ErrorField message={message} />}
            />
            <GenericComboBox
              options={topicEnums}
              onChange={onChange}
              selected={value}
              displayValue={(topic) => screamingSnakeToTitleCase(topic)}
              hasError={!!errors.topics?.message}
              placeholder="Ex: Coordinate Geometry"
              containerStyle="w-[50%]"
            />
          </>
        )}
      />
    </>
  );
};
