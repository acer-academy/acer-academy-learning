import {
  ErrorField,
  GenericBadges,
  GenericComboBox,
  screamingSnakeToTitleCase,
} from '@acer-academy-learning/common-ui';
import {
  CreateAnnouncementType,
  LevelEnum,
} from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

const levelsEnums = Object.values(LevelEnum);
export const AnnouncementLevelsField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateAnnouncementType>();
  return (
    <>
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Level(s):
      </h3>
      <Controller
        control={control}
        name={'targetLevels'}
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
              name="targetLevels"
              render={({ message }) => <ErrorField message={message} />}
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
