import {
  BackButton,
  FullscreenSpinner,
  getSubjectEnumFromPathParam,
  useAuth,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import {
  CreateQuizType,
  Teacher,
  createQuizSchema,
  getQuizByQuizId,
  updateQuiz,
} from '@acer-academy-learning/data-access';
import React, { useEffect, useMemo } from 'react';
import { FormProvider } from 'react-hook-form';
import { QuizCard } from './components/QuizCard';
import { DEFAULT_CREATE_QUIZ_VALUES } from './constants';
import { useMutation, useQuery } from 'react-query';
import { isAxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import omitDeep from 'omit-deep-lodash';

export const UpdateQuiz = () => {
  const { subject, quizId } = useParams();
  const memoedQuizId = useMemo(() => quizId ?? '', [quizId]);
  const { user } = useAuth<Teacher>();
  const { displayToast, ToastType } = useToast();
  const { data: quiz, isSuccess } = useQuery(['quiz', memoedQuizId], () =>
    getQuizByQuizId(memoedQuizId),
  );
  const { mutateAsync: updateQuizAsync } = useMutation(updateQuiz, {
    onSuccess: () => {
      displayToast('Successfully updated quiz!', ToastType.SUCCESS);
    },
    onError: (error) => {
      const errorMsg = isAxiosError<{ error: string }>(error)
        ? error.response?.data.error
        : 'Unknown error';
      displayToast('Error: ' + errorMsg, ToastType.ERROR);
      console.error(error);
    },
  });
  const wrangledQuizData = useMemo(
    () => omitDeep(quiz ?? DEFAULT_CREATE_QUIZ_VALUES, 'id'),
    [quiz],
  );
  const formMethods = useZodForm({
    schema: createQuizSchema,
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: wrangledQuizData,
  });

  useEffect(() => {
    if (quiz) {
      console.log(quiz);
      formMethods.reset(omitDeep(quiz, 'id'));
    }
  }, [quiz, formMethods]);

  const onSubmit = async (values: CreateQuizType) => {
    if (!!subject && !!user) {
      const updateValues = {
        ...values,
        subject: getSubjectEnumFromPathParam(subject),
        teacherCreated: user.id,
      };
      await updateQuizAsync({ quizId: memoedQuizId, data: updateValues });
    } else {
      displayToast(
        'Error: Not logged in or subject not found',
        ToastType.ERROR,
      );
    }
  };

  if (!isSuccess || Object.keys(wrangledQuizData).length === 0) {
    return <FullscreenSpinner />;
  }

  return (
    <FormProvider {...formMethods}>
      <section className="space-y-4">
        <BackButton />
        <QuizCard onSubmitForm={onSubmit} submitText="Update Quiz" />
      </section>
    </FormProvider>
  );
};
