import {
  PromotionData,
  PromotionPostData,
} from 'libs/data-access/src/lib/types/promotion';
import { Fragment, useState } from 'react';

interface PromotionCreateModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
  currentPromotions: PromotionData[];
  createPromotion: (promotionData: PromotionPostData) => void;
}

export const PromotionCreateModal: React.FC<PromotionCreateModalProps> = ({
  setIsModalOpen,
  currentPromotions,
  createPromotion,
}) => {
  const [promotionData, setPromotionData] = useState<PromotionPostData>({
    promoCode: '',
    description: '',
    percentageDiscount: 0,
    startDate: '',
    endDate: '',
  });

  const isPromoCodeInvalid = (promoCode: string) => {
    return currentPromotions.some(
      (promotion) =>
        promotion.promoCode.toLowerCase().trim() ===
        promoCode.toLowerCase().trim(),
    );
  };

  const isPercentageDiscountInvalid = (percentageDiscount: number) => {
    const checkDecimal = percentageDiscount.toString().split('.');
    return (
      percentageDiscount > 100 ||
      (checkDecimal[1] && checkDecimal[1].length > 2)
    );
  };

  const isDatesInvalid = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start > end;
  };

  const isStartDateInvalid = (startDate: string) => {
    const today = new Date();
    return new Date(startDate) < new Date(today.toISOString().substring(0, 10));
  };

  const isPromotionDataInvalid = () => {
    return (
      isPromoCodeInvalid(promotionData.promoCode) ||
      isPercentageDiscountInvalid(promotionData.percentageDiscount) ||
      promotionData.promoCode.trim() === '' ||
      promotionData.percentageDiscount === 0 ||
      isDatesInvalid(promotionData.startDate, promotionData.endDate) ||
      isStartDateInvalid(promotionData.startDate) ||
      promotionData.startDate === '' ||
      promotionData.endDate === '' ||
      promotionData.description === ''
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
                Create promotion
              </h3>
              <div className="w-full mt-3 mb-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Promotion Code
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="promoCode"
                    id="promoCode"
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                      isPromoCodeInvalid(promotionData.promoCode)
                        ? 'ring-red-300 text-red-900 focus:ring-red-500'
                        : 'ring-gray-300 text-gray-900 focus:ring-admin-primary-700'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    placeholder="AcerAcademy"
                    value={promotionData.promoCode}
                    onChange={(e) => {
                      setPromotionData({
                        ...promotionData,
                        promoCode: e.target.value,
                      });
                    }}
                    aria-invalid={true}
                    aria-describedby="name-error"
                  />
                </div>
                {isPromoCodeInvalid(promotionData.promoCode) && (
                  <p
                    className="absolute b-0 text-sm text-red-600"
                    id="name-error"
                  >
                    Promotion name already exists.
                  </p>
                )}
              </div>
              <div className="w-full mb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Discount (%)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="percentageDiscount"
                    id="percentageDiscount"
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                      isPercentageDiscountInvalid(
                        promotionData.percentageDiscount,
                      )
                        ? 'ring-red-300 text-red-900 focus:ring-red-500'
                        : 'ring-gray-300 text-gray-900 focus:ring-admin-primary-700'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    placeholder="5.25"
                    value={promotionData.percentageDiscount}
                    onChange={(e) => {
                      setPromotionData({
                        ...promotionData,
                        percentageDiscount: parseFloat(e.target.value),
                      });
                    }}
                    aria-invalid="true"
                    aria-describedby="address-error"
                  />
                </div>
                {isPercentageDiscountInvalid(
                  promotionData.percentageDiscount,
                ) && (
                  <p
                    className="absolute b-0 text-sm text-red-600"
                    id="address-error"
                  >
                    Cannot be more than 100, Maximum 2 decimal place.
                  </p>
                )}
              </div>
              <div className="w-full mb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="description"
                    id="description"
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 focus:ring-admin-primary-700`}
                    placeholder="For new students"
                    value={promotionData.description}
                    onChange={(e) => {
                      setPromotionData({
                        ...promotionData,
                        description: e.target.value,
                      });
                    }}
                    aria-invalid={true}
                    aria-describedby="name-error"
                  />
                </div>
              </div>
              <div className="w-full mb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Start Date
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                      isStartDateInvalid(promotionData.startDate)
                        ? 'ring-red-300 text-red-900 focus:ring-red-500'
                        : 'ring-gray-300 text-gray-900 focus:ring-admin-primary-700'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    value={promotionData.startDate.substring(0, 10)}
                    onChange={(e) => {
                      setPromotionData({
                        ...promotionData,
                        startDate: new Date(e.target.value).toISOString(),
                      });
                    }}
                    aria-invalid="true"
                    aria-describedby="address-error"
                  />
                </div>
                {isStartDateInvalid(promotionData.startDate) && (
                  <p
                    className="absolute b-0 text-sm text-red-600"
                    id="address-error"
                  >
                    Needs to be a future Date
                  </p>
                )}
              </div>
              <div className="w-full mb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  End Date
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                      isDatesInvalid(
                        promotionData.startDate,
                        promotionData.endDate,
                      )
                        ? 'ring-red-300 text-red-900 focus:ring-red-500'
                        : 'ring-gray-300 text-gray-900 focus:ring-admin-primary-700'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    value={promotionData.endDate.substring(0, 10)}
                    onChange={(e) => {
                      setPromotionData({
                        ...promotionData,
                        endDate: new Date(e.target.value).toISOString(),
                      });
                    }}
                    aria-invalid="true"
                    aria-describedby="address-error"
                  />
                </div>
                {isDatesInvalid(
                  promotionData.startDate,
                  promotionData.endDate,
                ) && (
                  <p
                    className="absolute b-0 text-sm text-red-600"
                    id="address-error"
                  >
                    End Date must be after Start Date
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
                disabled={isPromotionDataInvalid()}
                className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none
                  ${
                    isPromotionDataInvalid()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-admin-primary-700 hover:bg-admin-primary-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-admin-primary-500'
                  }`}
                onClick={() => createPromotion(promotionData)}
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
