import { error } from 'console';
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
export type GenericInputProps = {
  label?: string;
  descriptionDetails?: {
    description: string;
    descriptionId: string;
  };
  hasError?: boolean;
  inputClassName?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const GenericInput = ({
  label,
  descriptionDetails,
  hasError,
  inputClassName,
  ...props
}: GenericInputProps) => {
  return (
    <>
      {label && (
        <label
          htmlFor={props.id}
          className="block text-base font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      )}
      <input
        {...props}
        className={`${inputClassName} block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
          hasError ? 'ring-red-500' : 'ring-gray-300'
        } placeholder:text-gray-400 ${
          props.type !== 'radio' &&
          props.type !== 'checkbox' &&
          'focus:ring-inset'
        } focus:ring-2 focus:ring-gray-600 sm:text-sm sm:leading-6`}
        aria-describedby={descriptionDetails?.descriptionId}
      />
      {!hasError && (
        <p
          className="mt-2 text-sm text-gray-500"
          id={descriptionDetails?.descriptionId}
        >
          {descriptionDetails?.description}
        </p>
      )}
    </>
  );
};
