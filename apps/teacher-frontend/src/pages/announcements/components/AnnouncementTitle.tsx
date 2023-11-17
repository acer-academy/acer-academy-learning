import { ErrorField, GenericInput } from '@acer-academy-learning/common-ui';
import { CreateAnnouncementType } from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

export const AnnouncementTitle = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateAnnouncementType>();
  return (
    <Controller
      control={control}
      name={'title'}
      render={({ field: { onChange, value, onBlur } }) => (
        <section className="w-[50%] space-y-1">
          <GenericInput
            label="Title: "
            id="quiz-title"
            name="quiz-title"
            type="text"
            descriptionDetails={{
              description: 'Give your announcement a title',
              descriptionId: 'quiz-title-description',
            }}
            placeholder="Ex: Cancellation of class for Deepavali"
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            hasError={!!errors?.title?.message}
            inputClassName="w-full"
          />
          <ErrorMessage
            name="title"
            render={({ message }) => <ErrorField message={message} />}
          />
        </section>
      )}
    />
  );
};
