import React from 'react';
import { QuizTitle } from './QuizTitle';
import { CreateQuizType } from '@acer-academy-learning/data-access';
import { GenericButton } from '@acer-academy-learning/common-ui';
import { FieldErrors, useFormContext } from 'react-hook-form';
import { QuizDescription } from './QuizDescription';
import { QuizTimeAllowedField } from './QuizTimeAllowedField';
import { QuizTotalMarksField } from './QuizTotalMarksField';
import { QuizRewardPointsField } from './QuizRewardPointsField';

export type QuizCardProps = {
  onSubmitForm: (values: CreateQuizType) => Promise<void>;
  submitText?: string;
};

export const QuizCard = ({ onSubmitForm, submitText }: QuizCardProps) => {
  const { handleSubmit } = useFormContext<CreateQuizType>();

  const onError = (errors: FieldErrors<CreateQuizType>) => {
    console.error(errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm, onError)}
      className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded shadow space-y-4 flex flex-col"
    >
      <QuizTitle />
      <QuizDescription />
      <div className="grid grid-cols-2 gap-4 w-[50%]">
        <QuizTimeAllowedField />
        <QuizTotalMarksField />
        <QuizRewardPointsField />
      </div>
      <GenericButton type="submit" text="Create Quiz" />
    </form>
  );
};
