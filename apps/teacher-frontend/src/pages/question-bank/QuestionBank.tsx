import { getPaginatedFilteredQuestions as apiGetPaginatedFilteredQuestions } from '@acer-academy-learning/data-access';
import {
  QuizQuestionData,
  QuizQuestionPaginationFilter,
} from 'libs/data-access/src/lib/types/question';
import { useEffect, useState } from 'react';
import { useToast } from '@acer-academy-learning/common-ui';
import { Filter } from './Filter';
import { LevelTag } from './LevelTag';
import { TopicTag } from './TopicTag';
import { QuizStatusTag } from './QuizStatusTag';
import DifficultyTag from './DifficultyTag';
import TypeTag from './QuestionTypeTag';
import katex from 'katex';

export const QuestionBank: React.FC = () => {
  const { displayToast, ToastType } = useToast();
  const [filterOptions, setFilterOptions] =
    useState<QuizQuestionPaginationFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestionData[]>(
    [],
  );
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(true);

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

  useEffect(() => {
    getPaginatedFilteredQuestions();
  }, [currentPage, pageSize, filterOptions]);

  return (
    <div className="h-full bg-gray-50">
      <div className="flex min-h-full flex-col gap-7 align-middle py-12 px-12">
        <div className="flex align-middle justify-between">
          <span className="text-2xl font-bold tracking-tight">
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {currentQuestions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="whitespace-nowrap py-4 px-4 font-light italic text-gray-400 text-center"
                        >
                          No questions found.
                        </td>
                      </tr>
                    ) : (
                      currentQuestions.map((question) => (
                        <tr key={question.id}>
                          <td className="py-4 pl-3.5 pr-3 text-xs font-medium text-gray-900 max-w-0">
                            <div>
                              <span>
                                {question.questionText.length > 400
                                  ? question.questionText.slice(0, 100) + '...'
                                  : question.questionText}
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
    </div>
  );
};
