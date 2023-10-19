import {
  BackButton,
  getSubjectEnumFromPathParam,
  useAuth,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import {
  CreateQuizType,
  Teacher,
  createQuiz,
  createQuizSchema,
} from '@acer-academy-learning/data-access';
import React, { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { QuizCard } from './components/QuizCard';
import { DEFAULT_CREATE_QUIZ_VALUES } from './constants';
import { useMutation } from 'react-query';
import { isAxiosError } from 'axios';
import { useParams } from 'react-router-dom';

export const CreateQuiz = () => {
  const { subject } = useParams();
  const { user } = useAuth<Teacher>();
  const { displayToast, ToastType } = useToast();
  const { mutateAsync: createQuizAsync } = useMutation(createQuiz, {
    onSuccess: () => {
      displayToast('Successfully created quiz!', ToastType.SUCCESS);
    },
    onError: (error) => {
      const errorMsg = isAxiosError<{ error: string }>(error)
        ? error.response?.data.error
        : 'Unknown error';
      displayToast('Error: ' + errorMsg, ToastType.ERROR);
      console.error(error);
    },
  });
  const formMethods = useZodForm({
    schema: createQuizSchema,
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: DEFAULT_CREATE_QUIZ_VALUES,
  });

  // Side Effects
  useEffect(() => {
    if (subject) {
      const subjectEnum = getSubjectEnumFromPathParam(subject);
      formMethods.setValue('subject', subjectEnum);
    }
  }, [subject, formMethods]);

  useEffect(() => {
    if (user) {
      formMethods.setValue('teacherCreated', user.id);
    }
  }, [user, formMethods]);

  const onSubmit = async (values: CreateQuizType) => {
    await createQuizAsync(values);
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
