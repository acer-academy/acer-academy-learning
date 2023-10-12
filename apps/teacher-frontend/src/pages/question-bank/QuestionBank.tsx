import {
  getPaginatedFilteredQuestions as apiGetPaginatedFilteredQuestions,
  deleteQuizQuestion,
} from '@acer-academy-learning/data-access';
import {
  QuizQuestionData,
  QuizQuestionPaginationFilter,
} from 'libs/data-access/src/lib/types/question';
import { useEffect, useState } from 'react';
import {
  LexOutput,
  WarningModal,
  useToast,
} from '@acer-academy-learning/common-ui';
import { Filter } from './Filter';
import { LevelTag } from './LevelTag';
import { TopicTag } from './TopicTag';
import { QuizStatusTag } from './QuizStatusTag';
import DifficultyTag from './DifficultyTag';
import TypeTag from './QuestionTypeTag';
import katex from 'katex';
import { useLocation, useNavigate } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useMutation } from 'react-query';

export const QuestionBank: React.FC = () => {
  const location = useLocation();
  const { displayToast, ToastType } = useToast();
  const { mutate: deleteQuizQuestionMutate } = useMutation(deleteQuizQuestion, {
    onSuccess: async () => {
      await getPaginatedFilteredQuestions();
      displayToast('Successfully deleted question', ToastType.SUCCESS);
    },
    onError: (error: any) => {
      displayToast(
        'Error deleting question: ' + error.error.message,
        ToastType.ERROR,
      );
    },
  });
  const navigate = useNavigate();
  const [filterOptions, setFilterOptions] =
    useState<QuizQuestionPaginationFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestionData[]>(
    [],
  );
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState('');

  const getPaginatedFilteredQuestions = async () => {
    try {
      const response = await apiGetPaginatedFilteredQuestions(
        currentPage,
        pageSize,
        filterOptions,
      );
      const questionData: {
        questions: QuizQuestionData[];
        totalCount: number;
      } = response.data;
      console.log(questionData);
      setCurrentQuestions(questionData.questions);
      setTotalCount(questionData.totalCount);
    } catch (error) {
      displayToast(
        'Questions could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const isNextPageDisabled = () => {
    return currentPage * pageSize + currentQuestions.length >= totalCount;
  };

  const isPrevPageDisabled = () => {
    return currentPage === 1;
  };

  const navToSelectedQuestion = (selectedQuestionId: string) => {
    // for now will push to url/question-bank/questionId, change as needed
    navigate(`${selectedQuestionId}`);
  };

  const navToCreateQuestion = () => {
    // for now will push to url/question-bank/create, change as needed
    navigate(`create`);
  };

  useEffect(() => {
    getPaginatedFilteredQuestions();
  }, [currentPage, pageSize, filterOptions]);

  return (
    <div className="h-full">
      <div className="flex min-h-full flex-col gap-7 align-middle">
        <div className="flex align-middle justify-between">
          <div className="flex align-middle gap-4">
            <span className="text-2xl py-1 font-bold tracking-tight">
              Question Bank
            </span>
            <button
              className="text-blue-500 hover:text-blue-600"
              onClick={() => setIsFilterVisible(!isFilterVisible)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-7 h-7 fill-teacherBlue-500 hover:fill-teacherBlue-700 transition-colors"
              >
                <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
              </svg>
            </button>
          </div>
          <button
            className="inline-flex justify-center px-4 py-2 text-white bg-teacherBlue-500 border border-transparent rounded-md hover:bg-teacherBlue-700"
            onClick={() => {
              navToCreateQuestion();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4 fill-white stroke-2 relative mt-1"
              viewBox="0 0 16 16"
            >
              <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
            </svg>
            Add Question
          </button>
        </div>

        <div className={isFilterVisible ? '' : ' hidden'}>
          <Filter
            filterSubmitCallback={(
              newFilterOptions: QuizQuestionPaginationFilter,
            ) => {
              setFilterOptions(newFilterOptions);
            }}
          ></Filter>
        </div>

        <div className="min-w-max">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-3.5 pr-3 text-left text-lg font-bold text-gray-900 sm:pl-6"
                      >
                        Question
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                      >
                        Level(s)
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                      >
                        Topic(s)
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900 "
                      >
                        Difficulty
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {currentQuestions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="whitespace-nowrap py-4 px-4 font-light italic text-gray-400 text-center"
                        >
                          No questions found.
                        </td>
                      </tr>
                    ) : (
                      currentQuestions.map((question) => (
                        <tr
                          key={question.id}
                          className="hover:bg-slate-50 hover:cursor-pointer"
                          onClick={() => {
                            navToSelectedQuestion(question.id);
                          }}
                        >
                          <td className="py-4 pl-3.5 pr-3 text-xs font-medium text-gray-900 max-w-0">
                            <div>
                              <span>
                                <LexOutput
                                  editorStateStr={question.questionText}
                                  shorten
                                />
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 font-medium text-gray-900">
                            <div className="flex flex-col gap-1">
                              {question.levels.map((level, index) => {
                                return (
                                  <LevelTag
                                    key={index}
                                    index={index}
                                    levelEnum={level}
                                  />
                                );
                              })}
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                            <div className="flex flex-col gap-1 max-w-min">
                              {question.topics.map((topic, index) => {
                                return (
                                  <TopicTag
                                    key={index}
                                    index={index}
                                    topicEnum={topic}
                                  />
                                );
                              })}
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                            <DifficultyTag difficulty={question.difficulty} />
                          </td>
                          <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                            <QuizStatusTag status={question.status} />
                          </td>
                          <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                            <TypeTag type={question.questionType} />
                          </td>
                          <td className="whitespace-nowrap font-medium text-gray-900 space-x-1 w-max">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navToSelectedQuestion(question.id);
                              }}
                              className="inline-flex items-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-green-600"
                            >
                              <PencilSquareIcon className="w-6 h-6 text-white" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteQuestionId(question.id);
                                setDeleteModalOpen(true);
                              }}
                              className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-600"
                            >
                              <TrashIcon className="w-6 h-6 text-white" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-5 justify-end">
          <span className="py-2">Rows per page:</span>
          <select
            className=" rounded-md"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={isPrevPageDisabled()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke={isPrevPageDisabled() ? 'grey' : 'currentColor'}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <span className="py-2">
            {`${
              totalCount == 0
                ? `0 of 0`
                : `${(currentPage - 1) * pageSize + 1}-${
                    (currentPage - 1) * pageSize + currentQuestions.length
                  } of ${totalCount}`
            }`}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={isNextPageDisabled()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke={isNextPageDisabled() ? 'grey' : 'currentColor'}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
      <WarningModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        title={'Delete Question'}
        description={
          'Are you sure you want to delete this queston? The question and answers for this question data will be removed and cannot be undone.'
        }
        confirmContent={'Delete'}
        dismissContent={'Cancel'}
        onConfirm={() => deleteQuizQuestionMutate(deleteQuestionId)}
      />
    </div>
  );
};
