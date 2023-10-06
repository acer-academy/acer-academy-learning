import {
  CreditBundleData,
  CreditBundleUpdateData,
} from 'libs/data-access/src/lib/types/creditBundle';
import { useState } from 'react';
import {
  convertIntToFloat,
  convertFloatToInt,
} from '@acer-academy-learning/data-access';

interface CreditBundleUpdateModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
  updateCreditBundle: (creditBundleData: CreditBundleUpdateData) => void;
  currentCreditBundle: CreditBundleData;
  allCreditBundles: CreditBundleData[];
}

export const CreditBundleUpdateModal: React.FC<
  CreditBundleUpdateModalProps
> = ({
  setIsModalOpen,
  updateCreditBundle,
  currentCreditBundle,
  allCreditBundles,
}) => {
  const [creditBundleData, setCreditBundleData] =
    useState<CreditBundleUpdateData>(currentCreditBundle);

  const isCreditBundleNameInvalid = (creditBundleName: string) => {
    return allCreditBundles.some(
      (creditBundle) =>
        creditBundle.id !== currentCreditBundle.id &&
        creditBundle.name.toLowerCase().trim() ===
          creditBundleName.toLowerCase().trim(),
    );
  };

  const isCreditBundleNumCreditsInvalid = (numCredits: number) => {
    return numCredits <= 0;
  };

  const isCreditBundleBasePriceInvalid = (basePrice: number) => {
    return basePrice <= 0;
  };

  const isCreditBundleDataInvalid = () => {
    return (
      isCreditBundleNameInvalid(creditBundleData.name) ||
      creditBundleData.name.trim().length === 0 ||
      isCreditBundleNumCreditsInvalid(creditBundleData.numCredits) ||
      isCreditBundleBasePriceInvalid(creditBundleData.basePrice)
    );
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
        <div className="relative bg-white p-5 rounded-lg shadow-md h-42 w-96">
          <div className="flex flex-col items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              Edit Credit Bundle
            </h3>
            <div className="w-full mt-3 mb-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Bundle Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                    isCreditBundleNameInvalid(creditBundleData.name)
                      ? 'ring-red-300 text-red-900 focus:ring-red-500'
                      : 'ring-gray-300 text-gray-900 focus:ring-adminGreen-500'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                  placeholder="Lower Primary 12 Classes"
                  value={creditBundleData.name}
                  onChange={(e) => {
                    setCreditBundleData({
                      ...creditBundleData,
                      name: e.target.value,
                    });
                  }}
                  aria-invalid={true}
                  aria-describedby="name-error"
                />
              </div>
              {isCreditBundleNameInvalid(creditBundleData.name) && (
                <p
                  className="absolute b-0 text-sm text-red-600"
                  id="name-error"
                >
                  Bundle name already exists.
                </p>
              )}
            </div>
            <div className="w-full mb-3">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="description"
                  id="description"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 text-gray-900 focus:ring-adminGreen-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  placeholder="Optional"
                  value={creditBundleData.description}
                  onChange={(e) => {
                    setCreditBundleData({
                      ...creditBundleData,
                      description: e.target.value,
                    });
                  }}
                  aria-invalid={true}
                  aria-describedby="description-error"
                />
              </div>
            </div>
            <div className="w-full mb-3">
              <label
                htmlFor="numCredits"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Number of Credits
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="numCredits"
                  id="numCredits"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                    isCreditBundleNumCreditsInvalid(creditBundleData.numCredits)
                      ? 'ring-red-300 text-red-900 focus:ring-red-500'
                      : 'ring-gray-300 text-gray-900 focus:ring-adminGreen-500'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                  placeholder="12"
                  value={creditBundleData.numCredits}
                  onChange={(e) => {
                    // Ensure that the input value is an integer
                    const value = parseInt(e.target.value, 10); // Parse the value to an integer
                    setCreditBundleData({
                      ...creditBundleData,
                      numCredits: isNaN(value) ? 0 : value, // If it's not a number, set 0
                    });
                  }}
                  aria-invalid={true}
                  aria-describedby="numCredits-error"
                />
              </div>
              {isCreditBundleNumCreditsInvalid(creditBundleData.numCredits) && (
                <p
                  className="absolute b-0 text-sm text-red-600"
                  id="numCredits-error"
                >
                  Number of credits must be at least 1.
                </p>
              )}
            </div>
            <div className="w-full mb-3">
              <label
                htmlFor="basePrice"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Base Price ($)
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  step="0.1"
                  name="basePrice"
                  id="basePrice"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                    isCreditBundleBasePriceInvalid(creditBundleData.basePrice)
                      ? 'ring-red-300 text-red-900 focus:ring-red-500'
                      : 'ring-gray-300 text-gray-900 focus:ring-adminGreen-500'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                  placeholder="12"
                  value={convertIntToFloat(creditBundleData.basePrice)}
                  onChange={(e) => {
                    setCreditBundleData({
                      ...creditBundleData,
                      basePrice: convertFloatToInt(parseFloat(e.target.value)),
                    });
                  }}
                  aria-invalid={true}
                  aria-describedby="basePrice-error"
                />
              </div>
              {isCreditBundleBasePriceInvalid(creditBundleData.basePrice) && (
                <p
                  className="absolute b-0 text-sm text-red-600"
                  id="basePrice-error"
                >
                  Base price must be at least above 0.
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
              disabled={isCreditBundleDataInvalid()}
              className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none
                ${
                  isCreditBundleDataInvalid()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-adminGreen-600 hover:bg-adminGreen-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-adminGreen-500'
                }`}
              onClick={() => updateCreditBundle(creditBundleData)}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
