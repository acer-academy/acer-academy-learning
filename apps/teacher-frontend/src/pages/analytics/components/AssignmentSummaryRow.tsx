import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ArrowsUpDownIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/outline';

export const AssignmentSummaryRow: React.FC<{
  totalMarksArr: number[];
  assignmentTotalMarks: number;
}> = (props) => {
  const { totalMarksArr, assignmentTotalMarks } = props;

  const getAssignmentAverageScore = () => {
    if (!totalMarksArr) return '-';
    return `${Math.round(
      (totalMarksArr.reduce((x, y) => x + y, 0) /
        totalMarksArr.length /
        (assignmentTotalMarks ?? 1)) *
        100,
    )}%`;
  };

  const getAssignmentHighScore = () => {
    if (!totalMarksArr) return '-';
    return `${Math.round(
      (totalMarksArr.reduce((x, y) => (x > y ? x : y), 0) /
        (assignmentTotalMarks ?? 1)) *
        100,
    )}%`;
  };

  const getAssignmentLowScore = () => {
    if (!totalMarksArr) return '-';
    return `${Math.round(
      (totalMarksArr.reduce((x, y) => (x < y ? x : y)) /
        (assignmentTotalMarks ?? 1)) *
        100,
    )}%`;
  };

  const getStdDev = () => {
    if (!totalMarksArr || totalMarksArr.length <= 1) {
      return '-';
    }
    const mean =
      totalMarksArr.reduce((sum, num) => sum + num, 0) / totalMarksArr.length;
    const squaredDifferencesSum = totalMarksArr.reduce((sum, num) => {
      const diff = num - mean;
      return sum + diff * diff;
    }, 0);
    const variance = squaredDifferencesSum / (totalMarksArr.length - 1);
    const standardDeviation = Math.sqrt(variance).toFixed(2);
    return standardDeviation;
  };

  return (
    <div className="flex justify-around">
      <div className="flex flex-col w-30 text-2xl font-semibold">
        <div className="flex gap-1 items-center text-gray-700 text-base font-light">
          <MinusCircleIcon className="h-5" />
          Average Score
        </div>
        {getAssignmentAverageScore()}
      </div>

      <div className="flex flex-col w-30 text-2xl font-semibold">
        <div className="flex gap-1 items-center text-gray-700 text-base font-light">
          <ArrowUpCircleIcon className="h-5" />
          High Score
        </div>
        {getAssignmentHighScore()}
      </div>

      <div className="flex flex-col w-30 text-2xl font-semibold">
        <div className="flex gap-1 items-center text-gray-700 text-base font-light">
          <ArrowDownCircleIcon className="h-5" />
          Low Score
        </div>
        {getAssignmentLowScore()}
      </div>

      <div className="flex flex-col w-30 text-2xl font-semibold">
        <div className="flex gap-1 items-center text-gray-700 text-base font-light">
          <ArrowsUpDownIcon className="h-5" />
          Standard Deviation
        </div>
        {getStdDev()}
      </div>
    </div>
  );
};
