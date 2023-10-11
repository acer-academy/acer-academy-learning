import { BackButton, useZodForm } from '@acer-academy-learning/common-ui';
import {
  CreateQuizType,
  createQuizSchema,
} from '@acer-academy-learning/data-access';
import React from 'react';
import { FieldErrors, FormProvider } from 'react-hook-form';
import { QuizCard } from './components/QuizCard';
import { DEFAULT_CREATE_QUIZ_VALUES } from './constants';

export const CreateQuiz = () => {
  const formMethods = useZodForm({
    schema: createQuizSchema,
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: DEFAULT_CREATE_QUIZ_VALUES,
  });

  const onSubmit = async (values: CreateQuizType) => {
    console.log(values);
  };

  return (
    <FormProvider {...formMethods}>
      <section className="space-y-4">
        <BackButton />
        <QuizCard onSubmitForm={onSubmit} />
      </section>
    </FormProvider>
  );
};
