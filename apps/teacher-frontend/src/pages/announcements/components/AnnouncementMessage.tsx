import { ErrorField, LexEditor } from '@acer-academy-learning/common-ui';
import { CreateAnnouncementType } from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

export const AnnouncementMessage = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateAnnouncementType>();
  return (
    <div className="space-y-1">
      <span className="block text-base font-medium leading-6 text-gray-900">
        Announcement Message:{' '}
      </span>
      <Controller
        control={control}
        name="message"
        render={({ field: { onChange, value, onBlur } }) => (
          <>
            <LexEditor
              onChange={onChange}
              onBlur={onBlur}
              editorStateStr={value}
              hasError={!!errors?.message?.message}
            />
            <ErrorMessage
              name="message"
              render={({ message }) => <ErrorField message={message} />}
            />
          </>
        )}
      />
    </div>
  );
};
