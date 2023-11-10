import {
  BackButton,
  Divider,
  FullscreenSpinner,
  GenericBadges,
  GenericButton,
  LexOutput,
  screamingSnakeToTitleCase,
} from '@acer-academy-learning/common-ui';
import { getQuizByQuizId } from '@acer-academy-learning/data-access';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

export const ViewQuiz = () => {
  const navigate = useNavigate();
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
        <BackButton className="bg-student-primary-900 hover:bg-student-secondary-700 self-start" />
        <h1 className="text-3xl font-bold tracking-tight ">{quiz.title}</h1>
        <Divider lineClassName="border-gray-900" />
        <div className="flex justify-around">
          <span>
            <strong>Total Marks:</strong> {quiz.totalMarks}
          </span>
          <span>
            <strong>Reward Points:</strong> {quiz.rewardPoints}
          </span>
          <span>
            <strong>Reward Minimum Marks:</strong> {quiz.rewardMinimumMarks}
          </span>
          <span>
            <strong>Time Limit:</strong> {timeAllowed}
          </span>
        </div>
        <Divider lineClassName="border-gray-900" />
        <h1 className="text-3xl font-bold tracking-tight ">Description</h1>
        <LexOutput editorStateStr={quiz.description} />
        <p className="font-bold" style={{ marginTop: 'auto' }}>
          Topics:{' '}
        </p>
        <GenericBadges
          badges={quiz.topics}
          getDisplayValue={(topic) => screamingSnakeToTitleCase(topic)}
        />
        <p className="font-bold">Levels: </p>
        <GenericBadges
          badges={quiz.levels}
          getDisplayValue={(level) => screamingSnakeToTitleCase(level)}
        />
        <GenericButton
          type="button"
          text={'Start Quiz'}
          onClick={() => navigate('take#1')}
          className="bg-student-primary-900 hover:bg-student-secondary-700 self-center"
        />
      </div>
    )) || <FullscreenSpinner />
  );
};
