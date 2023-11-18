import { DetailedHTMLProps, InputHTMLAttributes, useMemo } from 'react';
import { LayoutRole, useThemeContext } from '../layout';
export type GenericInputProps = {
  noThemeContext?: boolean;
  label?: string;
  descriptionDetails?: {
    description: string;
    descriptionId: string;
  };
  hasError?: boolean;
  inputClassName?: string;
  rightIcon?: React.ReactNode;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const GenericInput = ({
  label,
  descriptionDetails,
  hasError,
  inputClassName,
  rightIcon,
  ...props
}: GenericInputProps) => {
  const { role } = useThemeContext();
  const roleInputStyles = useMemo(() => {
    switch (role) {
      case LayoutRole.Admin:
        return `ring-gray-300 focus:ring-admin-primary-700`;
      case LayoutRole.Teacher:
        return `ring-gray-300 focus:ring-teacher-secondary-700`;
      case LayoutRole.Student:
        return `ring-gray-300 focus:ring-student-secondary-700`;
      default:
        break;
    }
  }, [role]);

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
      <div className="relative">
        <input
          {...props}
          className={`w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
            hasError
              ? 'ring-red-500 focus:ring-red-600'
              : `${roleInputStyles ?? 'ring-gray-300 focus:ring-gray-600'}`
          } placeholder:text-gray-400 ${
            props.type !== 'radio' &&
            props.type !== 'checkbox' &&
            'focus:ring-inset'
          } focus:ring-2 sm:leading-6 text-sm ${inputClassName}`}
          aria-describedby={descriptionDetails?.descriptionId}
        />
        <div className="absolute right-0 top-0 bottom-0 my-auto flex items-center pr-2">
          {rightIcon}
        </div>
      </div>
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
