import {
  LexOutput,
  WarningModal,
  useAuth,
  useToast,
} from '@acer-academy-learning/common-ui';
import {
  Teacher,
  deleteAssignment,
  getAllAssignments,
} from '@acer-academy-learning/data-access';
import {
  DocumentCheckIcon,
  LockClosedIcon,
  LockOpenIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { AssignmentData } from 'libs/data-access/src/lib/types/assignment';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LevelTag } from '../question-bank/LevelTag';
import { useMutation } from 'react-query';
import moment from 'moment';

export const AssignmentManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { displayToast, ToastType } = useToast();
  const { user } = useAuth<Teacher>();
  const { subject } = useParams();
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteAssignmentId, setDeleteAssignmentId] = useState('');
  const [searchbarText, setSearchbarText] = useState('');

  const fetchAssignments = async () => {
    try {
      const response = await getAllAssignments();
      const assignmentsData = response.data.filter(
        (assignment) => assignment.subject.toLowerCase() === subject,
      );
      setAssignments(assignmentsData);
    } catch (error) {
      displayToast(
        'Assignments could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const navToSelectedAssignment = (selectedAssignmentId: string) => {
    navigate(`${location.pathname}/${selectedAssignmentId}`);
  };
  const navToCreateAssignment = () => {
    navigate(`${location.pathname}/create`);
  };
  const navToEditAssignment = (selectedAssignmentId: string) => {
    navigate(`${location.pathname}/edit/${selectedAssignmentId}`);
  };

  const { mutate: deleteAssignmentMutate } = useMutation(deleteAssignment, {
    onSuccess: async () => {
      await fetchAssignments();
      displayToast('Successfully deleted assignment', ToastType.SUCCESS);
    },
    onError: (error: Error) => {
      displayToast(
        'Error deleting assignment: ' + error.message,
        ToastType.ERROR,
      );
    },
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="h-full">
      <div className="flex min-h-full flex-col gap-7 align-middle">
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="text"
            name="assignment-searchbar"
            id="assignment-searchbar"
            className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-adminGreen-600 sm:text-sm sm:leading-6"
            placeholder="Search for an assignment..."
            value={searchbarText}
            onChange={(e) => {
              setSearchbarText(e.target.value);
            }}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 fill-gray-400 stroke-2"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </div>
        </div>
        <div className="flex align-middle justify-between">
          <div className="flex align-middle gap-4">
            <span className="text-2xl py-1 font-bold tracking-tight">
              Assignments
            </span>
          </div>
          <button
            className="inline-flex justify-center px-4 py-2 text-white bg-teacher-primary-900 border border-transparent rounded-md hover:bg-teacher-secondary-700"
            onClick={() => {
              navToCreateAssignment();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4 fill-white stroke-2 relative mt-1"
              viewBox="0 0 16 16"
            >
              <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
            </svg>
            Create Assignment
          </button>
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
                        Assignment
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900 min-w-0"
                      >
                        Details
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900 min-w-0"
                      >
                        Due Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                      >
                        Level(s)
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {assignments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="whitespace-nowrap py-4 px-4 font-light italic text-gray-400 text-center"
                        >
                          No assignments found.
                        </td>
                      </tr>
                    ) : (
                      assignments
                        .filter(
                          (assignment) =>
                            assignment.title
                              .toLowerCase()
                              .includes(searchbarText.toLowerCase()) ||
                            assignment.description
                              ?.toLowerCase()
                              .includes(searchbarText.toLowerCase()),
                        )
                        .map((assignment) => (
                          <tr
                            key={assignment.id}
                            className="hover:bg-slate-50 hover:cursor-pointer"
                            onClick={() => {
                              navToSelectedAssignment(assignment.id);
                            }}
                          >
                            <td className="py-4 pl-3.5 pr-3 text-xs font-medium text-gray-900">
                              <div>
                                <span className="font-bold text-sm">
                                  {assignment.title}
                                </span>
                                <span>
                                  <LexOutput
                                    editorStateStr={assignment.description}
                                    shorten
                                  />
                                </span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-900">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                  {new Date() <=
                                  new Date(assignment.dueDate) ? (
                                    <LockOpenIcon className="w-4 h-4 text-teacherBlue-700" />
                                  ) : (
                                    <LockClosedIcon className="w-4 h-4 text-teacherBlue-700" />
                                  )}
                                  <span className="font-semibold text-sm">
                                    {`${
                                      new Date() <= new Date(assignment.dueDate)
                                        ? 'Available'
                                        : `Closed`
                                    }`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DocumentCheckIcon className="w-4 h-4 text-teacherBlue-700" />
                                  <span className="font-semibold text-sm">
                                    {`${String(assignment.totalMarks)} marks`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <UserGroupIcon className="w-4 h-4 text-teacherBlue-700" />
                                  <span className="font-semibold text-sm">
                                    {`${assignment.assignmentAttempts.length} submitted`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <PlusCircleIcon className="w-4 h-4 text-teacherBlue-700" />
                                  <span className="font-semibold text-sm">
                                    Created by{' '}
                                    {`${assignment.teacher.firstName} ${assignment.teacher.lastName}`}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap py-4 px-3 font-medium text-gray-900">
                              <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500">
                                  {moment(assignment.dueDate).format(
                                    'D MMMM YYYY, h:mm:ss A',
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap py-4 px-3 font-medium text-gray-900">
                              <div className="flex flex-col gap-1">
                                {assignment.levels.map((level, index) => {
                                  return (
                                    <LevelTag
                                      key={index}
                                      index={index}
                                      levelEnum={level}
                                    />
                                  );
                                })}
                              </div>
                            </td>
                            <td className="whitespace-nowrap font-medium text-gray-900 space-x-1 w-max pr-3">
                              {user?.id === assignment.teacher.id && (
                                <>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navToEditAssignment(assignment.id);
                                    }}
                                    className="inline-flex items-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-green-600"
                                  >
                                    <PencilSquareIcon className="w-6 h-6 text-white" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteAssignmentId(assignment.id);
                                      setDeleteModalOpen(true);
                                    }}
                                    className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-600"
                                  >
                                    <TrashIcon className="w-6 h-6 text-white" />
                                  </button>
                                </>
                              )}
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
      <WarningModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        title={'Delete Assignment'}
        description={
          'Are you sure you want to delete this assignment? All student attempts for this assignment will also be removed and cannot be undone.'
        }
        confirmContent={'Delete'}
        dismissContent={'Cancel'}
        onConfirm={() => deleteAssignmentMutate(deleteAssignmentId)}
      />
    </div>
  );
};
