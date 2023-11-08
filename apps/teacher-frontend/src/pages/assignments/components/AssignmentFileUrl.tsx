import { ErrorField, GenericInput } from '@acer-academy-learning/common-ui';
import { CreateAssignmentType } from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

export const AssignmentFileUrl = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateAssignmentType>();
  return (
    <Controller
      control={control}
      name={'fileUrl'}
      render={({ field: { onChange, value, onBlur } }) => (
        <section className="w-[50%] space-y-1">
          <GenericInput
            label="File URL: "
            id="assignment-file-url"
            name="assignment-file-url"
            type="text"
            placeholder="Ex: https://drive.google.com/file/..."
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            hasError={!!errors?.title?.message}
            inputClassName="w-full"
          />
          <ErrorMessage
            name="fileUrl"
            render={({ message }) => <ErrorField message={message} />}
          />
        </section>
      )}
    />
  );
};
