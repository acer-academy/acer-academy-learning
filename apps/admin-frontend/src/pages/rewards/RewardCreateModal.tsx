import { RewardData, RewardPostData } from '@acer-academy-learning/data-access';
import { useState } from 'react';

interface RewardCreateModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
  currentRewards: RewardData[];
  createReward: (rewardData: RewardPostData) => void;
}

export const RewardCreateModal: React.FC<RewardCreateModalProps> = ({
  setIsModalOpen,
  currentRewards,
  createReward,
}) => {
  const [rewardData, setRewardData] = useState<RewardPostData>({
    name: '',
    pointsNeeded: 1,
  });

  const isRewardNameInvalid = (rewardName: string) => {
    return currentRewards.some(
      (reward) =>
        reward.name.toLowerCase().trim() === rewardName.toLowerCase().trim(),
    );
  };

  const isPointsInvalid = (points: number) => {
    return points <= 0;
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
        <div className="relative bg-white p-5 rounded-lg shadow-md h-42 w-96">
          <div className="flex flex-col items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              Create Reward
            </h3>
            <div className="w-full mt-3 mb-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                    isRewardNameInvalid(rewardData.name)
                      ? 'ring-red-300 text-red-900 focus:ring-red-500'
                      : 'ring-gray-300 text-gray-900 focus:ring-admin-primary-700'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                  placeholder="Starbucks Voucher"
                  value={rewardData.name}
                  onChange={(e) => {
                    setRewardData({
                      ...rewardData,
                      name: e.target.value,
                    });
                  }}
                  aria-invalid={true}
                  aria-describedby="name-error"
                />
              </div>
              {isRewardNameInvalid(rewardData.name) && (
                <p
                  className="absolute b-0 text-sm text-red-600"
                  id="name-error"
                >
                  Reward name already exists.
                </p>
              )}
            </div>
            <div className="w-full mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Points Needed
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="pointsNeeded"
                  id="pointsNeeded"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                    isPointsInvalid(rewardData.pointsNeeded)
                      ? 'ring-red-300 text-red-900 focus:ring-red-500'
                      : 'ring-gray-300 text-gray-900 focus:ring-admin-primary-700'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                  placeholder="100"
                  value={rewardData.pointsNeeded}
                  onChange={(e) => {
                    setRewardData({
                      ...rewardData,
                      pointsNeeded: parseInt(e.target.value),
                    });
                  }}
                  aria-invalid="true"
                  aria-describedby="address-error"
                />
              </div>
              {isPointsInvalid(rewardData.pointsNeeded) && (
                <p
                  className="absolute b-0 text-sm text-red-600"
                  id="address-error"
                >
                  Cannot be less than 0
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
              disabled={
                isPointsInvalid(rewardData.pointsNeeded) ||
                isRewardNameInvalid(rewardData.name)
              }
              className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none
                    ${
                      isPointsInvalid(rewardData.pointsNeeded) ||
                      isRewardNameInvalid(rewardData.name)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-admin-primary-700 hover:bg-admin-primary-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-admin-primary-500'
                    }`}
              onClick={() => createReward(rewardData)}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
