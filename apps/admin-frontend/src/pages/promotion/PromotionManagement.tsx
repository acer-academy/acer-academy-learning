import {
  PromotionData,
  PromotionPostData,
  PromotionPutData,
} from 'libs/data-access/src/lib/types/promotion';
import { PromotionStatusEnum } from '@acer-academy-learning/data-access';
import { useEffect, useState } from 'react';
import { PromotionDeleteModal } from './PromotionDelete';
import { PromotionCreateModal } from './PromotionCreate';
import { PromotionUpdateModal } from './PromotionUpdate';
import { useToast } from '@acer-academy-learning/common-ui';
import {
  getAllPromotions as apiGetAllPromotions,
  createPromotion as apiCreatePromotion,
  deletePromotion as apiDeletePromotion,
  updatePromotion as apiUpdatePromotion,
} from '@acer-academy-learning/data-access';

export const PromotionManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<PromotionData[]>([]);
  const [searchbarText, setSearchbarText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePromotionId, setDeletePromotionId] = useState('');
  const [updatePromotionId, setUpdatePromotionId] = useState('');
  const [initialPromotion, setInitialPromotion] = useState<PromotionData>();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const { displayToast, ToastType } = useToast();

  const getAllPromotions = async () => {
    try {
      const response = await apiGetAllPromotions();
      const allPromotions: PromotionData[] = response.data;
      console.log(response);
      setPromotions(allPromotions);
    } catch (error) {
      displayToast(
        'Promotions could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const createPromotion = async (promotionData: PromotionPostData) => {
    try {
      const response = await apiCreatePromotion(promotionData);
      console.log(response);

      displayToast('Promotion created successfully.', ToastType.SUCCESS);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'Promotion could not be created: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      setIsCreateModalOpen(false);
    }
  };

  const updatePromotion = async (
    id: string,
    promotionData: PromotionPutData,
  ) => {
    try {
      const response = await apiUpdatePromotion(id, promotionData);
      console.log(response);

      displayToast('Promotion created successfully.', ToastType.SUCCESS);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'Promotion could not be created: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      setIsUpdateModalOpen(false);
    }
  };

  const deletePromotion = async () => {
    try {
      const response = await apiDeletePromotion(deletePromotionId);

      console.log(response);
      displayToast('Promotion deleted successfully.', ToastType.INFO);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'Promotion could not be deleted: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    getAllPromotions();
  }, [isDeleteModalOpen, isCreateModalOpen, isUpdateModalOpen]);

  return (
    <div className="h-full bg-gray-50">
      <div className="flex min-h-full flex-col gap-7 align-middle py-12 px-12">
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="text"
            name="promotion-searchbar"
            id="promotion-searchbar"
            className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-adminGreen-600 sm:text-sm sm:leading-6"
            placeholder="Search for a promotion..."
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
          <span className="text-2xl font-bold tracking-tight">Promotions</span>
          <button
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-adminGreen-600 border border-transparent rounded-md hover:bg-adminGreen-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-adminGreen-500"
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
            Add Promotion
          </button>
        </div>
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                {promotions.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 max-w-xs"
                        >
                          Promotion Code
                        </th>
                        <th
                          scope="col"
                          className="px-3.5 py-3.5 text-left text-sm font-semibold text-gray-900 image-column max-w-xs"
                        >
                          Discount (%)
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          Start Date
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          End Date
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
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {promotions
                        .filter(
                          (promotion) =>
                            promotion.promoCode
                              .toLowerCase()
                              .includes(searchbarText.toLowerCase()) ||
                            promotion.description
                              ?.toLowerCase()
                              .includes(searchbarText.toLowerCase()) ||
                            new Date(promotion.startDate)
                              .toDateString()
                              .toLowerCase()
                              .includes(searchbarText.toLowerCase()) ||
                            new Date(promotion.endDate)
                              .toDateString()
                              .toLowerCase()
                              .includes(searchbarText.toLowerCase()),
                        )
                        .map((promotion) => (
                          <tr key={promotion.id}>
                            <td className="whitespace-normal py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-xs">
                              {promotion.promoCode}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 image-column max-w-xs">
                              {promotion.percentageDiscount}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              {promotion.description}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              {new Date(promotion.startDate).toDateString()}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              {new Date(promotion.endDate).toDateString()}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              <span
                                className={`inline-flex items-center rounded-md 
                                ${
                                  promotion.status ===
                                  PromotionStatusEnum.ACTIVE
                                    ? 'bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'
                                    : promotion.status ===
                                      PromotionStatusEnum.INACTIVE
                                    ? 'bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20'
                                    : 'bg-black-50 px-2 py-1 text-xs font-medium text-black-700 ring-1 ring-inset ring-black-600/20'
                                }
                              `}
                              >
                                {promotion.status}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 576 512"
                                className="h-4 w-4 fill-indigo-600 stroke-2 hover:fill-black cursor-pointer"
                                onClick={() => {
                                  setUpdatePromotionId(promotion.id);
                                  setInitialPromotion(promotion);
                                  setIsUpdateModalOpen(true);
                                }}
                              >
                                <path d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z" />
                              </svg>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 fill-indigo-600 stroke-2 hover:fill-black cursor-pointer"
                                viewBox="0 0 16 16"
                                onClick={() => {
                                  setDeletePromotionId(promotion.id);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                              </svg>
                            </td>
                          </tr>
                        ))
                        .reverse()}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    No promotions have been created yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isDeleteModalOpen && (
        <PromotionDeleteModal
          setIsModalOpen={setIsDeleteModalOpen}
          deletePromotion={deletePromotion}
        />
      )}
      {isCreateModalOpen && (
        <PromotionCreateModal
          setIsModalOpen={setIsCreateModalOpen}
          currentPromotions={promotions}
          createPromotion={createPromotion}
        />
      )}
      {isUpdateModalOpen && (
        <PromotionUpdateModal
          setIsModalOpen={setIsUpdateModalOpen}
          currentPromotions={promotions}
          updatePromotion={updatePromotion}
          initialPromotion={initialPromotion}
          updateId={updatePromotionId}
        />
      )}
    </div>
  );
};
