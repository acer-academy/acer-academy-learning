import {
  BackButton,
  FullscreenSpinner,
  LexOutput,
  useAuth,
} from '@acer-academy-learning/common-ui';
import { Teacher, getAssignmentById } from '@acer-academy-learning/data-access';
import { PaperClipIcon } from '@heroicons/react/20/solid';
import { useQuery } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LevelTag } from '../question-bank/LevelTag';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

export const ViewAssignment: React.FC = () => {
  const { assignmentId } = useParams();
  const {
    data: assignmentData,
    isLoading,
    isSuccess,
  } = useQuery(['assignment', assignmentId], () =>
    getAssignmentById(assignmentId ?? ''),
  );
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth<Teacher>();

  if (isLoading) {
    return <FullscreenSpinner />;
  }

  if (isSuccess && assignmentData) {
    const assignment = assignmentData.data;
    const navToEditAssignment = () => {
      navigate(`${location.pathname.slice(0, -37)}/edit/${assignment.id}`);
    };

    return (
      <>
        <BackButton className="mx-10" />
        <div className="px-10 pt-5">
          <div className="px-4 sm:px-0 flex flex-row justify-between">
            <h3 className="text-2xl font-semibold leading-7 text-gray-900">
              {assignment.title}
            </h3>
            {!!user && user.id === assignment.teacher.id && (
              <button
                className="inline-flex justify-center px-4 py-2 text-white bg-teacherBlue-500 border border-transparent rounded-md hover:bg-teacherBlue-700"
                onClick={() => {
                  navToEditAssignment();
                }}
              >
                <PencilSquareIcon className="h-5 w-5 mr-2" />
                Edit Assignment
              </button>
            )}
          </div>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-200">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Description
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <LexOutput editorStateStr={assignment.description} />
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Due Date
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {moment(assignment.dueDate).format('D MMMM YYYY, h:mm:ss A')}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Total Marks
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {assignment.totalMarks}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Created By
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {assignment.teacher.firstName} {assignment.teacher.lastName}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Subject
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {assignment.subject.toString().slice(0, 1)}
                  {assignment.subject.toString().slice(1).toLowerCase()}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Levels
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <div className="flex flex-row gap-3">
                    {assignment.levels.map((level, index) => {
                      return (
                        <LevelTag key={index} index={index} levelEnum={level} />
                      );
                    })}
                  </div>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  No. of Student Submissions
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <div className="flex flex-row gap-3">
                    {assignment.assignmentAttempts.length}
                  </div>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Attachment
                </dt>
                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul
                    role="list"
                    className="divide-y divide-gray-100 rounded-md border border-gray-200"
                  >
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <a
                            href={assignment.fileUrl}
                            className="font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {assignment.fileName}
                          </a>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href={assignment.fileUrl}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </>
    );
  }
};
