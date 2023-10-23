import { useMemo, useState } from 'react';
import { QuizTimer } from './QuizTimer';
import { GenericButton } from '@acer-academy-learning/common-ui';
import { useAttemptQuizContext } from '../context/AttemptQuizContext';
import { AttemptQuizQuestionList } from './AttemptQuizQuestionList';

export type AttemptQuizSideNavProps = {
  className?: string;
};

export const AttemptQuizSideNav = ({ className }: AttemptQuizSideNavProps) => {
  const { quiz } = useAttemptQuizContext();
  const timeAllowed = useMemo(() => {
    const timeAllowed = quiz.timeAllowed;
    if (timeAllowed) {
      return timeAllowed * 1000;
    }
  }, [quiz.timeAllowed]);
  const [showTimer, setShowTimer] = useState(true);
  return (
    <nav className={`flex flex-col px-4 ${className}`}>
      <AttemptQuizQuestionList />
      <p>
        {timeAllowed ? 'Time remaining: ' : 'Time elapsed: '}{' '}
        <GenericButton
          className="w-16 bg-student-primary-600"
          text={showTimer ? 'Hide' : 'Show'}
          type="button"
          onClick={() => setShowTimer((curr) => !curr)}
        />
      </p>
      <div
        className={`${
          showTimer ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-200`}
      >
        <QuizTimer
          name={`timeTaken`}
          totalDurationInMiliseconds={timeAllowed}
        />
      </div>
    </nav>
  );
};
