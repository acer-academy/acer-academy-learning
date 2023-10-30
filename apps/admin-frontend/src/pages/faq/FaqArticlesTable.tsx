import {
  FaqArticleCreateData,
  FaqArticleData,
  FaqArticleUpdateData,
} from 'libs/data-access/src/lib/types/faqArticle';
import { useEffect, useState } from 'react';
import { useToast } from '@acer-academy-learning/common-ui';
import {
  getFaqArticlesByFaqTopicId,
  createFaqArticle as apiCreateFaqArticle,
  updateFaqArticle as apiUpdateFaqArticle,
  deleteFaqArticle as apiDeleteFaqArticle,
} from '@acer-academy-learning/data-access';
import { FaqArticleDeleteModal } from './FaqArticleDeleteModal';
import { FaqArticleCreateModal } from './FaqArticleCreateModal';
import { FaqArticleUpdateModal } from './FaqArticleUpdateModal';

interface FaqArticlesTableProps {
  currentFaqArticles: FaqArticleData[];
  updateFaqArticles: (newFaqArticles: FaqArticleData[]) => void;
  faqTopicId: string;
}

export const FaqArticlesTable: React.FC<FaqArticlesTableProps> = ({
  currentFaqArticles,
  updateFaqArticles,
  faqTopicId,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updateFaqArticleId, setUpdateFaqArticleId] = useState('');
  const [updateFaqArticleData, setUpdateFaqArticleData] =
    useState<FaqArticleUpdateData>({
      title: '',
      imageUrl: '',
      body: '',
      faqTopicId: faqTopicId,
    });
  const [deleteFaqArticleId, setDeleteFaqArticleId] = useState('');

  const { displayToast, ToastType } = useToast();

  const createFaqArticle = async (faqArticleData: FaqArticleCreateData) => {
    try {
      faqArticleData.title = faqArticleData.title.trim();
      faqArticleData.body = faqArticleData.body.trim();
      faqArticleData.faqTopicId = faqTopicId;
      await apiCreateFaqArticle(faqArticleData);

      displayToast('FAQ article created successfully.', ToastType.SUCCESS);

      // Update the parent component's state
      const updatedFaqArticles = await getFaqArticlesByFaqTopicId(faqTopicId);
      updateFaqArticles(updatedFaqArticles.data);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'FAQ article could not be created: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      setIsCreateModalOpen(false);
    }
  };

  const updateFaqArticle = async (faqArticleData: FaqArticleUpdateData) => {
    try {
      faqArticleData.title = faqArticleData.title.trim();
      faqArticleData.body = faqArticleData.body.trim();
      faqArticleData.faqTopicId = faqTopicId;
      await apiUpdateFaqArticle(updateFaqArticleId, faqArticleData);
      displayToast('FAQ article updated successfully.', ToastType.INFO);

      // Update the parent component's state
      const updatedFaqArticles = await getFaqArticlesByFaqTopicId(faqTopicId);
      updateFaqArticles(updatedFaqArticles.data);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'FAQ article could not be updated: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      setIsUpdateModalOpen(false);
    }
  };

  const deleteFaqArticle = async () => {
    try {
      await apiDeleteFaqArticle(deleteFaqArticleId);
      displayToast('FAQ article deleted successfully.', ToastType.INFO);

      // Update the parent component's state by removing the deleted article
      const updatedFaqArticles = currentFaqArticles.filter(
        (article) => article.id !== deleteFaqArticleId,
      );
      updateFaqArticles(updatedFaqArticles);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'FAQ article could not be deleted: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            FAQ Articles
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            All articles in this FAQ topic section
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
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
            Add FAQ Article
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {currentFaqArticles.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 max-w-xs"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-3.5 py-3.5 text-left text-sm font-semibold text-gray-900 image-column max-w-xs"
                      >
                        Image
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                      >
                        Body
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
                    {currentFaqArticles.map((faqArticle) => (
                      <tr key={faqArticle.id}>
                        <td className="whitespace-normal py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-xs">
                          {faqArticle.title}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 image-column max-w-xs">
                          {faqArticle.imageUrl ? (
                            <img
                              src={faqArticle.imageUrl}
                              alt={`Image for ${faqArticle.title}`}
                              className="max-w-xs h-auto"
                            />
                          ) : (
                            <span className="text-gray-400">
                              No image uploaded
                            </span>
                          )}
                        </td>

                        <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                          {faqArticle.body}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                          <a
                            className="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                            onClick={() => {
                              setUpdateFaqArticleId(faqArticle.id);
                              setUpdateFaqArticleData({
                                title: faqArticle.title,
                                imageUrl: faqArticle.imageUrl,
                                body: faqArticle.body,
                                faqTopicId: faqTopicId,
                              });
                              setIsUpdateModalOpen(true);
                            }}
                          >
                            Edit
                          </a>
                          <a
                            className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                            onClick={() => {
                              setDeleteFaqArticleId(faqArticle.id);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500 text-center py-4">
                  No articles have been created yet for this topic.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isDeleteModalOpen && (
        <FaqArticleDeleteModal
          setIsModalOpen={setIsDeleteModalOpen}
          deleteFaqArticle={deleteFaqArticle}
        />
      )}
      {isCreateModalOpen && (
        <FaqArticleCreateModal
          setIsModalOpen={setIsCreateModalOpen}
          createFaqArticle={createFaqArticle}
        />
      )}
      {isUpdateModalOpen && (
        <FaqArticleUpdateModal
          setIsModalOpen={setIsUpdateModalOpen}
          updateFaqArticle={updateFaqArticle}
          currentFaqArticle={updateFaqArticleData}
        />
      )}
    </div>
  );
};
