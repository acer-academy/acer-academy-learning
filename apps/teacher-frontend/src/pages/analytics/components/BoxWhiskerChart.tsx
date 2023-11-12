import { ConsolidatedQuizStatistics } from '@acer-academy-learning/data-access';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import Boxplot, { computeBoxplotStats } from 'react-boxplot';

export const BoxWhiskerChart: React.FC<{
  totalMarksArr: number[];
  totalMarksPossible: number;
}> = (props) => {
  const { totalMarksArr, totalMarksPossible } = props;

  const sortedTotalMarksArr = totalMarksArr.sort((x, y) => x - y);
  const min = sortedTotalMarksArr[0];
  const max = sortedTotalMarksArr[sortedTotalMarksArr.length - 1];
  const median =
    sortedTotalMarksArr[Math.round(sortedTotalMarksArr.length / 2)];
  const lowerQuartile =
    sortedTotalMarksArr[Math.round(sortedTotalMarksArr.length / 4)];
  const upperQuartile =
    sortedTotalMarksArr[Math.round((sortedTotalMarksArr.length / 4) * 3)];
  const mean = (
    sortedTotalMarksArr.reduce((x, y) => x + y, 0) / sortedTotalMarksArr.length
  ).toFixed(2);

  return (
    <div className="my-10">
      {totalMarksArr && totalMarksArr.length > 1 ? (
        <div className="flex flex-col items-center">
          <div className="flex gap-5 mb-5">
            <div className="flex gap-1 items-center text-gray-700 text-base font-light">
              Low:
              <span className="font-semibold text-black">{min}</span>
            </div>
            <div className="flex gap-1 items-center text-gray-700 text-base font-light">
              Lower Quartile:
              <span className="font-semibold text-black">{lowerQuartile}</span>
            </div>
            <div className="flex gap-1 items-center text-gray-700 text-base font-light">
              Median:
              <span className="font-semibold text-black">{median}</span>
            </div>
            <div className="flex gap-1 items-center text-gray-700 text-base font-light">
              Mean:
              <span className="font-semibold text-black">{mean}</span>
            </div>
            <div className="flex gap-1 items-center text-gray-700 text-base font-light">
              Upper Quartile:
              <span className="font-semibold text-black">{upperQuartile}</span>
            </div>
            <div className="flex gap-1 items-center text-gray-700 text-base font-light">
              High:
              <span className="font-semibold text-black">{max}</span>
            </div>
          </div>
          <div className="flex gap-2 items-center text-xs">
            0
            <Boxplot
              width={500}
              height={30}
              orientation="horizontal"
              min={0}
              max={totalMarksPossible}
              stats={{
                whiskerLow: 0,
                quartile1: lowerQuartile,
                quartile2: median,
                quartile3: upperQuartile,
                whiskerHigh: totalMarksPossible,
                outliers: [min, max],
              }}
            />
            {totalMarksPossible}
          </div>
        </div>
      ) : (
        <div className="flex justify-center text-center">
          <span className="italic text-gray-700">
            Insufficient data to render box-and-whisker plot
          </span>
        </div>
      )}
    </div>
  );
};
