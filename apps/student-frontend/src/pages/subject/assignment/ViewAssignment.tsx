import {
  BackButton,
  FullscreenSpinner,
  LexOutput,
  useAuth,
} from '@acer-academy-learning/common-ui';
import { getAssignmentById } from '@acer-academy-learning/data-access';
import { PaperClipIcon } from '@heroicons/react/20/solid';
import { Student } from 'libs/data-access/src/lib/types/student';
import moment from 'moment';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

export const ViewAssignment: React.FC = () => {
  const { assignmentId } = useParams();
  const {
    data: assignmentData,
    isLoading,
    isSuccess,
  } = useQuery(['assignment', assignmentId], () =>
    getAssignmentById(assignmentId ?? ''),
  );
  const { user } = useAuth<Student>();

  if (isLoading) {
    return <FullscreenSpinner />;
  }

  if (isSuccess && assignmentData) {
    const assignment = assignmentData.data;
    const attempt = assignment.assignmentAttempts.find(
      (attempt) => attempt.studentId === user?.id,
    );

    return (
      <>
        <BackButton className="mx-10" />
        <div className="px-10 pt-5">
          <div className="px-4 sm:px-0 flex flex-row justify-between">
            <h3 className="text-2xl font-semibold leading-7 text-gray-900">
              {assignment.title}
            </h3>
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
              {!!attempt && (
                <>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Score
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {attempt.score} / {assignment.totalMarks} marks
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Feedback
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <LexOutput editorStateStr={attempt.feedback} />
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>
      </>
    );
  }
};
