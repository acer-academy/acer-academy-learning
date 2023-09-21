import {
  FaqArticleCreateData,
  FaqArticleData,
} from 'libs/data-access/src/lib/types/faqArticle';
import { Fragment, useState } from 'react';

interface FaqArticleCreateModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
  createFaqArticle: (faqArticleData: FaqArticleCreateData) => void;
}

export const FaqArticleCreateModal: React.FC<FaqArticleCreateModalProps> = ({
  setIsModalOpen,
  createFaqArticle,
}) => {
  const [faqArticleData, setFaqArticleData] = useState<FaqArticleCreateData>({
    title: '',
    imageUrl: '',
    body: '',
    faqTopicId: '',
  });

  const isFaqArticleDataInvalid = () => {
    return (
      faqArticleData.title.trim().length === 0 ||
      faqArticleData.body.trim().length === 0
    );
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
        <div className="relative bg-white p-5 rounded-lg shadow-md h-42 w-4/6">
          <div className="flex flex-col items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              Create FAQ Article
            </h3>
            <div className="w-full mt-3 mb-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Title
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 text-gray-900 focus:ring-adminGreen-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  placeholder="How does the curriculum fit my child?"
                  value={faqArticleData.title}
                  onChange={(e) => {
                    setFaqArticleData({
                      title: e.target.value,
                      imageUrl: faqArticleData.imageUrl,
                      body: faqArticleData.body,
                      faqTopicId: faqArticleData.faqTopicId,
                    });
                  }}
                  aria-invalid={true}
                  aria-describedby="title-error"
                />
              </div>
            </div>
            <div className="w-full mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Image URL
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="imageUrl"
                  id="imageUrl"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 text-gray-900 focus:ring-adminGreen-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  placeholder="Optional"
                  value={faqArticleData.imageUrl}
                  onChange={(e) => {
                    setFaqArticleData({
                      title: faqArticleData.title,
                      imageUrl: e.target.value,
                      body: faqArticleData.body,
                      faqTopicId: faqArticleData.faqTopicId,
                    });
                  }}
                  aria-invalid="true"
                  aria-describedby="imageUrl-error"
                />
              </div>
            </div>
            <div className="w-full mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Body
              </label>
              <div className="relative rounded-md shadow-sm">
                <textarea
                  name="body"
                  id="body"
                  className="block w-full rounded-md break-normal align-left border-0 py-1.5 h-32 text-gray-900 ring-1 ring-inset ring-gray-300 text-gray-900 focus:ring-adminGreen-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  placeholder="The curriculum can fit your child’s needs because..."
                  value={faqArticleData.body}
                  onChange={(e) => {
                    setFaqArticleData({
                      title: faqArticleData.title,
                      imageUrl: faqArticleData.imageUrl,
                      body: e.target.value,
                      faqTopicId: faqArticleData.faqTopicId,
                    });
                  }}
                  aria-invalid="true"
                  aria-describedby="body-error"
                />
              </div>
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
              disabled={isFaqArticleDataInvalid()}
              className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none
                ${
                  isFaqArticleDataInvalid()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-adminGreen-600 hover:bg-adminGreen-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-adminGreen-500'
                }`}
              onClick={() => createFaqArticle(faqArticleData)}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
