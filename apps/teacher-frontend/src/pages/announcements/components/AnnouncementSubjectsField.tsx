import {
  ErrorField,
  GenericBadges,
  GenericComboBox,
  screamingSnakeToTitleCase,
} from '@acer-academy-learning/common-ui';
import {
  CreateAnnouncementType,
  SubjectEnum,
} from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

const subjectEnums = Object.values(SubjectEnum);
export const AnnouncementSubjectsField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateAnnouncementType>();
  return (
    <>
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Subjects(s):
      </h3>
      <Controller
        control={control}
        name={'targetSubjects'}
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
              name="targetSubjects"
              render={({ message }) => <ErrorField message={message} />}
            />
            <GenericComboBox
              options={subjectEnums}
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
