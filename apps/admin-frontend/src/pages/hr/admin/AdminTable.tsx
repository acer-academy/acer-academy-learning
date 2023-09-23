import { deleteAdmin, getAllAdmins } from '@acer-academy-learning/data-access';
import { useToast } from '@acer-academy-learning/common-ui';
import { useEffect, useState } from 'react';
import { Admin } from 'libs/data-access/src/lib/types/admin';
import { DeletionConfirmationModal } from '../common/DeletionConfirmationModal';
import { AdminUpdateModal } from './AdminUpdateModal';

export const AdminTable: React.FC = () => {
  const [adminData, setAdminData] = useState<Admin[]>([]);

  const [toDeleteAdminId, setToDeleteAdminId] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [toDeleteAdminName, setToDeleteAdminName] = useState<string>('');

  const [isViewMoreModalOpen, setIsViewMoreModalOpen] =
    useState<boolean>(false);
  const [adminToView, setAdminToView] = useState<Admin>();

  const { displayToast, ToastType } = useToast();

  const fetchAllAdmins = async () => {
    try {
      const response = await getAllAdmins();
      const allAdmins: Admin[] = response.data;
      setAdminData(allAdmins);
    } catch (error) {
      displayToast(
        'Admins could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const handleDeleteAdmin = async () => {
    try {
      await deleteAdmin(toDeleteAdminId);
      displayToast('Successfully deleted admin.', ToastType.SUCCESS);
    } catch (error) {
      displayToast('Deletion has failed!', ToastType.ERROR);
      console.log(error);
    }
  };

  const handleOnClick = async (id: string, name: string) => {
    setToDeleteAdminId(id);
    setToDeleteAdminName(name);
    setIsDeleteModalOpen(true);
  };

  const handleViewMore = async (id: string) => {
    const selectedAdmin = adminData.find((admin) => admin.id === id);
    setAdminToView(selectedAdmin);
    setIsViewMoreModalOpen(true);
  };

  useEffect(() => {
    fetchAllAdmins();
  }, []);

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
  }
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Admins
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the admins registered in the system.
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
                    Type
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">View more</span>
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminData.map((admin, personIdx) => (
                  <tr key={admin.id}>
                    <td
                      className={classNames(
                        personIdx !== adminData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8',
                      )}
                    >
                      {admin.firstName}
                    </td>
                    <td
                      className={classNames(
                        personIdx !== adminData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell',
                      )}
                    >
                      {admin.lastName}
                    </td>
                    <td
                      className={classNames(
                        personIdx !== adminData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell',
                      )}
                    >
                      {admin.email}
                    </td>
                    <td
                      className={classNames(
                        personIdx !== adminData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                      )}
                    >
                      {admin.type === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                    </td>

                    <td
                      className={classNames(
                        personIdx !== adminData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8',
                      )}
                    >
                      <div
                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                        onClick={() => handleViewMore(admin.id)}
                      >
                        View more
                      </div>
                    </td>
                    <td
                      className={classNames(
                        personIdx !== adminData.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8',
                      )}
                    >
                      <div
                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                        onClick={() =>
                          handleOnClick(
                            admin.id,
                            admin.firstName + ' ' + admin.lastName,
                          )
                        }
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
      <DeletionConfirmationModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        onDeleted={handleDeleteAdmin}
        id={toDeleteAdminId}
        name={toDeleteAdminName}
        userRole="admin"
      />
      <AdminUpdateModal
        isOpen={isViewMoreModalOpen}
        setIsModalOpen={setIsViewMoreModalOpen}
        admin={adminToView}
      />
    </div>
  );
};
