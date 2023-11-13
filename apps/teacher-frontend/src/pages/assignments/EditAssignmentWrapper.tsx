import { FullscreenSpinner, useAuth } from '@acer-academy-learning/common-ui';
import { Teacher, getAssignmentById } from '@acer-academy-learning/data-access';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { EditAssignment } from './EditAssignment';

export const EditAssignmentWrapper: React.FC = () => {
  const { assignmentId } = useParams();
  const {
    data: assignmentData,
    isLoading,
    isSuccess,
  } = useQuery(['assignment', assignmentId], () =>
    getAssignmentById(assignmentId ?? ''),
  );
  const { user } = useAuth<Teacher>();

  if (isLoading) {
    return <FullscreenSpinner />;
  }

  if (isSuccess && assignmentData) {
    const assignment = assignmentData.data;
    if (!!user && user.id === assignment.teacher.id) {
      return <EditAssignment assignment={assignment} />;
    } else {
      return (
        <div className="flex justify-center text-red-500 font-bold">
          You do not have access to edit this assignment.
        </div>
      );
    }
  }
};
