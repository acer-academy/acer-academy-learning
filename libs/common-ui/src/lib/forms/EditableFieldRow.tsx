import { useState } from 'react';
import {
  FieldValues,
  Path,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';

export type EditableFieldRowProps<T extends FieldValues> = {
  id: string;
  label: string;
  value: string;
  type: HTMLInputElement['type'];
  register: UseFormRegister<T>;
  registerKey: Path<T>;
  errorMessage?: string;
  handleSubmit: UseFormHandleSubmit<T>;
  handleSubmitForm: (
    values: T,
    message: string,
    callback?: () => void,
  ) => Promise<void>;
};

/**
 * Meant to be wrapped in a grid, look at StudentProfile.tsx for an example
 */
export const EditableFieldRow = <T extends FieldValues>({
  id,
  label,
  value,
  type,
  register,
  registerKey,
  errorMessage,
  handleSubmit,
  handleSubmitForm,
}: EditableFieldRowProps<T>) => {
  const [isEditMode, setIsEditMode] = useState(false);
  return (
    <>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900 text-left"
      >
        {label}
      </label>
      {(isEditMode && (
        <>
          <div className="flex flex-col">
            <div
              className={`${
                errorMessage
                  ? 'focus-within:ring-red-600 ring-red-600'
                  : 'focus-within:ring-student-primary-600'
              } text-left flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset  sm:max-w-md`}
            >
              <input
                type="text"
                {...register(registerKey)}
                className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>
            <span className={`text-red-600 text-xs`}>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={handleSubmit((values) =>
              handleSubmitForm(values, `${label} successfully updated.`, () => {
                setIsEditMode(false);
              }),
            )}
            className="max-w-sm rounded self-center justify-self-center bg-indigo-600 px-2 py-1 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </>
      )) || (
        <>
          <span className="leading-6 text-sm py-1.5">{value}</span>
          <button
            type="button"
            onClick={() => setIsEditMode(true)}
            className="text-student-primary-600 hover:underline"
          >
            Edit
          </button>
        </>
      )}
    </>
  );
};
