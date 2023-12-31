import {
  BackButton,
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
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import omitDeep from 'omit-deep-lodash';
import { FormProvider } from 'react-hook-form';
import { QuestionCard } from './components/QuestionCard';
import { DEFAULT_QUESTION } from './constants';
import { AxiosError } from 'axios';

export const UpdateQuestion = () => {
  // Hooks/States
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { displayToast, ToastType } = useToast();
  const { questionId } = useParams();
  const memoedQuestionId = useMemo(() => questionId ?? '', [questionId]);
  const { mutate: mutateQuizQuestion } = useMutation(updateQuizQuestion, {
    onSuccess: async () => {
      displayToast('Successfully updated question!', ToastType.SUCCESS);
      await queryClient.invalidateQueries({
        queryKey: ['question', memoedQuestionId],
      });
      navigate(-1);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      displayToast(
        error.response?.data.error ?? 'Unknown error',
        ToastType.ERROR,
      );
      console.log(error);
    },
  });
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
    mode: 'onSubmit',
    criteriaMode: 'all',
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
        <section className="space-y-4">
          <BackButton className="bg-teacher-primary-900 hover:bg-teacher-secondary-700" />
          <QuestionCard onSubmitForm={onSubmitForm} submitText={'Update'} />
        </section>
      </FormProvider>
    );
  }

  return <FullscreenSpinner />;
};
