import {
  getAllStudents,
  getAllTerms,
  getAvailableCredits,
  blockStudent,
  getCurrentTerms,
  rolloverCredits,
} from '@acer-academy-learning/data-access';
import { useToast } from '@acer-academy-learning/common-ui';
import { Student } from 'libs/data-access/src/lib/types/student';
import { TermData } from 'libs/data-access/src/lib/types/term';
import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { DeletionConfirmationModal } from './DeletionConfirmationModal';
import { StudentStatusEnum } from '@acer-academy-learning/data-access';
import SendAlertModal from './SendAlertModal';
import RolloverCreditModal from './RolloverCreditModal';

export const ClassCreditManagement: React.FC = () => {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [termData, setTermData] = useState<TermData[]>([]);
  const [currentTerm, setCurrentTerm] = useState<TermData>(); // selected term in dropdown box
  const [currentTerms, setCurrentTerms] = useState<TermData[]>([]); // current terms with start date before today and end date after today
  const [creditMap, setCreditMap] = useState<{ [studentId: string]: number }>(
    {},
  );
  const [searchbarText, setSearchbarText] = useState('');
  const [blockStudentId, setBlockStudentId] = useState('');
  const [blockStudentName, setBlockStudentName] = useState('');
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isBlock, setIsBlock] = useState(true);
  const [creditFilterMinimum, setCreditFilterMinimum] = useState(-100);
  const [creditFilterMaximum, setCreditFilterMaximum] = useState(100);
  const [isSendAlertModalOpen, setIsSendAlertModalOpen] = useState(false);
  const [alertStudentName, setAlertStudentName] = useState('');
  const [alertParentName, setAlertParentName] = useState('');
  const [isRolloverCreditModalOpen, setIsRolloverCreditModalOpen] =
    useState(false);
  const [rolloverCreditStudent, setRolloverCreditStudent] = useState<Student>();

  const { displayToast, ToastType } = useToast();

  const fetchAllTerms = async () => {
    try {
      const response = await getAllTerms();
      const allTerms: TermData[] = response.data;
      const currentTermsResponse = await getCurrentTerms();
      const currentTerms: TermData[] = currentTermsResponse.data;
      setTermData(allTerms);
      setCurrentTerm(allTerms[0]);
      setCurrentTerms(currentTerms);
    } catch (error) {
      displayToast(
        'Terms could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const response = await getAllStudents();
      const allStudents: Student[] = response.data.students;
      setStudentData(allStudents);
    } catch (error) {
      displayToast(
        'Students could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const fetchAvailableCredits = async () => {
    try {
      // Fetch all student IDs
      const studentIds = studentData.map((student) => student.id);

      // Fetch available credits for all students in parallel
      const creditPromises = studentIds.map(async (studentId) => {
        const response = await getAvailableCredits(
          currentTerm?.id ?? '',
          studentId,
        );
        const availableCredits = response.data ?? 0;
        return { studentId, availableCredits };
      });

      const creditResults = await Promise.all(creditPromises);

      // Create a map of student IDs to available credits
      const updatedCreditMap = Object.fromEntries(
        creditResults.map(({ studentId, availableCredits }) => [
          studentId,
          availableCredits,
        ]),
      );

      setCreditMap(updatedCreditMap);
    } catch (error) {
      displayToast(
        'Available credits could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const handleBlockStudent = async () => {
    try {
      const response = await blockStudent(blockStudentId);
      displayToast('Successfully blocked student.', ToastType.SUCCESS);

      setStudentData((prevStudentData) =>
        prevStudentData.map((student) =>
          student.id === blockStudentId
            ? { ...student, status: StudentStatusEnum.BLOCKED } // Update the status of the blocked student
            : student,
        ),
      );
    } catch (error) {
      displayToast('Blocking of student has failed!', ToastType.ERROR);
      console.log(error);
    }
  };

  const handleUnblockStudent = async () => {
    try {
      const response = await blockStudent(blockStudentId);
      displayToast('Successfully unblocked student.', ToastType.SUCCESS);

      setStudentData((prevStudentData) =>
        prevStudentData.map((student) =>
          student.id === blockStudentId
            ? { ...student, status: StudentStatusEnum.ACTIVE } // Update the status of the unblocked student
            : student,
        ),
      );
    } catch (error) {
      displayToast('Unblocking of student has failed!', ToastType.ERROR);
      console.log(error);
    }
  };

  const handleRolloverCredit = async (targetTermId: string) => {
    try {
      const response = await rolloverCredits(
        rolloverCreditStudent?.id ?? '',
        targetTermId,
        currentTerm?.id ?? '',
      );

      const updatedCreditMap = {
        ...creditMap,
        [rolloverCreditStudent?.id ?? '']: 0,
      };
      setCreditMap(updatedCreditMap);

      displayToast(
        'Successfully completed rollover credits for student.',
        ToastType.SUCCESS,
      );
    } catch (error) {
      displayToast('Rollover credits has failed!', ToastType.ERROR);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllStudents();
    fetchAllTerms();
  }, []);

  useEffect(() => {
    // Only fetch available credits when currentTerm changes and studentData is available
    if (currentTerm && studentData.length > 0) {
      fetchAvailableCredits();
    }
  }, [currentTerm, studentData]);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  function selectedTermInCurrentTerms() {
    for (const index in currentTerms) {
      if (currentTerms[index].id === currentTerm?.id) {
        return true;
      }
    }
    return false;
  }

  function currentTermStartDateInFuture() {
    return currentTerm && currentTerm.startDate > new Date();
  }

  return (
    <div className="h-full bg-gray-50">
      <div className="flex min-h-full flex-col gap-7 align-middle py-12 px-12">
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="text"
            name="student-searchbar"
            id="student-searchbar"
            className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-adminGreen-600 sm:text-sm sm:leading-6"
            placeholder="Search for a student name or email..."
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

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold tracking-tight">
            Class Credits
          </span>
          <div className="inline-flex justify-center px-4 py-2">
            <div className="relative inline-block text-left mr-4 py-1.5">
              Select Term:
            </div>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  {currentTerm?.name}
                  <ChevronDownIcon
                    className="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {termData.map((term) => (
                      <Menu.Item key={term.id}>
                        {({ active }) => (
                          <a
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'block px-4 py-2 text-sm',
                            )}
                            onClick={() => setCurrentTerm(term)}
                          >
                            {term.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="inline-flex justify-center px-4">
            <div className="relative inline-block text-left mr-4 py-2">
              Filter by class credits:
            </div>
            <input
              type="number"
              name="credit-filter-min"
              id="credit-filter-min"
              className="block w-20 rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-adminGreen-600 sm:text-sm sm:leading-6"
              placeholder="-100"
              value={creditFilterMinimum}
              onChange={(e) => {
                setCreditFilterMinimum(parseInt(e.target.value));
              }}
            />
            <div className="relative inline-block text-left ml-4 mr-4 py-2">
              to
            </div>
            <input
              type="number"
              name="credit-filter-max"
              id="credit-filter-max"
              className="block w-20 rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-adminGreen-600 sm:text-sm sm:leading-6"
              placeholder="100"
              value={creditFilterMaximum}
              onChange={(e) => {
                setCreditFilterMaximum(parseInt(e.target.value));
              }}
            />
          </div>
        </div>
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                {studentData.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 max-w-xs"
                        >
                          First Name
                        </th>
                        <th
                          scope="col"
                          className="px-3.5 py-3.5 text-left text-sm font-semibold text-gray-900 image-column max-w-xs"
                        >
                          Last Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          Available Class Credits
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        ></th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        ></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {studentData
                        .filter(
                          (student) =>
                            student.firstName
                              .toLowerCase()
                              .includes(searchbarText.toLowerCase()) ||
                            student.lastName
                              ?.toLowerCase()
                              .includes(searchbarText.toLowerCase()) ||
                            student.email
                              ?.toLowerCase()
                              .includes(searchbarText.toLowerCase()),
                        )
                        .filter((student) => {
                          const credits = creditMap[student.id] ?? 0;
                          return (
                            credits >= creditFilterMinimum &&
                            credits <= creditFilterMaximum
                          );
                        })
                        .map((student) => (
                          <tr key={student.id}>
                            <td className="whitespace-normal py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-xs">
                              {student.firstName}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 max-w-xs">
                              {student.lastName}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              {student.email}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              <div className="inline-flex justify-center">
                                <div className="flex items-center">
                                  {creditMap[student.id] ?? 0}
                                </div>
                                {!(
                                  selectedTermInCurrentTerms() || // Cannot rollover from current or future terms
                                  currentTermStartDateInFuture()
                                ) && creditMap[student.id] > 0 ? ( // Can only rollover positive credits
                                  <div
                                    className="ml-5 inline-flex items-center rounded-md bg-black-50 px-2 py-1 text-xs font-medium text-black-700 ring-1 ring-gray-600/20 hover:bg-gray-100 hover:text-black-900 cursor-pointer"
                                    onClick={() => {
                                      setRolloverCreditStudent(student);
                                      setIsRolloverCreditModalOpen(true);
                                    }}
                                  >
                                    ROLLOVER
                                  </div>
                                ) : (
                                  <div />
                                )}
                              </div>
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              <span
                                className={`inline-flex items-center rounded-md 
                                    ${
                                      student.status.toUpperCase() === 'ACTIVE'
                                        ? 'bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'
                                        : student.status.toUpperCase() ===
                                          'BLOCKED'
                                        ? 'bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20'
                                        : // student status is INACTIVE
                                          'bg-black-50 px-2 py-1 text-xs font-medium text-black-700 ring-1 ring-inset ring-gray-600/20'
                                    }
                                    `}
                              >
                                {student.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                              <a
                                className="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                                onClick={() => {
                                  setAlertStudentName(
                                    student.firstName + ' ' + student.lastName,
                                  );
                                  setAlertParentName(
                                    student.parents[0].firstName +
                                      ' ' +
                                      student.parents[0].lastName,
                                  );
                                  setIsSendAlertModalOpen(true);
                                }}
                              >
                                Send Alert
                              </a>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                              <a
                                className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                onClick={() => {
                                  setBlockStudentId(student.id);
                                  setBlockStudentName(
                                    student.firstName + ' ' + student.lastName,
                                  );
                                  setIsBlockModalOpen(true);
                                  setIsBlock(
                                    student.status.toUpperCase() !== 'BLOCKED',
                                  );
                                }}
                              >
                                {student.status.toUpperCase() === 'BLOCKED'
                                  ? 'Unblock'
                                  : 'Block'}
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    No data available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeletionConfirmationModal
        open={isBlockModalOpen}
        setOpen={setIsBlockModalOpen}
        onDeleted={isBlock ? handleBlockStudent : handleUnblockStudent}
        id={blockStudentId}
        name={blockStudentName}
        isBlock={isBlock}
      />
      <SendAlertModal
        open={isSendAlertModalOpen}
        setOpen={setIsSendAlertModalOpen}
        studentName={alertStudentName}
        parentName={alertParentName}
        termName={currentTerm?.name || ''}
      />
      <RolloverCreditModal
        open={isRolloverCreditModalOpen}
        setOpen={setIsRolloverCreditModalOpen}
        studentName={
          rolloverCreditStudent
            ? rolloverCreditStudent.firstName +
              ' ' +
              rolloverCreditStudent.lastName
            : ''
        }
        currentTermName={currentTerm?.name || ''}
        numCredits={creditMap[rolloverCreditStudent?.id ?? '']}
        currentTerms={currentTerms}
        onClick={handleRolloverCredit}
      />
    </div>
  );
};
