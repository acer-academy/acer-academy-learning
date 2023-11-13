import {
  CreditBundleCreateData,
  CreditBundleUpdateData,
  CreditBundleData,
} from 'libs/data-access/src/lib/types/creditBundle';
import { useEffect, useState } from 'react';
import { CreditBundleDeleteModal } from './CreditBundleDeleteModal';
import { CreditBundleCreateModal } from './CreditBundleCreateModal';
import { CreditBundleUpdateModal } from './CreditBundleUpdateModal';
import { useToast } from '@acer-academy-learning/common-ui';
import {
  getAllCreditBundles as apiGetAllCreditBundles,
  createCreditBundle as apiCreateCreditBundle,
  updateCreditBundle as apiUpdateCreditBundle,
  deleteCreditBundle as apiDeleteCreditBundle,
  convertIntToFloat,
  convertFloatToInt,
  LevelEnum,
} from '@acer-academy-learning/data-access';

export const CreditBundleManagement: React.FC = () => {
  const [creditBundles, setCreditBundles] = useState<CreditBundleData[]>([]);
  const [searchbarText, setSearchbarText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCreditBundleId, setDeleteCreditBundleId] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateCreditBundleId, setUpdateCreditBundleId] = useState('');
  const [updateCreditBundleData, setUpdateCreditBundleData] =
    useState<CreditBundleData>({
      id: '',
      name: '',
      description: '',
      numCredits: 1,
      basePrice: 1,
      isActive: true,
      level: LevelEnum.P1,
    });

  const { displayToast, ToastType } = useToast();

  const getAllCreditBundles = async () => {
    try {
      const response = await apiGetAllCreditBundles();
      const allCreditBundles: CreditBundleData[] = response.data;
      setCreditBundles(allCreditBundles);
    } catch (error) {
      displayToast(
        'Credit bundles could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const createCreditBundle = async (
    creditBundleData: CreditBundleCreateData,
  ) => {
    try {
      creditBundleData.name = creditBundleData.name.trim();
      creditBundleData.basePrice = convertFloatToInt(
        creditBundleData.basePrice,
      );
      await apiCreateCreditBundle(creditBundleData);
      displayToast('Credit bundle created successfully.', ToastType.SUCCESS);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'Credit bundle could not be created: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      setIsCreateModalOpen(false);
    }
  };

  const updateCreditBundle = async (
    updateCreditBundleId: string,
    creditBundleData: CreditBundleUpdateData,
  ) => {
    try {
      creditBundleData.name = creditBundleData.name?.trim();
      creditBundleData.description = creditBundleData.description?.trim();
      await apiUpdateCreditBundle(updateCreditBundleId, creditBundleData);
      displayToast('Credit bundle updated successfully.', ToastType.INFO);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'Credit bundle could not be updated: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      setIsUpdateModalOpen(false);
    }
  };

  const deleteCreditBundle = async () => {
    try {
      await apiDeleteCreditBundle(deleteCreditBundleId);
      displayToast('Credit bundle deleted successfully.', ToastType.INFO);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'Credit bundle could not be deleted: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    getAllCreditBundles();
  }, [
    isDeleteModalOpen,
    isCreateModalOpen,
    isUpdateModalOpen,
    updateCreditBundle,
  ]);

  return (
    <div className="h-full">
      <div className="flex min-h-full flex-col gap-7 align-middle py-12 px-12">
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="text"
            name="creditBundle-searchbar"
            id="creditBundle-searchbar"
            className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-admin-primary-700 sm:text-sm sm:leading-6"
            placeholder="Search for a credit bundle..."
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
            Credit Bundles
          </span>
          <button
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-admin-primary-700 border border-transparent rounded-md hover:bg-admin-primary-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-admin-primary-500"
            onClick={() => {
              setIsCreateModalOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4 fill-white stroke-2 relative mt-0.5"
              viewBox="0 0 16 16"
            >
              <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
            </svg>
            Add Credit Bundle
          </button>
        </div>
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                {creditBundles.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 max-w-xs"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3.5 py-3.5 text-left text-sm font-semibold text-gray-900 image-column max-w-xs"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          Number of Credits
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          Level
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          Base Price
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          Price Per Credit
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {creditBundles
                        .filter(
                          (creditBundle) =>
                            creditBundle.name
                              .toLowerCase()
                              .includes(searchbarText.toLowerCase()) ||
                            creditBundle.description
                              ?.toLowerCase()
                              .includes(searchbarText.toLowerCase()),
                        )
                        .map((creditBundle) => (
                          <tr key={creditBundle.id}>
                            <td className="whitespace-normal py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-xs">
                              {creditBundle.name}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 max-w-xs">
                              {creditBundle.description}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              {creditBundle.numCredits}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              {creditBundle.level}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              {'$' + convertIntToFloat(creditBundle.basePrice)}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              {'$' +
                                convertIntToFloat(
                                  creditBundle.basePrice /
                                    creditBundle.numCredits,
                                )}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              <span
                                className={`inline-flex items-center rounded-md 
                                ${
                                  creditBundle.isActive
                                    ? 'bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'
                                    : !creditBundle.isActive
                                    ? 'bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20'
                                    : 'bg-black-50 px-2 py-1 text-xs font-medium text-black-700 ring-1 ring-inset ring-black-600/20'
                                }
                              `}
                              >
                                {creditBundle.isActive ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                              <a
                                className="text-admin-primary-700 hover:text-admin-primary-900 mr-4 cursor-pointer"
                                onClick={() => {
                                  setUpdateCreditBundleId(creditBundle.id);
                                  setUpdateCreditBundleData(creditBundle);
                                  setIsUpdateModalOpen(true);
                                }}
                              >
                                Edit
                              </a>
                              {!creditBundle.isActive && (
                                <a
                                  className={`${'text-indigo-600 hover:text-indigo-900 cursor-pointer'}`}
                                  onClick={() => {
                                    updateCreditBundle(creditBundle.id, {
                                      isActive: true,
                                    });
                                  }}
                                >
                                  Reactivate
                                </a>
                              )}
                              {creditBundle.isActive && (
                                <a
                                  className={`${
                                    !creditBundle.isActive
                                      ? 'disabled:opacity-30 pointer-events-none text-gray-300'
                                      : 'text-admin-primary-700 hover:text-admin-primary-900 cursor-pointer'
                                  }`}
                                  onClick={() => {
                                    setDeleteCreditBundleId(creditBundle.id);
                                    setIsDeleteModalOpen(true);
                                  }}
                                >
                                  Delete
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    No credit bundles have been created yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isDeleteModalOpen && (
        <CreditBundleDeleteModal
          setIsModalOpen={setIsDeleteModalOpen}
          deleteCreditBundle={deleteCreditBundle}
        />
      )}
      {isCreateModalOpen && (
        <CreditBundleCreateModal
          setIsModalOpen={setIsCreateModalOpen}
          currentCreditBundles={creditBundles}
          createCreditBundle={createCreditBundle}
        />
      )}
      {isUpdateModalOpen && (
        <CreditBundleUpdateModal
          setIsModalOpen={setIsUpdateModalOpen}
          updateCreditBundle={updateCreditBundle}
          currentCreditBundle={updateCreditBundleData}
          allCreditBundles={creditBundles}
        />
      )}
    </div>
  );
};
