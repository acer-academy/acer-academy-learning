import { ErrorField, LexEditor } from '@acer-academy-learning/common-ui';
import { CreateAssignmentType } from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export const AssignmentDescription = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateAssignmentType>();
  return (
    <div className="space-y-1">
      <span className="block text-base font-medium leading-6 text-gray-900">
        Assignment Description:{' '}
      </span>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value, onBlur } }) => (
          <>
            <LexEditor
              onChange={onChange}
              onBlur={onBlur}
              editorStateStr={value}
              hasError={!!errors?.description?.message}
            />
            <ErrorMessage
              name="description"
              render={({ message }) => <ErrorField message={message} />}
            />
          </>
        )}
      />
    </div>
  );
};
