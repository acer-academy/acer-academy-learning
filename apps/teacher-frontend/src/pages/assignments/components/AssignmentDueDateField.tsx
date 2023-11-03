import { ErrorField } from '@acer-academy-learning/common-ui';
import { CreateAssignmentType } from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useFormContext } from 'react-hook-form';

export type AssignmentDueDateFieldProps = {
  isUpdate: boolean;
};

export const AssignmentDueDateField = ({
  isUpdate,
}: AssignmentDueDateFieldProps) => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<CreateAssignmentType>();
  return (
    <Controller
      control={control}
      name={'dueDate'}
      render={({ field: { onChange, value, onBlur } }) => (
        <section className="w-[50%] space-y-1">
          <label
            htmlFor="dueDate"
            className="block text-base font-medium leading-6 text-gray-900"
          >
            Due Date:
          </label>
          {isUpdate ? (
            <DatePicker
              id="dueDate"
              name="dueDate"
              selected={new Date(value)}
              onChange={(date) => setValue('dueDate', date ?? new Date())}
              onBlur={onBlur}
              dateFormat="MMMM d, yyyy h:mm aa" // Customize the date format
              showTimeSelect
              timeFormat="h:mm aa"
              className="mt-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          ) : (
            <DatePicker
              id="dueDate"
              name="dueDate"
              selected={value}
              onChange={onChange}
              onBlur={onBlur}
              dateFormat="MMMM d, yyyy h:mm aa" // Customize the date format
              showTimeSelect
              timeFormat="h:mm aa"
              className="mt-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          )}
          <ErrorMessage
            name="dueDate"
            render={({ message }) => <ErrorField message={message} />}
          />
        </section>
      )}
    />
  );
};
