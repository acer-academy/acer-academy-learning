import { useToast } from '@acer-academy-learning/common-ui';
import {
  RedemptionData,
  RewardData,
  getAllRedemptions,
  getAllRewards,
  markRedemptionAsRedeemed as apiMarkRedemptionAsRedeemed,
} from '@acer-academy-learning/data-access';
import moment from 'moment';
import { useEffect, useState } from 'react';

export const RewardAndRedemptionManagement: React.FC = () => {
  const [rewards, setRewards] = useState<RewardData[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionData[]>([]);

  const { displayToast, ToastType } = useToast();

  const fetchRewards = async () => {
    try {
      const response = await getAllRewards();
      setRewards(response.data);
    } catch (error) {
      displayToast(
        'Rewards could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const fetchRedemptions = async () => {
    try {
      const response = await getAllRedemptions();
      setRedemptions(response.data);
    } catch (error) {
      displayToast(
        'Redemptions could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const markRedemptionAsRedeemed = async (redemptionId: string) => {
    try {
      await apiMarkRedemptionAsRedeemed(redemptionId);
      displayToast(
        'Successfully marked redemption as redeemed!',
        ToastType.SUCCESS,
      );
      fetchRedemptions();
    } catch (error) {
      displayToast(
        'Redemption could not be marked as redeemed.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRewards();
    fetchRedemptions();
  }, []);

  return (
    <div className="h-full bg-gray-50">
      <div className="flex min-h-full flex-col gap-7 align-middle py-12 px-12">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold tracking-tight">Rewards</span>
        </div>
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                {rewards.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 max-w-xs"
                        >
                          Reward Name
                        </th>
                        <th
                          scope="col"
                          className="px-3.5 py-3.5 text-left text-sm font-semibold text-gray-900 image-column max-w-xs"
                        >
                          Points Needed
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
                      {rewards
                        .map((reward) => (
                          <tr key={reward.id}>
                            <td className="whitespace-normal py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-xs">
                              {reward.name}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 image-column max-w-xs">
                              {reward.pointsNeeded}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              <span
                                className={`inline-flex items-center rounded-md 
                                ${
                                  reward.isActive
                                    ? 'bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'
                                    : 'bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20'
                                }
                              `}
                              >
                                {reward.isActive ? `Active` : `Inactive`}
                              </span>
                            </td>
                          </tr>
                        ))
                        .reverse()}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    No rewards have been created yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold tracking-tight">Redemptions</span>
        </div>
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                {redemptions.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 max-w-xs"
                        >
                          Redemption Date
                        </th>
                        <th
                          scope="col"
                          className="px-3.5 py-3.5 text-left text-sm font-semibold text-gray-900 image-column max-w-xs"
                        >
                          Student Name
                        </th>
                        <th
                          scope="col"
                          className="px-3.5 py-3.5 text-left text-sm font-semibold text-gray-900 image-column max-w-xs"
                        >
                          Reward Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          Redeemed
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
                      {redemptions
                        .map((redemption) => (
                          <tr key={redemption.id}>
                            <td className="whitespace-normal py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-xs">
                              {moment(redemption.createdAt).format(
                                'D MMMM YYYY, h:mm:ss A',
                              )}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 image-column max-w-xs">
                              {redemption.student.firstName}{' '}
                              {redemption.student.lastName}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 image-column max-w-xs">
                              {redemption.reward.name}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              <span
                                className={`inline-flex items-center rounded-md 
                                ${
                                  redemption.isRedeemed
                                    ? 'bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'
                                    : 'bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20'
                                }
                              `}
                              >
                                {redemption.isRedeemed ? `Yes` : `No`}
                              </span>
                            </td>
                            {!redemption.isRedeemed ? (
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                                <button
                                  className="text-admin-primary-700 hover:text-admin-secondary-900 cursor-pointer"
                                  onClick={() => {
                                    markRedemptionAsRedeemed(redemption.id);
                                  }}
                                >
                                  Redeem
                                </button>
                              </td>
                            ) : (
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                                -
                              </td>
                            )}
                          </tr>
                        ))
                        .reverse()}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    No redemptions have been created yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
