import { FullscreenSpinner, useAuth } from '@acer-academy-learning/common-ui';
import { Teacher, getQuizByQuizId } from '@acer-academy-learning/data-access';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { UpdateQuiz } from './UpdateQuiz';
import { ViewQuiz } from './ViewQuiz';
import { useQuery } from 'react-query';

/**
 * Used to conditionally render ViewQuiz or UpdateQuiz depending on whether the quiz is created by the account teacher account used
 * @returns
 */
export const ModifyQuizWrapper = () => {
  const { quizId } = useParams();
  const { user } = useAuth<Teacher>();
  const {
    data: quiz,
    isLoading,
    isSuccess,
  } = useQuery(['quiz', quizId], () => getQuizByQuizId(quizId ?? ''));

  if (isLoading || !user) {
    return <FullscreenSpinner />;
  }

  if (user?.id === quiz?.teacherCreatedId) {
    return <UpdateQuiz quiz={quiz} />;
  }

  if (isSuccess && quiz) {
    return <ViewQuiz quiz={quiz} />;
  }

  return null;
};
