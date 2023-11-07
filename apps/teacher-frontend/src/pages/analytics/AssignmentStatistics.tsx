import { BackButton, useToast } from '@acer-academy-learning/common-ui';
import { getAssignmentAttemptsByAssignmentId } from '@acer-academy-learning/data-access';
import { AssignmentAttemptData } from 'libs/data-access/src/lib/types/assignmentAttempt';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AssignmentSummaryBoxWhisker } from './components/AssignmentSummaryBoxWhisker';
import { AssignmentSummaryRow } from './components/AssignmentSummaryRow';
import { AssignmentSummaryBellCurve } from './components/AssignmentSummaryBellCurve';

export const AssignmentStatistics: React.FC = () => {
  const { assignmentId } = useParams();
  const { displayToast, ToastType } = useToast();
  const [assignmentAttempts, setAssignmentAttempts] = useState<
    AssignmentAttemptData[]
  >([]);
  const [totalMarksArr, setTotalMarksArr] = useState<number[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (assignmentId) {
      getAssignmentAttemptsByAssignmentId(assignmentId)
        .then((res) => {
          const attempts = res.data;
          setAssignmentAttempts(attempts);

          const totalMarks = attempts.map((attempt) => attempt.score);
          setTotalMarksArr(totalMarks);
        })
        .catch((error: Error) => {
          displayToast(
            'Assignment statistics could not be retrieved from the server: ' +
              error.message,
            ToastType.ERROR,
          );
        });
    }
  }, [assignmentId]);

  if (assignmentAttempts.length === 0 || totalMarksArr.length === 0) {
    return (
      <>
        <BackButton />
        <div className="flex justify-center my-auto text-gray-700 italic text-center">
          No statistics to show - this assignment has not been attempted yet.
        </div>
      </>
    );
  }

  const assignment = assignmentAttempts[0].assignment;

  return (
    <div className="flex min-h-full flex-col gap-5">
      <div>
        <BackButton />
      </div>
      <div className="flex gap-2 text-2xl py-1 mb-5 font-bold tracking-tight items-center">
        {assignment.title}
      </div>
      <div>
        <AssignmentSummaryRow
          totalMarksArr={totalMarksArr}
          assignmentTotalMarks={assignment.totalMarks}
        />
        <AssignmentSummaryBoxWhisker
          totalMarksArr={totalMarksArr}
          assignmentTotalMarks={assignment.totalMarks}
        />
        <AssignmentSummaryBellCurve
          totalMarksArr={totalMarksArr}
          assignmentTotalMarks={assignment.totalMarks}
        />
      </div>
    </div>
  );
};
