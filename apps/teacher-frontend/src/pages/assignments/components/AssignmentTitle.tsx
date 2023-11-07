import { ErrorField, GenericInput } from '@acer-academy-learning/common-ui';
import { CreateAssignmentType } from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

export const AssignmentTitle = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateAssignmentType>();
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
              description: 'Give your assignment a title',
              descriptionId: 'quiz-title-description',
            }}
            placeholder="Ex: Primary 4 Mock Paper 1"
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
