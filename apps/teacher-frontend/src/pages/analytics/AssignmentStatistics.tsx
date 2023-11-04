import { BackButton, useToast } from '@acer-academy-learning/common-ui';
import {
  ConsolidatedAssignmentStatistics,
  getAssignmentStatisticsByAssignmentId,
} from '@acer-academy-learning/data-access';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StatisticsSummaryRow } from './components/StatisticsSummaryRow';
import { BoxWhiskerChart } from './components/BoxWhiskerChart';
import { BellcurveChart } from './components/BellcurveChart';

export const AssignmentStatistics: React.FC = () => {
  const { displayToast, ToastType } = useToast();
  const { assignmentId } = useParams();
  const [assignmentStats, setAssignmentStats] =
    useState<ConsolidatedAssignmentStatistics>();

  useEffect(() => {
    if (assignmentId) {
      getAssignmentStatisticsByAssignmentId(assignmentId)
        .then((res) => {
          setAssignmentStats(res.data);
        })
        .catch((error: any) => {
          displayToast(
            'Quiz statistics could not be retrieved from the server: ' +
              error.message,
            ToastType.ERROR,
          );
        });
    }
  }, [assignmentId]);

  return (
    <div className="flex min-h-full flex-col gap-5">
      <div>
        <BackButton />
      </div>
      <div className="flex gap-2 text-2xl py-1 mb-5 font-bold tracking-tight items-center">
        {assignmentStats?.assignmentDetails.title ?? ''}
      </div>
      {assignmentStats?.assignmentDetails.totalMarks ? (
        <div>
          <StatisticsSummaryRow
            totalMarksArr={assignmentStats.totalMarksArr}
            totalMarksPossible={assignmentStats.assignmentDetails.totalMarks}
          />
          <BoxWhiskerChart
            totalMarksArr={assignmentStats.totalMarksArr}
            totalMarksPossible={assignmentStats.assignmentDetails.totalMarks}
          />
          <BellcurveChart
            totalMarksArr={assignmentStats.totalMarksArr}
            totalMarksPossible={assignmentStats.assignmentDetails.totalMarks}
          />
        </div>
      ) : (
        <div className="flex justify-center my-auto text-gray-700 italic text-center">
          No statistics to show - this assignment has not been attempted yet.
        </div>
      )}
    </div>
  );
};
