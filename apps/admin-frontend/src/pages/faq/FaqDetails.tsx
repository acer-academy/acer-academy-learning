import { useToast } from '@acer-academy-learning/common-ui';
import {
  FaqTopicData,
  FaqTopicUpdateData,
} from 'libs/data-access/src/lib/types/faqTopic';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaqTopicDeleteModal } from './FaqTopicDeleteModal';
import { FaqArticlesTable } from './FaqArticlesTable';
import {
  getFaqTopicById,
  updateFaqTopic as apiUpdateFaqTopic,
  deleteFaqTopic as apiDeleteFaqTopic,
} from '@acer-academy-learning/data-access';
import { FaqArticleData } from 'libs/data-access/src/lib/types/faqArticle';

export const FaqTopicDetails: React.FC = () => {
  const [faqTopic, setFaqTopic] = useState<FaqTopicData>();
  const { faqTopicId } = useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updatedFaqTopicTitle, setUpdatedFaqTopicTitle] = useState('');
  const [isEditingFaqTopicTitle, setIsEditingFaqTopicTitle] = useState(false);
  const [updatesMade, setUpdatesMade] = useState(false);
  const [faqArticles, setFaqArticles] = useState<FaqArticleData[]>([]);

  const { displayToast, ToastType } = useToast();
  const navigate = useNavigate();

  const wereUpdatesMade = () => {
    if (faqTopic?.title.trim() !== updatedFaqTopicTitle.trim()) {
      setUpdatesMade(true);
    }
  };

  const getCurrentFaqTopic = async (id: string) => {
    try {
      const response = await getFaqTopicById(id);
      const faqTopicData: FaqTopicData = response.data;
      console.log(faqTopicData);
      setFaqTopic(faqTopicData);
      setUpdatedFaqTopicTitle(faqTopicData.title);
      setFaqArticles(faqTopicData.faqArticles);
    } catch (error) {
      displayToast(
        'FAQ topic could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const updateFaqTopic = async (
    faqTopicId: string,
    faqTopicData: FaqTopicUpdateData,
  ) => {
    try {
      const response = await apiUpdateFaqTopic(faqTopicId, faqTopicData);
      const updatedFaqTopic: FaqTopicData = response.data;
      console.log(updatedFaqTopic);
      displayToast('FAQ topic updated successfully.', ToastType.SUCCESS);
      setFaqTopic(updatedFaqTopic);
    } catch (error: any) {
      setUpdatedFaqTopicTitle(faqTopic?.title || '');
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'FAQ topic could not be updated: Unknown error.',
          ToastType.ERROR,
        );
      }
    } finally {
      setUpdatesMade(false);
    }
  };

  const deleteFaqTopic = async () => {
    if (!faqTopicId) return;
    try {
      const response = await apiDeleteFaqTopic(faqTopicId);
      console.log(response);
      displayToast('FAQ topic deleted successfully.', ToastType.INFO);
      navigate('/faq-management');
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

  const updateFaqArticles = (newFaqArticles: FaqArticleData[]) => {
    setFaqArticles(newFaqArticles);
  };

  useEffect(() => {
    getCurrentFaqTopic(faqTopicId || '');
  }, []);

  useEffect(() => {
    if (updatesMade && faqTopicId) {
      const faqTopicUpdateData: FaqTopicUpdateData = {
        title: updatedFaqTopicTitle,
      };
      console.log(faqTopicUpdateData);
      updateFaqTopic(faqTopicId, faqTopicUpdateData);
    }
  }, [updatesMade]);

  return (
    <div className="h-full bg-gray-50">
      <div className="flex min-h-full flex-col gap-7 align-middle py-12 px-12">
        <a
          className="hover:text-adminGreen-600 underline"
          href="faq-management"
        >{`< Back`}</a>
        {faqTopic && (
          <div className="inline-flex justify-between">
            <span className="text-2xl font-bold tracking-tight">
              FAQ Topic: {faqTopic.title}
            </span>
            <button
              className="inline-flex h-min justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
              onClick={() => {
                setIsDeleteModalOpen(true);
              }}
            >
              Delete
            </button>
          </div>
        )}
        <div className="grid grid-cols-4 gap-7 text-m">
          <div className="flex items-center col-span-1 font-semibold">
            Title
          </div>
          {isEditingFaqTopicTitle ? (
            <input
              name="updatedFaqTopicName"
              className="flex items-center col-span-1 border-0 rounded bg-transparent ring-1 ring-inset focus:ring-2 focus:ring-inset ring-gray-300 text-gray-900 focus:ring-adminGreen-500"
              placeholder="Curriculum"
              value={updatedFaqTopicTitle}
              onChange={(e) => {
                setUpdatedFaqTopicTitle(e.target.value);
              }}
            ></input>
          ) : (
            <div className="col-span-1 h-10 flex items-center pl-3">
              {faqTopic?.title}
            </div>
          )}
          <div className="flex items-center col-span-2">
            {isEditingFaqTopicTitle ? (
              <button
                onClick={() => {
                  setIsEditingFaqTopicTitle(false);
                  wereUpdatesMade();
                }}
                className="text-adminGreen-600 hover:underline"
              >
                Update
              </button>
            ) : (
              <button
                onClick={() => setIsEditingFaqTopicTitle(true)}
                className="hover:text-adminGreen-600 underline"
              >
                Edit
              </button>
            )}
          </div>
        </div>
        <hr className="my-12 h-0.5 border-t-0 bg-neutral-200 opacity-100 dark:opacity-50" />
        <FaqArticlesTable
          currentFaqArticles={faqArticles}
          updateFaqArticles={updateFaqArticles}
          faqTopicId={faqTopicId ?? ''}
        />
      </div>
      {isDeleteModalOpen && faqTopicId && (
        <FaqTopicDeleteModal
          setIsModalOpen={setIsDeleteModalOpen}
          deleteFaqTopic={deleteFaqTopic}
        />
      )}
    </div>
  );
};
