import { Dialog, Transition } from '@headlessui/react';
import { Admin } from 'libs/data-access/src/lib/types/admin';
import { useToast } from '@acer-academy-learning/common-ui';
import { useState, Fragment, useEffect } from 'react';
import { updateAdmin } from '@acer-academy-learning/data-access';

export interface AdminUpdateModalProps {
  admin?: Admin;
  setIsModalOpen: (isModalOpen: boolean) => void;
  isOpen: boolean;
}

export const AdminUpdateModal: React.FC<AdminUpdateModalProps> = (
  props: AdminUpdateModalProps,
) => {
  const { admin, setIsModalOpen, isOpen } = props;

  const [firstName, setFirstName] = useState(admin?.firstName ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const [lastName, setLastName] = useState(admin?.lastName ?? '');

  useEffect(() => {
    if (admin) {
      setFirstName(admin.firstName);
      setLastName(admin.lastName);
    }
  }, [admin]);

  const { displayToast, ToastType } = useToast();

  if (!admin) {
    return null;
  }

  const onSaveProfile = async () => {
    try {
      if (firstName.length === 0 || lastName.length === 0) {
        displayToast(
          `Please fill in your First and Last name`,
          ToastType.ERROR,
        );
        return;
      } else {
        await updateAdmin(admin.id, {
          firstName: firstName,
          lastName: lastName,
        });
        //

        displayToast('Profile updated!', ToastType.SUCCESS);
        setIsEditing(false);
      }
    } catch (error) {
      displayToast('Profile update failed', ToastType.ERROR);
    }
  };

  const onEditProfile = () => {
    setIsEditing(true);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsModalOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div className="h-full bg-gray">
                  <div className="mx-8 sm:mx-auto sm:w-full sm:max-w-[1000px]">
                    <div className="flex justify-between items-center">
                      <h1 className="mt-6 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Admin Profile
                      </h1>
                      <div className="mt-4 sm:mt-0">
                        {isEditing ? (
                          <button
                            onClick={onSaveProfile}
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6"
                          >
                            Save Profile
                          </button>
                        ) : (
                          <button
                            onClick={onEditProfile}
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6"
                          >
                            Edit Profile
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[1000px]">
                    <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-600">
                            First Name:
                          </span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={firstName}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) => {
                                setFirstName(e.target.value);
                              }}
                              autoFocus
                            />
                          ) : (
                            <span className="text-gray-800">{firstName}</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-600">
                            Last Name:
                          </span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={lastName}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) => {
                                setLastName(e.target.value);
                              }}
                              autoFocus
                            />
                          ) : (
                            <span className="text-gray-800">{lastName}</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-600">
                            Email:
                          </span>
                          <span className="text-gray-800">{admin.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-600">
                            Admin Type:
                          </span>
                          <span className="text-gray-800 capitalize">
                            {admin.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
