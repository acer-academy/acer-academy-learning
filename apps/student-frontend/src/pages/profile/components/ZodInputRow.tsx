import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';

export type ZodInputRowProps<T extends FieldValues> = {
  id: string;
  label: string;
  type: HTMLInputElement['type'];
  register: UseFormRegister<T>;
  registerKey: Path<T>;
  errorMessage?: string;
};

export const ZodInputRow = <T extends FieldValues>({
  id,
  label,
  type,
  register,
  registerKey,
  errorMessage = '',
}: ZodInputRowProps<T>) => {
  return (
    <div className={`flex items-center space-x-4 mb-7`}>
      <label
        htmlFor={id}
        className="w-1/4 text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="flex flex-col w-full">
        <input
          id={id}
          type={type}
          {...register(registerKey)}
          className={`w-3/4 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${
            errorMessage
              ? 'focus-within:ring-red-600 ring-red-600'
              : 'focus-within:ring-student-primary-600'
          }`}
        />
        <span className={`text-red-600 text-xs`}>{errorMessage}</span>
      </div>
    </div>
  );
};
