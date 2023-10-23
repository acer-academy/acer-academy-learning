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
import { FormProvider } from 'react-hook-form';
import { QuizCard } from './components/QuizCard';
import { DEFAULT_CREATE_QUIZ_VALUES } from './constants';
import { useMutation } from 'react-query';
import { isAxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export const CreateQuiz = () => {
  const navigate = useNavigate();
  const { subject } = useParams();
  const { user } = useAuth<Teacher>();
  const { displayToast, ToastType } = useToast();
  const { mutateAsync: createQuizAsync } = useMutation(createQuiz, {
    onSuccess: () => {
      displayToast('Successfully created quiz!', ToastType.SUCCESS);
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
    defaultValues: DEFAULT_CREATE_QUIZ_VALUES,
  });

  const onSubmit = async (values: CreateQuizType) => {
    const subjectEnum = getSubjectEnumFromPathParam(subject ?? '');
    if (!!subjectEnum && !!user) {
      const createValues = {
        ...values,
        subject: subjectEnum,
        teacherCreated: user.id,
      };
      await createQuizAsync(createValues);
    } else {
      displayToast(
        'Error: Not logged in or subject not found',
        ToastType.ERROR,
      );
    }
  };

  return (
    <FormProvider {...formMethods}>
      <section className="space-y-4">
        <BackButton />
        <QuizCard onSubmitForm={onSubmit} submitText="Create Quiz" />
      </section>
    </FormProvider>
  );
};
