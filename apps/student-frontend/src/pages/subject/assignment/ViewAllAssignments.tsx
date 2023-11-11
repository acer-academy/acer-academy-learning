import {
  GenericAccordion,
  useAuth,
  useToast,
} from '@acer-academy-learning/common-ui';
import { getAllAssignments } from '@acer-academy-learning/data-access';
import { AssignmentData } from 'libs/data-access/src/lib/types/assignment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Student } from 'libs/data-access/src/lib/types/student';
import { AssignmentRow } from './AssignmentRow';

const accordionTitleClassName =
  'px-6 py-4 bg-student-primary-900 text-white hover:bg-student-secondary-700';

export const ViewAllAssignments: React.FC = () => {
  const { displayToast, ToastType } = useToast();
  const { user } = useAuth<Student>();
  const { subject } = useParams();

  // Past assignments = assignments that are past the due date or have been attempted by the student
  const [pastAssignments, setPastAssignments] = useState<AssignmentData[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<
    AssignmentData[]
  >([]);
  const [searchbarText, setSearchbarText] = useState('');

  const fetchAssignments = async () => {
    try {
      const response = await getAllAssignments();
      const assignmentsData = response.data
        .filter((assignment) => assignment.subject.toLowerCase() === subject)
        .filter((assignment) =>
          user ? assignment.levels.includes(user.level) : true,
        );
      const pastAssignmentsData = assignmentsData.filter(
        (assignment) =>
          new Date(assignment.dueDate) < new Date() ||
          assignment.assignmentAttempts.findIndex(
            (attempt) => attempt.studentId === user?.id,
          ) !== -1,
      );
      const upcomingAssignmentsData = assignmentsData.filter(
        (assignment) =>
          new Date(assignment.dueDate) >= new Date() &&
          assignment.assignmentAttempts.findIndex(
            (attempt) => attempt.studentId === user?.id,
          ) === -1,
      );
      setPastAssignments(pastAssignmentsData);
      setUpcomingAssignments(upcomingAssignmentsData);
    } catch (error) {
      displayToast(
        'Assignments could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

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
            className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-student-secondary-700 sm:text-sm sm:leading-6"
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
        </div>

        <GenericAccordion
          title="Upcoming Assignments"
          titleClassName={accordionTitleClassName}
          arrowClassName="text-white"
          content={
            <ul>
              {upcomingAssignments.length === 0 && (
                <p className="text-base border-x border-b h-8 w-full flex items-center justify-center py-8 text-gray-600 ">
                  <span>No upcoming assignments found.</span>
                </p>
              )}
              {upcomingAssignments
                .filter((assignment) =>
                  assignment.title
                    .toLowerCase()
                    .includes(searchbarText.toLowerCase()),
                )
                .map((assignment) => (
                  <AssignmentRow
                    iconStyles="text-student-primary-900"
                    key={assignment.id}
                    assignment={assignment}
                    studentId={user?.id ?? ''}
                    className="hover:bg-student-secondary-700"
                  />
                ))}
            </ul>
          }
        />

        <GenericAccordion
          title="Past Assignments"
          titleClassName={accordionTitleClassName}
          arrowClassName="text-white"
          content={
            <ul>
              {pastAssignments.length === 0 && (
                <p className="text-base border-x border-b h-8 w-full flex items-center justify-center py-8 text-gray-600 ">
                  <span>No past assignments found.</span>
                </p>
              )}
              {pastAssignments
                .filter((assignment) =>
                  assignment.title
                    .toLowerCase()
                    .includes(searchbarText.toLowerCase()),
                )
                .map((assignment) => (
                  <AssignmentRow
                    iconStyles="text-student-primary-900"
                    key={assignment.id}
                    assignment={assignment}
                    studentId={user?.id ?? ''}
                    className="hover:bg-student-secondary-100"
                  />
                ))}
            </ul>
          }
        />
      </div>
    </div>
  );
};
