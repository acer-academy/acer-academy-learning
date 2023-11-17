import {
  GenericAccordion,
  GenericInput,
  useAuth,
  useToast,
} from '@acer-academy-learning/common-ui';
import { getAllAssignments } from '@acer-academy-learning/data-access';
import { AssignmentData } from 'libs/data-access/src/lib/types/assignment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Student } from 'libs/data-access/src/lib/types/student';
import { AssignmentRow } from './AssignmentRow';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
        <GenericInput
          type="text"
          placeholder="Search for an assignment"
          rightIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
          onChange={(e) => setSearchbarText(e.target.value)}
          value={searchbarText}
        />
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
