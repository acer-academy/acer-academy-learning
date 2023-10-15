import React from 'react';
import {
  ErrorMessage,
  FieldValuesFromFieldErrors,
} from '@hookform/error-message';
import {
  FieldErrors,
  FieldName,
  FieldValues,
  useFormState,
} from 'react-hook-form';

export type ErrorFieldType<T extends FieldValues> = {
  message?: string;
};
export const ErrorField = <T extends FieldValues>({
  message,
}: ErrorFieldType<T>) => {
  return (
    <p className="text-xs font-semibold text-red-500">
      {message && '⚠ ' + message}
    </p>
  );
};
