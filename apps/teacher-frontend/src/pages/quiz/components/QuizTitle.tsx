import { ErrorField, GenericInput } from '@acer-academy-learning/common-ui';
import { CreateQuizType } from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export const QuizTitle = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateQuizType>();
  return (
    <Controller
      control={control}
      name={'title'}
      render={({ field: { onChange, value, onBlur } }) => (
        <section className="w-[70%] space-y-1">
          <GenericInput
            label="Title: "
            id="quiz-title"
            name="quiz-title"
            type="text"
            descriptionDetails={{
              description: 'Give your quiz a title',
              descriptionId: 'quiz-title-description',
            }}
            placeholder="Ex: Trigonometry Quiz 1"
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
