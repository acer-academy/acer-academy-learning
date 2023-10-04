import React, { useEffect, useState } from 'react';
import { QuestionCard } from './components/QuestionCard';
import {
  CreateQuizAnswerType,
  CreateQuizQuestionType,
  LevelEnum,
  QuizQuestionStatusEnum,
  QuizQuestionTypeEnum,
  createQuestion,
  createQuizQuestionSchema,
} from '@acer-academy-learning/data-access';
import { useToast, useZodForm } from '@acer-academy-learning/common-ui';
import { FormProvider } from 'react-hook-form';
import { useMutation } from 'react-query';

export const CreateQuestion = () => {
  const { displayToast, ToastType } = useToast();
  const formMethods = useZodForm({
    schema: createQuizQuestionSchema,
    defaultValues: {
      questionType: QuizQuestionTypeEnum.MCQ,
      answers: [
        {
          answer: '',
          isCorrect: false,
        },
        {
          answer: '',
          isCorrect: false,
        },
      ],
      topics: [],
      levels: [],
      status: QuizQuestionStatusEnum.READY,
    },
    mode: 'onTouched',
  });
  const { mutate: createQuestionMutation } = useMutation(createQuestion, {
    onSuccess: () => {
      displayToast('Successfully created question!', ToastType.SUCCESS);
      console.log('success');
    },
    onError: (error) => {
      displayToast('Error :(', ToastType.ERROR);
      console.log(error);
    },
  });

  // Handlers
  const onSubmitForm = async (values: CreateQuizQuestionType) => {
    createQuestionMutation(values);
  };

  return (
    <FormProvider {...formMethods}>
      <QuestionCard onSubmitForm={onSubmitForm} />
    </FormProvider>
  );
};
