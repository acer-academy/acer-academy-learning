import {
  CentreCreateData,
  CentreData,
} from 'libs/data-access/src/lib/types/centre';
import { Fragment, useState } from 'react';

interface CentreCreateModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
  currentCentres: CentreData[];
  createCentre: (centeData: CentreCreateData) => void;
}

export const CentreCreateModal: React.FC<CentreCreateModalProps> = ({
  setIsModalOpen,
  currentCentres,
  createCentre,
}) => {
  const [centreData, setCentreData] = useState<CentreCreateData>({
    name: '',
    address: '',
  });

  const isCentreNameInvalid = (centreName: string) => {
    return currentCentres.some(
      (centre) =>
        centre.name.toLowerCase().trim() === centreName.toLowerCase().trim(),
    );
  };

  const isCentreAddressInvalid = (centreAddress: string) => {
    return currentCentres.some(
      (centre) =>
        centre.address.toLowerCase().trim() ===
        centreAddress.toLowerCase().trim(),
    );
  };

  const isCentreDataInvalid = () => {
    return (
      isCentreNameInvalid(centreData.name) ||
      isCentreAddressInvalid(centreData.address) ||
      centreData.name.trim().length === 0 ||
      centreData.address.trim().length === 0
    );
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <Fragment>
        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white p-5 rounded-lg shadow-md h-42 w-96">
            <div className="flex flex-col items-start justify-between gap-3">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Create centre
              </h3>
              <div className="w-full mt-3 mb-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Centre name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                      isCentreNameInvalid(centreData.name)
                        ? 'ring-red-300 text-red-900 focus:ring-red-500'
                        : 'ring-gray-300 text-gray-900 focus:ring-admin-primary-900'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    placeholder="Acer Academy"
                    value={centreData.name}
                    onChange={(e) => {
                      setCentreData({
                        name: e.target.value,
                        address: centreData.address,
                      });
                    }}
                    aria-invalid={true}
                    aria-describedby="name-error"
                  />
                </div>
                {isCentreNameInvalid(centreData.name) && (
                  <p
                    className="absolute b-0 text-sm text-red-600"
                    id="name-error"
                  >
                    Centre name already exists.
                  </p>
                )}
              </div>
              <div className="w-full mb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Centre address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                      isCentreAddressInvalid(centreData.address)
                        ? 'ring-red-300 text-red-900 focus:ring-red-500'
                        : 'ring-gray-300 text-gray-900 focus:ring-admin-primary-900'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    placeholder="18 Yishun Ave 9 #01-36"
                    value={centreData.address}
                    onChange={(e) => {
                      setCentreData({
                        name: centreData.name,
                        address: e.target.value,
                      });
                    }}
                    aria-invalid="true"
                    aria-describedby="address-error"
                  />
                </div>
                {isCentreAddressInvalid(centreData.address) && (
                  <p
                    className="absolute b-0 text-sm text-red-600"
                    id="address-error"
                  >
                    Centre address already exists
                  </p>
                )}
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                className="mr-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                disabled={isCentreDataInvalid()}
                className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none
                ${
                  isCentreDataInvalid()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-admin-primary-700 hover:bg-admin-primary-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-admin-primary-900'
                }`}
                onClick={() => createCentre(centreData)}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    </div>
  );
};
