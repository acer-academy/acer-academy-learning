import {
  FullscreenSpinner,
  useAuth,
  useToast,
} from '@acer-academy-learning/common-ui';
import {
  createTake,
  getQuizByQuizId,
} from '@acer-academy-learning/data-access';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { AttemptQuizForm } from './components/AttemptQuizForm';
import { isAxiosError } from 'axios';
import {
  CreateTakeApiSchema,
  CreateTakeSchema,
  CreateTakeAnswerApiSchema,
} from 'libs/data-access/src/lib/types/take';
import { Student } from 'libs/data-access/src/lib/types/student';
import { MS_IN_SECOND } from './components/QuizTimer';
import { QUIZZES, SUBJECTS } from '../../../libs/routes';

export const AttemptQuiz = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const { displayToast, ToastType } = useToast();
  const { user } = useAuth<Student>();
  const { quizId } = useParams();
  const { data: quiz, isLoading } = useQuery(['quiz', quizId], () =>
    getQuizByQuizId(quizId ?? ''),
  );
  const { mutateAsync: createTakeAsync } = useMutation(createTake, {
    onSuccess: (response) => {
      const takeId = response.data.id;
      displayToast('Quiz successfully submitted!', ToastType.SUCCESS);
      navigate(`${SUBJECTS}/${subject}/quizzes/result/${takeId}`);
    },
    onError: (error) => {
      const errorMsg = isAxiosError<{ error: string }>(error)
        ? error.response?.data.error
        : 'Unknown error';
      displayToast('Error: ' + errorMsg, ToastType.ERROR);
      console.error(error);
      navigate(`${QUIZZES}/${quizId}`);
    },
  });

  const onSubmit = async (values: CreateTakeSchema) => {
    if (user) {
      // Format data
      const studentAnswers: CreateTakeAnswerApiSchema[] = [];
      values.studentAnswers.forEach((studentAnswer) => {
        const answers = studentAnswer.studentAnswer;
        answers
          .filter((answer): answer is string => typeof answer === 'string')
          .forEach((answer) => {
            studentAnswers.push({
              questionId: studentAnswer.questionId,
              studentAnswer: answer,
              timeTaken: Math.floor(studentAnswer.timeTaken / MS_IN_SECOND),
            });
          });
      });

      const formattedValues: CreateTakeApiSchema = {
        quizId: values.quizId,
        studentAnswers: studentAnswers,
        attemptedAt: values.attemptedAt,
        timeTaken: Math.floor(values.timeTaken / MS_IN_SECOND),
        takenById: user.id,
      };

      await createTakeAsync(formattedValues);
    } else {
      displayToast('Error: Not logged in', ToastType.ERROR);
    }
  };

  return (
    (!isLoading && quiz && (
      <AttemptQuizForm quiz={quiz} onSubmitForm={onSubmit} />
    )) || <FullscreenSpinner />
  );
};
