import { getAllTeachers } from '@acer-academy-learning/data-access';
import { useToast } from '@acer-academy-learning/common-ui';
import { TeacherData } from 'libs/data-access/src/lib/types/teacher';
import { useEffect, useState } from 'react';

export const TeacherTable: React.FC = () => {
  const [teacherData, setTeacherData] = useState<TeacherData[]>([]);
  const { displayToast, ToastType } = useToast();

  const fetchAllTeachers = async () => {
    try {
      const response = await getAllTeachers();
      const allStudents: TeacherData[] = response.data;
      setTeacherData(allStudents);
    } catch (error) {
      displayToast(
        'Teachers could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllTeachers();
  }, []);

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
  }
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Teachers
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the teachers registered in the system.
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
                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                  >
                    Subjects
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                  >
                    Levels
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
                {teacherData.map((teacher, personIdx) => (
                  <tr key={teacher.id}>
                    <td
                      className={classNames(
                        personIdx !== teacherData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8',
                      )}
                    >
                      {teacher.firstName}
                    </td>
                    <td
                      className={classNames(
                        personIdx !== teacherData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell',
                      )}
                    >
                      {teacher.lastName}
                    </td>
                    <td
                      className={classNames(
                        personIdx !== teacherData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell',
                      )}
                    >
                      {teacher.email}
                    </td>
                    <td
                      className={classNames(
                        personIdx !== teacherData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell',
                      )}
                    >
                      {teacher.subjects.join(', ')}
                    </td>
                    <td
                      className={classNames(
                        personIdx !== teacherData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell',
                      )}
                    >
                      {teacher.levels.join(', ')}
                    </td>
                    <td
                      className={classNames(
                        personIdx !== teacherData.length - 1
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
