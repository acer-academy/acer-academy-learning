import {
  FullscreenSpinner,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import {
  CreateQuizQuestionType,
  createQuizQuestionSchema,
  getQuizQuestionById,
  updateQuizQuestion,
} from '@acer-academy-learning/data-access';
import React, { useEffect, useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import omitDeep from 'omit-deep-lodash';
import { FormProvider } from 'react-hook-form';
import { QuestionCard } from './components/QuestionCard';
import { DEFAULT_QUESTION } from './constants';
import { AxiosError } from 'axios';

export const UpdateQuestion = () => {
  // Hooks/States
  const { displayToast, ToastType } = useToast();
  const { mutate: mutateQuizQuestion } = useMutation(updateQuizQuestion, {
    onSuccess: () => {
      displayToast('Successfully updated question!', ToastType.SUCCESS);
    },
    onError: (error: AxiosError) => {
      displayToast('Error updating question: ', ToastType.ERROR);
      console.log(error);
    },
  });
  const { questionId } = useParams();
  const memoedQuestionId = useMemo(() => questionId ?? '', [questionId]);
  const { data, isSuccess } = useQuery(
    ['question', memoedQuestionId],
    () => getQuizQuestionById(memoedQuestionId),
    {
      enabled: memoedQuestionId !== '',
    },
  );
  const wrangledData = useMemo(
    () => omitDeep(data ?? DEFAULT_QUESTION, 'id'),
    [data],
  );
  const formMethods = useZodForm({
    schema: createQuizQuestionSchema,
    defaultValues: wrangledData,
    mode: 'onTouched',
  });

  // Side effects
  useEffect(() => {
    formMethods.reset(wrangledData);
  }, [wrangledData, formMethods]);

  // Handlers
  const onSubmitForm = async (values: CreateQuizQuestionType) => {
    mutateQuizQuestion({ questionId: memoedQuestionId, data: values });
  };

  if (isSuccess && Object.keys(wrangledData).length !== 0) {
    return (
      <FormProvider {...formMethods}>
        <QuestionCard onSubmitForm={onSubmitForm} />
      </FormProvider>
    );
  }

  return <FullscreenSpinner />;
};
