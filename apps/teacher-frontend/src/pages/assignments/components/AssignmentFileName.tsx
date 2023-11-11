import { ErrorField, GenericInput } from '@acer-academy-learning/common-ui';
import { CreateAssignmentType } from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

export const AssignmentFileName = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateAssignmentType>();
  return (
    <Controller
      control={control}
      name={'fileName'}
      render={({ field: { onChange, value, onBlur } }) => (
        <section className="w-[50%] space-y-1">
          <GenericInput
            label="File Name: "
            id="assignment-file-name"
            name="assignment-file-name"
            type="text"
            placeholder="Ex: Primary 4 Mock Paper 1.pdf"
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            hasError={!!errors?.title?.message}
            inputClassName="w-full"
          />
          <ErrorMessage
            name="fileName"
            render={({ message }) => <ErrorField message={message} />}
          />
        </section>
      )}
    />
  );
};
