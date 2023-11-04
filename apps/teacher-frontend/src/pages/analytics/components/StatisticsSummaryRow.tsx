import { ConsolidatedQuizStatistics } from '@acer-academy-learning/data-access';
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ArrowsUpDownIcon,
  ClockIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/outline';

export const StatisticsSummaryRow: React.FC<{
  quizStats?: ConsolidatedQuizStatistics;
  totalMarksArr?: number[];
  totalMarksPossible?: number;
}> = (props) => {
  const { quizStats, totalMarksArr, totalMarksPossible } = props;

  const getQuizAverageScore = (marksArr?: number[]) => {
    if (!marksArr) return '-';
    return `${Math.round(
      (marksArr.reduce((x, y) => x + y, 0) /
        marksArr.length /
        (totalMarksPossible ?? 1)) *
        100,
    )}%`;
  };

  const getQuizHighScore = (marksArr?: number[]) => {
    if (!marksArr) return '-';
    return `${Math.round(
      (marksArr.reduce((x, y) => (x > y ? x : y), 0) /
        (totalMarksPossible ?? 1)) *
        100,
    )}%`;
  };

  const getQuizLowScore = (marksArr?: number[]) => {
    if (!marksArr) return '-';
    return `${Math.round(
      (marksArr.reduce((x, y) => (x < y ? x : y)) / (totalMarksPossible ?? 1)) *
        100,
    )}%`;
  };

  const getStdDev = (marksArr?: number[]) => {
    if (!marksArr || marksArr.length <= 1) {
      return '-';
    }
    const mean = marksArr.reduce((sum, num) => sum + num, 0) / marksArr.length;
    const squaredDifferencesSum = marksArr.reduce((sum, num) => {
      const diff = num - mean;
      return sum + diff * diff;
    }, 0);
    const variance = squaredDifferencesSum / (marksArr.length - 1);
    const standardDeviation = Math.sqrt(variance).toFixed(2);
    return standardDeviation;
  };

  const getTimeString = (averageTotalTimeTaken: number | undefined) => {
    if (!averageTotalTimeTaken) return 'None';
    if (averageTotalTimeTaken < 60) return 'Less than 1 minute';
    let numMins = Math.floor(averageTotalTimeTaken / 60);
    const numHrs = Math.floor(numMins / 60);
    numMins %= 60;
    return `${numHrs > 0 ? `${numHrs} hour` : ''} ${
      numMins > 0 ? `${numMins} minutes` : ''
    }`;
  };

  return (
    <div className="flex justify-around">
      <div className="flex flex-col w-30 text-2xl font-semibold">
        <div className="flex gap-1 items-center text-gray-700 text-base font-light">
          <MinusCircleIcon className="h-5" />
          Average Score
        </div>
        {getQuizAverageScore(totalMarksArr)}
      </div>

      <div className="flex flex-col w-30 text-2xl font-semibold">
        <div className="flex gap-1 items-center text-gray-700 text-base font-light">
          <ArrowUpCircleIcon className="h-5" />
          High Score
        </div>
        {getQuizHighScore(totalMarksArr)}
      </div>

      <div className="flex flex-col w-30 text-2xl font-semibold">
        <div className="flex gap-1 items-center text-gray-700 text-base font-light">
          <ArrowDownCircleIcon className="h-5" />
          Low Score
        </div>
        {getQuizLowScore(totalMarksArr)}
      </div>

      <div className="flex flex-col w-30 text-2xl font-semibold">
        <div className="flex gap-1 items-center text-gray-700 text-base font-light">
          <ArrowsUpDownIcon className="h-5" />
          Standard Deviation
        </div>
        {getStdDev(totalMarksArr)}
      </div>

      {quizStats ? (
        <div className="flex flex-col w-30 text-2xl font-semibold">
          <div className="flex gap-1 items-center text-gray-700 text-base font-light">
            <ClockIcon className="h-5" />
            Average Time Taken
          </div>
          {getTimeString(quizStats?.averageTotalTimeTaken)}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
