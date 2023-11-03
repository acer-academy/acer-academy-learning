import {
  BackButton,
  FullscreenSpinner,
  LexOutput,
} from '@acer-academy-learning/common-ui';
import { getAssignmentAttemptsByAssignmentId } from '@acer-academy-learning/data-access';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import moment from 'moment';

export const AssignmentAttemptManagement: React.FC = () => {
  const { assignmentId } = useParams();
  const {
    data: assignmentAttemptsData,
    isLoading,
    isSuccess,
  } = useQuery(['assignment', assignmentId], () =>
    getAssignmentAttemptsByAssignmentId(assignmentId ?? ''),
  );

  if (isLoading) {
    return <FullscreenSpinner />;
  }

  if (isSuccess && assignmentAttemptsData) {
    const attempts = assignmentAttemptsData.data;

    return (
      <div className="h-full">
        <div className="flex min-h-full flex-col gap-7 align-middle">
          <BackButton className="w-20" />

          <div className="flex align-middle justify-between">
            <div className="flex align-middle gap-4">
              <span className="text-2xl py-1 font-bold tracking-tight">
                Attempts for {attempts[0].assignment.title}
              </span>
            </div>
          </div>

          <div className="min-w-max">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-200">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-3.5 pr-3 text-left text-lg font-bold text-gray-900 sm:pl-6"
                        >
                          Student Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-lg font-bold text-gray-900 min-w-0"
                        >
                          Student Email
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-lg font-bold text-gray-900 min-w-0"
                        >
                          Score
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-lg font-bold text-gray-900 min-w-0"
                        >
                          Submission Date
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                        >
                          Feedback
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {attempts.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="whitespace-nowrap py-4 px-4 font-light italic text-gray-400 text-center"
                          >
                            No student attempts found.
                          </td>
                        </tr>
                      ) : (
                        attempts.map((attempt) => (
                          <tr
                            key={attempt.id}
                            className="hover:bg-slate-50 hover:cursor-pointer"
                          >
                            <td className="py-4 pl-3.5 pr-3 text-xs text-gray-900">
                              <div>
                                {attempt.student.firstName}{' '}
                                {attempt.student.lastName}
                              </div>
                            </td>
                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-900">
                              {attempt.student.email}
                            </td>
                            <td className="whitespace-nowrap py-4 px-3 text-gray-900">
                              {attempt.score}
                            </td>
                            <td className="whitespace-nowrap py-4 px-3 text-gray-900">
                              {moment(attempt.submittedOn).format(
                                'D MMMM YYYY, h:mm:ss A',
                              )}
                            </td>
                            <td className="whitespace-nowrap py-4 px-3 text-gray-900">
                              <span>
                                <LexOutput
                                  editorStateStr={attempt.feedback}
                                  shorten
                                />
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
