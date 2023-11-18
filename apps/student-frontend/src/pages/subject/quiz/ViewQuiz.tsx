import {
  BackButton,
  FullscreenSpinner,
  GenericTabs,
  GenericTabsProps,
} from '@acer-academy-learning/common-ui';
import { getQuizByQuizId } from '@acer-academy-learning/data-access';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router-dom';
import { ViewQuizDetails } from './components/ViewQuizDetails';
import { ViewQuizStatistics } from './components/ViewQuizStatistics';

const STATISTICS_HASH = 'statistics';

const viewQuizTabs: GenericTabsProps['tabs'] = [
  { name: 'Details', path: '', current: false },
  { name: 'Statistics', path: STATISTICS_HASH, current: false },
];

export const ViewQuiz = () => {
  const location = useLocation();
  const { quizId } = useParams();
  const { data: quiz, isLoading } = useQuery(['quiz', quizId], () =>
    getQuizByQuizId(quizId ?? ''),
  );
  const timeAllowed = useMemo(() => {
    const timeAllowed = quiz?.timeAllowed;
    if (timeAllowed && timeAllowed < 60) return 'Less than 1 minute';
    if (timeAllowed) {
      const minutes = Math.floor(timeAllowed / 60);
      const hours = Math.floor(minutes / 60);
      if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ${
          minutes % 60 === 0 ? '' : (minutes % 60) + ' minutes'
        }`;
      } else {
        return `${minutes} minutes`;
      }
    }

    return 'No Time Limit';
  }, [quiz]);

  return (
    (!isLoading && quiz && (
      <div className="space-y-4 flex flex-col h-full">
        <BackButton />
        <h1 className="text-3xl font-bold tracking-tight ">{quiz.title}</h1>
        <GenericTabs tabs={viewQuizTabs} />
        {(location.hash.slice(1) === STATISTICS_HASH && (
          <ViewQuizStatistics />
        )) || <ViewQuizDetails quiz={quiz} timeAllowed={timeAllowed} />}
      </div>
    )) || <FullscreenSpinner />
  );
};
