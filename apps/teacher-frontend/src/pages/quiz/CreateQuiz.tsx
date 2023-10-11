import { BackButton, useZodForm } from '@acer-academy-learning/common-ui';
import { createQuizSchema } from '@acer-academy-learning/data-access';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { QuizCard } from './components/QuizCard';
import { DEFAULT_CREATE_QUIZ_VALUES } from './constants';

export const CreateQuiz = () => {
  const formMethods = useZodForm({
    schema: createQuizSchema,
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: DEFAULT_CREATE_QUIZ_VALUES,
  });
  return (
    <FormProvider {...formMethods}>
      <section className="space-y-4">
        <BackButton />
        <QuizCard />
      </section>
    </FormProvider>
  );
};
