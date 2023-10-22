import { FullscreenSpinner } from '@acer-academy-learning/common-ui';
import { getQuizByQuizId } from '@acer-academy-learning/data-access';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { AttemptQuizForm } from './components/AttemptQuizForm';

export const AttemptQuiz = () => {
  const { quizId } = useParams();
  const { data: quiz, isLoading } = useQuery(['quiz', quizId], () =>
    getQuizByQuizId(quizId ?? ''),
  );

  return (
    (!isLoading && quiz && <AttemptQuizForm quiz={quiz} />) || (
      <FullscreenSpinner />
    )
  );
};
