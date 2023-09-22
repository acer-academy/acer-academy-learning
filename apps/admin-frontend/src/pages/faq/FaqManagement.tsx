import {
  FaqTopicCreateData,
  FaqTopicData,
} from 'libs/data-access/src/lib/types/faqTopic';
import { useEffect, useState } from 'react';
import { FaqTopicDeleteModal } from './FaqTopicDeleteModal';
import { FaqTopicCreateModal } from './FaqTopicCreateModal';
import { useToast } from '@acer-academy-learning/common-ui';
import {
  getAllFaqTopics as apiGetAllFaqTopics,
  createFaqTopic as apiCreateFaqTopic,
  deleteFaqTopic as apiDeleteFaqTopic,
} from '@acer-academy-learning/data-access';

export const FaqTopicManagement: React.FC = () => {
  const [faqTopics, setFaqTopics] = useState<FaqTopicData[]>([]);
  const [searchbarText, setSearchbarText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteFaqTopicId, setDeleteFaqTopicId] = useState('');

  const { displayToast, ToastType } = useToast();

  const getAllFaqTopics = async () => {
    try {
      const response = await apiGetAllFaqTopics();
      const allFaqTopics: FaqTopicData[] = response.data;
      console.log(response);
      setFaqTopics(allFaqTopics);
    } catch (error) {
      displayToast(
        'FAQ topics could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const createFaqTopic = async (faqTopicData: FaqTopicCreateData) => {
    try {
      faqTopicData.title = faqTopicData.title.trim();
      const response = await apiCreateFaqTopic(faqTopicData);
      console.log(response);

      displayToast('FAQ topic created successfully.', ToastType.SUCCESS);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'FAQ topic could not be created: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      setIsCreateModalOpen(false);
    }
  };

  const deleteFaqTopic = async () => {
    try {
      const response = await apiDeleteFaqTopic(deleteFaqTopicId);
      console.log(response);
      displayToast('FAQ topic deleted successfully.', ToastType.INFO);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'FAQ topic could not be deleted: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    getAllFaqTopics();
  }, [isDeleteModalOpen, isCreateModalOpen]);

  return (
    <div className="h-full bg-gray-50">
      <div className="flex min-h-full flex-col gap-7 align-middle py-12 px-12">
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="text"
            name="faqTopic-searchbar"
            id="faqTopic-searchbar"
            className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-adminGreen-600 sm:text-sm sm:leading-6"
            placeholder="Search for a FAQ topic..."
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
          <span className="text-2xl font-bold tracking-tight">FAQ Topics</span>
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
            Add FAQ Topic
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
          {faqTopics?.length > 0 ? (
            faqTopics
              .filter((faqTopic) =>
                faqTopic.title
                  .toLowerCase()
                  .includes(searchbarText.toLowerCase()),
              )
              .map((faqTopic) => (
                <div
                  key={faqTopic.id}
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-adminGreen-500 focus-within:ring-offset-2 hover:border-gray-400"
                >
                  <div className="min-w-0 flex-1">
                    <a
                      href={`faq-management/${faqTopic.id}`}
                      className="focus:outline-none"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">
                        {faqTopic.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {faqTopic.faqArticles.length} articles created
                      </p>
                    </a>
                    <div className="absolute inset-y-3 right-3 flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 fill-gray-400 stroke-2 hover:fill-black cursor-pointer"
                        viewBox="0 0 16 16"
                        onClick={() => {
                          setDeleteFaqTopicId(faqTopic.id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <span className="text-sm italic text-gray-500">
              No FAQ topics have been added yet.
            </span>
          )}
        </div>
      </div>
      {isDeleteModalOpen && (
        <FaqTopicDeleteModal
          setIsModalOpen={setIsDeleteModalOpen}
          deleteFaqTopic={deleteFaqTopic}
        />
      )}
      {isCreateModalOpen && (
        <FaqTopicCreateModal
          setIsModalOpen={setIsCreateModalOpen}
          currentFaqTopics={faqTopics}
          createFaqTopic={createFaqTopic}
        />
      )}
    </div>
  );
};
