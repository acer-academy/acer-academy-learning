import { AssignmentData } from '@acer-academy-learning/data-access';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { attempt } from 'lodash';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

export type AssignmentRowProps = {
  assignment: AssignmentData;
  studentId: string;
  className?: string;
  iconStyles?: string;
};

/**
 * A list item for view all quizzes
 * @returns {JSX.Element}
 */
const smallDataClassName = `text-xs px-2`;
export const AssignmentRow = ({
  assignment,
  studentId,
  className,
  iconStyles,
}: AssignmentRowProps) => {
  const navigate = useNavigate();
  const attempt = assignment.assignmentAttempts.find(
    (attempt) => attempt.studentId === studentId,
  );
  return (
    <li
      className={` hover:bg-blue-100 border-x border-b border-gray-400 ${className}`}
    >
      <button
        type="button"
        className="flex items-center space-x-4 px-6 py-4 w-full"
        onClick={() => navigate(assignment.id)}
      >
        <DocumentTextIcon className={`h-8 w-8 ${iconStyles}`} />
        <div className="flex flex-col space-y-1">
          <span className="text-base font-bold underline hover:no-underline self-start">
            {assignment.title}
          </span>
          {attempt === undefined ? (
            <div className="flex divide-x divide-black text-black">
              <small className={`${smallDataClassName} pl-0`}>
                {assignment.totalMarks} marks
              </small>
              <small className={`${smallDataClassName}`}>Unattempted</small>
              <small className={`${smallDataClassName}`}>
                Due{' '}
                {moment(assignment.dueDate).format('D MMMM YYYY, h:mm:ss A')}
              </small>
            </div>
          ) : (
            <div className="flex divide-x divide-black text-black">
              <small className={`${smallDataClassName} pl-0`}>
                {attempt.score} / {assignment.totalMarks} marks
              </small>
              <small className={`${smallDataClassName}`}>
                Submitted{' '}
                {moment(attempt.submittedOn).format('D MMMM YYYY, h:mm:ss A')}
              </small>
            </div>
          )}
        </div>
      </button>
    </li>
  );
};
