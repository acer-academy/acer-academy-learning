import { Role } from 'libs/data-access/src/lib/types/whitelist';
import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { createWhitelist } from '@acer-academy-learning/data-access';
import { useToast } from '@acer-academy-learning/common-ui';

interface AddWhitelistModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userRole: string;
}

export const AddWhitelistModal: React.FC<AddWhitelistModalProps> = (
  props: AddWhitelistModalProps,
) => {
  const { open, setOpen, userRole } = props;
  const { displayToast, ToastType } = useToast();
  const [email, setEmail] = useState<string>('');

  const handleAddWhitelist = async () => {
    try {
      await createWhitelist({
        email,
        role: userRole as Role,
      });
      displayToast('Email is whitelisted successfully.', ToastType.SUCCESS);
      setOpen(false);
    } catch (err) {
      displayToast('Whitelisting failed', ToastType.ERROR);
      console.log(err);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <h2 className="text-2xl font-semibold leading-7 text-gray-900 mb-6">
                  Add whitelist for {userRole}
                </h2>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-admin-primary-700 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddWhitelist()}
                    className="rounded-md bg-admin-primary-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-admin-primary-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-primary-600"
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
