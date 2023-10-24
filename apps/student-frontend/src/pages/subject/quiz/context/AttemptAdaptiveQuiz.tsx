import {
  FullscreenSpinner,
  useAuth,
} from '@acer-academy-learning/common-ui';
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdaptiveNoTopics } from '../components/AdaptiveNoTopics';
import { useQuery } from 'react-query';
import {
  QuizQuestionTopicEnum,
  getAdaptiveQuizQuestions,
} from '@acer-academy-learning/data-access';
import { Student } from 'libs/data-access/src/lib/types/student';
import { AttemptAdaptiveQuizForm } from '../components/AttemptAdaptiveQuizForm';

export const AttemptAdaptiveQuiz = () => {
  const { user } = useAuth<Student>();
  const [searchParams, setSearchParams] = useSearchParams();
  const topics = useMemo(
    () =>
      searchParams
        .get('topics')
        ?.split(',')
        .filter((topic): topic is QuizQuestionTopicEnum =>
          Object.values(QuizQuestionTopicEnum).includes(
            topic as QuizQuestionTopicEnum,
          ),
        ),
    [searchParams],
  );

  const { data: questions, isLoading } = useQuery([topics, user], async () => {
    if (topics && user) {
      const res = await getAdaptiveQuizQuestions({
        topics: topics,
        level: user.level,
        studentId: user.id,
      });
      return res.data.questions;
    }
  });

  if (!topics?.length) {
    return <AdaptiveNoTopics />;
  }

  return (
    (!isLoading && questions && (
      <AttemptAdaptiveQuizForm questions={questions} />
    )) || <FullscreenSpinner />
  );
};
