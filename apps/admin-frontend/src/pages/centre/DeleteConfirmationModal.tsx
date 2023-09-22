import { Fragment } from 'react';

interface DeleteConfirmationProps {
  modalTitle: string;
  modalMessage: string;
  setIsModalOpen: (isModalOpen: boolean) => void;
  deleteCallback: () => void;
  cancelCallback?: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationProps> = ({
  modalTitle,
  modalMessage,
  setIsModalOpen,
  deleteCallback,
  cancelCallback,
}) => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <Fragment>
        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white p-5 rounded-lg shadow-md h-42 w-96">
            <div className="flex items-start justify-between">
              <div className=" w-0 flex-1 pt-0.5">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  {modalTitle}
                </h3>
                <p className="mt-3 text-sm text-gray-500">{modalMessage}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="mr-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                onClick={() => {
                  if (cancelCallback) {
                    cancelCallback();
                  }
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                onClick={() => deleteCallback()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    </div>
  );
};
