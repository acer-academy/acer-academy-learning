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
  QuizData,
  Teacher,
  createQuizSchema,
  updateQuiz,
} from '@acer-academy-learning/data-access';
import { useMemo } from 'react';
import { FormProvider } from 'react-hook-form';
import { QuizCard } from './components/QuizCard';
import { useMutation } from 'react-query';
import { isAxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import omitDeep from 'omit-deep-lodash';

export type UpdateUnpublishedQuizProps = {
  quiz: QuizData;
};

export const UpdateUnpublishedQuiz = ({ quiz }: UpdateUnpublishedQuizProps) => {
  const navigate = useNavigate();
  const { subject, quizId } = useParams();
  const memoedQuizId = useMemo(() => quizId ?? '', [quizId]);
  const { user } = useAuth<Teacher>();
  const { displayToast, ToastType } = useToast();
  const { mutateAsync: updateQuizAsync } = useMutation(updateQuiz, {
    onSuccess: () => {
      displayToast('Successfully updated quiz!', ToastType.SUCCESS);
      navigate(-1);
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
    defaultValues: omitDeep(quiz, 'id') as CreateQuizType,
  });

  const onSubmit = async (values: CreateQuizType) => {
    if (!!subject && !!user) {
      const updateValues = {
        ...values,
        subject: subject,
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

  if (formMethods.formState.isLoading) {
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
