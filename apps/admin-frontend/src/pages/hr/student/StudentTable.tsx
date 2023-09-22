import { getAllStudents } from '@acer-academy-learning/data-access';
import { useToast } from '@acer-academy-learning/common-ui';
import { Student } from 'libs/data-access/src/lib/types/student';
import { useEffect, useState } from 'react';

export const StudentTable: React.FC = () => {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const { displayToast, ToastType } = useToast();

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

  useEffect(() => {
    fetchAllStudents();
  }, []);

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
  }
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Students
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the students registered in the system.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                  >
                    First Name
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Last Name
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                  >
                    Level
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">View more</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentData.map((student, personIdx) => (
                  <tr key={student.id}>
                    <td
                      className={classNames(
                        personIdx !== studentData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8',
                      )}
                    >
                      {student.firstName}
                    </td>
                    <td
                      className={classNames(
                        personIdx !== studentData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell',
                      )}
                    >
                      {student.lastName}
                    </td>
                    <td
                      className={classNames(
                        personIdx !== studentData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell',
                      )}
                    >
                      {student.email}
                    </td>
                    <td
                      className={classNames(
                        personIdx !== studentData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                      )}
                    >
                      {student.level}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center rounded-md 
                        ${
                          student.status.toUpperCase() === 'ACTIVE'
                            ? 'bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'
                            : student.status.toUpperCase() === 'INACTIVE'
                            ? 'bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20'
                            : 'bg-black-50 px-2 py-1 text-xs font-medium text-black-700 ring-1 ring-inset ring-black-600/20'
                        }
                        `}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td
                      className={classNames(
                        personIdx !== studentData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8',
                      )}
                    >
                      <div className="text-indigo-600 hover:text-indigo-900 cursor:pointer">
                        View more
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
