import { useToast } from '@acer-academy-learning/common-ui';
import { getWhitelistByRole } from '@acer-academy-learning/data-access';
import { WhitelistData } from 'libs/data-access/src/lib/types/whitelist';
import { useEffect, useState } from 'react';
import { AddWhitelistModal } from './common/AddWhitelistModal';
import { DeleteWhitelistModal } from './common/DeleteWhitelistModal';
import { TeacherTable } from './teacher/TeacherTable';

export const TeacherHRManagementPage: React.FC = () => {
  const [whitelistData, setWhiteListData] = useState<WhitelistData[]>([]);
  const [isAddWhitelistModalOpen, setIsAddWhitelistModalOpen] =
    useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<WhitelistData>();
  const [isDeleteWhitelistModalOpen, setIsDeleteWhitelistModalOpen] =
    useState<boolean>(false);
  const { displayToast, ToastType } = useToast();

  const getWhitelistedEmailsForTeachers = async () => {
    try {
      const response = await getWhitelistByRole('TEACHER');
      const whitelistRoles: WhitelistData[] = response.data;
      setWhiteListData(whitelistRoles);
    } catch (error) {
      displayToast(
        'Whitelisted emails could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  useEffect(() => {
    getWhitelistedEmailsForTeachers();
  }, []);

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 lg:py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Whitelisted Emails
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all whitelisted emails for Teachers
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setIsAddWhitelistModalOpen(true)}
              className="block rounded-md bg-admin-primary-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-admin-secondary-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-primary-600"
            >
              Add whitelist
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Registered
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {whitelistData.map((data) => (
                    <tr key={data.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {data.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {data.role}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {data.teacher ? 'Yes' : 'No'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <div
                          className={`${
                            data.teacher
                              ? `text-slate-300`
                              : `text-indigo-600 hover:text-indigo-900 cursor-pointer`
                          }`}
                          onClick={() => {
                            if (data.teacher) return;
                            setSelectedData(data);
                            setIsDeleteWhitelistModalOpen(true);
                          }}
                        >
                          Delete
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <AddWhitelistModal
          open={isAddWhitelistModalOpen}
          setOpen={setIsAddWhitelistModalOpen}
          userRole="TEACHER"
        />
        <DeleteWhitelistModal
          open={isDeleteWhitelistModalOpen}
          setOpen={setIsDeleteWhitelistModalOpen}
          data={selectedData}
        />
      </div>
      <div className="relative mb-12">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>
      <TeacherTable />
    </div>
  );
};
