import { StudentTakeData } from '@acer-academy-learning/data-access';
import { useLocation, useNavigate } from 'react-router-dom';

export const QuizAttempt: React.FC<{
  quizAttempt: StudentTakeData;
  enabledHr?: boolean;
  index?: number;
}> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizAttempt, enabledHr = false, index = 0 } = props;

  const displayTimeAttemptedAt = (time: string) => {
    const date = time.split('T')[0];
    const timeStamp = time.split('T')[1].split(':');
    const meridiem = Number(timeStamp[0]) < 12 ? 'AM' : 'PM';
    return `${date} at ${Number(timeStamp[0]) % 12}:${timeStamp[1]}${meridiem}`;
  };

  const displayMarks = () => {
    return `${quizAttempt.marks}/${quizAttempt.quiz.totalMarks} marks`;
  };

  const displayRewardPoints = () => {
    const { rewardMinimumMarks, rewardPoints } = quizAttempt.quiz;
    if (quizAttempt.marks >= rewardMinimumMarks)
      return `${rewardPoints}/${rewardPoints} pts`;
    return `0/${rewardPoints} pts`;
  };

  const displayTimeTaken = (timeTaken: number) => {
    let numMins = Math.floor(timeTaken / 60);
    const numHrs = Math.floor(numMins / 60);
    numMins %= 60;
    return `${numHrs > 0 ? `${numHrs} hour` : ''} ${
      numMins > 0 ? `${numMins} minutes` : '0 minutes'
    } spent`;
  };

  const navToSelectedQuizAttempt = () => {
    navigate(
      `${location.pathname.slice(0, -6)}/quizzes/${
        quizAttempt.quizId
      }?attempt=${quizAttempt.id}`,
    );
  };

  return (
    <div
      className={`px-2 flex flex-col ${
        enabledHr ? 'border-b pb-4' : 'border-b-0'
      }`}
    >
      <span
        className="font-bold underline hover:text-teacherBlue-500 hover:cursor-pointer"
        onClick={() => {
          navToSelectedQuizAttempt();
        }}
      >
        Quiz Attempt {index + 1}
      </span>
      <span className="text-xs text-gray-500">
        {displayTimeAttemptedAt(quizAttempt.attemptedAt)}
      </span>
      <div className="text-sm flex gap-2">
        <span>{displayMarks()}</span>|
        <span>{displayTimeTaken(quizAttempt.timeTaken)}</span>|
        <span>{displayRewardPoints()}</span>
      </div>
    </div>
  );
};
