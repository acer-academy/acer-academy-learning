import {
  FaqTopicCreateData,
  FaqTopicData,
} from 'libs/data-access/src/lib/types/faqTopic';
import { Fragment, useState } from 'react';

interface FaqTopicCreateModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
  currentFaqTopics: FaqTopicData[];
  createFaqTopic: (faqTopicData: FaqTopicCreateData) => void;
}

export const FaqTopicCreateModal: React.FC<FaqTopicCreateModalProps> = ({
  setIsModalOpen,
  currentFaqTopics,
  createFaqTopic,
}) => {
  const [faqTopicData, setFaqTopicData] = useState<FaqTopicCreateData>({
    title: '',
  });

  const isFaqTopicTitleInvalid = (faqTopicTitle: string) => {
    return currentFaqTopics.some(
      (faqTopic) =>
        faqTopic.title.toLowerCase().trim() ===
        faqTopicTitle.toLowerCase().trim(),
    );
  };

  const isFaqTopicDataInvalid = () => {
    return (
      isFaqTopicTitleInvalid(faqTopicData.title) ||
      faqTopicData.title.trim().length === 0
    );
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
        <div className="relative bg-white p-5 rounded-lg shadow-md h-42 w-96">
          <div className="flex flex-col items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              Create FAQ Topic
            </h3>
            <div className="w-full mt-3 mb-3">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                FAQ Topic Title
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                    isFaqTopicTitleInvalid(faqTopicData.title)
                      ? 'ring-red-300 text-red-900 focus:ring-red-500'
                      : 'ring-gray-300 text-gray-900 focus:ring-admin-primary-900'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                  placeholder="Curriculum"
                  value={faqTopicData.title}
                  onChange={(e) => {
                    setFaqTopicData({
                      title: e.target.value,
                    });
                  }}
                  aria-invalid={true}
                  aria-describedby="title-error"
                />
              </div>
              {isFaqTopicTitleInvalid(faqTopicData.title) && (
                <p
                  className="absolute b-0 text-sm text-red-600"
                  id="title-error"
                >
                  FAQ topic title already exists.
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
              disabled={isFaqTopicDataInvalid()}
              className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none
                ${
                  isFaqTopicDataInvalid()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-admin-primary-700 hover:bg-admin-primary-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-admin-primary-900'
                }`}
              onClick={() => createFaqTopic(faqTopicData)}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
