import React from 'react';
import { QuestionCard } from './components/QuestionCard';
import {
  CreateQuizQuestionType,
  QuizQuestionStatusEnum,
  QuizQuestionTypeEnum,
  createQuestion,
  createQuizQuestionSchema,
} from '@acer-academy-learning/data-access';
import {
  BackButton,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import { FormProvider } from 'react-hook-form';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_QUESTION } from './constants';

export const CreateQuestion = () => {
  const { displayToast, ToastType } = useToast();
  const navigate = useNavigate();
  const formMethods = useZodForm({
    schema: createQuizQuestionSchema,
    defaultValues: DEFAULT_QUESTION,
    mode: 'onTouched',
    criteriaMode: 'all',
  });
  const { mutateAsync: createQuestionMutationAsync } = useMutation(
    createQuestion,
    {
      onSuccess: () => {
        displayToast('Successfully created question!', ToastType.SUCCESS);
      },
      onError: (error: AxiosError) => {
        displayToast('Error: ' + error.message, ToastType.ERROR);
        console.log(error);
      },
    },
  );

  // Handlers
  const onSubmitForm = async (values: CreateQuizQuestionType) => {
    await createQuestionMutationAsync(values);
    navigate(-1);
  };

  return (
    <FormProvider {...formMethods}>
      <section className="space-y-4">
        <BackButton />
        <QuestionCard onSubmitForm={onSubmitForm} submitText="Create" />
      </section>
    </FormProvider>
  );
};
