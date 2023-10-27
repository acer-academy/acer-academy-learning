import { StudentTakeData } from '@acer-academy-learning/data-access';
import { useState } from 'react';
import {
  ClockIcon,
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { QuizAttempt } from './QuizAttempt';

export const QuizAttemptTableRow: React.FC<{
  quizTakeMap: Map<string, StudentTakeData[]>;
  index: number;
  takes: StudentTakeData[];
}> = (props) => {
  const { quizTakeMap, index, takes } = props;

  const [displayBestAttempt, setDisplayBestAttempt] = useState(true);

  const getTimeAllowedString = (timeAllowedInSeconds: number | undefined) => {
    if (!timeAllowedInSeconds) return 'None';
    let numMins = Math.floor(timeAllowedInSeconds / 60);
    const numHrs = Math.floor(numMins / 60);
    numMins %= 60;
    return `${numHrs > 0 ? `${numHrs} hour` : ''} ${
      numMins > 0 ? `${numMins} minutes` : ''
    }`;
  };

  const getTabClassName = (tabname: string) => {
    if (displayBestAttempt) {
      if (tabname == 'best')
        return 'h-7 relative top-0.5 justify-center px-2 py-1 text-xs font-bold border border-b border-b-white rounded-t-lg border-gray-300 bg-white hover:cursor-default';
      return 'h-6 relative justify-center px-2 pb-0.5 pt-0.5 text-xs border border-b-0 rounded-t-lg border-gray-300 text-gray-500';
    } else {
      if (tabname == 'best')
        return 'h-6 relative justify-center px-2 pb-0.5 pt-0.5 text-xs border border-b-0 rounded-t-lg border-gray-300 text-gray-500';
      return 'h-7 relative top-0.5 justify-center px-2 py-1 text-xs font-bold border border-b border-b-white rounded-t-lg border-gray-300 bg-white hover:cursor-default';
    }
  };

  const getBestAttempt = (takes: StudentTakeData[]) => {
    const clone = takes.slice();
    clone.sort((a, b) => b.marks - a.marks);
    return clone[0];
  };

  return (
    <div
      key={Array.from(quizTakeMap.keys())[index]}
      className="shadow ring-1 ring-black ring-opacity-5 bg-white sm:rounded-lg pt-3 pb-4 px-4 font-medium text-gray-900"
    >
      <div className="flex flex-col">
        <span className="font-bold text-lg">{takes[0].quiz.title}</span>
        <div className="flex gap-3 mt-2">
          <div className="flex items-center gap-1">
            <DocumentDuplicateIcon className="w-4 h-4 text-teacherBlue-700" />
            <span className="font-semibold text-sm">
              {`${takes[0].quiz.quizQuestions.length} questions`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <DocumentCheckIcon className="w-4 h-4 text-teacherBlue-700" />
            <span className="font-semibold text-sm">
              {`${String(takes[0].quiz.totalMarks)} marks`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4 text-teacherBlue-700" />
            <span className="font-semibold text-sm">
              {getTimeAllowedString(takes[0].quiz.timeAllowed)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowPathIcon className="w-4 h-4 text-teacherBlue-700" />
            <span className="font-semibold text-sm">
              {`${takes.length} attempts`}
            </span>
          </div>
        </div>
        <div className="flex mt-4 items-end justify-left">
          <button
            className={getTabClassName('best')}
            onClick={() => {
              setDisplayBestAttempt(true);
            }}
          >
            Best Attempt
          </button>
          <button
            className={getTabClassName('all')}
            onClick={() => {
              setDisplayBestAttempt(false);
            }}
          >
            All Attempts
          </button>
        </div>
        <div className="border border-gray-300 sm:rounded-b-lg rounded-tr-lg py-4 px-3">
          {displayBestAttempt ? (
            <QuizAttempt
              quizAttempt={getBestAttempt(takes)}
              index={takes.indexOf(getBestAttempt(takes))}
            ></QuizAttempt>
          ) : (
            <div className="flex flex-col gap-2">
              {takes.map((take, index) => (
                <QuizAttempt
                  quizAttempt={take}
                  enabledHr={takes.length > 1 && index != takes.length - 1}
                  index={index}
                ></QuizAttempt>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
