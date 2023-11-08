import {
  BackButton,
  FullscreenSpinner,
  GenericButton,
  GenericInput,
  GenericSelect,
  LexEditor,
  LexOutput,
  useToast,
} from '@acer-academy-learning/common-ui';
import {
  AssignmentData,
  getAllStudents as apiGetAllStudents,
  createAssignmentAttempt,
  getAssignmentAttemptsByAssignmentId,
  getAssignmentById,
} from '@acer-academy-learning/data-access';
import { isAxiosError } from 'axios';
import { AssignmentAttemptCreateData } from 'libs/data-access/src/lib/types/assignmentAttempt';
import { StudentData } from 'libs/data-access/src/lib/types/student';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

export const AssignmentAttemptManagement: React.FC = () => {
  const { assignmentId } = useParams();
  const queryClient = useQueryClient();
  const { displayToast, ToastType } = useToast();
  const [assignment, setAssignment] = useState<AssignmentData>();
  const [createAttemptData, setCreateAttemptData] =
    useState<AssignmentAttemptCreateData>({
      assignmentId: assignmentId ?? '',
      studentId: '',
      feedback: '',
      score: 0,
      submittedOn: new Date(),
    });
  const [selectedStudent, setSelectedStudent] = useState<StudentData>();
  const [allStudents, setAllStudents] = useState<StudentData[]>([]);
  const [isAddAttemptFormOpen, setIsAddAttemptFormOpen] = useState(false);

  const getAllStudents = async () => {
    try {
      const response = await apiGetAllStudents();
      const studentData = response.data;
      setAllStudents(studentData.students);
    } catch (error) {
      displayToast(
        'Students could not be retrieved from the server.',
        ToastType.ERROR,
      );
    }
  };

  const getAssignment = async () => {
    try {
      const response = await getAssignmentById(assignmentId ?? '');
      setAssignment(response.data);
    } catch (error) {
      displayToast(
        'Assignment could not be retrieved from the server.',
        ToastType.ERROR,
      );
    }
  };

  useEffect(() => {
    getAllStudents();
    getAssignment();
  }, []);

  const {
    data: assignmentAttemptsData,
    isLoading,
    isSuccess,
  } = useQuery(['assignment', assignmentId], () =>
    getAssignmentAttemptsByAssignmentId(assignmentId ?? ''),
  );

  const createAttemptMutation = useMutation(createAssignmentAttempt, {
    onSuccess: () => {
      // Invalidate and refetch the assignment attempts query
      queryClient.invalidateQueries(['assignment', assignmentId]);
      displayToast('Successfully added attempt for student', ToastType.SUCCESS);
    },
    onError: (error) => {
      const errorMsg = isAxiosError<{ error: string }>(error)
        ? error.response?.data.error
        : 'Unknown error';
      displayToast('Error: ' + errorMsg, ToastType.ERROR);
      console.error(error);
    },
  });

  const handleAddAttempt = async () => {
    if (createAttemptData.score < 0) {
      displayToast('Score cannot be negative', ToastType.ERROR);
    } else if (
      !!assignmentAttemptsData &&
      assignment &&
      createAttemptData.score > assignment.totalMarks
    ) {
      displayToast('Score cannot be larger than total marks', ToastType.ERROR);
    } else if (selectedStudent === undefined) {
      displayToast('No student selected', ToastType.ERROR);
    } else {
      try {
        const createData = {
          ...createAttemptData,
          studentId: selectedStudent.id,
          submittedOn: new Date(),
        };

        // Reset form
        setCreateAttemptData({
          assignmentId: assignmentId ?? '',
          studentId: '',
          feedback: '',
          score: 0,
          submittedOn: new Date(),
        });
        setSelectedStudent(undefined);

        await createAttemptMutation.mutateAsync(createData);
      } catch (error) {
        const errorMsg = isAxiosError<{ error: string }>(error)
          ? error.response?.data.error
          : 'Unknown error';
        displayToast('Error: ' + errorMsg, ToastType.ERROR);
        console.error(error);
      }
    }
  };

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
                Attempts for {assignment?.title}
              </span>
            </div>
            {isAddAttemptFormOpen ? (
              <button
                className="inline-flex justify-center px-4 py-2 text-white bg-teacherBlue-500 border border-transparent rounded-md hover:bg-teacherBlue-700"
                onClick={() => {
                  setIsAddAttemptFormOpen(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 mr-3"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
                Close Form
              </button>
            ) : (
              <button
                className="inline-flex justify-center px-4 py-2 text-white bg-teacherBlue-500 border border-transparent rounded-md hover:bg-teacherBlue-700"
                onClick={() => {
                  setIsAddAttemptFormOpen(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4 fill-white stroke-2 relative mt-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                </svg>
                Add Attempt
              </button>
            )}
          </div>

          {isAddAttemptFormOpen && (
            <div className="rounded-md border border-gray-300 py-8 px-8 my-5 flex flex-col gap-5">
              <div className="font-bold text-lg">Add Marks for Student</div>
              <div className="space-y-1">
                <span className="block text-base font-medium leading-6 text-gray-900">
                  Student:{' '}
                </span>
                <GenericSelect
                  options={allStudents}
                  onChange={(student: StudentData) =>
                    setSelectedStudent(student)
                  }
                  selected={selectedStudent as StudentData}
                  getDisplayValue={(student) => {
                    return student.firstName + ' ' + student.lastName;
                  }}
                  placeholder="Choose Student"
                />
              </div>
              <div className="flex flex-row gap-5 items-center">
                <span className="text-base font-medium leading-6 text-gray-900">
                  Score:{' '}
                </span>
                <GenericInput
                  onChange={(e) =>
                    setCreateAttemptData({
                      ...createAttemptData,
                      score: parseInt(e.target.value),
                    })
                  }
                  onBlur={() => {
                    // TODO
                  }}
                  value={createAttemptData.score}
                  type="number"
                  inputClassName="w-20"
                />
              </div>
              <div className="space-y-1">
                <span className="block text-base font-medium leading-6 text-gray-900">
                  Feedback:{' '}
                </span>
                <LexEditor
                  onChange={(value) =>
                    setCreateAttemptData({
                      ...createAttemptData,
                      feedback: value,
                    })
                  }
                  onBlur={() => {
                    // TODO
                  }}
                  editorStateStr={createAttemptData.feedback}
                />
              </div>
              <div className="flex flex-row gap-5 justify-center">
                <GenericButton
                  type="submit"
                  onClick={handleAddAttempt}
                  text="Add Attempt"
                  className="w-1/12"
                />
              </div>
            </div>
          )}

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
